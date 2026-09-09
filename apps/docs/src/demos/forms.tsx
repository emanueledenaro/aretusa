import * as React from "react";
import * as U from "../../../../packages/ui/src/index";

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
