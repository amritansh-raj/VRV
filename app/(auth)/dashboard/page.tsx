'use client';

import StatCard from '@/components/Cards/StatCards';
import { Task } from '@/components/table/TaskTable';
import { useToast } from '@/hooks/use-toast';
import { ENDPOINTS } from '@/lib/helpers/constants/endpoints';
import { client } from '@/services/axios';
import useAuthStore, { UserI } from '@/store/userStore';
import {
  Activity,
  CheckSquare,
  ClipboardList,
  Trash2,
  UserCheck,
  UserCog,
  Users,
  XSquare,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import withAuth from '../../../components/hoc/withAuth';

interface initialStateI {
  totalUsers?: number | null;
  totalTasks?: number | null;
  totalManagers?: number | null;
  totalActive?: number | null;
  completedTasks?: number | null;
  incompletedTasks?: number | null;
  deletedTasks?: number | null;
  totalUserTasks?: number | null;
}

const initialState: initialStateI = {
  totalUsers: null,
  totalTasks: null,
  totalManagers: null,
  totalActive: null,
  completedTasks: null,
  incompletedTasks: null,
  deletedTasks: null,
  totalUserTasks: null,
};

const Page = () => {
  const [state, setState] = useState<initialStateI>(initialState);
  const { toast } = useToast();
  const User = useAuthStore((state) => state.user);

  const getData = async (User: UserI) => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        client.get(ENDPOINTS.USERS),
        client.get(ENDPOINTS.TASKS),
      ]);

      const users = usersRes.data;
      const tasks = tasksRes.data;

      if (User.role === 'admin') {
        const totalUsers = users.length;
        const totalManagers = users.filter(
          (user: UserI) => user.role === 'manager',
        ).length;
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
          (task: Task) => task.completed,
        ).length;
        console.log(completedTasks);

        setState((prev) => ({
          ...prev,
          totalUsers: totalUsers,
          totalManagers: totalManagers,
          totalTasks: totalTasks,
          completedTasks: completedTasks,
        }));
      } else if (User.role === 'manager') {
        const totalUsers = users.length;
        const activeUsers = users.filter(
          (user: UserI) => user.status === 'active',
        ).length;
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
          (task: Task) => task.completed,
        ).length;

        setState((prev) => ({
          ...prev,
          totalUsers,
          totalActive: activeUsers,
          totalTasks,
          completedTasks,
        }));
      } else if (User.role === 'user') {
        const userTasks = tasks.filter((task: Task) => task.userId === User.id);
        const totalUserTasks = userTasks.length;
        const completedTasks = userTasks.filter(
          (task: Task) => task.completed,
        ).length;
        const incompletedTasks = userTasks.filter(
          (task: Task) => !task.completed,
        ).length;
        const deletedTasks = userTasks.filter(
          (task: Task) => task.deleted,
        ).length;

        setState((prev) => ({
          ...prev,
          totalUserTasks,
          completedTasks,
          incompletedTasks,
          deletedTasks,
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to fetch dashboard data.',
      });
    }
  };

  useEffect(() => {
    if (User) {
      getData(User);
    }
  }, [User]);

  const cards = [
    {
      title: 'Total Users',
      value: state.totalUsers,
      icon: Users,
      description: 'Registered users',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      title: 'Total Tasks',
      value: state.totalTasks,
      icon: ClipboardList,
      description: 'All tasks',
      gradient: 'bg-gradient-to-br from-green-500 to-green-600',
    },
    {
      title: 'Total Managers',
      value: state.totalManagers,
      icon: UserCog,
      description: 'Project managers',
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
    {
      title: 'Total Active',
      value: state.totalActive,
      icon: Activity,
      description: 'Active users',
      gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    },
    {
      title: 'Completed Tasks',
      value: state.completedTasks,
      icon: CheckSquare,
      description: 'Finished tasks',
      gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
    {
      title: 'Incompleted Tasks',
      value: state.incompletedTasks,
      icon: XSquare,
      description: 'Pending tasks',
      gradient: 'bg-gradient-to-br from-red-500 to-red-600',
    },
    {
      title: 'Deleted Tasks',
      value: state.deletedTasks,
      icon: Trash2,
      description: 'Removed tasks',
      gradient: 'bg-gradient-to-br from-gray-500 to-gray-600',
    },
    {
      title: 'Total User Tasks',
      value: state.totalUserTasks,
      icon: UserCheck,
      description: 'User assigned tasks',
      gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default withAuth(Page, ['admin', 'user', 'manager']);
