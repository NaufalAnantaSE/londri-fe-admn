'use client';
export default function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
export const inputCls =
  'neuo-inset w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:border-sky-600 dark:focus:ring-sky-900 placeholder:text-slate-400 dark:placeholder:text-slate-500';
