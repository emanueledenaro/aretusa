import * as React from "react";
import * as U from "../../../../packages/ui/src/index";
import { Activity, LayoutGrid, Settings2 } from "lucide-react";

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
