import * as React from "react";
import { Paperclip, X } from "lucide-react";
import { Button, Progress } from "./basic";
import { Input, RadioGroup } from "./forms";
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
        <button onClick={onRemove} aria-label={"Remove " + name}>
          <X className="size-4" />
        </button>
      )}
    </span>
  );
}
export function Bubble({
  children,
  side = "start",
}: {
  children: React.ReactNode;
  side?: "start" | "end";
}) {
  return (
    <div
      className={
        "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed " +
        (side === "end" ? "ms-auto bg-ink text-paper" : "bg-surface")
      }
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
