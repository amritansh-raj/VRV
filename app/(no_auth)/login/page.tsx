/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { LoginFormValues, loginSchema } from '@/lib/schemas/loginSchema';
import { client } from '@/services/axios';
import useAuthStore from '@/store/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface initialStateI {
  showPass: boolean;
  isLoading: boolean;
}

const initialState: initialStateI = {
  showPass: false,
  isLoading: false,
};

export default function LoginPage() {
  const [state, setState] = useState<initialStateI>(initialState);
  const { toast } = useToast();
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginUser = async (values: { email: string; password: string }) => {
    try {
      const response = await client.get(ENDPOINTS.USERS, {
        params: { email: values.email, password: values.password },
      });
      const users = response.data;

      if (users.length === 0) {
        toast({
          variant: 'destructive',
          description: 'Invalid credentials.',
          duration: 3000,
        });
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const user = users[0];
      if (user.status === 'inactive') {
        toast({
          variant: 'destructive',
          description: 'Your account is inactive. Please contact support.',
          duration: 3000,
        });
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      if (user) {
        setUser(user);
        router.push('dashboard');
        form.reset();
      }

      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      toast({
        variant: 'destructive',
        description: 'Login error.',
        duration: 3000,
      });
    }
  };

  function onSubmit(values: LoginFormValues) {
    setState((prev) => ({ ...prev, isLoading: true }));

    loginUser(values);
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Card className="w-full max-w-sm space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to login
          </p>
        </div>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Button
                className="w-full"
                type="submit"
                disabled={state.isLoading}
              >
                {state.isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="!mt-0 text-center text-sm">
          {"Don't have an account? "}
          <Link className="text-primary hover:underline" href="/register">
            Register
          </Link>
        </div>
      </Card>
    </div>
  );
}
