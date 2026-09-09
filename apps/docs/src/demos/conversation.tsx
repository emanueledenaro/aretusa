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
