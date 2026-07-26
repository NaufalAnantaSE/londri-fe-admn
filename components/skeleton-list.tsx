export default function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-200/60 dark:border-slate-800 glass p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-2 h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
