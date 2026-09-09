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

export function SpinnerExample() {
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => {
    if (!busy) return;
    const timer = window.setTimeout(() => setBusy(false), 2400);
    return () => window.clearTimeout(timer);
  }, [busy]);
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <U.Spinner size="sm" label="Small" />
        <U.Spinner label="Medium" />
        <U.Spinner size="lg" label="Large" />
        <U.Spinner label="Label for screen readers only" labelHidden />
      </div>
      <p className="max-w-prose text-sm leading-relaxed">
        Inline with running text the spinner sits on the middle of the line, so a sentence such as
        "your export is being prepared <U.Spinner size="sm" label="preparing" labelHidden />" keeps its rhythm.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <U.Button loading={busy} onClick={() => setBusy(true)}>Save changes</U.Button>
        <U.Button tone="outline" onClick={() => setBusy(true)}>
          {busy ? <U.Spinner size="sm" label="Saving" /> : "Save as draft"}
        </U.Button>
        {busy && <U.Spinner size="sm" label="Saving your draft, this takes a moment" className="text-muted" />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-line bg-card">
          <U.Spinner size="lg" label="Loading the archive" className="text-terracotta" />
        </div>
        <div className="flex min-h-40 items-center justify-center rounded-xl bg-ink text-paper" data-theme="dark">
          <U.Spinner size="lg" label="Rendering preview" />
        </div>
      </div>
      <div className="w-60 max-w-full rounded-xl border border-line p-4">
        <p className="mb-2 text-xs text-muted">240px parent</p>
        <U.Spinner label="Synchronising twelve notebooks with the studio archive" />
      </div>
    </div>
  );
}

export function ProgressExample() {
  const [done, setDone] = React.useState(2);
  const files = 9;
  return (
    <div className="w-full space-y-8">
      <div className="space-y-4">
        <U.Progress
          label="Uploading photographs"
          description={done >= files ? "All files are in the archive." : "Large files are compressed before upload."}
          value={done}
          max={files}
          tone={done >= files ? "success" : "default"}
          formatValue={(value, max) => `${value} of ${max} files`}
        />
        <div className="flex flex-wrap gap-3">
          <U.Button tone="outline" onClick={() => setDone((d) => Math.min(files, d + 1))} disabled={done >= files}>Next file</U.Button>
          <U.Button tone="quiet" onClick={() => setDone(0)}>Reset</U.Button>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <U.Progress label="Not started" value={0} />
        <U.Progress label="Complete" value={100} />
        <U.Progress label="Preparing export" description="The total is not known yet." />
        <U.Progress label="Storage almost full" value={94} tone="danger" description="Free space or upgrade the plan to keep saving." />
      </div>
      <div className="grid gap-6 sm:grid-cols-[240px_1fr]">
        <div className="w-60 max-w-full rounded-xl border border-line p-4">
          <p className="mb-3 text-xs text-muted">240px parent</p>
          <U.Progress label="Synchronising the complete studio archive with every collaborator" value={61} />
        </div>
        <div className="rounded-xl bg-ink p-4 text-paper" data-theme="dark">
          <p className="mb-3 text-xs text-muted">Dark surface, label for screen readers only</p>
          <U.Progress label="Rendering" labelHidden value={38} />
        </div>
      </div>
    </div>
  );
}

