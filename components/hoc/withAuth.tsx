/* eslint-disable @typescript-eslint/no-explicit-any */
import useAuthStore from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (
  WrappedComponent: React.ComponentType,
  allowedRoles: string[],
) => {
  const AuthWrapper = (props: any) => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');
      }

      if (user && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }, [isAuthenticated, user, allowedRoles, router]);

    if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthWrapper;
};

export default withAuth;
