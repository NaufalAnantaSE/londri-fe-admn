'use client';
import { MagnifyingGlass, X } from '@phosphor-icons/react';

export default function SearchInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="relative">
      <MagnifyingGlass size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || 'Cari…'} inputMode="search"
        className="neuo-inset min-h-[44px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-10 text-sm outline-none transition-colors focus:border-sky-400 focus:bg-white dark:focus:border-sky-600 dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Bersihkan pencarian"
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 active:bg-slate-200 dark:active:bg-slate-700">
          <X size={16} weight="bold" />
        </button>
      )}
    </div>
  );
}
