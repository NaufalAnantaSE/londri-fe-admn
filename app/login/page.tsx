'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { apiMessage } from '@/lib/api/client';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => authApi.login(username, password),
    onSuccess: (data) => { login(data.token, data.user); router.replace('/dashboard'); },
    onError: (e) => setError(apiMessage(e)),
  });

  return (
    <div className="flex min-h-[100dvh] flex-col justify-center px-8 safe-top">
      <div className="mb-8">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-2xl font-bold text-white">L</div>
        <h1 className="text-2xl font-bold">Londri POS</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Masuk sebagai Superadmin</p>
      </div>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setError(''); mutation.mutate(); }}>
        {error && <div className="rounded-xl bg-red-50 dark:bg-red-950 px-4 py-3 text-sm text-red-600">{error}</div>}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username"
            className="min-h-[48px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 outline-none focus:border-sky-400 dark:focus:border-sky-600" placeholder="admin" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
            className="min-h-[48px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 outline-none focus:border-sky-400 dark:focus:border-sky-600" placeholder="••••••••" />
        </div>
        <button type="submit" disabled={mutation.isPending}
          className="min-h-[48px] w-full rounded-xl bg-sky-500 font-semibold text-white active:bg-sky-600 disabled:opacity-50">
          {mutation.isPending ? 'Masuk…' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
