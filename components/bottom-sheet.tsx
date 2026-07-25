'use client';
import { useEffect } from 'react';
export default function BottomSheet({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title?: string; children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] mx-auto max-w-md">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-white dark:bg-slate-900 safe-bottom">
        <div className="sticky top-0 bg-white dark:bg-slate-900 px-5 pb-2 pt-4">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
          {title && <h2 className="text-base font-semibold">{title}</h2>}
        </div>
        <div className="px-5 pb-6">{children}</div>
      </div>
    </div>
  );
}
