import * as React from "react";
import * as U from "../../../../packages/ui/src/index";
import { AlignCenter, AlignLeft, AlignRight, Check, Clock, LayoutGrid, List, Map, TriangleAlert, X } from "lucide-react";

export function BadgeExample() {
  return (
    <div className="grid w-full gap-8">
      <div>
        <p className="mb-3 text-sm font-medium">Soft and outline, five tones</p>
        <div className="flex flex-wrap items-center gap-2">
          <U.Badge>Draft</U.Badge>
          <U.Badge tone="info">Scheduled</U.Badge>
          <U.Badge tone="success">Published</U.Badge>
          <U.Badge tone="warning">In review</U.Badge>
          <U.Badge tone="danger">Failed</U.Badge>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <U.Badge variant="outline">Draft</U.Badge>
          <U.Badge variant="outline" tone="info">Scheduled</U.Badge>
          <U.Badge variant="outline" tone="success">Published</U.Badge>
          <U.Badge variant="outline" tone="warning">In review</U.Badge>
          <U.Badge variant="outline" tone="danger">Failed</U.Badge>
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-medium">Icons, dots and the small size</p>
        <div className="flex flex-wrap items-center gap-2">
          <U.Badge tone="success" icon={<Check strokeWidth={2.5} />}>Paid</U.Badge>
          <U.Badge tone="info" icon={<Clock />}>Opens at 09:00</U.Badge>
          <U.Badge tone="warning" icon={<TriangleAlert />}>Two seats left</U.Badge>
          <U.Badge tone="danger" icon={<X strokeWidth={2.5} />}>Cancelled</U.Badge>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <U.Badge size="sm" dot>Draft</U.Badge>
          <U.Badge size="sm" dot tone="success">Live</U.Badge>
          <U.Badge size="sm" dot tone="warning">Pending</U.Badge>
          <U.Badge size="sm" dot tone="danger" variant="outline">Offline</U.Badge>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-medium">Beside controls and inline text</p>
          <div className="flex flex-wrap items-center gap-3">
            <U.Button tone="outline">Open workshop</U.Button>
            <U.Badge tone="success" dot>3 new</U.Badge>
          </div>
          <p className="mt-4 text-sm leading-6">
            The printing room is <U.Badge size="sm" tone="warning">booked</U.Badge> until Friday and the
            terrace is <U.Badge size="sm" tone="success">free</U.Badge> all week.
          </p>
        </div>
        <div className="w-60 max-w-full">
          <p className="mb-3 text-sm font-medium">Long label in a 240px parent</p>
          <U.Badge tone="info" icon={<Clock />}>
            Waiting for the printing room to confirm the reservation
          </U.Badge>
        </div>
      </div>
    </div>
  );
}

export function CardExample({ onNotice }: { onNotice: (text: string) => void }) {
  return (
    <div className="grid w-full gap-8">
      <div className="grid gap-4 md:grid-cols-3">
        <U.Card>
          <U.CardHeader action={<U.Button tone="quiet" size="sm" aria-label="Remove Field notes" onClick={() => onNotice("Field notes removed")}><X className="size-4" /></U.Button>}>
            <U.Badge tone="success" dot>Published</U.Badge>
            <U.CardTitle>Field notes</U.CardTitle>
            <U.CardDescription>Twelve pages from the salt gardens, with the printing schedule for October.</U.CardDescription>
          </U.CardHeader>
          <U.CardContent>
            <p>Last edited by Alex on Tuesday. Two comments are waiting for a reply.</p>
          </U.CardContent>
          <U.CardFooter align="between">
            <span className="text-xs text-muted">2.4 MB</span>
            <U.Button tone="outline" size="sm" onClick={() => onNotice("Field notes opened")}>Open</U.Button>
          </U.CardFooter>
        </U.Card>
        <U.Card>
          <U.CardHeader>
            <U.Badge>Draft</U.Badge>
            <U.CardTitle>Quiet interfaces</U.CardTitle>
            <U.CardDescription>A short essay.</U.CardDescription>
          </U.CardHeader>
          <U.CardFooter align="between">
            <span className="text-xs text-muted">180 KB</span>
            <U.Button tone="outline" size="sm" onClick={() => onNotice("Quiet interfaces opened")}>Open</U.Button>
          </U.CardFooter>
        </U.Card>
        <U.Card aria-busy="true" aria-label="Loading the next project">
          <U.CardHeader>
            <U.Skeleton className="h-5 w-16 rounded-full" />
            <U.Skeleton className="h-6 w-3/4" />
            <U.Skeleton className="h-4 w-full" />
            <U.Skeleton className="h-4 w-5/6" />
          </U.CardHeader>
          <U.CardFooter align="between">
            <U.Skeleton className="h-3 w-12" />
            <U.Skeleton className="h-9 w-16 rounded-lg" />
          </U.CardFooter>
        </U.Card>
      </div>
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_240px]">
        <U.Card as="section" aria-labelledby="card-open-studio">
          <U.CardHeader>
            <U.CardTitle as="h2" id="card-open-studio">Open studio, Saturday</U.CardTitle>
            <U.CardDescription>Doors open at 10:00. Bring your own paper if you want to print on the letterpress; the workshop supplies ink and the small formats.</U.CardDescription>
          </U.CardHeader>
          <U.CardContent className="space-y-3">
            <p>The printing room and the terrace are open all day. The library keeps quiet hours after 18:00, so plan reading sessions before the evening talk.</p>
            <ul className="list-disc space-y-1 ps-5 text-muted">
              <li>Letterpress introduction at 11:00</li>
              <li>Map folding at 15:00</li>
              <li>Evening talk at 19:00</li>
            </ul>
          </U.CardContent>
          <U.CardFooter align="end">
            <U.Button tone="outline" onClick={() => onNotice("Reminder saved")}>Remind me</U.Button>
            <U.Button onClick={() => onNotice("Seat reserved")}>Reserve a seat</U.Button>
          </U.CardFooter>
        </U.Card>
        <U.Card>
          <U.CardHeader>
            <U.CardTitle>Straordinariamenteinterminabile</U.CardTitle>
            <U.CardDescription>A 240px parent with an unbroken word and a long address below.</U.CardDescription>
          </U.CardHeader>
          <U.CardContent>https://aretusa.example/archive/a-very-long-path-that-wraps-inside-the-card</U.CardContent>
          <U.CardFooter>
            <U.Button tone="outline" size="sm" onClick={() => onNotice("Archive opened")}>Open the archive folder</U.Button>
          </U.CardFooter>
        </U.Card>
      </div>
    </div>
  );
}

