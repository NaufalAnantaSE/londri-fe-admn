'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

// Guard: pages under (app) require login. Hydrates token from localStorage.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, hydrated, hydrate } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    if (hydrated && !token) router.replace('/login');
  }, [hydrated, token, router, pathname]);

  if (!hydrated || !token) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-sky-500" />
      </div>
    );
  }
  return <>{children}</>;
}
