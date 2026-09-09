import * as React from "react";
import * as U from "../../../../packages/ui/src/index";
import { Search, X, Copy, Eye, EyeOff, Heart, Bold, Italic, Underline, Bell, BellOff, List, LayoutGrid, Columns3, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export function TextareaExample() {
  const [message, setMessage] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const messageError = submitted && message.trim().length < 20 ? "Write at least twenty characters so the studio can prepare." : undefined;
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <U.Field label="Message to the studio" hint="What would you like to work on during the visit?" error={messageError}>
        <U.Textarea name="message" placeholder="A short note about your project" value={message} onChange={(event) => { setMessage(event.target.value); setSubmitted(false); }} showCount maxLength={400} />
      </U.Field>
      <U.Field label="Bio" hint="Grows with the text, up to six lines, then scrolls.">
        <U.Textarea name="bio" autoResize rows={2} maxRows={6} defaultValue="Printmaker in Ortigia. Etchings, monotypes and the occasional map." />
      </U.Field>
      <U.Field label="Long content" hint="Resize from the corner; the box never shrinks below three lines.">
        <U.Textarea rows={3} defaultValue={"A letter from Ortigia, second draft.\n\nThe printing room opens at nine. Bring the copper plates from the archive and the proofs from last week so we can compare the two inks before the terrace conversation. Lunch is at the usual place; afterwards we check the new paper stock and decide which sheets go to the fair.\n\nRemember the keys."} />
      </U.Field>
      <div className="grid gap-6">
        <U.Field label="Archived note" hint="Read only.">
          <U.Textarea readOnly rows={2} value="Sent to the printer on 3 September." />
        </U.Field>
        <U.Field label="Closed thread">
          <U.Textarea disabled rows={2} value="Comments are closed for this visit." />
        </U.Field>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <U.Button tone="outline" onClick={() => setSubmitted(true)}>Validate message</U.Button>
      </div>
      <div className="w-60 max-w-full sm:col-span-2">
        <U.Field label="In a 240px parent" hint="A long placeholder wraps inside the box and the count stays under the field.">
          <U.Textarea rows={3} showCount maxLength={80} placeholder="Describe the plates you would like to print during the open studio week" />
        </U.Field>
      </div>
    </div>
  );
}

export function LabelExample() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <div className="grid gap-2">
        <U.Label htmlFor="label-name" required>Display name</U.Label>
        <U.Input id="label-name" required placeholder="As shown to other members" />
      </div>
      <div className="grid gap-2">
        <U.Label htmlFor="label-site" secondary="Optional">Website</U.Label>
        <U.Input id="label-site" type="url" placeholder="https://" />
      </div>
      <div className="grid gap-2">
        <U.Label htmlFor="label-plan" disabled>Plan</U.Label>
        <U.Input id="label-plan" disabled value="Studio, yearly" />
      </div>
      <div className="grid gap-2">
        <U.Label htmlFor="label-select">Meeting room</U.Label>
        <U.Select id="label-select" label="Meeting room" options={[{ value: "print", label: "Printing room" }, { value: "terrace", label: "Terrace" }]} />
      </div>
      <div className="w-60 max-w-full sm:col-span-2">
        <div className="grid gap-2">
          <U.Label htmlFor="label-long" required secondary="Max 80 chars">Title of the piece as it should appear in the catalogue and on the wall label</U.Label>
          <U.Input id="label-long" maxLength={80} />
        </div>
      </div>
    </div>
  );
}

