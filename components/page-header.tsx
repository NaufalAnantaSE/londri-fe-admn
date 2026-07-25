'use client';
import { useRouter } from 'next/navigation';

export default function PageHeader({ title, back = false, right }: { title: string; back?: boolean; right?: React.ReactNode }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 flex min-h-[56px] items-center gap-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/95 px-4 backdrop-blur safe-top">
      {back && (
        <button onClick={() => router.back()} aria-label="Kembali"
          className="flex h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:bg-slate-950">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <h1 className="flex-1 truncate text-lg font-semibold">{title}</h1>
      {right}
    </header>
  );
}
