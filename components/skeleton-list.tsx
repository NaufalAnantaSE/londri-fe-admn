export default function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="mb-3 h-4 w-2/3 rounded bg-slate-200" />
          <div className="mb-2 h-3 w-full rounded bg-slate-100 dark:bg-slate-950" />
          <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-950" />
        </div>
      ))}
    </div>
  );
}
