import * as React from "react";
import * as U from "../../../../packages/ui/src/index";
import { AlignCenter, ArrowUpRight, AlignLeft, AlignRight, Bold, Check, Clock, Italic, LayoutGrid, Link2, List, Map, Search, TriangleAlert, Underline, X } from "lucide-react";

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

export function KbdExample({ onNotice }: { onNotice: (text: string) => void }) {
  const [platform, setPlatform] = React.useState<"mac" | "windows">("mac");
  const mod = platform === "mac" ? "⌘" : "Ctrl";
  const alt = platform === "mac" ? "⌥" : "Alt";
  const shortcuts = [
    { action: "Open the search", keys: [mod, "K"] },
    { action: "Save the current page", keys: [mod, "S"] },
    { action: "Move the selected block up", keys: [alt, "⇧", "↑"] },
    { action: "Close the dialog without saving the changes you made", keys: ["⎋"] },
  ];
  return (
    <div className="grid w-full gap-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-medium">Inline in text</p>
          <p className="text-sm leading-6">
            Press <U.Kbd keys={[mod, "K"]} /> to open the search, then <U.Kbd>Enter</U.Kbd> to jump to the first result. Use <U.Kbd>?</U.Kbd> for the full list.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Small size in secondary text: <U.Kbd size="sm">Tab</U.Kbd> moves between fields and <U.Kbd size="sm" keys={["⇧", "⇥"]} /> goes back.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-medium">Platform labels</p>
          <U.ButtonGroup label="Platform" attached>
            <U.Button tone={platform === "mac" ? "primary" : "outline"} size="sm" aria-pressed={platform === "mac"} onClick={() => setPlatform("mac")}>macOS</U.Button>
            <U.Button tone={platform === "windows" ? "primary" : "outline"} size="sm" aria-pressed={platform === "windows"} onClick={() => setPlatform("windows")}>Windows</U.Button>
          </U.ButtonGroup>
          <p className="mt-3 text-sm leading-6">
            Glyphs are announced as words: <U.Kbd keys={["⌘", "⇧", "P"]} /> reads as Command Shift P. Words stay as typed: <U.Kbd keys={["Ctrl", "Alt", "Del"]} />.
          </p>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <p className="mb-3 text-sm font-medium">Shortcut list</p>
          <ul className="divide-y divide-line rounded-xl border border-line">
            {shortcuts.map((item) => (
              <li key={item.action} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 text-sm">
                <span className="min-w-0 flex-1">{item.action}</span>
                <U.Kbd keys={item.keys} />
              </li>
            ))}
          </ul>
        </div>
        <div className="w-60 max-w-full">
          <p className="mb-3 text-sm font-medium">Inside a control, 240px parent</p>
          <U.Button tone="outline" className="w-full justify-between" onClick={() => onNotice("Search opened")}>
            <span className="inline-flex items-center gap-2"><Search className="size-4" /> Search</span>
            <U.Kbd keys={[mod, "K"]} />
          </U.Button>
          <p className="mt-3 text-xs leading-5 text-muted">
            Multiline hint: hold <U.Kbd size="sm" keys={[alt]} /> while dragging a block to duplicate it, or press <U.Kbd size="sm" keys={[mod, "D"]} /> with the block selected.
          </p>
        </div>
      </div>
    </div>
  );
}

