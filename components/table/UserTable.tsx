'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { UserI } from '@/store/userStore';
import { Mail, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UserTable() {
  const [users, setUsers] = useState<UserI[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await client.get(ENDPOINTS.USERS);
      const nonAdmins = response.data.filter(
        (user: UserI) => user.role !== 'admin',
      );
      console.log(nonAdmins);
      setUsers(nonAdmins);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id: string) => {
    try {
      const userToToggle = users.find((user) => user.id === id);
      if (!userToToggle) return;

      const newStatus =
        userToToggle.status === 'active' ? 'inactive' : 'active';

      await client.patch(`${ENDPOINTS.USERS}/${id}`, { status: newStatus });

      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user,
        ),
      );
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const changeRole = async (id: string, newRole: 'user' | 'manager') => {
    try {
      await client.patch(`${ENDPOINTS.USERS}/${id}`, { role: newRole });

      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, role: newRole } : user,
        ),
      );
    } catch (error) {
      console.error('Error changing user role:', error);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[600px] min-h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">S.No.</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="min-h-[500px]">
            {users.map((user, index) => (
              <TableRow
                key={user.id}
                className="transition-colors hover:bg-muted/50"
              >
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>
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
                <TableCell className="text-center">
                  <Select
                    value={user.role}
                    onValueChange={(value: 'user' | 'manager') =>
                      changeRole(user.id, value)
                    }
                  >
                    <SelectTrigger className="mx-auto w-[130px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={user.status === 'active' ? 'default' : 'secondary'}
                    className={`${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-400 text-gray-800'} mx-auto`}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant={
                      user.status === 'active' ? 'destructive' : 'default'
                    }
                    size="sm"
                    onClick={() => toggleStatus(user.id)}
                  >
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
