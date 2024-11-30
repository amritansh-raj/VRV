import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-card px-4 py-8 text-center shadow-lg duration-500 animate-in fade-in-50">
        <AlertCircle
          className="mx-auto h-16 w-16 text-destructive"
          aria-hidden="true"
        />
        <h1 className="text-3xl font-bold tracking-tight">
          Unauthorized Access
        </h1>
        <p className="text-muted-foreground">
          Sorry, you don&apos;t have permission to access this page. Please
          check your credentials and try again.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild variant="default">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
