export default function EmptyState({ emoji, title = 'Belum ada data', description }: {
  emoji?: string; title?: string; description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-3xl">{emoji || '⌁'}</div>
      <h3 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{description}</p>}
    </div>
  );
}
