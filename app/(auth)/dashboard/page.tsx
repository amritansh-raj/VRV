'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ENDPOINTS } from '@/lib/helpers/constants/endpoints';
import { client } from '@/services/axios';
import useAuthStore, { UserI } from '@/store/userStore';
import { DollarSign, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import withAuth from '../../../components/hoc/withAuth';

interface initialStateI {
  totalUsers?: number | null;
  totalTasks?: number | null;
  totalManagers?: number | null;
  totalActive?: number | null;
}

const initialState: initialStateI = {
  totalUsers: null,
  totalTasks: null,
  totalManagers: null,
  totalActive: null,
};

const Page = () => {
  const [state, setState] = useState<initialStateI>(initialState);

  const User = useAuthStore((state) => state.user);

  const getData = async (User: UserI) => {
    console.log(User.role);
    const [usersRes, tasksRes] = await Promise.all([
      client.get(ENDPOINTS.USERS),
      client.get(ENDPOINTS.TASKS),
    ]);

    const totalUsers = usersRes.data.length;
    const totalTasks = tasksRes.data.length;

    setState((prev) => ({
      ...prev,
      totalTasks: totalTasks,
      totalUsers: totalUsers,
    }));
  };

  useEffect(() => {
    if (User) {
      getData(User);
    } else {
    }
  }, [User]);

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {state.totalTasks && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tasks
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{state.totalTasks}</div>
              </CardContent>
            </Card>
          )}
          {state.totalUsers && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{state.totalUsers}</div>
              </CardContent>
            </Card>
          )}
          {state.totalActive && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>{state.totalActive}</CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default withAuth(Page, ['admin', 'user', 'manager']);
