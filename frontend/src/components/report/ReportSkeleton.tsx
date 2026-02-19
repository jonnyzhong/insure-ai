export function ReportSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Executive summary skeleton */}
      <div className="rounded-xl border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 rounded bg-muted" />
          <div className="h-6 w-20 rounded-full bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-4 w-4/6 rounded bg-muted" />
          <div className="h-4 w-3/6 rounded bg-muted" />
        </div>
      </div>

      {/* Customer profile skeleton */}
      <div className="rounded-xl border p-6 space-y-4">
        <div className="h-5 w-40 rounded bg-muted" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-muted" />
              <div className="space-y-1 flex-1">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="h-4 w-32 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Policy portfolio skeleton */}
      <div className="rounded-xl border p-6 space-y-4">
        <div className="h-5 w-44 rounded bg-muted" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-[200px] rounded bg-muted" />
          <div className="h-[200px] rounded bg-muted" />
        </div>
      </div>

      {/* Claims skeleton */}
      <div className="rounded-xl border p-6 space-y-4">
        <div className="h-5 w-36 rounded bg-muted" />
        <div className="h-[180px] rounded bg-muted" />
      </div>
    </div>
  );
}
