'use client';
import { useToastStore } from '@/hooks/useToast';
import { CheckCircle, WarningCircle } from '@phosphor-icons/react';

export default function Toaster() {
  const { toasts } = useToastStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] mx-auto flex w-full max-w-md flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div key={t.id}
          className={`animate-toast-in pointer-events-auto flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-sm text-white shadow-lg ${t.type === 'error' ? 'bg-red-500 dark:bg-red-600' : 'bg-emerald-600 dark:bg-emerald-700'}`}>
          {t.type === 'error' ? <WarningCircle size={20} weight="fill" className="shrink-0" /> : <CheckCircle size={20} weight="fill" className="shrink-0" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}
