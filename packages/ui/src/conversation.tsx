import * as React from "react";
import { ArrowDown, Download, LoaderCircle, Paperclip, RotateCw, TriangleAlert, X } from "lucide-react";
import { Button } from "./button";
import { Progress } from "./progress";
import { Input, RadioGroup } from "./forms";
import { cx } from "./utils";
import { ScrollFade, useScrollFade } from "./scroll-fade";
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
export type MarkerProps = Omit<React.ComponentPropsWithRef<"div">, "children"> & {
  children: React.ReactNode;
  /** Machine readable value when the marker is a time boundary. */
  dateTime?: string;
  /** accent uses the terracotta token for state boundaries such as unread. */
  tone?: "default" | "accent";
  /** Keep the marker visible at the top of its scroll region. */
  sticky?: boolean;
};
/** A quiet boundary between groups of messages. Plain text, never a live region. */
export const Marker = React.forwardRef<HTMLDivElement, MarkerProps>(function Marker(
  { children, dateTime, tone = "default", sticky = false, className, ...props },
  ref,
) {
  const lineClass = cx("h-px min-w-4 flex-1", tone === "accent" ? "bg-terracotta/60" : "bg-line");
  const Label = dateTime ? "time" : "span";
  return (
    <div
      {...props}
      ref={ref}
      data-tone={tone}
      className={cx(
        "flex w-full items-center gap-3 py-1 text-xs font-medium tracking-wide",
        tone === "accent" ? "text-terracotta" : "text-muted",
        sticky && "sticky top-0 z-10 -mx-4 w-auto bg-paper/95 px-4",
        className,
      )}
    >
      <span aria-hidden className={lineClass} />
      <Label dateTime={dateTime} className="min-w-0 max-w-[75%] text-center leading-5 break-words">
        {children}
      </Label>
      <span aria-hidden className={lineClass} />
    </div>
  );
});
export type MessageStatus = "sending" | "sent" | "failed";
export type MessageProps = Omit<React.ComponentPropsWithRef<"article">, "children"> & {
  author: string;
  /** Visible time text, for example "09:41". */
  time?: string;
  /** Machine readable value for the time element. */
  dateTime?: string;
  side?: "start" | "end";
  /** Avatar or initials placed beside the message. Hidden on the end side by default. */
  avatar?: React.ReactNode;
  /** Attachment chips rendered under the content. */
  attachments?: React.ReactNode;
  /** Message actions such as reply or copy. Always visible so hover is never the only route. */
  actions?: React.ReactNode;
  status?: MessageStatus;
  /** Called from the retry control when status is failed. */
  onRetry?: () => void;
  /** Labels for the status line and the retry control. */
  labels?: Partial<{ sending: string; failed: string; retry: string }>;
  children: React.ReactNode;
};
const messageLabels = { sending: "Sending", failed: "Not sent", retry: "Retry sending" };
/** One conversation entry: author, time, content, attachments, actions and delivery state. */
export const Message = React.forwardRef<HTMLElement, MessageProps>(function Message(
  { author, time, dateTime, side = "start", avatar, attachments, actions, status, onRetry, labels, className, children, ...props },
  ref,
) {
  const uid = React.useId();
  const text = { ...messageLabels, ...labels };
  const end = side === "end";
  return (
    <article
      {...props}
      ref={ref}
      aria-labelledby={props["aria-labelledby"] ?? uid + "-author"}
      aria-busy={status === "sending" ? true : props["aria-busy"]}
      data-side={side}
      data-status={status}
      className={cx(
        "flex min-w-0 gap-3",
        end && "flex-row-reverse",
        status === "sending" && "opacity-70",
        className,
      )}
    >
      {avatar && <div className="mt-5 shrink-0">{avatar}</div>}
      <div className={cx("flex min-w-0 flex-1 flex-col gap-1.5", end ? "items-end" : "items-start")}>
        <div className={cx("flex min-w-0 max-w-full flex-wrap items-baseline gap-x-2 gap-y-0.5 px-1 text-xs", end && "flex-row-reverse")}>
          <span id={uid + "-author"} className="truncate font-semibold text-ink">
            {author}
          </span>
          {time && (
            <time dateTime={dateTime} className="text-muted tabular-nums">
              {time}
            </time>
          )}
        </div>
        <Bubble side={side}>{children}</Bubble>
        {attachments && (
          <div className={cx("flex w-full max-w-[min(85%,42rem)] flex-wrap gap-2", end && "justify-end")}>{attachments}</div>
        )}
        {status === "sending" && (
          <p role="status" className="px-1 text-xs text-muted">
            {text.sending}
          </p>
        )}
        {status === "failed" && (
          <div role="alert" className={cx("flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-xs text-danger", end && "justify-end")}>
            <span>{text.failed}</span>
            {onRetry && (
              <Button tone="quiet" size="sm" onClick={onRetry} className="-my-2 h-auto min-h-11 px-2 text-xs text-danger underline underline-offset-2 hover:bg-danger/10">
                {text.retry}
              </Button>
            )}
          </div>
        )}
        {actions && (
          <div className={cx("flex flex-wrap items-center gap-1 text-xs", end && "justify-end")}>{actions}</div>
        )}
      </div>
    </article>
  );
});
export type MessageScrollerProps = React.ComponentPropsWithRef<"div"> & {
  /** Accessible name of the log region. */
  label?: string;
  /** Height and surface classes for the outer frame. */
  className?: string;
  /** Follow new content while the reader is at the newest message. */
  stickToBottom?: boolean;
  /** Earlier messages are being fetched; shows a status row at the top. */
  loading?: boolean;
  /** Rendered when there are no children and nothing is loading. */
  empty?: React.ReactNode;
  labels?: Partial<{ newMessages: string; loading: string }>;
};
const scrollerLabels = { newMessages: "New messages", loading: "Loading earlier messages" };
const bottomThreshold = 8;
/** A bounded conversation log that follows new messages without stealing the reader's place. */
export const MessageScroller = React.forwardRef<HTMLDivElement, MessageScrollerProps>(function MessageScroller(
  { label = "Conversation", className, stickToBottom = true, loading = false, empty, labels, children, ...props },
  ref,
) {
  const text = { ...scrollerLabels, ...labels };
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  const [pending, setPending] = React.useState(false);
  const atBottom = React.useRef(true);
  const count = React.Children.count(children);
  const previousCount = React.useRef(count);
  const { ref: fadeRef, edges } = useScrollFade();
  const viewportRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      setNode(element);
      fadeRef(element);
      if (typeof ref === "function") ref(element);
      else if (ref) ref.current = element;
    },
    [fadeRef, ref],
  );
  const measure = React.useCallback(() => {
    if (!node) return true;
    return node.scrollHeight - node.scrollTop - node.clientHeight <= bottomThreshold;
  }, [node]);
  const jumpToLatest = React.useCallback(() => {
    if (!node) return;
    node.scrollTop = node.scrollHeight;
    atBottom.current = true;
    setPending(false);
  }, [node]);
  // First paint starts at the newest message; later growth follows only while the reader is there.
  React.useLayoutEffect(() => {
    if (!node) return;
    const grew = count > previousCount.current;
    previousCount.current = count;
    if (!stickToBottom) return;
    if (atBottom.current) jumpToLatest();
    else if (grew) setPending(true);
  }, [node, count, stickToBottom, jumpToLatest]);
  React.useEffect(() => {
    if (!node) return;
    const onScroll = () => {
      atBottom.current = measure();
      if (atBottom.current) setPending(false);
    };
    node.addEventListener("scroll", onScroll, { passive: true });
    // Content that grows without a new child, such as streamed text or a loaded image, also follows.
    const resize =
      typeof ResizeObserver === "undefined" || !stickToBottom
        ? null
        : new ResizeObserver(() => {
            if (atBottom.current) node.scrollTop = node.scrollHeight;
          });
    if (resize) for (const child of Array.from(node.children)) resize.observe(child);
    return () => {
      node.removeEventListener("scroll", onScroll);
      resize?.disconnect();
    };
  }, [node, measure, stickToBottom]);
  const showEmpty = count === 0 && !loading;
  return (
    <div className={cx("relative flex max-h-72 min-h-0 flex-col overflow-hidden rounded-xl border border-line bg-paper", className)}>
      <div
        {...props}
        ref={viewportRef}
        role="log"
        aria-label={label}
        aria-live="polite"
        aria-busy={loading ? true : props["aria-busy"]}
        tabIndex={0}
        className="a-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth p-4 focus-visible:outline-offset-[-2px] motion-reduce:scroll-auto"
      >
        <div className="flex min-h-full flex-col justify-end gap-5">
          {loading && (
            <p role="status" className="flex items-center justify-center gap-2 py-1 text-xs text-muted">
              <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
              {text.loading}
            </p>
          )}
          {showEmpty ? (
            <div className="flex flex-1 items-center justify-center py-8 text-center text-sm text-muted">{empty ?? "No messages yet."}</div>
          ) : (
            children
          )}
        </div>
      </div>
      <ScrollFade edges={edges} depth="min(40px, 12%)" style={{ insetInlineEnd: 12 }} />
      {pending && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <button
            type="button"
            onClick={() => {
              jumpToLatest();
              node?.focus();
            }}
            className="a-button pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-xs font-medium text-ink shadow-sm hover:bg-surface"
          >
            <ArrowDown aria-hidden className="size-4" />
            {text.newMessages}
          </button>
        </div>
      )}
    </div>
  );
});
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
