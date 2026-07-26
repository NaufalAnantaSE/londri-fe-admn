'use client';
import { PencilSimple, TrashSimple } from '@phosphor-icons/react';

export default function CardActions({ onEdit, onRemove }: { onEdit: () => void; onRemove: () => void }) {
  return (
    <div className="flex shrink-0 gap-1">
      <button onClick={onEdit} aria-label="Ubah" className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-700">
        <PencilSimple size={17} weight="duotone" />
      </button>
      <button onClick={onRemove} aria-label="Hapus" className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950 text-red-500 active:bg-red-100 dark:active:bg-red-900">
        <TrashSimple size={17} weight="duotone" />
      </button>
    </div>
  );
}
