import * as React from "react";
import * as U from "../../../../packages/ui/src/index";
import { Activity, Archive, Copy, FolderInput, LayoutGrid, Pencil, Settings2, Share2, Trash2 } from "lucide-react";

export function TabsExample() {
  const [section, setSection] = React.useState("activity");
  const controlled = [
    { value: "overview", label: "Overview", icon: <LayoutGrid />, content: <p className="max-w-prose text-sm leading-relaxed text-muted">Everything you need to begin: the brief, the people involved and the first milestone.</p> },
    { value: "activity", label: "Activity", icon: <Activity />, content: <ul className="space-y-3 text-sm">{["Brief approved", "Print proofs uploaded", "Terrace booked for the review"].map((line) => <li key={line} className="border-b border-line pb-3 last:border-b-0">{line}</li>)}</ul> },
    { value: "billing", label: "Billing", disabled: true, content: <p>Unavailable</p> },
    { value: "settings", label: "Settings", icon: <Settings2 />, content: <div className="max-w-sm"><U.Switch label="Weekly digest" description="A summary every Monday morning." defaultChecked /><U.Switch label="Mention alerts" /></div> },
  ];
  return (
    <div className="w-full space-y-10">
      <div>
        <p className="mb-3 text-sm text-muted">Pill variant, controlled. Section: <span className="font-medium text-ink">{section}</span></p>
        <U.Tabs label="Project sections" items={controlled} value={section} onValueChange={setSection} />
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">Line variant with long labels, in a narrow parent.</p>
        <div className="w-60 max-w-full">
          <U.Tabs
            label="Archive sections"
            variant="line"
            items={[
              { value: "letters", label: "Letters from Ortigia", content: <p className="text-sm leading-relaxed">Forty-two letters, transcribed and searchable.</p> },
              { value: "maps", label: "Maps and margins", content: <p className="text-sm leading-relaxed">Hand drawn plans of the salt gardens.</p> },
              { value: "workshop", label: "Workshop notes, 1998 to 2004", content: <p className="text-sm leading-relaxed">Six notebooks of print tests.</p> },
            ]}
          />
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">Many tabs wrap before anything is clipped.</p>
        <U.Tabs
          label="Months"
          items={["January", "February", "March", "April", "May", "June", "July", "August", "September"].map((m) => ({ value: m.toLowerCase(), label: m, content: <p className="text-sm text-muted">Bookings for {m}.</p> }))}
        />
      </div>
    </div>
  );
}

