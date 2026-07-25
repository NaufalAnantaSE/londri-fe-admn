'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import { authApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Sun, Moon, GearSix } from '@phosphor-icons/react';
import { toast } from '@/hooks/useToast';

const THEME_OPTIONS = [
  { value: 'light' as const, label: 'Terang', Icon: Sun },
  { value: 'dark' as const, label: 'Gelap', Icon: Moon },
  { value: 'system' as const, label: 'Ikuti Sistem', Icon: GearSix },
];

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: authApi.me });
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => { logout(); router.replace('/login'); toast.success('Berhasil keluar'); },
  });

  return (
    <>
      <PageHeader title="Pengaturan" />
      <div className="space-y-4 p-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 text-xl font-bold text-white shadow-md shadow-sky-500/30">
              {(me?.username || 'A')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{me?.username || '…'}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{me?.role || 'Super Admin'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Tema Tampilan</h3>
          <div className="grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => setTheme(opt.value)}
                className={`flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-xl border-2 transition-all ${
                  theme === opt.value
                    ? 'border-sky-500 bg-sky-50 dark:border-sky-500 dark:bg-sky-950'
                    : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                }`}>
                <opt.Icon size={24} weight="duotone" />
                <span className={`text-xs font-medium ${
                  theme === opt.value ? 'text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400'
                }`}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}
          className="min-h-[48px] w-full rounded-xl bg-red-50 font-semibold text-red-600 active:bg-red-100 disabled:opacity-50 dark:bg-red-950 dark:text-red-400 dark:active:bg-red-900">
          {logoutMutation.isPending ? 'Keluar…' : 'Keluar'}
        </button>

        <p className="pt-2 text-center text-xs text-slate-400 dark:text-slate-500">Londri POS Superadmin · v0.1.0</p>
      </div>
    </>
  );
}
