'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { ENDPOINTS } from '@/lib/helpers/constants/endpoints';
import { client } from '@/services/axios';
import useAuthStore from '@/store/userStore';
import { Check, Plus, Trash, Undo, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface Permission {
  add: boolean;
  delete: boolean;
  update: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: Permission;
}

interface NewTaskI {
  title: string;
  description: string;
  completed: boolean;
  deleted: boolean;
  userId: string | undefined;
}

export interface Task extends NewTaskI {
  id: string;
}

const fetchTasksForUser = async (userId: string): Promise<Task[]> => {
  const response = await client.get(`${ENDPOINTS.TASKS}/?userId=${userId}`);
  return response.data;
};

const fetchUser = async (id: string): Promise<User> => {
  const response = await client.get(`${ENDPOINTS.USERS}/${id}`);
  return response.data;
};

const updateTask = async (id: string, updates: Partial<Task>) => {
  await client.patch(`${ENDPOINTS.TASKS}/${id}`, {
    body: JSON.stringify(updates),
  });
};

export default function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const User = useAuthStore((state) => state.user);

  useEffect(() => {
    if (User) {
      Promise.all([fetchUser(User.id), fetchTasksForUser(User.id)]).then(
        ([userData, userTasks]) => {
          setUser(userData);
          setTasks(userTasks);
        },
      );
    }
  }, []);

  const toggleTaskCompletion = async (taskId: string) => {
    if (!user?.permissions.update) {
      toast({
        variant: 'destructive',
        description: "You don't have update permission !!",
      });
      return;
    }

    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };

      try {
        const response = await client.patch(`${ENDPOINTS.TASKS}/${taskId}`, {
          completed: updatedTask.completed,
        });

        if (response.status === 200) {
          const updatedTasks = tasks.map((t) =>
            t.id === taskId ? response.data : t,
          );
          setTasks(updatedTasks);
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          description: 'Failed to toggle task completion.',
        });
      }
    }
  };

  const toggleTaskDeleted = async (taskId: string) => {
    if (!user?.permissions.delete) {
      toast({
        variant: 'destructive',
        description: "You don't have delete permission !!",
        duration: 3000,
      });
      return;
    }

    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      try {
        const response = await client.patch(`${ENDPOINTS.TASKS}/${taskId}`, {
          deleted: !task.deleted,
        });

        if (response.status === 200) {
          const updatedTasks = tasks.map((t) =>
            t.id === taskId ? { ...t, deleted: !task.deleted } : t,
          );
          setTasks(updatedTasks);
          toast({
            description: `Task marked as ${
              !task.deleted ? 'deleted' : 'active'
            }.`,
          });
        }
      } catch (error) {
        console.error('Error toggling task deletion:', error);
        toast({
          variant: 'destructive',
          description: 'Failed to toggle the task deletion status.',
        });
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user?.permissions.delete) {
      toast({
        variant: 'destructive',
        description: "You don't have delete permission !!",
        duration: 3000,
      });
      return;
    }

    try {
      const response = await client.delete(`${ENDPOINTS.TASKS}/${taskId}`);

      if (response.status === 200 || response.status === 204) {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
        toast({
          description: 'Task permanently deleted.',
        });
        setTaskToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to delete the task.',
      });
    }
  };

  const startEditing = (task: Task) => {
    if (!user?.permissions.update) {
      toast({
        variant: 'destructive',
        description: "You don't have update permission !!",
      });
      return;
    }

    setEditingTask(task.id);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

  const saveEditing = async (taskId: string) => {
    if (!user?.permissions.update) {
      toast({
        variant: 'destructive',
        description: "You don't have update permission !!",
      });
      return;
    }

    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      const updatedTask = {
        ...task,
        title: editedTitle,
        description: editedDescription,
      };

      try {
        const response = await client.put(`/api/tasks/${taskId}`, {
          title: updatedTask.title,
          description: updatedTask.description,
        });

        if (response.status === 200) {
          const updatedTasks = tasks.map((t) =>
            t.id === taskId ? response.data : t,
          );
          setTasks(updatedTasks);
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          description: 'Failed to save changes.',
        });
      }
    }

    setEditingTask(null);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const addNewTask = async () => {
    if (!user?.permissions.add) {
      toast({
        variant: 'destructive',
        description: "You don't have add permission !!",
      });
      return;
    }
    if (newTaskTitle.trim() === '' || newTaskDescription.trim() === '') {
      toast({
        variant: 'destructive',
        description:
          'Please fill in both title and description for the new task.',
      });

      return;
    }

    const newTask: NewTaskI = {
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
      deleted: false,
      userId: User?.id,
    };

    try {
      const response = await client.post(ENDPOINTS.TASKS, newTask);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      toast({
        description: 'New task added successfully!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to add the new task. Please try again later.',
      });
    }

    setNewTaskDescription('');
    setNewTaskTitle('');
  };

  return (
    <Card className="mx-auto mt-8 w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Task Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <Input
            placeholder="New Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <Input
            placeholder="New Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <Button onClick={addNewTask} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add New Task
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">S.No.</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow
                key={task.id}
                className={`transition-colors hover:bg-muted/50 ${task.deleted ? 'opacity-50' : ''}`}
              >
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                  ) : (
                    <div
                      className="cursor-pointer rounded p-2 hover:bg-muted/50"
                      onClick={() => !task.deleted && startEditing(task)}
                    >
                      {task.title}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                    />
                  ) : (
                    <div
                      className="cursor-pointer rounded p-2 hover:bg-muted/50"
                      onClick={() => !task.deleted && startEditing(task)}
                    >
                      {task.description}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={task.completed ? 'default' : 'secondary'}
                    className={`${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {task.completed ? 'Completed' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    {editingTask === task.id ? (
                      <>
                        <Button size="sm" onClick={() => saveEditing(task.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        {!task.deleted && (
                          <Button
                            size="sm"
                            variant={task.completed ? 'outline' : 'default'}
                            onClick={() => toggleTaskCompletion(task.id)}
                            disabled={task.deleted}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {task.deleted && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => toggleTaskDeleted(task.id)}
                          >
                            <Undo className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (task.deleted) {
                              setTaskToDelete(task.id);
                              setIsDeleteDialogOpen(true);
                            } else toggleTaskDeleted(task.id);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setTaskToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (taskToDelete) {
                    deleteTask(taskToDelete);
                  }
                  setIsDeleteDialogOpen(false);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