export function FieldExample() {
  const [email, setEmail] = React.useState("ada@studio");
  const [checking, setChecking] = React.useState(false);
  const [asyncError, setAsyncError] = React.useState<string | undefined>();
  const [room, setRoom] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const check = () => {
    setChecking(true);
    setAsyncError(undefined);
    window.setTimeout(() => {
      setChecking(false);
      setAsyncError(email.includes("@") && email.includes(".") ? undefined : "We could not find a mailbox at this address.");
    }, 700);
  };
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <div className="grid gap-3">
        <U.Field label="Work email" required hint={checking ? "Checking the address…" : "We send the visit confirmation here."} error={asyncError}>
          <U.Input type="email" name="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setAsyncError(undefined); }} />
        </U.Field>
        <div>
          <U.Button tone="outline" loading={checking} onClick={check}>Check address</U.Button>
        </div>
      </div>
      <U.Field label="Website" secondary="Optional" hint={<>Shown on your member page.<br />Use a full address, including https.</>}>
        <U.Input type="url" name="website" placeholder="https://" />
      </U.Field>
      <U.Field label="Meeting room" required error={submitted && !room ? "Choose a room for the first session." : undefined}>
        <U.Select label="Meeting room" options={[{ value: "print", label: "Printing room" }, { value: "terrace", label: "Terrace" }, { value: "library", label: "Library, quiet hours only", description: "After 18:00 on weekdays." }]} value={room} onValueChange={(next) => { setRoom(next); setSubmitted(false); }} />
      </U.Field>
      <U.Field label="Plan" disabled hint="Managed by your workspace.">
        <U.Input value="Studio, yearly" readOnly />
      </U.Field>
      <U.Field label="Notes for the printer" hint="Paper, ink and edition size.">
        <U.Textarea name="notes" rows={3} showCount maxLength={240} />
      </U.Field>
      <div className="w-60 max-w-full">
        <U.Field label="Title as it appears in the catalogue and on the wall label" required secondary="Max 80 chars" hint="Long labels and hints wrap inside a 240px parent without pushing the control." error="Add a title before publishing.">
          <U.Input maxLength={80} />
        </U.Field>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <U.Button tone="outline" onClick={() => setSubmitted(true)}>Validate room</U.Button>
      </div>
    </div>
  );
}

export function InputGroupExample() {
  const [query, setQuery] = React.useState("etchings");
  const [domain, setDomain] = React.useState("studio ortigia");
  const [submitted, setSubmitted] = React.useState(false);
  const [shown, setShown] = React.useState(false);
  const domainError = submitted && /\s/.test(domain) ? "Use letters, digits and dashes only." : undefined;
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <U.Field label="Website" hint="The address is built from your name.">
        <U.InputGroup prefix="https://" suffix=".design">
          <U.Input placeholder="your-studio" autoComplete="off" />
        </U.InputGroup>
      </U.Field>
      <U.Field label="Search the archive">
        <U.InputGroup prefix={<Search />} action={query ? <button aria-label="Clear search" onClick={() => setQuery("")}><X /></button> : undefined}>
          <U.Input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Prints, ceramics, maps" enterKeyHint="search" />
        </U.InputGroup>
      </U.Field>
      <div className="grid gap-3">
        <U.Field label="Domain" required error={domainError}>
          <U.InputGroup prefix="https://" suffix=".aretusa.app">
            <U.Input value={domain} onChange={(event) => { setDomain(event.target.value); setSubmitted(false); }} />
          </U.InputGroup>
        </U.Field>
        <div>
          <U.Button tone="outline" onClick={() => setSubmitted(true)}>Validate domain</U.Button>
        </div>
      </div>
      <U.Field label="Password" hint="At least twelve characters.">
        <U.InputGroup action={<button aria-label={shown ? "Hide password" : "Show password"} aria-pressed={shown} onClick={() => setShown((value) => !value)}>{shown ? <EyeOff /> : <Eye />}</button>}>
          <U.Input type={shown ? "text" : "password"} autoComplete="new-password" />
        </U.InputGroup>
      </U.Field>
      <U.Field label="Amount" secondary="EUR">
        <U.InputGroup prefix="€" suffix=".00">
          <U.Input type="number" inputMode="decimal" min={0} step={1} defaultValue={120} />
        </U.InputGroup>
      </U.Field>
      <U.Field label="Workspace ID" hint="Read only." disabled>
        <U.InputGroup suffix="studio" action={<button aria-label="Copy workspace ID" onClick={() => navigator.clipboard?.writeText("ortigia-2026")}><Copy /></button>}>
          <U.Input value="ortigia-2026" readOnly />
        </U.InputGroup>
      </U.Field>
      <div className="w-60 max-w-full sm:col-span-2">
        <U.Field label="In a 240px parent" hint="A long prefix truncates before the input shrinks below a usable width.">
          <U.InputGroup prefix="https://archive.trinacrialabs.example/" suffix=".pdf">
            <U.Input placeholder="file" />
          </U.InputGroup>
        </U.Field>
      </div>
    </div>
  );
}

