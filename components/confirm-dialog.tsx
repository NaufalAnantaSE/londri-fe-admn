'use client';
export default function ConfirmDialog({ open, title, message, loading, onCancel, onConfirm }: {
  open: boolean; title: string; message?: string; loading?: boolean;
  onCancel: () => void; onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95] mx-auto flex max-w-md items-center justify-center px-8">
      <div className="animate-fade-in absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="animate-dialog-in glass-strong relative w-full rounded-3xl p-6 shadow-xl">
        <h3 className="text-base font-semibold">{title}</h3>
        {message && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{message}</p>}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={onCancel} className="min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 font-medium active:bg-slate-50 dark:active:bg-slate-800">Batal</button>
          <button onClick={onConfirm} disabled={loading}
            className="min-h-[44px] rounded-xl bg-red-500 font-medium text-white active:bg-red-600 disabled:opacity-50">
            {loading ? 'Menghapus…' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