export function ButtonGroupExample({ onNotice }: { onNotice: (text: string) => void }) {
  const [view, setView] = React.useState<"grid" | "list" | "map">("grid");
  const [align, setAlign] = React.useState<"left" | "center" | "right">("left");
  const [saving, setSaving] = React.useState(false);
  const views = [
    { id: "grid" as const, label: "Grid", icon: <LayoutGrid className="size-4" /> },
    { id: "list" as const, label: "List", icon: <List className="size-4" /> },
    { id: "map" as const, label: "Map", icon: <Map className="size-4" /> },
  ];
  const aligns = [
    { id: "left" as const, label: "Align left", icon: <AlignLeft className="size-4" /> },
    { id: "center" as const, label: "Align centre", icon: <AlignCenter className="size-4" /> },
    { id: "right" as const, label: "Align right", icon: <AlignRight className="size-4" /> },
  ];
  return (
    <div className="grid w-full gap-8">
      <div>
        <p className="mb-3 text-sm font-medium">Spaced actions, one primary</p>
        <U.ButtonGroup label="Draft actions">
          <U.Button tone="outline" onClick={() => onNotice("Draft discarded")}>Discard</U.Button>
          <U.Button tone="outline" loading={saving} onClick={() => { setSaving(true); onNotice("Saving draft"); setTimeout(() => setSaving(false), 1200); }}>Save draft</U.Button>
          <U.Button tone="outline" disabled>Archive</U.Button>
          <U.Button onClick={() => onNotice("Published locally")}>Publish</U.Button>
        </U.ButtonGroup>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-medium">Attached, selected view with aria-pressed</p>
          <U.ButtonGroup label="View" attached>
            {views.map((item) => (
              <U.Button key={item.id} tone={view === item.id ? "primary" : "outline"} aria-pressed={view === item.id} onClick={() => { setView(item.id); onNotice(item.label + " view"); }}>
                {item.icon}
                {item.label}
              </U.Button>
            ))}
          </U.ButtonGroup>
        </div>
        <div>
          <p className="mb-3 text-sm font-medium">Attached icon actions, 44px each</p>
          <U.ButtonGroup label="Text alignment" attached>
            {aligns.map((item) => (
              <U.Button key={item.id} tone={align === item.id ? "secondary" : "outline"} aria-pressed={align === item.id} aria-label={item.label} onClick={() => setAlign(item.id)}>
                {item.icon}
              </U.Button>
            ))}
          </U.ButtonGroup>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="w-60 max-w-full">
          <p className="mb-3 text-sm font-medium">Mixed lengths in a 240px parent</p>
          <U.ButtonGroup label="Reservation">
            <U.Button tone="outline" onClick={() => onNotice("Reservation cancelled")}>Cancel</U.Button>
            <U.Button onClick={() => onNotice("Printing room reserved")}>Reserve the printing room for Saturday morning</U.Button>
          </U.ButtonGroup>
        </div>
        <div className="w-60 max-w-full">
          <p className="mb-3 text-sm font-medium">Attached and vertical in a 240px parent</p>
          <U.ButtonGroup label="Export" attached orientation="vertical">
            <U.Button tone="outline" onClick={() => onNotice("PDF exported")}>Export as PDF</U.Button>
            <U.Button tone="outline" onClick={() => onNotice("Print sheet exported")}>Export the print sheet with crop marks</U.Button>
            <U.Button tone="outline" disabled>Send to the letterpress</U.Button>
          </U.ButtonGroup>
        </div>
      </div>
    </div>
  );
}
