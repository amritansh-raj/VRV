/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ENDPOINTS } from '@/lib/helpers/constants/endpoints';
import {
  RegisterFormValues,
  registerSchema,
} from '@/lib/schemas/registerSchema';
import { client } from '@/services/axios';
import { registerUserI } from '@/types/user/registerUserI';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface initialStateI {
  isLoading: boolean;
  showPass: boolean;
  showCnfrmPass: boolean;
}

const initialState: initialStateI = {
  isLoading: false,
  showPass: false,
  showCnfrmPass: false,
};

export default function RegisterPage() {
  const [state, setState] = useState<initialStateI>(initialState);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const addUser = async (newUser: registerUserI) => {
    newUser.role = 'user';
    newUser.status = 'active';

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const existingUsersResponse = await client.get(ENDPOINTS.USERS, {
        params: { email: newUser.email },
      });

      const existingUsers = existingUsersResponse.data;

      if (existingUsers.length > 0) {
        toast({
          variant: 'destructive',
          description: 'A user with this email already exists.',
          duration: 3000,
        });
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const response = await client.post(ENDPOINTS.USERS, newUser);

      if (response) {
        toast({
          description: 'User added successfully.',
        });
        setState((prev) => ({ ...prev, isLoading: false }));
        form.reset();
        router.push('login');
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));

      toast({
        variant: 'destructive',
        description: 'Error adding user.',
        duration: 3000,
      });
    }
  };

  function onSubmit(values: RegisterFormValues) {
    // Simulate API call
    const { confirmPassword, ...userDetails } = values;
    addUser(userDetails);
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl className="relative">
                      <div className="relative">
                        <Input
                          type={state.showPass ? 'text' : 'password'}
                          placeholder="Enter password"
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              showPass: !prev.showPass,
                            }))
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer border-none bg-none"
                        >
                          {state.showPass ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl className="relative">
                      <div className="relative">
                        <Input
                          type={state.showPass ? 'text' : 'password'}
                          placeholder="Enter Confirm Password"
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              showPass: !prev.showCnfrmPass,
                            }))
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer border-none bg-none"
                        >
                          {state.showPass ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full"
                type="submit"
                disabled={state.isLoading}
              >
                {state.isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Account
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full text-center">
            Already have an account ?{' '}
            <Link href={'/login'} className="cursor-pointer underline">
              Login
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
