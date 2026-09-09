import * as React from "react";
import { Paperclip, X } from "lucide-react";
import { Button } from "./button";
import { Progress } from "./progress";
import { Input, RadioGroup } from "./forms";
import { cx } from "./utils";
export function Attachment({
  name,
  onRemove,
}: {
  name: string;
  onRemove?: () => void;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm">
      <Paperclip aria-hidden className="size-4 shrink-0" />
      <span className="truncate">{name}</span>
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={"Remove " + name}>
          <X className="size-4" />
        </button>
      )}
    </span>
  );
}
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
