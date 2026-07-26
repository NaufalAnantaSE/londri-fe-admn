import type { Icon as PhosphorIcon } from '@phosphor-icons/react';

export default function EmptyState({ icon: Icon, title = 'Belum ada data', description }: {
  icon?: PhosphorIcon; title?: string; description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        {Icon ? <Icon size={32} weight="duotone" /> : <span className="text-3xl">⌁</span>}
      </div>
      <h3 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{description}</p>}
    </div>
  );
}
