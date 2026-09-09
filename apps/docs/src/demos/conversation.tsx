import * as React from "react";
import * as U from "../../../../packages/ui/src/index";

export function BubbleExample() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-[1fr_240px]">
      <div className="flex min-w-0 flex-col gap-3">
        <U.Bubble>What are we working on today?</U.Bubble>
        <U.Bubble side="end">A small idea with a lot of potential. I sketched two directions and I would like your opinion before Friday.</U.Bubble>
        <U.Bubble>
          <p>Send the notes to https://aretusa.example/workspace/prints/spring-collection-2026/proofs-and-margins</p>
          <p>
            Run <code>npm run check</code> and open <a href="#preview">the preview</a> when it finishes.
          </p>
          <pre>
            <code>{"npm run registry:build\nnpm run typecheck && npx vitest run"}</code>
          </pre>
        </U.Bubble>
        <U.Bubble side="end">
          <p>Done. Two follow ups:</p>
          <ul>
            <li>Tighten the margins on the poster proof.</li>
            <li>Ask the printer about the cream paper stock.</li>
          </ul>
        </U.Bubble>
      </div>
      <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-dashed border-line p-3">
        <p className="text-xs text-muted">240px parent</p>
        <U.Bubble>Antidisestablishmentarianism is a long word.</U.Bubble>
        <U.Bubble side="end">Noted, will keep it short.</U.Bubble>
      </div>
    </div>
  );
}

export function AttachmentExample() {
  const [files, setFiles] = React.useState(["spring-proofs.pdf", "terrace-photo.jpg"]);
  const [progress, setProgress] = React.useState(35);
  const [failed, setFailed] = React.useState(true);
  React.useEffect(() => {
    if (progress >= 100) return;
    const id = window.setTimeout(() => setProgress((p) => Math.min(100, p + 5)), 600);
    return () => window.clearTimeout(id);
  }, [progress]);
  return (
    <div className="grid w-full gap-6 sm:grid-cols-[1fr_240px]">
      <div className="flex min-w-0 flex-col gap-3">
        {files.includes("spring-proofs.pdf") ? (
          <U.Attachment name="spring-proofs.pdf" kind="PDF" size={248000} href="#spring-proofs" onRemove={() => setFiles((f) => f.filter((n) => n !== "spring-proofs.pdf"))} />
        ) : (
          <p className="text-sm text-muted" role="status">spring-proofs.pdf removed.</p>
        )}
        {files.includes("terrace-photo.jpg") ? (
          <U.Attachment name="terrace-photo.jpg" kind="Image" size={3_400_000} href="#terrace" onRemove={() => setFiles((f) => f.filter((n) => n !== "terrace-photo.jpg"))} />
        ) : (
          <p className="text-sm text-muted" role="status">terrace-photo.jpg removed.</p>
        )}
        <U.Attachment
          name="workshop-recording-2026-03-04-morning-session-complete.mov"
          kind="Video"
          size={912_000_000}
          status={progress < 100 ? "uploading" : "idle"}
          progress={progress}
          href={progress < 100 ? undefined : "#recording"}
          onRemove={() => setProgress(100)}
        />
        {failed ? (
          <U.Attachment name="budget.xlsx" kind="Spreadsheet" size={18000} status="error" error="The upload was interrupted." onRetry={() => setFailed(false)} onRemove={() => setFailed(false)} />
        ) : (
          <U.Attachment name="budget.xlsx" kind="Spreadsheet" size={18000} href="#budget" />
        )}
        <U.Attachment name="read-only.txt" kind="Text" size="2 KB" />
      </div>
      <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-dashed border-line p-3">
        <p className="text-xs text-muted">240px parent</p>
        <U.Attachment name="a-very-long-export-of-the-spring-collection-final-v3.pdf" kind="PDF" size={248000} href="#long" onRemove={() => {}} />
        <U.Attachment name="cover.png" status="uploading" />
      </div>
    </div>
  );
}

