import * as React from "react";
import { Download, Paperclip, RotateCw, TriangleAlert, X } from "lucide-react";
import { Button } from "./button";
import { Progress } from "./progress";
import { Input, RadioGroup } from "./forms";
import { cx } from "./utils";
/** Format a byte count as B, KB, MB or GB with one decimal above the unit boundary. */
export function formatFileSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let value = Math.max(0, bytes);
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const rounded = unit === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[unit]}`;
}
export type AttachmentStatus = "idle" | "uploading" | "error";
export type AttachmentProps = Omit<React.ComponentPropsWithRef<"div">, "children"> & {
  name: string;
  /** Short type label such as PDF or Image. */
  kind?: string;
  /** Bytes, formatted here, or a preformatted string. */
  size?: number | string;
  /** Download location; renders a named download link. */
  href?: string;
  status?: AttachmentStatus;
  /** Upload percentage while status is uploading. Omit for an indeterminate bar. */
  progress?: number;
  /** Explanation shown while status is error. */
  error?: React.ReactNode;
  onRetry?: () => void;
  onRemove?: () => void;
  /** Icon replacing the default paperclip, for example a file type glyph. */
  icon?: React.ReactNode;
  labels?: Partial<{ download: string; remove: string; retry: string; uploading: string }>;
};
const attachmentLabels = { download: "Download", remove: "Remove", retry: "Retry uploading", uploading: "Uploading" };
const actionClass =
  "flex size-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-offset-[-2px] disabled:opacity-40";
/** A file chip with type, size, upload progress, error recovery and named actions. */
export const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(function Attachment(
  { name, kind, size, href, status = "idle", progress, error, onRetry, onRemove, icon, labels, className, ...props },
  ref,
) {
  const uid = React.useId();
  const text = { ...attachmentLabels, ...labels };
  const sizeText = typeof size === "number" ? formatFileSize(size) : size;
  const meta = [kind, sizeText].filter(Boolean);
  const uploading = status === "uploading";
  const percent = uploading && typeof progress === "number" ? Math.max(0, Math.min(100, Math.round(progress))) : undefined;
  return (
    <div
      {...props}
      ref={ref}
      role="group"
      aria-label={name}
      data-status={status}
      className={cx(
        "flex w-full min-w-0 max-w-full items-center gap-1 rounded-xl border bg-card py-1 ps-3 pe-1 text-sm",
        status === "error" ? "border-danger" : "border-line",
        className,
      )}
    >
      <span
        aria-hidden
        className={cx("flex size-8 shrink-0 items-center justify-center rounded-lg", status === "error" ? "bg-danger/10 text-danger" : "bg-surface text-muted")}
      >
        {icon ?? (status === "error" ? <TriangleAlert className="size-4" /> : <Paperclip className="size-4" />)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 py-1.5 ps-2">
        <span className="truncate font-medium leading-5 text-ink">{name}</span>
        {(meta.length > 0 || uploading || status === "error") && (
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 text-xs leading-5 text-muted">
            {meta.length > 0 && !uploading && status !== "error" && (
              <span className="truncate">{meta.join(" · ")}</span>
            )}
            {uploading && (
              <>
                <progress
                  id={uid + "-progress"}
                  aria-label={text.uploading + " " + name}
                  value={percent}
                  max={100}
                  className="h-1.5 w-full max-w-40 overflow-hidden rounded-full accent-terracotta"
                />
                <span role="status" className="tabular-nums">
                  {percent === undefined ? text.uploading : percent + "%"}
                </span>
              </>
            )}
            {status === "error" && (
              <span role="alert" className="text-danger">
                {error ?? text.retry}
              </span>
            )}
          </div>
        )}
      </div>
      {status === "error" && onRetry && (
        <button type="button" onClick={onRetry} aria-label={text.retry + " " + name} className={cx(actionClass, "text-danger hover:bg-danger/10 hover:text-danger")}>
          <RotateCw className="size-4" />
        </button>
      )}
      {href && status === "idle" && (
        <a href={href} download aria-label={text.download + " " + name} className={actionClass}>
          <Download className="size-4" />
        </a>
      )}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={text.remove + " " + name} disabled={uploading} className={actionClass}>
          <X className="size-4" />
        </button>
      )}
    </div>
  );
});
export type BubbleProps = React.ComponentPropsWithRef<"div"> & {
  /** start is an incoming message, end is one the current user sent. */
  side?: "start" | "end";
};
/** One message surface. Side is expressed by alignment, corner shape and tokens together. */
export function Bubble({ side = "start", className, children, ...props }: BubbleProps) {
  return (
    <div
      {...props}
      data-side={side}
      className={cx(
        "min-w-0 max-w-[min(85%,42rem)] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words [overflow-wrap:anywhere]",
        "[&_p+p]:mt-2 [&_ul]:mt-2 [&_ol]:mt-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ps-5 [&_ol]:ps-5",
        "[&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-current/50 hover:[&_a]:decoration-current",
        "[&_code]:rounded-md [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875em]",
        "[&_pre]:a-scrollbar [&_pre]:mt-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:text-xs [&_pre]:leading-relaxed [&_pre_code]:p-0 [&_pre_code]:bg-transparent",
        side === "end"
          ? "ms-auto rounded-ee-md bg-ink text-paper [&_code]:bg-paper/15 [&_pre]:bg-paper/10"
          : "me-auto rounded-es-md bg-surface text-ink [&_code]:bg-ink/8 [&_pre]:bg-ink/5",
        className,
      )}
    >
      {children}
    </div>
  );
}
export function Marker({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-muted">
      <hr className="flex-1 border-line" />
      {children}
      <hr className="flex-1 border-line" />
    </div>
  );
}
export function Message({
  author,
  children,
  time,
}: {
  author: string;
  children: React.ReactNode;
  time?: string;
}) {
  return (
    <article className="space-y-2">
      <div className="flex gap-3 text-xs">
        <span className="font-semibold">{author}</span>
        {time && <time className="text-muted">{time}</time>}
      </div>
      <Bubble>{children}</Bubble>
    </article>
  );
}
export function MessageScroller({
  children,
  label = "Conversation",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div
      role="log"
      aria-label={label}
      aria-live="polite"
      tabIndex={0}
      className="max-h-64 space-y-4 overflow-y-auto rounded-xl border border-line p-4"
    >
      {children}
    </div>
  );
}
export function Questionnaire({
  questions,
  onComplete,
}: {
  questions: { id: string; title: string; options: string[] }[];
  onComplete: (answers: Record<string, string>) => void;
}) {
  const [step, setStep] = React.useState(0),
    [answers, setAnswers] = React.useState<Record<string, string>>({});
  const q = questions[step];
  if (!q) return <p>No questions configured.</p>;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!answers[q.id]) return;
        if (step === questions.length - 1) onComplete(answers);
        else setStep(step + 1);
      }}
      className="space-y-6"
    >
      <Progress label="Your progress" value={(step / questions.length) * 100} />
      <h3 className="font-editorial text-2xl">{q.title}</h3>
      <RadioGroup
        label={q.title}
        value={answers[q.id] || ""}
        onValueChange={(value) => setAnswers((a) => ({ ...a, [q.id]: value }))}
        options={q.options.map((o) => ({ label: o, value: o }))}
      />
      <div className="flex gap-3">
        <Button
          tone="outline"
          disabled={!step}
          onClick={() => setStep(step - 1)}
        >
          Previous
        </Button>
        <Button type="submit" disabled={!answers[q.id]}>
          {step === questions.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </form>
  );
}
