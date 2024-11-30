'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ENDPOINTS } from '@/lib/helpers/constants/endpoints';
import { client } from '@/services/axios';
import { Mail, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Permission {
  add: boolean;
  delete: boolean;
  update: boolean;
}

interface UserI {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  permissions: Permission;
}

export default function UserPermissionsTable() {
  const [users, setUsers] = useState<UserI[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await client.get(ENDPOINTS.USERS);
      const users = response.data.filter((user: UserI) => user.role === 'user');

      console.log(users);
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const togglePermission = async (
    userId: string,
    permission: keyof Permission,
  ) => {
    try {
      const userToUpdate = users.find((user) => user.id === userId);

      if (!userToUpdate) {
        console.error('User not found.');
        return;
      }

      const updatedPermissions = {
        ...userToUpdate.permissions,
        [permission]: !userToUpdate.permissions[permission],
      };

      const response = await client.patch(`${ENDPOINTS.USERS}/${userId}`, {
        permissions: updatedPermissions,
      });

      console.log('Updated user:', response.data);

      fetchUsers();
    } catch (error) {
      console.error('Error toggling permission:', error);
    }
  };

  return (
    <Card className="mx-auto mt-8 w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          User Permissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Add</TableHead>
              <TableHead className="text-center">Delete</TableHead>
              <TableHead className="text-center">Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="transition-colors hover:bg-muted/50"
              >
                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </TableCell>
                {(Object.keys(user.permissions) as Array<keyof Permission>).map(
                  (permission) => (
                    <TableCell key={permission} className="text-center">
                      <Switch
                        checked={user.permissions[permission]}
                        onCheckedChange={() =>
                          togglePermission(user.id, permission)
                        }
                      />
                    </TableCell>
                  ),
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