export function MessageExample() {
  const [status, setStatus] = React.useState<U.MessageStatus>("failed");
  const [copied, setCopied] = React.useState(false);
  const retry = () => {
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 1200);
  };
  const actions = (
    <>
      <U.Button tone="quiet" size="sm" onClick={() => setCopied(true)}>{copied ? "Copied" : "Copy"}</U.Button>
      <U.Button tone="quiet" size="sm">Reply</U.Button>
    </>
  );
  return (
    <div className="grid w-full gap-6 sm:grid-cols-[1fr_240px]">
      <div className="flex min-w-0 flex-col gap-5">
        <U.Message author="Alex Rivers" time="09:41" dateTime="2026-03-04T09:41:00Z" avatar={<U.Avatar name="Alex Rivers" size="sm" decorative />} actions={actions}>
          I have a first draft to share. The poster keeps the wide margins we talked about and the cream stock reads warmer than the sample.
        </U.Message>
        <U.Message
          author="Sam Costa"
          time="09:44"
          dateTime="2026-03-04T09:44:00Z"
          avatar={<U.Avatar name="Sam Costa" size="sm" decorative />}
          attachments={
            <>
              <U.Attachment name="spring-proofs.pdf" kind="PDF" size={248000} href="#proofs" />
              <U.Attachment name="terrace-photo.jpg" kind="Image" size={3_400_000} href="#terrace" />
            </>
          }
        >
          Attached the proofs and the photo from the terrace for the cover.
        </U.Message>
        <U.Message author="You" side="end" time="09:46" dateTime="2026-03-04T09:46:00Z" status={status} onRetry={retry}>
          Looks right to me. Let us go with the cream stock and print twenty copies for the open studio.
        </U.Message>
        <U.Message author="You" side="end" time="09:47" dateTime="2026-03-04T09:47:00Z" status="sending">
          Sending a second note with the address of the printer.
        </U.Message>
      </div>
      <div className="flex min-w-0 flex-col gap-4 rounded-xl border border-dashed border-line p-3">
        <p className="text-xs text-muted">240px parent</p>
        <U.Message author="Alessandra Montalbano Serafini" time="Yesterday" attachments={<U.Attachment name="long-file-name-for-the-open-studio.pdf" kind="PDF" size={1024} href="#narrow" />}>
          Antidisestablishmentarianism fits in a narrow bubble.
        </U.Message>
        <U.Message author="You" side="end" time="Now">Short reply.</U.Message>
      </div>
    </div>
  );
}

const seed = [
  { author: "Alex Rivers", side: "start" as const, text: "Good morning. The proofs came back from the printer." },
  { author: "You", side: "end" as const, text: "How does the cream stock look under daylight?" },
  { author: "Alex Rivers", side: "start" as const, text: "Warmer than the sample, and the margins hold. I would keep them." },
  { author: "Sam Costa", side: "start" as const, text: "Agreed. The photo from the terrace works for the cover if we crop the railing." },
  { author: "You", side: "end" as const, text: "Let us go with twenty copies for the open studio and ten for the archive." },
  { author: "Alex Rivers", side: "start" as const, text: "Ordering now. I will send the invoice this afternoon." },
];

export function MessageScrollerExample() {
  const [items, setItems] = React.useState(seed);
  const [loading, setLoading] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const add = () => {
    const n = count + 1;
    setCount(n);
    setItems((list) => [...list, { author: n % 2 ? "Sam Costa" : "You", side: n % 2 ? "start" : "end", text: "A new thought for the next iteration, number " + n + "." }]);
  };
  const loadEarlier = () => {
    setLoading(true);
    window.setTimeout(() => {
      setItems((list) => [{ author: "Sam Costa", side: "start", text: "Earlier: the first sketches arrived on Monday." }, ...list]);
      setLoading(false);
    }, 900);
  };
  return (
    <div className="grid w-full gap-6 lg:grid-cols-[1fr_240px]">
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <U.Button tone="outline" size="sm" onClick={add}>Add a message</U.Button>
          <U.Button tone="outline" size="sm" onClick={loadEarlier} loading={loading}>Load earlier</U.Button>
        </div>
        <U.MessageScroller label="Project conversation" loading={loading} className="max-h-80">
          <U.Marker>Today</U.Marker>
          {items.map((m, i) => (
            <U.Message key={i} author={m.author} side={m.side} time={"09:" + String(41 + i).padStart(2, "0")}>
              {m.text}
            </U.Message>
          ))}
        </U.MessageScroller>
        <p className="text-xs text-muted">Scroll up, then add a message: the view stays where you are and a control offers the newest message.</p>
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <p className="text-xs text-muted">Empty and short containers</p>
        <U.MessageScroller label="New conversation" className="max-h-40">{[]}</U.MessageScroller>
        <U.MessageScroller label="Short viewport" className="max-h-40">
          <U.Message author="Alex Rivers">A short log that still shows the scrollbar and the edge fade.</U.Message>
          <U.Message author="You" side="end">Understood.</U.Message>
          <U.Message author="Alex Rivers">One more line to force scrolling in a 160px frame.</U.Message>
        </U.MessageScroller>
      </div>
    </div>
  );
}