export function NativeSelectExample() {
  const [room, setRoom] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <U.Field label="Discipline" hint="Uses the platform picker on phones.">
        <U.NativeSelect name="discipline" defaultValue="design" options={[{ value: "design", label: "Design" }, { value: "engineering", label: "Engineering" }, { value: "product", label: "Product" }, { value: "archive", label: "Archive, by invitation only", disabled: true }]} />
      </U.Field>
      <U.Field label="Meeting room" required error={submitted && !room ? "Choose a room for the first session." : undefined}>
        <U.NativeSelect name="room" placeholder="Choose a room" value={room} onChange={(event) => { setRoom(event.target.value); setSubmitted(false); }} options={[
          { label: "Ground floor", options: [{ value: "print", label: "Printing room" }, { value: "workshop", label: "Workshop" }] },
          { label: "Upstairs", options: [{ value: "terrace", label: "Terrace" }, { value: "library", label: "Library, quiet hours only after 18:00 on weekdays" }] },
        ]} />
      </U.Field>
      <U.Field label="Plan" hint="Managed by your workspace." disabled>
        <U.NativeSelect options={[{ value: "studio", label: "Studio, yearly" }]} value="studio" onChange={() => {}} />
      </U.Field>
      <U.Field label="Season">
        <U.NativeSelect defaultValue="autumn" options={[{ value: "spring", label: "Spring" }, { value: "summer", label: "Summer" }, { value: "autumn", label: "Autumn" }, { value: "winter", label: "Winter" }]} />
      </U.Field>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <U.Button tone="outline" onClick={() => setSubmitted(true)}>Validate room</U.Button>
      </div>
      <div className="w-60 max-w-full sm:col-span-2">
        <U.Field label="In a 240px parent" hint="Long option text truncates in the closed control and stays complete in the picker.">
          <U.NativeSelect defaultValue="long" options={[{ value: "long", label: "A letter from Ortigia, second draft with margin notes" }, { value: "short", label: "Short" }]} />
        </U.Field>
      </div>
    </div>
  );
}

export function ToggleExample() {
  const [favorite, setFavorite] = React.useState(false);
  const [notify, setNotify] = React.useState(true);
  const [marks, setMarks] = React.useState({ bold: true, italic: false, underline: false });
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <div className="grid gap-3">
        <p className="text-sm text-muted">Text and icon, controlled</p>
        <div className="flex flex-wrap gap-2">
          <U.Toggle pressed={favorite} onPressedChange={setFavorite} aria-label="Favorite"><Heart />{favorite ? "Saved" : "Save"}</U.Toggle>
          <U.Toggle pressed={notify} onPressedChange={setNotify}>{notify ? <Bell /> : <BellOff />}{notify ? "Notifications on" : "Notifications off"}</U.Toggle>
        </div>
      </div>
      <div className="grid gap-3">
        <p className="text-sm text-muted">Icon-only toolbar, quiet tone, small size</p>
        <div role="toolbar" aria-label="Formatting" className="flex flex-wrap gap-1 rounded-lg border border-line bg-card p-1">
          <U.Toggle tone="quiet" size="sm" aria-label="Bold" pressed={marks.bold} onPressedChange={(value) => setMarks({ ...marks, bold: value })}><Bold /></U.Toggle>
          <U.Toggle tone="quiet" size="sm" aria-label="Italic" pressed={marks.italic} onPressedChange={(value) => setMarks({ ...marks, italic: value })}><Italic /></U.Toggle>
          <U.Toggle tone="quiet" size="sm" aria-label="Underline" pressed={marks.underline} onPressedChange={(value) => setMarks({ ...marks, underline: value })}><Underline /></U.Toggle>
        </div>
      </div>
      <div className="grid gap-3">
        <p className="text-sm text-muted">Uncontrolled and disabled</p>
        <div className="flex flex-wrap gap-2">
          <U.Toggle defaultPressed>Pinned</U.Toggle>
          <U.Toggle disabled>Unavailable</U.Toggle>
          <U.Toggle disabled pressed>Included</U.Toggle>
        </div>
      </div>
      <div className="w-60 max-w-full">
        <p className="mb-3 text-sm text-muted">Long label in a 240px parent</p>
        <U.Toggle defaultPressed className="w-full">Show the printing room schedule on my calendar</U.Toggle>
      </div>
    </div>
  );
}

