import * as React from "react";
import * as U from "../../../../packages/ui/src/index";

const notes = [
  { name: "Field notes", detail: "Updated this morning by Giulia", initials: "GC" },
  { name: "Quiet interfaces", detail: "Draft, 1,240 words", initials: "MR" },
  { name: "The salt gardens", detail: "Photographs from the Marsala trip", initials: "AL" },
];

export function SkeletonExample() {
  const [loaded, setLoaded] = React.useState(false);
  const list = loaded ? (
    <ul className="divide-y divide-line">
      {notes.map((note) => (
        <li key={note.name} className="flex items-center gap-3 py-3">
          <U.Avatar name={note.name} />
          <div className="min-w-0 text-sm">
            <p className="truncate font-medium">{note.name}</p>
            <p className="truncate text-muted">{note.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <U.SkeletonGroup label="Loading notes" className="divide-y divide-line">
      {notes.map((note) => (
        <div key={note.name} className="flex items-center gap-3 py-3">
          <U.Skeleton shape="circle" />
          <div className="min-w-0 flex-1 text-sm">
            <U.Skeleton className="w-2/5" />
            <U.Skeleton className="w-4/5" />
          </div>
        </div>
      ))}
    </U.SkeletonGroup>
  );
  return (
    <div className="w-full space-y-6">
      <U.Switch label="Show loaded content" description="Shapes and content take the same space, so nothing moves." checked={loaded} onCheckedChange={setLoaded} />
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="mb-2 text-sm font-medium">List rows</p>
          {list}
        </div>
        <div className="min-w-0">
          <p className="mb-2 text-sm font-medium">Article</p>
          {loaded ? (
            <article className="space-y-3">
              <div className="h-32 rounded-lg bg-surface" role="img" aria-label="Harbour at dusk, placeholder image" />
              <h3 className="font-editorial text-xl">Arrival at the harbour</h3>
              <p className="text-sm leading-relaxed text-muted">The ferry docks a little after seven. The salt light makes the facades look freshly painted, and the printing room is already open.</p>
            </article>
          ) : (
            <U.SkeletonGroup label="Loading article" className="space-y-3">
              <U.Skeleton shape="rectangle" className="h-32" />
              <U.Skeleton className="h-[1.25rem] w-3/5 text-xl" />
              <U.Skeleton lines={3} className="text-sm" />
            </U.SkeletonGroup>
          )}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-[240px_1fr]">
        <div className="w-60 max-w-full rounded-xl border border-line p-4">
          <p className="mb-2 text-xs text-muted">240px parent</p>
          <U.SkeletonGroup label="Loading card">
            <U.Skeleton shape="rectangle" className="h-20" />
            <U.Skeleton lines={2} className="mt-3 text-sm" />
            <U.Skeleton className="mt-3 h-11 w-28 rounded-lg" shape="rectangle" />
          </U.SkeletonGroup>
        </div>
        <div className="rounded-xl bg-ink p-4 text-paper" data-theme="dark">
          <p className="mb-2 text-xs text-muted">Dark surface</p>
          <U.SkeletonGroup label="Loading comment" className="flex items-start gap-3">
            <U.Skeleton shape="circle" className="size-8" />
            <U.Skeleton lines={2} className="flex-1 text-sm" />
          </U.SkeletonGroup>
        </div>
      </div>
    </div>
  );
}
