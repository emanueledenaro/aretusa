import * as React from "react";
import * as U from "../../../packages/ui/src/index";
import { Heart, Plus, ArrowUpRight } from "lucide-react";
import { fr } from "react-day-picker/locale";
import type { DateRange } from "react-day-picker";
import { ReactHookFormExample } from "../../../examples/react-hook-form/example";
import { TanStackFormExample } from "../../../examples/tanstack-form/example";
import { FormischExample } from "../../../examples/formisch/example";
import { TextareaExample, LabelExample } from "./demos/forms";
const choices = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
];
const rows = [
  { id: "1", name: "Field notes", status: "Published", amount: 120 },
  { id: "2", name: "Quiet interfaces", status: "Draft", amount: 85 },
  { id: "3", name: "The workshop", status: "Published", amount: 240 },
  { id: "4", name: "Open studio", status: "Review", amount: 160 },
  { id: "5", name: "Small details", status: "Draft", amount: 40 },
  { id: "6", name: "A new beginning", status: "Published", amount: 300 },
];
const chapters = [
  "Arrival at the harbour",
  "The salt gardens",
  "A letter from Ortigia",
  "Workshop notes",
  "Evening on the terrace",
  "The printing room",
  "Maps and margins",
  "Departure",
];
const collection = ["Ceramics", "Prints", "Textiles", "Books", "Maps", "Posters"];
function ScrollFadeExample() {
  const [enabled, setEnabled] = React.useState(true);
  const [rtl, setRtl] = React.useState(false);
  const vertical = U.useScrollFade({ enabled });
  const horizontal = U.useScrollFade<HTMLElement>({ axis: "horizontal", enabled });
  const both = U.useScrollFade({ axis: "both", enabled });
  const short = U.useScrollFade({ enabled });
  const region = "focus-visible:outline-offset-[-2px]";
  return (
    <div className="w-full space-y-5">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <U.Switch label="Fade edges" checked={enabled} onCheckedChange={setEnabled} />
        <U.Switch label="Right to left" checked={rtl} onCheckedChange={setRtl} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <h3 id="scroll-fade-reading" className="mb-2 text-sm font-medium">Reading list</h3>
          <div className="relative overflow-hidden rounded-xl border border-line bg-paper">
            <div ref={vertical.ref} role="region" aria-labelledby="scroll-fade-reading" tabIndex={0} className={"h-56 overflow-auto p-4 " + region}>
              <ul className="space-y-3">
                {chapters.map((title, index) => (
                  <li key={title}>
                    <U.Item title={title} description={"Chapter " + (index + 1)} />
                  </li>
                ))}
              </ul>
            </div>
            <U.ScrollFade edges={vertical.edges} depth={40} />
          </div>
        </div>
        <div className="min-w-0">
          <h3 id="scroll-fade-collection" className="mb-2 text-sm font-medium">Collection</h3>
          <div className="relative overflow-hidden rounded-xl border border-line bg-card" dir={rtl ? "rtl" : undefined}>
            <section ref={horizontal.ref} aria-labelledby="scroll-fade-collection" tabIndex={0} className={"flex gap-3 overflow-x-auto p-4 " + region}>
              {collection.map((name) => (
                <div key={name} className="min-w-40 shrink-0 rounded-lg border border-line bg-paper p-4">
                  <p className="font-editorial text-lg">{name}</p>
                  <p className="mt-1 text-sm text-muted">Studio archive</p>
                </div>
              ))}
            </section>
            <U.ScrollFade edges={horizontal.edges} color="var(--color-card)" depth="2.5rem" />
          </div>
          <h3 id="scroll-fade-short" className="mb-2 mt-4 text-sm font-medium">Short list</h3>
          <div className="relative overflow-hidden rounded-xl border border-line bg-paper">
            <div ref={short.ref} role="region" aria-labelledby="scroll-fade-short" tabIndex={0} className={"h-24 overflow-auto p-4 " + region}>
              <p className="text-sm text-muted">Two lines fit without scrolling, so no fade appears.</p>
            </div>
            <U.ScrollFade edges={short.edges} depth={40} />
          </div>
        </div>
      </div>
      <div className="min-w-0">
        <h3 id="scroll-fade-schedule" className="mb-2 text-sm font-medium">Schedule, both axes</h3>
        <div className="relative overflow-hidden rounded-xl border border-line bg-paper">
          <div ref={both.ref} role="region" aria-labelledby="scroll-fade-schedule" tabIndex={0} className={"h-44 overflow-auto p-4 " + region}>
            <div className="grid w-[44rem] grid-cols-4 gap-3">
              {Array.from({ length: 16 }, (_, index) => (
                <div key={index} className="rounded-lg bg-surface px-3 py-4 text-sm">
                  <p className="font-medium">Session {index + 1}</p>
                  <p className="text-muted">Room {String.fromCharCode(65 + (index % 4))}</p>
                </div>
              ))}
            </div>
          </div>
          <U.ScrollFade edges={both.edges} depth={28} />
        </div>
      </div>
    </div>
  );
}
const september = new Date(2026, 8, 1);
function CalendarExample() {
  const [single, setSingle] = React.useState<Date | undefined>(new Date(2026, 8, 8));
  const [range, setRange] = React.useState<DateRange | undefined>({ from: new Date(2026, 8, 24), to: new Date(2026, 9, 2) });
  const unavailable = [new Date(2026, 8, 10), new Date(2026, 8, 11), new Date(2026, 9, 8)];
  const [dates, setDates] = React.useState<Date[] | undefined>([new Date(2026, 8, 3), new Date(2026, 8, 10)]);
  const label = (date?: Date) => date?.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="w-full space-y-8">
      <div>
        <h3 id="calendar-range" className="mb-2 text-sm font-medium">Stay dates across two months, three nights unavailable</h3>
        <div className="rounded-xl border border-line bg-card p-4" role="group" aria-labelledby="calendar-range">
          <U.Calendar mode="range" defaultMonth={september} selected={range} onSelect={setRange} numberOfMonths={2} showOutsideDays={false} disabled={unavailable} excludeDisabled footer={range?.to ? `From ${label(range.from)} to ${label(range.to)}` : "Choose a start and end date"} />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <h3 id="calendar-single" className="mb-2 text-sm font-medium">Single date with today marked</h3>
          <div className="rounded-xl border border-line bg-card p-4" role="group" aria-labelledby="calendar-single">
            <U.Calendar mode="single" defaultMonth={september} selected={single} onSelect={setSingle} footer={single ? `Selected ${label(single)}` : "No date selected"} />
          </div>
        </div>
        <div className="min-w-0">
          <h3 id="calendar-multiple" className="mb-2 text-sm font-medium">Up to three workshop days</h3>
          <div className="rounded-xl border border-line bg-card p-4" role="group" aria-labelledby="calendar-multiple">
            <U.Calendar mode="multiple" defaultMonth={september} selected={dates} onSelect={setDates} min={1} max={3} footer={`${dates?.length ?? 0} of 3 days chosen`} />
          </div>
        </div>
        <div className="min-w-0">
          <h3 id="calendar-dropdown" className="mb-2 text-sm font-medium">Month and year menus within bounds</h3>
          <div className="rounded-xl border border-line bg-card p-4" role="group" aria-labelledby="calendar-dropdown">
            <U.Calendar mode="single" defaultMonth={september} captionLayout="dropdown" startMonth={new Date(2025, 0)} endMonth={new Date(2027, 11)} />
          </div>
        </div>
        <div className="min-w-0">
          <h3 id="calendar-locale" className="mb-2 text-sm font-medium">French locale, Monday first, in a 240px parent</h3>
          <div className="w-60 max-w-full rounded-xl border border-line bg-card p-3" role="group" aria-labelledby="calendar-locale">
            <U.Calendar mode="single" defaultMonth={september} locale={fr} weekStartsOn={1} showWeekNumber />
          </div>
        </div>
      </div>
      <div className="max-w-sm">
        <h3 id="calendar-past" className="mb-2 text-sm font-medium">Earlier dates unavailable</h3>
        <div className="rounded-xl border border-line bg-card p-4" role="group" aria-labelledby="calendar-past">
          <U.Calendar mode="single" defaultMonth={september} disabled={{ before: new Date(2026, 8, 8) }} footer="Dates before today cannot be chosen. Validation, loading and error messages belong to the surrounding field." />
        </div>
      </div>
    </div>
  );
}
function AlertDialogExample({ onNotice }: { onNotice: (text: string) => void }) {
  const attempts = React.useRef(0);
  return (
    <div className="flex flex-wrap gap-3">
      <U.AlertDialog
        trigger={<U.Button tone="danger">Archive project</U.Button>}
        title="Archive this project?"
        description="Field notes will leave the active workspace. Members keep read access and you can restore it from the archive."
        confirmLabel="Archive project"
        onConfirm={() => new Promise<void>((resolve) => setTimeout(() => { onNotice("Project archived in the example"); resolve(); }, 1200))}
      >
        <ul className="space-y-1 text-muted">
          <li>12 documents and 3 shared boards move to the archive.</li>
          <li>Scheduled reminders stop.</li>
        </ul>
      </U.AlertDialog>
      <U.AlertDialog
        trigger={<U.Button tone="outline">Delete workspace</U.Button>}
        title="Delete the Studio workspace?"
        description="This removes the workspace for everyone. The first attempt in this example fails so you can see the recovery path."
        confirmLabel="Delete workspace"
        onConfirm={() => new Promise<void>((resolve, reject) => setTimeout(() => {
          attempts.current += 1;
          if (attempts.current % 2 === 1) reject(new Error("The server did not respond. Check your connection and try again."));
          else { onNotice("Workspace deleted in the example"); resolve(); }
        }, 900))}
      />
      <U.AlertDialog
        tone="neutral"
        trigger={<U.Button tone="quiet">Leave editor</U.Button>}
        title="Leave without saving?"
        description="Your draft of A letter from Ortigia has unsaved changes from the last four minutes."
        confirmLabel="Leave"
        cancelLabel="Keep editing"
        onConfirm={() => onNotice("Editor closed in the example")}
      />
    </div>
  );
}
const disciplines = [
  { value: "design", label: "Design", description: "Identity, editorial and product work." },
  { value: "engineering", label: "Engineering", description: "Front end, tooling and infrastructure." },
  { value: "product", label: "Product", description: "Research, strategy and roadmaps." },
  { value: "writing", label: "Writing", description: "Documentation and long form.", disabled: true },
];
const palette = [
  { value: "paper", label: "Paper", swatch: "#f4f1e9" },
  { value: "terracotta", label: "Terracotta", swatch: "#ac4333" },
  { value: "gold", label: "Gold", swatch: "#edbd52" },
  { value: "ink", label: "Ink", swatch: "#20201d" },
];
const regions = ["Agrigento", "Caltanissetta", "Catania", "Enna", "Messina", "Palermo", "Ragusa", "Siracusa", "Trapani", "Lampedusa e Linosa", "Pantelleria", "Isole Eolie"].map((name) => ({ value: name.toLowerCase().replace(/\s+/g, "-"), label: name }));
function SelectExample() {
  const [discipline, setDiscipline] = React.useState("");
  const [color, setColor] = React.useState("terracotta");
  const [region, setRegion] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const regionError = submitted && !region ? "Choose the region where you work." : undefined;
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <U.Field label="Discipline" hint="Options can carry a second line.">
        <U.Select label="Discipline" options={disciplines} value={discipline} onValueChange={setDiscipline} />
      </U.Field>
      <U.Field label="Accent">
        <U.Select label="Accent" options={palette} value={color} onValueChange={setColor} />
      </U.Field>
      <U.Field label="Region" error={regionError}>
        <U.Select label="Region" options={regions} value={region} onValueChange={(next) => { setRegion(next); setSubmitted(false); }} placeholder="Twelve places to scroll" />
      </U.Field>
      <U.Field label="Plan" hint="Managed by your workspace.">
        <U.Select label="Plan" options={[{ value: "studio", label: "Studio, yearly" }]} value="studio" disabled />
      </U.Field>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <U.Button tone="outline" onClick={() => setSubmitted(true)}>Validate region</U.Button>
        <U.Modal
          title="Choose a meeting room"
          description="A select inside a dialog keeps its list within the dialog's stacking context."
          trigger={<U.Button tone="quiet">Select inside a dialog</U.Button>}
          footer={<U.ModalClose><U.Button>Done</U.Button></U.ModalClose>}
        >
          <U.Field label="Room">
            <U.Select label="Room" options={[{ value: "print", label: "Printing room" }, { value: "terrace", label: "Terrace" }, { value: "library", label: "Library, quiet hours only", description: "Booked after 18:00 on weekdays." }]} />
          </U.Field>
        </U.Modal>
      </div>
    </div>
  );
}
function CheckboxExample() {
  const [terms, setTerms] = React.useState(false);
  const [rooms, setRooms] = React.useState({ print: true, terrace: false, library: false });
  const [submitted, setSubmitted] = React.useState(false);
  const chosen = Object.values(rooms).filter(Boolean).length;
  const all: boolean | "indeterminate" = chosen === 3 ? true : chosen === 0 ? false : "indeterminate";
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <div>
        <U.Checkbox label="I accept the booking terms" description="You can cancel up to two days before the visit." error={submitted && !terms ? "Accept the booking terms to continue." : undefined} checked={terms} onCheckedChange={(value) => { setTerms(value === true); setSubmitted(false); }} />
        <U.Button tone="outline" className="mt-2" onClick={() => setSubmitted(true)}>Validate</U.Button>
      </div>
      <fieldset className="min-w-0">
        <legend className="text-sm font-medium">Rooms to reserve</legend>
        <U.Checkbox label="All rooms" checked={all} onCheckedChange={(value) => setRooms({ print: value === true, terrace: value === true, library: value === true })} />
        <div className="ms-6 border-s border-line ps-4">
          <U.Checkbox label="Printing room" checked={rooms.print} onCheckedChange={(value) => setRooms({ ...rooms, print: value === true })} />
          <U.Checkbox label="Terrace" checked={rooms.terrace} onCheckedChange={(value) => setRooms({ ...rooms, terrace: value === true })} />
          <U.Checkbox label="Library" description="Quiet hours only, after 18:00 on weekdays." checked={rooms.library} onCheckedChange={(value) => setRooms({ ...rooms, library: value === true })} />
        </div>
      </fieldset>
      <div>
        <U.Checkbox label="Unavailable option" disabled />
        <U.Checkbox label="Included with your plan" disabled checked />
      </div>
      <div className="w-60 max-w-full">
        <U.Checkbox label="Send me the monthly letter about workshops, open studios and new prints from the archive" description="One message a month, no tracking." defaultChecked />
      </div>
    </div>
  );
}
function RadioGroupExample() {
  const [session, setSession] = React.useState("");
  const [plan, setPlan] = React.useState("studio");
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <div className="grid w-full gap-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p id="radio-session" className="mb-1 text-sm font-medium">Session</p>
          <U.RadioGroup
            label="Session"
            aria-labelledby="radio-session"
            value={session}
            onValueChange={(next) => { setSession(next); setSubmitted(false); }}
            description="Morning sessions include the printing room."
            error={submitted && !session ? "Choose a session to continue." : undefined}
            options={[
              { value: "morning", label: "Morning", description: "09:00 to 12:30" },
              { value: "afternoon", label: "Afternoon", description: "14:00 to 17:30" },
              { value: "evening", label: "Evening", description: "Fully booked this month.", disabled: true },
            ]}
          />
          <U.Button tone="outline" className="mt-3" onClick={() => setSubmitted(true)}>Validate</U.Button>
        </div>
        <div className="w-60 max-w-full">
          <p id="radio-delivery" className="mb-1 text-sm font-medium">Delivery in a 240px parent</p>
          <U.RadioGroup
            label="Delivery"
            aria-labelledby="radio-delivery"
            defaultValue="pickup"
            options={[
              { value: "pickup", label: "Pick up at the studio during opening hours, Monday to Saturday" },
              { value: "courier", label: "Courier", description: "Tracked, two to four working days across the island." },
            ]}
          />
        </div>
      </div>
      <div>
        <p id="radio-plan" className="mb-2 text-sm font-medium">Plan, card variant</p>
        <U.RadioGroup
          label="Plan"
          aria-labelledby="radio-plan"
          variant="cards"
          value={plan}
          onValueChange={setPlan}
          options={[
            { value: "studio", label: "Studio", description: "Shared desk, printing room by reservation, monthly meeting." },
            { value: "resident", label: "Resident", description: "Own desk, keys to the terrace, a shelf in the archive." },
            { value: "visitor", label: "Visitor", description: "Day passes only, no reservation rights.", disabled: true },
          ]}
        />
      </div>
    </div>
  );
}
function SwitchExample() {
  const [email, setEmail] = React.useState(true);
  const [share, setShare] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <div>
        <U.Switch label="Email notifications" description={email ? "A weekly digest every Monday." : "You will only see updates in the app."} checked={email} onCheckedChange={setEmail} />
        <U.Switch label="Share my calendar with the studio" description="Members see busy slots, never titles." error={submitted && !share ? "Sharing is required for shared desks." : undefined} checked={share} onCheckedChange={(next) => { setShare(next); setSubmitted(false); }} />
        <U.Button tone="outline" className="mt-2" onClick={() => setSubmitted(true)}>Validate</U.Button>
      </div>
      <div>
        <U.Switch label="Reduced motion" defaultChecked />
        <U.Switch label="Beta features" description="Managed by your workspace." disabled />
        <U.Switch label="Two-factor sign in" disabled checked />
      </div>
      <div className="w-60 max-w-full sm:col-span-2">
        <U.Switch label="Let other members see when I am at the studio and which room I am using" description="Only during opening hours." />
      </div>
    </div>
  );
}
export function Demo({ id }: { id: string }) {
  const [value, setValue] = React.useState(""),
    [flag, setFlag] = React.useState(false),
    [page, setPage] = React.useState(1),
    [notice, setNotice] = React.useState(""),
    [date, setDate] = React.useState<Date | undefined>();
  const options = [
    { label: "Rename", onSelect: () => setNotice("Rename selected") },
    { label: "Duplicate", onSelect: () => setNotice("Duplicate selected") },
    { label: "Unavailable", onSelect: () => {}, disabled: true },
  ];
  let content: React.ReactNode;
  switch (id) {
    case "button":
      content = (
        <div className="flex flex-wrap gap-3">
          <U.Button onClick={() => setNotice("Primary action selected")}>
            Create something <Plus className="size-4" />
          </U.Button>
          <U.Button
            tone="outline"
            onClick={() => setNotice("Secondary action selected")}
          >
            Explore
          </U.Button>
          <U.Button tone="accent" onClick={() => setFlag(!flag)}>
            {flag ? "Following" : "Follow"}
          </U.Button>
          <U.Button disabled>Disabled</U.Button>
          <U.Button loading>Saving</U.Button>
        </div>
      );
      break;
    case "button-group":
      content = (
        <U.ButtonGroup label="Formatting">
          <U.Button tone="outline" onClick={() => setNotice("Draft saved")}>
            Save draft
          </U.Button>
          <U.Button onClick={() => setNotice("Published locally")}>
            Publish
          </U.Button>
        </U.ButtonGroup>
      );
      break;
    case "card":
      content = (
        <U.Card>
          <U.CardHeader>
            <U.Badge>In progress</U.Badge>
            <U.CardTitle>A little room for ideas.</U.CardTitle>
            <U.CardDescription>
              Keep notes, share work and make your next step a thoughtful one.
            </U.CardDescription>
          </U.CardHeader>
          <U.CardFooter>
            <U.Button onClick={() => setNotice("Workspace opened")}>
              Open workspace
            </U.Button>
          </U.CardFooter>
        </U.Card>
      );
      break;
    case "badge":
      content = (
        <div className="flex gap-3">
          <U.Badge>Draft</U.Badge>
          <U.Badge tone="success">Published</U.Badge>
          <U.Badge tone="warning">Review</U.Badge>
          <U.Badge tone="danger">Failed</U.Badge>
        </div>
      );
      break;
    case "avatar":
      content = (
        <div className="flex gap-3">
          <U.Avatar name="Alex Rivers" />
          <U.Avatar name="Sam Chen" />
          <U.Avatar name="Image fallback" />
        </div>
      );
      break;
    case "aspect-ratio":
      content = (
        <U.AspectRatio className="grid place-items-center bg-surface">
          <span className="font-editorial text-3xl">Space to create.</span>
        </U.AspectRatio>
      );
      break;
    case "direction":
      content = (
        <U.Direction dir="rtl">
          <U.Card>A right-to-left content container.</U.Card>
        </U.Direction>
      );
      break;
    case "item":
      content = (
        <U.Item
          title="Project notes"
          description="Updated just now"
          action={
            <U.Button tone="outline" onClick={() => setNotice("Notes opened")}>
              Open
            </U.Button>
          }
        />
      );
      break;
    case "kbd":
      content = (
        <p className="text-sm">
          Press <U.Kbd>⌘</U.Kbd> <U.Kbd>K</U.Kbd> to search.
        </p>
      );
      break;
    case "separator":
      content = (
        <>
          <p className="text-sm">Your workspace</p>
          <U.Separator />
          <p className="text-sm text-muted">A new section starts here.</p>
        </>
      );
      break;
    case "skeleton":
      content = (
        <div className="space-y-3" aria-label="Loading example">
          <U.Skeleton className="h-9 w-1/2" />
          <U.Skeleton />
          <U.Skeleton className="w-3/4" />
        </div>
      );
      break;
    case "spinner":
      content = <U.Spinner label="Preparing your workspace" />;
      break;
    case "progress":
      content = (
        <div className="space-y-4">
          <U.Progress value={page * 20} label="Import progress" />
          <U.Button
            tone="outline"
            onClick={() => setPage((p) => (p === 5 ? 1 : p + 1))}
          >
            Advance
          </U.Button>
        </div>
      );
      break;
    case "empty":
      content = (
        <U.Empty title="A fresh page.">
          Your first project belongs here.
          <div className="mt-4">
            <U.Button onClick={() => setNotice("Project created")}>
              Create project
            </U.Button>
          </div>
        </U.Empty>
      );
      break;
    case "alert":
      content = (
        <div className="space-y-3">
          <U.Alert title="Your work is saved" tone="success">
            You can safely close this page.
          </U.Alert>
          <U.Alert title="Something needs attention" tone="error">
            Review the highlighted field and try again.
          </U.Alert>
        </div>
      );
      break;
    case "typography":
      content = (
        <div className="space-y-5">
          <U.Typography as="h2" editorial>
            Thoughtful by nature.
          </U.Typography>
          <U.Typography>
            Clear typography gives ideas room to breathe. DM Sans for utility,
            Lora for editorial moments.
          </U.Typography>
        </div>
      );
      break;
    case "input":
      content = (
        <div className="grid w-full gap-5 sm:grid-cols-2">
          <U.Field label="Project name" hint="Shown on the public page.">
            <U.Input name="project" placeholder="A new beginning" autoComplete="off" />
          </U.Field>
          <U.Field label="Work email" error="Enter a valid email address.">
            <U.Input type="email" name="email" autoComplete="email" defaultValue="not-an-email" />
          </U.Field>
          <U.Field label="Password" hint="At least twelve characters.">
            <U.Input type="password" name="password" autoComplete="new-password" />
          </U.Field>
          <U.Field label="Seats" hint="Whole numbers between 1 and 12.">
            <U.Input type="number" name="seats" min={1} max={12} step={1} defaultValue={4} inputMode="numeric" />
          </U.Field>
          <U.Field label="Search the archive">
            <U.Input type="search" name="q" placeholder="Prints, ceramics, maps" enterKeyHint="search" />
          </U.Field>
          <U.Field label="Workspace ID" hint="Assigned by the studio and cannot be changed here.">
            <U.Input readOnly value="studio-ortigia-2026" />
          </U.Field>
          <U.Field label="Long value">
            <U.Input defaultValue="A letter from Ortigia, second draft with margin notes from the printing room and the terrace conversation" />
          </U.Field>
          <U.Field label="Plan">
            <U.Input disabled value="Studio, yearly" />
          </U.Field>
          <div className="w-60 max-w-full sm:col-span-2">
            <U.Field label="In a 240px parent" hint="Long placeholder text stays inside the box.">
              <U.Input placeholder="Type a name for this collection" />
            </U.Field>
          </div>
        </div>
      );
      break;
    case "textarea":
      content = <TextareaExample />;
      break;
    case "field":
      content = (
        <U.Field
          label="Email"
          hint="Use your work address."
          error="Enter a valid email address."
        >
          <U.Input type="email" defaultValue="not-an-email" />
        </U.Field>
      );
      break;
    case "label":
      content = <LabelExample />;
      break;
    case "input-group":
      content = (
        <U.InputGroup prefix="https://" suffix=".design">
          <U.Input aria-label="Website name" placeholder="your-studio" />
        </U.InputGroup>
      );
      break;
    case "checkbox":
      content = <CheckboxExample />;
      break;
    case "switch":
      content = <SwitchExample />;
      break;
    case "radio-group":
      content = <RadioGroupExample />;
      break;
    case "select":
      content = <SelectExample />;
      break;
    case "native-select":
      content = (
        <U.Field label="Discipline">
          <U.NativeSelect options={choices} />
        </U.Field>
      );
      break;
    case "combobox":
      content = (
        <U.Combobox
          label="Search a discipline"
          placeholder="Type or choose…"
          options={["Design", "Engineering", "Product", "Research"]}
        />
      );
      break;
    case "slider":
      content = (
        <div className="space-y-3">
          <p className="text-sm">Contrast preference</p>
          <U.Slider label="Contrast preference" defaultValue={[40]} />
        </div>
      );
      break;
    case "calendar":
      content = <CalendarExample />;
      break;
    case "date-picker":
      content = (
        <U.Field label="Start date">
          <U.DatePicker />
        </U.Field>
      );
      break;
    case "input-otp":
      content = (
        <div className="space-y-3">
          <U.InputOTP value={value} onChange={setValue} />
          <p className="text-xs text-muted">
            Six digits. Paste and device autofill are supported.
          </p>
        </div>
      );
      break;
    case "toggle":
      content = (
        <U.Toggle
          aria-label="Favorite"
          pressed={flag}
          onPressedChange={setFlag}
        >
          <Heart className="size-4" />
          Favorite
        </U.Toggle>
      );
      break;
    case "toggle-group":
      content = (
        <U.ToggleGroup
          label="View density"
          options={["Comfortable", "Compact", "Spacious"]}
          value={value}
          onValueChange={setValue}
        />
      );
      break;
    case "dialog":
    case "sheet":
    case "drawer": {
      const Component =
        id === "dialog" ? U.Modal : id === "sheet" ? U.Sheet : U.Drawer;
      content = (
        <div className="flex flex-wrap gap-3">
          <Component
            title="Make it yours."
            description="A focused space for a small change. Your profile updates as soon as you save."
            trigger={<U.Button>Open {id}</U.Button>}
            footer={
              <>
                <U.ModalClose>
                  <U.Button tone="outline">Cancel</U.Button>
                </U.ModalClose>
                <U.ModalClose>
                  <U.Button onClick={() => setNotice("Changes saved in the example")}>Save changes</U.Button>
                </U.ModalClose>
              </>
            }
          >
            <div className="space-y-5">
              <U.Field label="Display name" hint="Shown on your public page.">
                <U.Input placeholder="Alex Rivers" />
              </U.Field>
              <U.Field label="About you">
                <U.Textarea placeholder="A few words…" />
              </U.Field>
              <U.Switch label="Show my workshops publicly" defaultChecked />
            </div>
          </Component>
          <Component
            title="Studio agreement"
            description="Read the terms before joining the shared studio. The body scrolls; the actions stay in view."
            trigger={<U.Button tone="outline">Long content</U.Button>}
            footer={
              <>
                <U.ModalClose>
                  <U.Button tone="outline">Not now</U.Button>
                </U.ModalClose>
                <U.ModalClose>
                  <U.Button onClick={() => setNotice("Agreement accepted in the example")}>Accept and continue</U.Button>
                </U.ModalClose>
              </>
            }
          >
            <div className="space-y-4 text-sm leading-relaxed">
              {Array.from({ length: 8 }, (_, index) => (
                <p key={index}>
                  <strong className="font-medium">{index + 1}. </strong>
                  Members share the printing room by reservation and leave tools clean for the next person. Materials bought with the studio account are logged in the notebook by the door, and larger purchases are agreed in the monthly meeting before anyone commits the group.
                </p>
              ))}
            </div>
          </Component>
        </div>
      );
      break;
    }
    case "alert-dialog":
      content = <AlertDialogExample onNotice={setNotice} />;
      break;
    case "popover":
      content = (
        <U.Popover
          label="Quick settings"
          trigger={<U.Button tone="outline">Quick settings</U.Button>}
        >
          <U.Field label="Width">
            <U.Input defaultValue="320" />
          </U.Field>
        </U.Popover>
      );
      break;
    case "tooltip":
      content = (
        <U.Tooltip content="Add this project to your favorites">
          <U.Button tone="outline" aria-label="Favorite">
            <Heart className="size-4" />
          </U.Button>
        </U.Tooltip>
      );
      break;
    case "hover-card":
      content = (
        <U.HoverCard
          trigger={
            <a
              href="https://github.com/emanueledenaro/aretusa"
              className="underline"
            >
              Aretusa
            </a>
          }
        >
          <p className="font-editorial text-xl">Aretusa</p>
          <p className="mt-2 text-sm text-muted">
            Original interfaces, by TrinacriaLabs.
          </p>
        </U.HoverCard>
      );
      break;
    case "toast":
      content = <U.ToastDemo />;
      break;
    case "accordion":
      content = (
        <U.Accordion
          items={[
            {
              title: "Can I customize the source?",
              content:
                "Yes. The source is yours to adapt under the MIT license.",
            },
            {
              title: "Does it support keyboard navigation?",
              content:
                "Each interactive component documents its keyboard behavior.",
            },
          ]}
        />
      );
      break;
    case "collapsible":
      content = (
        <U.Collapsible title="Show project details">
          A few additional details, revealed when you need them.
        </U.Collapsible>
      );
      break;
    case "tabs":
      content = (
        <U.Tabs
          items={[
            {
              value: "overview",
              label: "Overview",
              content: <p className="text-sm">Everything you need to begin.</p>,
            },
            {
              value: "activity",
              label: "Activity",
              content: (
                <p className="text-sm">Your recent changes appear here.</p>
              ),
            },
            {
              value: "settings",
              label: "Settings",
              content: <U.Switch label="Notifications" />,
            },
          ]}
        />
      );
      break;
    case "dropdown-menu":
      content = (
        <U.DropdownMenu
          trigger={<U.Button tone="outline">Project actions</U.Button>}
          items={options}
        />
      );
      break;
    case "context-menu":
      content = (
        <U.ContextMenu items={options}>
          <div
            className="rounded-xl border border-dashed border-line p-10 text-center text-sm"
            tabIndex={0}
          >
            Right-click or use your context-menu key here.
          </div>
        </U.ContextMenu>
      );
      break;
    case "menubar":
      content = (
        <U.Menubar
          menus={[
            { label: "File", items: options },
            { label: "Edit", items: options },
          ]}
        />
      );
      break;
    case "navigation-menu":
      content = (
        <U.NavigationMenu
          items={[
            { label: "Components", href: "#/components/button" },
            { label: "Blocks", href: "#/blocks" },
            { label: "Documentation", href: "#/docs" },
          ]}
        />
      );
      break;
    case "breadcrumb":
      content = (
        <U.Breadcrumb
          items={[
            { label: "Home", href: "#/" },
            { label: "Components", href: "#/components/button" },
            { label: "Breadcrumb" },
          ]}
        />
      );
      break;
    case "pagination":
      content = <U.Pagination page={page} total={5} onChange={setPage} />;
      break;
    case "shimmer":
      content = <div className="w-full space-y-6"><U.Switch label="Pause shimmer" checked={flag} onCheckedChange={setFlag} /><p className="text-lg"><U.Shimmer enabled={!flag}>Preparing your next idea.</U.Shimmer></p><p className="max-w-64 font-editorial text-2xl"><U.Shimmer enabled={!flag} speed={4}>A little light across words that have room to breathe.</U.Shimmer></p><U.Marker><U.Shimmer enabled={!flag}>Reading project notes</U.Shimmer></U.Marker></div>;
      break;
    case "scroll-fade":
      content = <ScrollFadeExample />;
      break;
    case "react-hook-form":
      content = <ReactHookFormExample />;
      break;
    case "tanstack-form":
      content = <TanStackFormExample />;
      break;
    case "formisch":
      content = <FormischExample />;
      break;
    case "scroll-area":
      content = (
        <div className="w-full space-y-4">
        <U.Checkbox label="Smart edge fade" checked={flag} onCheckedChange={value => setFlag(value === true)} />
        <U.ScrollArea fade={flag} label="Example chapters" className="h-60 rounded-xl border border-line bg-paper">
          <div className="px-5 pe-7">
            {Array.from({ length: 12 }, (_, i) => (
              <U.Item
                key={i}
                title={"Chapter " + (i + 1)}
                description="A small detail worth exploring."
              />
            ))}
          </div>
        </U.ScrollArea>
        </div>
      );
      break;
    case "sidebar":
      content = (
        <U.Sidebar
          items={[
            { label: "Overview", href: "#/components/sidebar" },
            { label: "Projects", href: "#/blocks" },
          ]}
        >
          <U.CardTitle>Your workspace</U.CardTitle>
          <p className="mt-3 text-sm text-muted">
            A responsive shell with room for your work.
          </p>
        </U.Sidebar>
      );
      break;
    case "command":
      content = <U.Command items={options} />;
      break;
    case "table":
      content = (
        <U.Table
          caption="Project overview"
          columns={["Project", "Status", "Budget"]}
          rows={rows.slice(0, 3).map((r) => [r.name, r.status, "€" + r.amount])}
        />
      );
      break;
    case "data-table":
      content = <U.DataTable rows={rows} />;
      break;
    case "chart":
      content = (
        <U.Chart
          label="Weekly contributions"
          data={[
            { name: "Mon", value: 12 },
            { name: "Tue", value: 28 },
            { name: "Wed", value: 21 },
            { name: "Thu", value: 45 },
            { name: "Fri", value: 38 },
          ]}
        />
      );
      break;
    case "carousel":
      content = (
        <U.Carousel
          slides={[
            {
              title: "A space for ideas.",
              description: "Start with what matters.",
            },
            {
              title: "Make a little progress.",
              description: "One thoughtful step at a time.",
            },
            {
              title: "Build it together.",
              description: "Share the work and what you learn.",
            },
          ]}
        />
      );
      break;
    case "resizable":
      content = (
        <U.Resizable
          left={<p className="text-sm">Navigation</p>}
          right={<p className="text-sm">Your main workspace</p>}
        />
      );
      break;
    case "attachment":
      content = flag ? (
        <U.Empty title="Attachment removed" />
      ) : (
        <U.Attachment name="project-notes.pdf" onRemove={() => setFlag(true)} />
      );
      break;
    case "bubble":
      content = (
        <div className="space-y-3">
          <U.Bubble>What are we working on today?</U.Bubble>
          <U.Bubble side="end">A small idea with a lot of potential.</U.Bubble>
        </div>
      );
      break;
    case "marker":
      content = <U.Marker>Today</U.Marker>;
      break;
    case "message":
      content = (
        <U.Message author="Alex" time="09:41">
          I have a first draft to share.
        </U.Message>
      );
      break;
    case "message-scroller":
      content = (
        <U.MessageScroller>
          {Array.from({ length: 6 }, (_, i) => (
            <U.Message key={i} author={i % 2 ? "Sam" : "Alex"}>
              A thought for our next iteration, number {i + 1}.
            </U.Message>
          ))}
        </U.MessageScroller>
      );
      break;
    case "questionnaire":
      content = notice ? (
        <U.Alert title="Answers saved">{notice}</U.Alert>
      ) : (
        <U.Questionnaire
          questions={[
            {
              id: "focus",
              title: "What are you building?",
              options: ["A website", "An application", "A design system"],
            },
            {
              id: "priority",
              title: "What matters most?",
              options: ["Clarity", "Speed", "Flexibility"],
            },
          ]}
          onComplete={(a) => setNotice(Object.values(a).join(" · "))}
        />
      );
      break;
    default:
      content = <U.Empty title="Choose a component" />;
  }
  return (
    <div className="w-full">
      {content}
      {notice && id !== "questionnaire" && (
        <p className="mt-4 text-sm text-success" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