export function ToggleGroupExample() {
  const [view, setView] = React.useState("list");
  const [days, setDays] = React.useState(["mon", "wed"]);
  const [align, setAlign] = React.useState("left");
  const [submitted, setSubmitted] = React.useState(false);
  const daysError = submitted && days.length === 0 ? "Choose at least one day." : undefined;
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <div className="grid gap-3">
        <p id="tg-view" className="text-sm font-medium">View, single and required</p>
        <U.ToggleGroup label="View" required value={view} onValueChange={setView} options={[{ value: "list", label: "List", icon: <List /> }, { value: "grid", label: "Grid", icon: <LayoutGrid /> }, { value: "board", label: "Board", icon: <Columns3 /> }]} />
        <p className="text-xs text-muted">Showing the {view} view.</p>
      </div>
      <div className="grid gap-3">
        <p className="text-sm font-medium">Open days, multiple</p>
        <U.ToggleGroup type="multiple" label="Open days" value={days} onValueChange={(next) => { setDays(next); setSubmitted(false); }} aria-describedby={daysError ? "tg-days-error" : undefined} aria-invalid={daysError ? true : undefined} options={[{ value: "mon", label: "Mon" }, { value: "tue", label: "Tue" }, { value: "wed", label: "Wed" }, { value: "thu", label: "Thu" }, { value: "fri", label: "Fri" }, { value: "sat", label: "Sat" }, { value: "sun", label: "Sun", disabled: true }]} />
        {daysError && <p id="tg-days-error" role="alert" className="text-xs text-danger">{daysError}</p>}
        <div><U.Button tone="outline" onClick={() => setSubmitted(true)}>Validate days</U.Button></div>
      </div>
      <div className="grid gap-3">
        <p className="text-sm font-medium">Icon-only alignment, small size</p>
        <U.ToggleGroup label="Alignment" size="sm" required value={align} onValueChange={setAlign} options={[{ value: "left", label: <span className="sr-only">Align left</span>, icon: <AlignLeft /> }, { value: "center", label: <span className="sr-only">Align center</span>, icon: <AlignCenter /> }, { value: "right", label: <span className="sr-only">Align right</span>, icon: <AlignRight /> }]} />
      </div>
      <div className="grid gap-3">
        <p className="text-sm font-medium">Disabled group</p>
        <U.ToggleGroup label="Plan" disabled defaultValue="studio" options={[{ value: "studio", label: "Studio" }, { value: "resident", label: "Resident" }]} />
      </div>
      <div className="w-60 max-w-full">
        <p className="mb-3 text-sm font-medium">Long labels wrap in a 240px parent</p>
        <U.ToggleGroup label="Delivery" defaultValue="pickup" options={[{ value: "pickup", label: "Pick up at the studio" }, { value: "courier", label: "Tracked courier" }, { value: "post", label: "Ordinary post" }]} />
      </div>
      <div className="w-60 max-w-full">
        <p className="mb-3 text-sm font-medium">Vertical orientation</p>
        <U.ToggleGroup label="Session" orientation="vertical" defaultValue="morning" options={["Morning", "Afternoon", "Evening"].map((name) => ({ value: name.toLowerCase(), label: name }))} />
      </div>
    </div>
  );
}

export function SliderExample() {
  const [contrast, setContrast] = React.useState([40]);
  const [price, setPrice] = React.useState([120, 340]);
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <div className="grid gap-3">
        <U.Slider label="Contrast" showValue value={contrast} onValueChange={setContrast} formatValue={(value) => `${value}%`} />
        <p className="text-xs text-muted">Controlled, value beside the label.</p>
      </div>
      <div className="grid gap-3">
        <U.Slider label="Price" showValue min={0} max={500} step={10} minStepsBetweenThumbs={1} value={price} onValueChange={setPrice} formatValue={(value) => `${value} EUR`} />
        <p className="text-xs text-muted">Range with two named thumbs and a formatted value.</p>
      </div>
      <div className="grid gap-3">
        <U.Slider label="Quality" showValue min={0} max={4} step={1} defaultValue={[2]} marks={[{ value: 0, label: "Draft" }, { value: 2, label: "Balanced" }, { value: 4, label: "Final" }]} />
        <p className="text-xs text-muted">Stepped with marks under the track.</p>
      </div>
      <div className="grid gap-3">
        <U.Slider label="Brightness" showValue defaultValue={[65]} disabled />
        <p className="text-xs text-muted">Disabled.</p>
      </div>
      <div className="w-60 max-w-full">
        <p className="mb-3 text-sm font-medium">Long label in a 240px parent</p>
        <U.Slider label="Time before the printing room closes" showValue defaultValue={[15]} max={60} formatValue={(value) => `${value} min`} />
      </div>
      <div className="grid gap-3">
        <p className="text-sm font-medium">Vertical orientation</p>
        <U.Slider label="Volume" orientation="vertical" defaultValue={[30]} />
      </div>
    </div>
  );
}
