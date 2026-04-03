"use client";

type Props = {
  rows?: number;
};

export default function InboxListSkeleton({ rows = 4 }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="animate-pulse space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-40 rounded bg-white/10" />
          <div className="h-3 w-72 rounded bg-white/10" />
        </div>

        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={`inbox-row-skeleton-${index}`}
            className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
          >
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-full bg-white/10" />
                <div className="h-6 w-28 rounded-full bg-white/10" />
              </div>
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-4/5 rounded bg-white/10" />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="h-10 rounded bg-white/10" />
                <div className="h-10 rounded bg-white/10" />
                <div className="h-10 rounded bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