export function EmptyExample() {
  const [notice, setNotice] = React.useState("");
  const [query, setQuery] = React.useState("harbour maps 1962");
  return (
    <div className="w-full space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <U.Empty
          title="No projects yet"
          action={<U.Button onClick={() => setNotice("Project created")}>Create project</U.Button>}
        >
          Your first project belongs here. Start from a blank page or import notes from the archive.
        </U.Empty>
        <U.Empty
          variant="search"
          title={query ? `Nothing matches "${query}"` : "Search the archive"}
          action={
            <>
              <U.Button tone="outline" onClick={() => { setQuery(""); setNotice("Search cleared"); }} disabled={!query}>Clear search</U.Button>
              <U.Button tone="quiet" onClick={() => setNotice("Filters opened")}>Adjust filters</U.Button>
            </>
          }
        >
          {query ? "Check the spelling or try a broader phrase. Titles, tags and author names are searched." : "Type a title, a tag or an author name."}
        </U.Empty>
        <U.Empty
          variant="permission"
          title="Members only"
          action={
            <>
              <U.Button onClick={() => setNotice("Access requested")}>Request access</U.Button>
              <U.Button tone="quiet" onClick={() => setNotice("Back to the catalogue")}>Back to the catalogue</U.Button>
            </>
          }
        >
          This collection is shared with studio members. An administrator will review your request within a day.
        </U.Empty>
        <U.Empty
          variant="error"
          title="The archive could not be loaded"
          action={
            <>
              <U.Button onClick={() => setNotice("Retrying")}>Try again</U.Button>
              <U.Button tone="quiet" onClick={() => setNotice("Support opened")}>Contact support</U.Button>
            </>
          }
        >
          The connection dropped while loading. Your drafts are safe and nothing was sent.
        </U.Empty>
      </div>
      <div className="grid gap-6 sm:grid-cols-[240px_1fr]">
        <div className="w-60 max-w-full">
          <p className="mb-2 text-xs text-muted">240px parent, long explanation and two actions</p>
          <U.Empty
            variant="search"
            title="No photographs from the Marsala saltworks trip were found"
            action={
              <>
                <U.Button onClick={() => setNotice("Upload started")}>Upload photographs</U.Button>
                <U.Button tone="quiet" onClick={() => setNotice("Search cleared")}>Clear</U.Button>
              </>
            }
          >
            Photographs are matched by caption, place name and the date written on the back of the print, so a misspelled place name hides the whole set.
          </U.Empty>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-card p-4">
            <p className="mb-3 text-sm font-medium">Comments</p>
            <U.Empty compact title="No comments yet" action={<U.Button tone="outline" size="sm" onClick={() => setNotice("Composer opened")}>Write the first</U.Button>}>
              Notes you leave here are visible to the studio.
            </U.Empty>
          </div>
          <div className="rounded-xl bg-ink p-4 text-paper" data-theme="dark">
            <U.Empty compact variant="permission" title="Private notebook">Ask the owner to share it with you.</U.Empty>
          </div>
        </div>
      </div>
      {notice && <p className="text-sm text-success" role="status">{notice}</p>}
    </div>
  );
}

export function ItemExample() {
  const [notice, setNotice] = React.useState("");
  const [current, setCurrent] = React.useState("field-notes");
  const rows = [
    { id: "field-notes", name: "Field notes", detail: "Updated this morning by Giulia", meta: "12 files, 48 MB" },
    { id: "quiet", name: "Quiet interfaces", detail: "Draft, 1,240 words", meta: "Edited 3 days ago" },
    { id: "salt", name: "The salt gardens", detail: "Photographs from the Marsala trip, still to be captioned", meta: "84 photographs" },
  ];
  return (
    <div className="w-full space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="min-w-0">
          <p className="mb-1 text-sm font-medium">Linked rows with trailing actions</p>
          <ul>
            {rows.map((row) => (
              <U.Item
                key={row.id}
                as="li"
                href={"#/components/item?open=" + row.id}
                selected={current === row.id}
                title={row.name}
                description={row.detail}
                meta={row.meta}
                leading={<U.Avatar name={row.name} />}
                action={
                  <U.Button tone="quiet" size="sm" aria-label={"Share " + row.name} onClick={() => { setCurrent(row.id); setNotice(row.name + " shared"); }}>
                    Share
                  </U.Button>
                }
              />
            ))}
          </ul>
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-sm font-medium">Activatable, static and disabled</p>
          <U.Item title="Workshop notes" description="Opens the notebook in place." onActivate={() => setNotice("Workshop notes opened")} />
          <U.Item title="Maps and margins" description="A static row with a badge." action={<U.Badge tone="success">Published</U.Badge>} />
          <U.Item title="Departure" description="Archived by the owner." meta="Read only" onActivate={() => {}} disabled />
          <U.Item title="Evening on the terrace" description="Two named actions beside a multiline description that wraps onto a second line in most widths." action={<><U.Button tone="outline" size="sm" aria-label="Rename Evening on the terrace">Rename</U.Button><U.Button tone="danger" size="sm" aria-label="Delete Evening on the terrace">Delete</U.Button></>} />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-[240px_1fr]">
        <div className="w-60 max-w-full rounded-xl border border-line px-4">
          <p className="mt-3 text-xs text-muted">240px parent, actions stack</p>
          <U.Item
            href="#/components/item"
            title="Correspondence with the Ortigia printing house, 1958 to 1964"
            description="Twelve letters, two telegrams and one invoice."
            leading={<U.Avatar name="Ortigia printing house" />}
            action={<><U.Button tone="outline" size="sm" aria-label="Download the correspondence">Download</U.Button><U.Button tone="quiet" size="sm" aria-label="Archive the correspondence">Archive</U.Button></>}
          />
        </div>
        <div className="rounded-xl bg-ink px-4 text-paper" data-theme="dark">
          <p className="mt-3 text-xs text-muted">Dark surface</p>
          <U.Item href="#/components/item" title="A letter from Ortigia" description="Chapter 3" meta="18 min read" action={<U.Badge>Draft</U.Badge>} />
          <U.Item title="The printing room" description="Chapter 6" meta="9 min read" className="border-b-0" />
        </div>
      </div>
      {notice && <p className="text-sm text-success" role="status">{notice}</p>}
    </div>
  );
}