export function SeparatorExample({ onNotice }: { onNotice: (text: string) => void }) {
  return (
    <div className="grid w-full gap-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-medium">Semantic break between sections</p>
          <U.Card>
            <U.CardHeader>
              <U.CardTitle>Your workspace</U.CardTitle>
              <U.CardDescription>Three projects, two shared with the studio.</U.CardDescription>
            </U.CardHeader>
            <U.Separator />
            <U.CardContent>
              <p className="font-medium text-ink">Settings</p>
              <p className="mt-1 text-muted">Notifications, members and billing live here.</p>
            </U.CardContent>
            <U.Separator spacing="sm" />
            <U.CardContent className="text-muted">Version 0.1, updated today.</U.CardContent>
          </U.Card>
        </div>
        <div>
          <p className="mb-3 text-sm font-medium">Labelled break between two routes</p>
          <U.Card>
            <U.Button className="w-full" onClick={() => onNotice("Magic link sent")}>Send me a sign-in link</U.Button>
            <U.Separator label="or" />
            <U.Button tone="outline" className="w-full" onClick={() => onNotice("Password sign-in")}>Use a password</U.Button>
          </U.Card>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <p className="mb-3 text-sm font-medium">Vertical rules bounded by the toolbar row</p>
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-line bg-card p-1" role="toolbar" aria-label="Formatting">
            <U.Button tone="quiet" size="sm" aria-label="Bold"><Bold className="size-4" /></U.Button>
            <U.Button tone="quiet" size="sm" aria-label="Italic"><Italic className="size-4" /></U.Button>
            <U.Button tone="quiet" size="sm" aria-label="Underline"><Underline className="size-4" /></U.Button>
            <U.Separator orientation="vertical" spacing="sm" decorative className="my-2" />
            <U.Button tone="quiet" size="sm" aria-label="Align left"><AlignLeft className="size-4" /></U.Button>
            <U.Button tone="quiet" size="sm" aria-label="Align centre"><AlignCenter className="size-4" /></U.Button>
            <U.Separator orientation="vertical" spacing="sm" decorative className="my-2" />
            <U.Button tone="quiet" size="sm" onClick={() => onNotice("Link inserted")}><Link2 className="size-4" /> Link</U.Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center text-sm text-muted">
            <span>Alex Rivers</span>
            <U.Separator orientation="vertical" decorative className="h-3 self-center" />
            <span>Edited 2 hours ago</span>
            <U.Separator orientation="vertical" decorative className="h-3 self-center" />
            <span>12 pages</span>
          </div>
        </div>
        <div className="w-60 max-w-full">
          <p className="mb-3 text-sm font-medium">Long label in a 240px parent</p>
          <div className="rounded-xl border border-line bg-card p-4 text-sm">
            <p>Messages from this morning.</p>
            <U.Separator label="Earlier this week, before the workshop" />
            <p className="text-muted">Older messages are archived after thirty days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Inline SVG placeholders so the demo needs no network and the intrinsic size is known. */
function placeholder(width: number, height: number, from: string, to: string, title: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="${width}" height="${height}" fill="url(#g)"/><circle cx="${width * 0.72}" cy="${height * 0.3}" r="${Math.min(width, height) * 0.12}" fill="#f4f1e9" fill-opacity="0.7"/><text x="${width / 2}" y="${height * 0.88}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.min(width, height) * 0.09}" fill="#f4f1e9">${title}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
const harbour = placeholder(1600, 900, "#8b9fa2", "#326145", "Harbour, 1600 by 900");
const portrait = placeholder(900, 1200, "#ac4333", "#edbd52", "Portrait, 900 by 1200");

export function AspectRatioExample() {
  const [failed, setFailed] = React.useState(false);
  return (
    <div className="grid w-full gap-8">
      <div>
        <p className="mb-3 text-sm font-medium">Ratios side by side, same image, no layout shift</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <figure className="min-w-0">
            <U.AspectRatio ratio={16 / 9}>
              <img src={harbour} alt="Harbour at dawn, cropped to a wide frame" loading="lazy" />
            </U.AspectRatio>
            <figcaption className="mt-2 text-xs text-muted">16:9, cover</figcaption>
          </figure>
          <figure className="min-w-0">
            <U.AspectRatio ratio={1}>
              <img src={harbour} alt="Harbour at dawn, cropped to a square" loading="lazy" />
            </U.AspectRatio>
            <figcaption className="mt-2 text-xs text-muted">1:1, cover</figcaption>
          </figure>
          <figure className="min-w-0">
            <U.AspectRatio ratio={3 / 4} fit="contain">
              <img src={harbour} alt="Harbour at dawn, whole picture inside a portrait frame" loading="lazy" />
            </U.AspectRatio>
            <figcaption className="mt-2 text-xs text-muted">3:4, contain on the surface token</figcaption>
          </figure>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_240px]">
        <div className="grid gap-4 sm:grid-cols-2">
          <figure className="min-w-0">
            <U.AspectRatio ratio={4 / 5}>
              <img src={portrait} alt="Portrait print from the archive" loading="lazy" />
            </U.AspectRatio>
            <figcaption className="mt-2 text-xs text-muted">Portrait source in a 4:5 frame</figcaption>
          </figure>
          <figure className="min-w-0">
            <U.AspectRatio ratio={4 / 5}>
              {failed ? (
                <div role="img" aria-label="Terrace at noon, image unavailable" className="grid size-full place-items-center p-4 text-center text-sm text-muted">
                  Image unavailable
                </div>
              ) : (
                <img src="/aretusa-missing-image.jpg" alt="Terrace at noon" onError={() => setFailed(true)} />
              )}
            </U.AspectRatio>
            <figcaption className="mt-2 text-xs text-muted">Load error: the fallback keeps the frame and an accessible name</figcaption>
          </figure>
        </div>
        <div className="w-60 max-w-full">
          <p className="mb-3 text-sm font-medium">240px parent, intrinsic minimum width</p>
          <U.AspectRatio ratio={1} className="rounded-lg">
            <div className="size-full overflow-auto p-3" role="region" aria-label="Schedule table" tabIndex={0}>
              <table className="min-w-[360px] border-collapse text-xs">
                <caption className="sr-only">Workshop schedule</caption>
                <thead>
                  <tr className="text-start text-muted"><th className="pe-4 text-start font-medium">Time</th><th className="pe-4 text-start font-medium">Room</th><th className="text-start font-medium">Session</th></tr>
                </thead>
                <tbody>
                  <tr><td className="pe-4">09:00</td><td className="pe-4">Printing room</td><td>Letterpress introduction</td></tr>
                  <tr><td className="pe-4">11:00</td><td className="pe-4">Library</td><td>Map folding</td></tr>
                  <tr><td className="pe-4">15:00</td><td className="pe-4">Terrace</td><td>Open studio</td></tr>
                  <tr><td className="pe-4">19:00</td><td className="pe-4">Hall</td><td>Evening talk</td></tr>
                </tbody>
              </table>
            </div>
          </U.AspectRatio>
          <p className="mt-2 text-xs text-muted">The frame clips; the table scrolls inside its own labelled region.</p>
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-medium">Non-media content</p>
        <U.AspectRatio ratio={21 / 9} className="grid place-items-center">
          <span className="px-4 text-center font-editorial text-2xl sm:text-3xl">Space to create.</span>
        </U.AspectRatio>
      </div>
    </div>
  );
}

export function DirectionExample({ onNotice }: { onNotice: (text: string) => void }) {
  const [dir, setDir] = React.useState<U.TextDirection>("rtl");
  const menu = [
    { label: dir === "rtl" ? "إعادة تسمية" : "Rename", onSelect: () => onNotice("Rename chosen in the example") },
    { label: dir === "rtl" ? "نسخ الرابط" : "Copy link", onSelect: () => onNotice("Link copied in the example") },
    { label: dir === "rtl" ? "حذف" : "Delete", danger: true, onSelect: () => onNotice("Delete chosen in the example") },
  ];
  return (
    <div className="grid w-full gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <U.ButtonGroup label="Reading direction" attached>
          <button type="button" aria-pressed={dir === "ltr"} onClick={() => setDir("ltr")}>Left to right</button>
          <button type="button" aria-pressed={dir === "rtl"} onClick={() => setDir("rtl")}>Right to left</button>
        </U.ButtonGroup>
        <p className="text-xs text-muted">Every block below reads the same prop; nothing else is rewritten.</p>
      </div>
      <U.Direction dir={dir} className="grid gap-6 rounded-xl border border-line bg-paper p-4 sm:grid-cols-[minmax(0,1fr)_240px]">
        <div className="grid min-w-0 gap-4">
          <U.Breadcrumb items={dir === "rtl" ? [{ label: "المشاريع", href: "#" }, { label: "الأرشيف", href: "#" }, { label: "الطلب 4821" }] : [{ label: "Projects", href: "#" }, { label: "Archive", href: "#" }, { label: "Order 4821" }]} />
          <U.Card>
            <U.CardHeader action={<U.DropdownMenu trigger={<U.Button tone="outline" size="sm">{dir === "rtl" ? "خيارات" : "Options"}</U.Button>} items={menu} />}>
              <U.CardTitle>{dir === "rtl" ? "طباعة الملصقات" : "Poster printing"}</U.CardTitle>
              <U.CardDescription>{dir === "rtl" ? "تُسلَّم النسخ يوم الخميس، القاعة الكبرى." : "Copies arrive on Thursday, main hall."}</U.CardDescription>
            </U.CardHeader>
            <U.CardContent>
              <div className="flex flex-wrap items-center gap-2">
                <U.Badge tone="success" icon={<Check strokeWidth={2.5} />}>{dir === "rtl" ? "مدفوع" : "Paid"}</U.Badge>
                <U.Badge tone="info" icon={<Clock />}>{dir === "rtl" ? "يفتح 09:00" : "Opens at 09:00"}</U.Badge>
                <U.Badge dot size="sm">{dir === "rtl" ? "مسودة" : "Draft"}</U.Badge>
              </div>
              <p className="mt-3 text-sm">
                {dir === "rtl" ? "رقم الطلب " : "Order number "}
                <U.Direction dir="ltr" className="inline-block font-mono">ARE-2026-4821</U.Direction>
                {dir === "rtl" ? " ينتهي في " : " expires on "}
                <U.Direction dir="ltr" className="inline-block">2026-10-01</U.Direction>.
              </p>
            </U.CardContent>
            <U.CardFooter align="end">
              <U.Popover label={dir === "rtl" ? "تفاصيل التسليم" : "Delivery details"} trigger={<U.Button tone="outline" size="sm">{dir === "rtl" ? "التسليم" : "Delivery"}</U.Button>}>
                <p className="text-sm">{dir === "rtl" ? "القاعة الكبرى، الطابق الأول، من 09:00 إلى 18:00." : "Main hall, first floor, 09:00 to 18:00."}</p>
              </U.Popover>
              <U.Button size="sm" onClick={() => onNotice("Approved in the example")}>
                {dir === "rtl" ? "اعتماد" : "Approve"}
                <ArrowUpRight aria-hidden className="size-4 rtl:-scale-x-100" />
              </U.Button>
            </U.CardFooter>
          </U.Card>
        </div>
        <div className="min-w-0">
          <p className="mb-3 text-sm font-medium">{dir === "rtl" ? "عمود بعرض 240 بكسل" : "240px column"}</p>
          <U.Field label={dir === "rtl" ? "البريد الإلكتروني" : "Email"} hint={dir === "rtl" ? "الحقل يبقى من اليسار إلى اليمين." : "The field itself stays left to right."}>
            <U.Direction dir="ltr"><U.Input type="email" placeholder="name@example.com" /></U.Direction>
          </U.Field>
          <p className="mt-3 text-xs text-muted">
            {dir === "rtl" ? "نص طويل جدًا بدون فواصل: " : "A long unbroken token: "}
            <span className="break-all">https://aretusa.example/orders/4821/delivery-notes</span>
          </p>
        </div>
      </U.Direction>
    </div>
  );
}
