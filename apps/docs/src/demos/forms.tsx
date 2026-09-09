import * as React from "react";
import * as U from "../../../../packages/ui/src/index";
import { Search, X, Copy, Eye, EyeOff } from "lucide-react";

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