export function AlertExample() {
  const [notice, setNotice] = React.useState("");
  const [dismissed, setDismissed] = React.useState(false);
  const [failed, setFailed] = React.useState(true);
  return (
    <div className="w-full space-y-6">
      <div className="space-y-3">
        <U.Alert title="An early release" live="off">
          Components may change before 1.0. Pin a version in your lockfile and read the changelog before upgrading.
        </U.Alert>
        {!dismissed && (
          <U.Alert tone="success" title="Your work is saved" onDismiss={() => { setDismissed(true); setNotice("Notice dismissed"); }}>
            You can safely close this page. A copy is kept in the archive for thirty days.
          </U.Alert>
        )}
        <U.Alert
          tone="warning"
          title="Storage almost full"
          action={
            <>
              <U.Button size="sm" onClick={() => setNotice("Plan page opened")}>Upgrade plan</U.Button>
              <U.Button size="sm" tone="quiet" onClick={() => setNotice("Large files listed")}>Review large files</U.Button>
            </>
          }
        >
          94% of the studio space is used. New photographs will fail to upload once it is full; see <a href="#/docs">the storage guide</a> for what counts.
        </U.Alert>
        {failed ? (
          <U.Alert
            tone="error"
            title="The upload could not be completed"
            action={<U.Button size="sm" onClick={() => { setFailed(false); setNotice("Retrying the upload"); }}>Try again</U.Button>}
          >
            The connection dropped while sending "Marsala saltworks, contact sheet 07.tif" (312 MB). Nothing was lost; the file is still on your device.
          </U.Alert>
        ) : (
          <U.Alert tone="success" title="Upload complete" action={<U.Button size="sm" tone="quiet" onClick={() => setFailed(true)}>Show the error again</U.Button>} />
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-[240px_1fr]">
        <div className="w-60 max-w-full">
          <p className="mb-2 text-xs text-muted">240px parent, dismissable, long words</p>
          <U.Alert tone="error" title="Unrecoverable synchronisation conflict" onDismiss={() => setNotice("Conflict notice dismissed")}>
            Rename the local copy, then reopen /archive/correspondence/1958-1964/letters-and-telegrams.pdf.
          </U.Alert>
        </div>
        <div className="space-y-3 rounded-xl bg-ink p-4 text-paper" data-theme="dark">
          <U.Alert tone="info" title="Scheduled maintenance" live="off">Saturday 03:00 to 04:00 CET.</U.Alert>
          <U.Alert tone="warning" title="Two collaborators are editing" live="off" icon={null}>Changes merge automatically.</U.Alert>
        </div>
      </div>
      {notice && <p className="text-sm text-success" role="status">{notice}</p>}
    </div>
  );
}