export function AccordionExample() {
  const [open, setOpen] = React.useState<string[]>(["shipping"]);
  return (
    <div className="w-full space-y-10">
      <div>
        <p className="mb-3 text-sm text-muted">Single mode, one answer open at a time, with a disabled entry and a form inside the last answer.</p>
        <U.Accordion
          headingLevel={3}
          items={[
            { title: "Can I customize the source?", content: "Yes. The source is yours to adapt under the MIT license. Change tokens in one place and every installed component follows." },
            { title: "Does it support keyboard navigation?", content: "Each interactive component documents its keyboard behavior and is tested through its public role and name." },
            { title: "Archived: the 2024 pricing question", content: "Kept for reference.", disabled: true },
            { title: "Where do I report a problem, and what should I include so the studio can reproduce it quickly?", content: <form className="max-w-sm space-y-3" onSubmit={(event) => event.preventDefault()}><U.Field label="What happened?"><U.Input aria-label="What happened?" placeholder="A short description" /></U.Field><U.Button size="sm" type="submit">Send report</U.Button></form> },
          ]}
        />
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">Multiple mode, controlled, in a narrow parent. Open: {open.length ? open.join(", ") : "none"}</p>
        <div className="w-60 max-w-full">
          <U.Accordion
            type="multiple"
            value={open}
            onValueChange={setOpen}
            items={[
              { value: "shipping", title: "Shipping across the island", content: "Two to four working days with a tracked courier." },
              { value: "returns", title: "Returns", content: "Fourteen days, prints must be unframed." },
              { value: "care", title: "Caring for a hand-pulled print on cotton paper", content: "Keep it out of direct sunlight and away from damp walls." },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export function CollapsibleExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="w-full space-y-10">
      <div>
        <p className="mb-3 text-sm text-muted">Uncontrolled, with a description under the trigger.</p>
        <U.Collapsible title="Show project details" description="Budget, dates and the people involved.">
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
            <dt className="text-muted">Budget</dt><dd>4,200 EUR</dd>
            <dt className="text-muted">Dates</dt><dd>12 to 26 October</dd>
            <dt className="text-muted">People</dt><dd>Alex, Giulia and the printing room</dd>
          </dl>
        </U.Collapsible>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">Controlled, quiet trigger, with a form and a Done action that closes it and returns focus to the trigger.</p>
        <U.Collapsible title="Filters" tone="quiet" open={open} onOpenChange={setOpen}>
          <div className="max-w-sm space-y-3">
            <U.Field label="Search"><U.Input aria-label="Search" placeholder="Prints, maps, letters" /></U.Field>
            <U.Button size="sm" tone="outline" onClick={() => setOpen(false)}>Done</U.Button>
          </div>
        </U.Collapsible>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">Long hidden content in a 240px parent, plus a disabled trigger.</p>
        <div className="w-60 max-w-full space-y-4">
          <U.Collapsible title="Read the full note about paper conservation and framing" defaultOpen>
            <p>Keep prints out of direct sunlight. Frame with acid-free mounts and leave a small gap so the paper can breathe. Unframed prints travel flat between two boards, never rolled. Sehrlangeswortohneleerzeichenzumtesten.</p>
          </U.Collapsible>
          <U.Collapsible title="Archive access" disabled><p>Members only.</p></U.Collapsible>
        </div>
      </div>
    </div>
  );
}

export function BreadcrumbExample() {
  const stop = (event: React.MouseEvent) => event.preventDefault();
  return (
    <div className="w-full space-y-10">
      <div>
        <p className="mb-3 text-sm text-muted">Three levels, the current page last.</p>
        <U.Breadcrumb items={[{ label: "Home", href: "#/", onClick: stop }, { label: "Components", href: "#/components/button", onClick: stop }, { label: "Breadcrumb" }]} />
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">Six levels collapse behind a control that reveals the hidden ancestors.</p>
        <U.Breadcrumb
          items={[
            { label: "Home", href: "#/", onClick: stop },
            { label: "Archive", href: "#/archive", onClick: stop },
            { label: "Letters", href: "#/archive/letters", onClick: stop },
            { label: "Ortigia", href: "#/archive/letters/ortigia", onClick: stop },
            { label: "1998", href: "#/archive/letters/ortigia/1998", onClick: stop },
            { label: "A letter from Ortigia, 12 October" },
          ]}
        />
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">Slash separator and a long current title wrapping in a 240px parent.</p>
        <div className="w-60 max-w-full">
          <U.Breadcrumb separator="/" label="Location" items={[{ label: "Studio", href: "#/studio", onClick: stop }, { label: "Printing room", href: "#/studio/print", onClick: stop }, { label: "Reservations for the autumn open studio weekend" }]} />
        </div>
      </div>
    </div>
  );
}

export function PaginationExample() {
  const [page, setPage] = React.useState(1);
  const [result, setResult] = React.useState(7);
  return (
    <div className="w-full space-y-10">
      <div>
        <p className="mb-3 text-sm text-muted">Five pages. Numbers appear from the sm breakpoint; narrower viewports show the position instead.</p>
        <U.Pagination page={page} total={5} onChange={setPage} />
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">Forty pages of search results with gaps around the current one.</p>
        <U.Pagination label="Search results" page={result} total={40} onChange={setResult} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-sm text-muted">A single page.</p>
          <U.Pagination page={1} total={1} onChange={() => {}} />
        </div>
        <div>
          <p className="mb-3 text-sm text-muted">No pages yet.</p>
          <U.Pagination page={1} total={0} onChange={() => {}} />
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">Custom labels in a 240px parent.</p>
        <div className="w-60 max-w-full">
          <U.Pagination page={page} total={5} onChange={setPage} previousLabel="Newer" nextLabel="Older" />
        </div>
      </div>
    </div>
  );
}

export function DropdownMenuExample() {
  const [last, setLast] = React.useState("none");
  const [archived, setArchived] = React.useState(true);
  const [starred, setStarred] = React.useState(false);
  const say = (label: string) => () => setLast(label);
  const actions: U.MenuEntry[] = [
    { label: "Rename", icon: <Pencil />, shortcut: "⌘R", onSelect: say("Rename") },
    { label: "Duplicate", icon: <Copy />, shortcut: "⌘D", onSelect: say("Duplicate") },
    { label: "Share", icon: <Share2 />, description: "Members with the link can view.", onSelect: say("Share") },
    { type: "submenu", label: "Move to", icon: <FolderInput />, items: [{ label: "Prints", onSelect: say("Move to Prints") }, { label: "Maps and margins", onSelect: say("Move to Maps") }, { label: "Letters from Ortigia", onSelect: say("Move to Letters") }] },
    { type: "separator" },
    { type: "group", label: "View", items: [{ type: "checkbox", label: "Show archived", checked: archived, onCheckedChange: setArchived }, { type: "checkbox", label: "Starred only", checked: starred, onCheckedChange: setStarred }] },
    { type: "separator" },
    { label: "Archive", icon: <Archive />, disabled: true, onSelect: say("Archive") },
    { label: "Delete project", icon: <Trash2 />, danger: true, onSelect: say("Delete") },
  ];
  return (
    <div className="w-full space-y-10">
      <div>
        <p className="mb-3 text-sm text-muted">Icons, shortcut hints, a description, a submenu, a labelled group of checkbox items, a disabled entry and a destructive action. Last action: <span className="font-medium text-ink">{last}</span></p>
        <U.DropdownMenu label="Project actions" trigger={<U.Button tone="outline">Project actions</U.Button>} items={actions} />
      </div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-3 text-sm text-muted">Aligned to the end of an icon trigger.</p>
          <U.DropdownMenu label="More" align="end" trigger={<U.Button tone="quiet" aria-label="More options" className="min-w-11 px-2"><Settings2 aria-hidden="true" className="size-4" /></U.Button>} items={actions.slice(0, 3)} />
        </div>
        <div>
          <p className="mb-3 text-sm text-muted">Inside a dialog.</p>
          <U.Dialog trigger={<U.Button tone="outline">Open dialog</U.Button>} title="Letters from Ortigia" description="Forty-two letters, transcribed and searchable.">
            <U.DropdownMenu label="Letter actions" trigger={<U.Button size="sm" tone="outline">Actions</U.Button>} items={actions} />
          </U.Dialog>
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">Long labels wrap and forty entries scroll inside the menu, in a 240px parent.</p>
        <div className="w-60 max-w-full">
          <U.DropdownMenu
            label="Chapters"
            trigger={<U.Button tone="outline" className="w-full">Jump to a chapter of the workshop notes</U.Button>}
            items={Array.from({ length: 40 }, (_, n) => ({ label: n === 3 ? "Chapter 4, in which the press is moved across the courtyard during the first rain of October" : "Chapter " + (n + 1), onSelect: say("Chapter " + (n + 1)) }))}
          />
        </div>
      </div>
    </div>
  );
}

export function ContextMenuExample() {
  const [last, setLast] = React.useState("none");
  const say = (label: string) => () => setLast(label);
  const actions: U.MenuEntry[] = [
    { label: "Open", icon: <LayoutGrid />, shortcut: "Enter", onSelect: say("Open") },
    { label: "Rename", icon: <Pencil />, onSelect: say("Rename") },
    { type: "submenu", label: "Move to", icon: <FolderInput />, items: [{ label: "Prints", onSelect: say("Move to Prints") }, { label: "Letters", onSelect: say("Move to Letters") }] },
    { type: "separator" },
    { type: "group", label: "Share", items: [{ label: "Copy link", icon: <Share2 />, onSelect: say("Copy link") }, { label: "Export as PDF", disabled: true, onSelect: say("Export") }] },
    { type: "separator" },
    { label: "Delete", icon: <Trash2 />, danger: true, onSelect: say("Delete") },
  ];
  const card = (title: string, note: string) => (
    <div className="rounded-xl border border-dashed border-line bg-paper p-6 pe-14 text-sm">
      <p className="font-medium text-ink">{title}</p>
      <p className="mt-1 leading-relaxed text-muted">{note}</p>
    </div>
  );
  return (
    <div className="w-full space-y-10">
      <div>
        <p className="mb-3 text-sm text-muted">Right click, a long press or Shift+F10 on the focused card. The button in the corner offers the same actions to touch and assistive technology. Last action: <span className="font-medium text-ink">{last}</span></p>
        <U.ContextMenu label="Letter actions" items={actions} buttonLabel="Actions for the letter">
          <div tabIndex={0} className="rounded-xl">{card("A letter from Ortigia, 12 October", "Transcribed. Focus the card and press Shift+F10, or right click anywhere on it.")}</div>
        </U.ContextMenu>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-sm text-muted">Without the button, in a 240px parent.</p>
          <div className="w-60 max-w-full">
            <U.ContextMenu label="Map actions" items={actions}>
              <div tabIndex={0} className="rounded-xl">{card("Plan of the salt gardens", "Right click only.")}</div>
            </U.ContextMenu>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm text-muted">Disabled area.</p>
          <U.ContextMenu label="Archive actions" items={actions} disabled buttonLabel="Actions for the archive">
            <div className="rounded-xl opacity-60">{card("Archived notebook", "Nothing to do here yet.")}</div>
          </U.ContextMenu>
        </div>
      </div>
    </div>
  );
}

export function MenubarExample() {
  const [last, setLast] = React.useState("none");
  const [spelling, setSpelling] = React.useState(true);
  const [wrap, setWrap] = React.useState(false);
  const say = (label: string) => () => setLast(label);
  const menus: U.MenubarMenu[] = [
    { label: "File", items: [{ label: "New letter", icon: <Pencil />, shortcut: "⌘N", onSelect: say("New letter") }, { label: "Duplicate", icon: <Copy />, onSelect: say("Duplicate") }, { type: "submenu", label: "Open recent", items: [{ label: "A letter from Ortigia", onSelect: say("Open letter") }, { label: "Plan of the salt gardens", onSelect: say("Open plan") }] }, { type: "separator" }, { label: "Close", onSelect: say("Close") }] },
    { label: "Edit", items: [{ label: "Undo", shortcut: "⌘Z", onSelect: say("Undo") }, { label: "Redo", shortcut: "⇧⌘Z", disabled: true, onSelect: say("Redo") }, { type: "separator" }, { type: "checkbox", label: "Check spelling", checked: spelling, onCheckedChange: setSpelling }, { type: "checkbox", label: "Wrap long lines", checked: wrap, onCheckedChange: setWrap }] },
    { label: "Share", items: [{ label: "Copy link", icon: <Share2 />, onSelect: say("Copy link") }, { label: "Export as PDF", onSelect: say("Export") }] },
    { label: "Archive", disabled: true, items: [{ label: "Move to archive", onSelect: say("Archive") }] },
  ];
  return (
    <div className="w-full space-y-10">
      <div>
        <p className="mb-3 text-sm text-muted">Four menus, one disabled. ArrowLeft and ArrowRight move between them. Last action: <span className="font-medium text-ink">{last}</span></p>
        <U.Menubar label="Editor" menus={menus} />
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">The same menubar in a 240px parent wraps its triggers instead of hiding them.</p>
        <div className="w-60 max-w-full">
          <U.Menubar label="Editor, narrow" menus={menus} />
        </div>
      </div>
    </div>
  );
}

export function NavigationMenuExample() {
  const [destination, setDestination] = React.useState("none");
  const go = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setDestination(event.currentTarget.getAttribute("href") ?? "");
  };
  const items: U.NavigationMenuItem[] = [
    { label: "Prints", href: "#/prints", active: true, onClick: go },
    {
      label: "Archive",
      items: [
        { label: "Letters from Ortigia", href: "#/archive/letters", description: "Forty-two letters, transcribed and searchable.", onClick: go },
        { label: "Maps and margins", href: "#/archive/maps", description: "Hand drawn plans of the salt gardens.", onClick: go },
        { label: "Workshop notes, 1998 to 2004", href: "#/archive/notes", onClick: go },
      ],
    },
    {
      label: "Studio",
      items: [
        { label: "Printing room", href: "#/studio/print", onClick: go },
        { label: "Reservations", href: "#/studio/reservations", onClick: go },
      ],
    },
    { label: "About", href: "#/about", onClick: go },
  ];
  return (
    <div className="w-full space-y-10">
      <div>
        <p className="mb-3 text-sm text-muted">Two plain links, one current, and two groups that open a panel of links. Chosen destination: <span className="font-medium text-ink">{destination}</span></p>
        <U.NavigationMenu label="Site" items={items} />
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">In a 240px parent the row wraps and the panel stays inside the viewport.</p>
        <div className="w-60 max-w-full rounded-xl border border-dashed border-line p-3">
          <U.NavigationMenu label="Site, narrow" items={items} />
        </div>
      </div>
    </div>
  );
}
