export default function CardActions({ onEdit, onRemove }: { onEdit: () => void; onRemove: () => void }) {
  return (
    <div className="flex shrink-0 gap-1">
      <button onClick={onEdit} aria-label="Ubah" className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 dark:bg-slate-800 text-slate-500 dark:text-slate-400 active:bg-slate-100 dark:bg-slate-950">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      </button>
      <button onClick={onRemove} aria-label="Hapus" className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950 text-red-500 active:bg-red-100">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  );
}
