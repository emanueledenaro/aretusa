import * as React from "react";
import {
  Checkbox as RC,
  Switch as RS,
  Slider as SL,
  Select as SE,
  RadioGroup as RG,
  Toggle as TO,
  ToggleGroup as TG,
} from "radix-ui";
import { Check, Minus, ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cx } from "./utils";
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...p }, ref) {
  return <input ref={ref} className={cx("a-input", className)} {...p} />;
});
/** Joins optional id lists for aria-describedby; returns undefined when empty. */
function joinIds(...ids: (string | undefined | false | null)[]) {
  return ids.filter(Boolean).join(" ") || undefined;
}
/** Runs every ref in the list with the same node. */
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Grow with the content instead of showing a resize handle. */
  autoResize?: boolean;
  /** Upper bound for autoResize, in rows; beyond it the content scrolls. */
  maxRows?: number;
  /** Show a live character count; pairs with maxLength for a limit. */
  showCount?: boolean;
};
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      className,
      autoResize = false,
      maxRows,
      showCount = false,
      rows = 4,
      "aria-describedby": describedBy,
      "aria-invalid": invalid,
      onChange,
      style,
      ...p
    },
    ref,
  ) {
    const generatedId = React.useId();
    const id = p.id ?? generatedId;
    const countId = showCount ? `${id}-count` : undefined;
    const inner = React.useRef<HTMLTextAreaElement | null>(null);
    const [count, setCount] = React.useState(() =>
      String(p.value ?? p.defaultValue ?? "").length,
    );
    const over = p.maxLength !== undefined && count > p.maxLength;
    const fit = React.useCallback(() => {
      const node = inner.current;
      if (!node || !autoResize) return;
      const style = getComputedStyle(node);
      const line = parseFloat(style.lineHeight) || 24;
      const padding =
        (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
      const border =
        (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.borderBottomWidth) || 0);
      const min = rows * line + padding + border;
      const max = maxRows ? maxRows * line + padding + border : Infinity;
      node.style.height = "auto";
      const wanted = node.scrollHeight + border;
      const next = Math.min(Math.max(wanted, min), max);
      node.style.height = `${next}px`;
      node.style.overflowY = wanted > max ? "auto" : "hidden";
    }, [autoResize, rows, maxRows]);
    React.useLayoutEffect(fit, [fit, p.value]);
    React.useEffect(() => {
      if (p.value !== undefined) setCount(String(p.value).length);
    }, [p.value]);
    return (
      <>
        <textarea
          ref={mergeRefs(ref, inner)}
          rows={rows}
          className={cx(
            "a-input min-h-[calc(var(--rows)*1.5rem+1.25rem+2px)] py-2.5 leading-6",
            autoResize ? "resize-none" : "resize-y",
            over && "border-danger",
            className,
          )}
          style={{ "--rows": Math.min(rows, maxRows ?? rows), ...style } as React.CSSProperties}
          {...p}
          id={id}
          aria-invalid={over ? true : invalid}
          aria-describedby={joinIds(describedBy, countId)}
          onChange={(event) => {
            if (p.value === undefined) setCount(event.target.value.length);
            if (autoResize) fit();
            onChange?.(event);
          }}
        />
        {showCount && (
          <p
            id={countId}
            aria-live="polite"
            className={cx(
              "text-end text-xs tabular-nums leading-relaxed",
              over ? "text-danger" : "text-muted",
            )}
          >
            {p.maxLength !== undefined
              ? `${count} of ${p.maxLength} characters`
              : `${count} characters`}
          </p>
        )}
      </>
    );
  },
);
export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  /** Adds the required marker; the control itself carries the `required` attribute. */
  required?: boolean;
  /** Trailing muted text such as "Optional" or a short unit; not part of the accessible name. */
  secondary?: React.ReactNode;
  /** Dims the label to match a disabled control. */
  disabled?: boolean;
};
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { required = false, secondary, disabled = false, className, children, ...p },
  ref,
) {
  return (
    <label
      ref={ref}
      data-disabled={disabled || undefined}
      {...p}
      className={cx(
        "inline-flex min-w-0 flex-wrap items-baseline gap-x-2 text-sm font-medium leading-6 text-ink",
        disabled && "cursor-default opacity-50",
        className,
      )}
    >
      <span className="min-w-0 break-words">
        {children}
        {required && (
          <span aria-hidden="true" className="ms-1 text-terracotta">
            *
          </span>
        )}
      </span>
      {secondary && (
        <span aria-hidden="true" className="text-xs font-normal text-muted">
          {secondary}
        </span>
      )}
    </label>
  );
});
export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactElement;
}) {
  const id = React.useId();
  const description =
    [hint ? id + "-hint" : "", error ? id + "-error" : ""]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {React.cloneElement(
        children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
        {
          id,
          "aria-describedby": description,
          "aria-invalid": error ? true : undefined,
        },
      )}
      {hint && (
        <p id={id + "-hint"} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p role="alert" id={id + "-error"} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
export function InputGroup({
  prefix,
  suffix,
  children,
}: {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-line bg-card px-3 [&_input]:border-0 [&_input]:bg-transparent">
      <span className="text-sm text-muted">{prefix}</span>
      {children}
      <span className="text-sm text-muted">{suffix}</span>
    </div>
  );
}
export function Checkbox({
  label,
  description,
  error,
  className,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: React.ComponentProps<typeof RC.Root> & {
  label: React.ReactNode;
  /** Help text linked to the control through aria-describedby. */
  description?: React.ReactNode;
  /** Validation message; marks the control invalid and links the text. */
  error?: React.ReactNode;
}) {
  const generatedId = React.useId();
  const id = props.id ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const indeterminate = props.checked === "indeterminate";
  return (
    <div className={cx("flex items-start gap-3 py-3", className)}>
      <RC.Root
        id={id}
        {...props}
        aria-invalid={error ? true : invalid}
        aria-describedby={
          [describedBy, descriptionId, errorId].filter(Boolean).join(" ") ||
          undefined
        }
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-control bg-card transition-colors hover:border-ink data-[state=checked]:border-ink data-[state=checked]:bg-ink data-[state=checked]:text-paper data-[state=indeterminate]:border-ink data-[state=indeterminate]:bg-ink data-[state=indeterminate]:text-paper aria-invalid:border-danger disabled:cursor-default disabled:opacity-40 disabled:hover:border-control"
      >
        <RC.Indicator>
          {indeterminate ? (
            <Minus className="size-3.5" strokeWidth={2.5} />
          ) : (
            <Check className="size-3.5" strokeWidth={2.5} />
          )}
        </RC.Indicator>
      </RC.Root>
      <div className="grid min-w-0 gap-1">
        <label htmlFor={id} className="text-sm leading-6">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="text-xs leading-relaxed text-muted">
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs leading-relaxed text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
export function Switch({
  label,
  description,
  error,
  className,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: React.ComponentProps<typeof RS.Root> & {
  label: React.ReactNode;
  /** Help text linked to the control through aria-describedby. */
  description?: React.ReactNode;
  /** Validation message; marks the control invalid and links the text. */
  error?: React.ReactNode;
}) {
  const generatedId = React.useId();
  const id = props.id ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="flex items-start gap-3 py-3">
      <RS.Root
        id={id}
        {...props}
        aria-invalid={error ? true : invalid}
        aria-describedby={
          [describedBy, descriptionId, errorId].filter(Boolean).join(" ") ||
          undefined
        }
        className={cx(
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full border border-control bg-surface p-0.5 transition-colors hover:border-ink data-[state=checked]:border-terracotta data-[state=checked]:bg-terracotta aria-invalid:border-danger disabled:cursor-default disabled:opacity-40 disabled:hover:border-control",
          className,
        )}
      >
        <RS.Thumb className="relative start-0 block size-3.5 rounded-full bg-card shadow-xs transition-[inset-inline-start] data-[state=checked]:start-[calc(100%-14px)] motion-reduce:transition-none" />
      </RS.Root>
      <div className="grid min-w-0 gap-1">
        <label htmlFor={id} className="text-sm leading-6">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="text-xs leading-relaxed text-muted">
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs leading-relaxed text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
export function RadioGroup({
  label,
  description,
  error,
  options,
  variant = "list",
  focusRef,
  className,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: React.ComponentProps<typeof RG.Root> & {
  label: string;
  /** Help text for the whole group, linked through aria-describedby. */
  description?: React.ReactNode;
  /** Validation message; marks the group invalid and links the text. */
  error?: React.ReactNode;
  /** cards wraps each option in a selectable bordered surface. */
  variant?: "list" | "cards";
  focusRef?: React.Ref<HTMLButtonElement>;
  options: {
    value: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
  }[];
}) {
  const uid = React.useId();
  const firstEnabled = props.disabled ? -1 : options.findIndex(option => !option.disabled);
  const descriptionId = description ? `${uid}-description` : undefined;
  const errorId = error ? `${uid}-error` : undefined;
  const cards = variant === "cards";
  return (
    <div className={cx("grid gap-2", className)}>
      <RG.Root
        aria-label={label}
        {...props}
        aria-invalid={error ? true : invalid}
        aria-describedby={[describedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined}
        className={cards ? "group grid gap-3 sm:grid-cols-2" : "group grid"}
      >
        {options.map((o, i) => {
          const id = uid + i;
          const optionDescriptionId = o.description ? `${id}-description` : undefined;
          const item = (
            <RG.Item
              ref={i === firstEnabled ? focusRef : undefined}
              id={id}
              value={o.value}
              disabled={o.disabled || props.disabled}
              aria-labelledby={`${id}-label`}
              aria-describedby={optionDescriptionId}
              className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-control bg-card transition-colors hover:border-ink data-[state=checked]:border-terracotta group-aria-[invalid=true]:border-danger disabled:cursor-default disabled:opacity-40 disabled:hover:border-control"
            >
              <RG.Indicator className="size-2.5 rounded-full bg-terracotta" />
            </RG.Item>
          );
          const text = (
            <div className="grid min-w-0 gap-1">
              <Label id={`${id}-label`} htmlFor={id} className="leading-6">{o.label}</Label>
              {o.description && (
                <p id={optionDescriptionId} className="text-xs leading-relaxed text-muted">
                  {o.description}
                </p>
              )}
            </div>
          );
          return cards ? (
            <label
              key={o.value}
              htmlFor={id}
              className={cx(
                "flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-paper/40 p-4 transition-colors has-[[data-state=checked]]:border-ink has-[[data-state=checked]]:bg-card has-[:disabled]:cursor-default has-[:disabled]:opacity-60",
              )}
            >
              {item}
              {text}
            </label>
          ) : (
            <div className="flex items-start gap-3 py-3" key={o.value}>
              {item}
              {text}
            </div>
          );
        })}
      </RG.Root>
      {description && (
        <p id={descriptionId} className="text-xs leading-relaxed text-muted">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs leading-relaxed text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
export function NativeSelect({
  options,
  ...props
}: React.ComponentPropsWithRef<"select"> & {
  options: { value: string; label: string; disabled?: boolean }[];
}) {
  return (
    <select {...props} className={cx("a-input", props.className)}>
      {options.map((o) => (
        <option key={o.value} {...o}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
export function Select({
  label,
  options,
  triggerRef,
  triggerOnBlur,
  placeholder = "Choose an option",
  id,
  "aria-invalid": invalid,
  "aria-describedby": describedBy,
  ...props
}: React.ComponentProps<typeof SE.Root> & {
  triggerRef?: React.Ref<HTMLButtonElement>;
  triggerOnBlur?: React.FocusEventHandler<HTMLButtonElement>;
  id?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
  "aria-describedby"?: string;
  label: string;
  placeholder?: string;
  options: {
    value: string;
    label: string;
    disabled?: boolean;
    description?: string;
    swatch?: string;
  }[];
}) {
  return (
    <SE.Root {...props}>
      <SE.Trigger
        ref={triggerRef}
        onBlur={triggerOnBlur}
        id={id}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        aria-label={label}
        className="a-input flex items-center justify-between gap-3 text-start data-[state=open]:border-terracotta [&>span:first-child]:min-w-0 [&>span:first-child]:truncate"
      >
        <SE.Value placeholder={placeholder} />
        <SE.Icon>
          <ChevronDown className="size-4 shrink-0 text-muted" />
        </SE.Icon>
      </SE.Trigger>
      <SE.Portal>
        <SE.Content
          className="a-popup w-[var(--radix-select-trigger-width)] min-w-[min(12rem,calc(100vw-24px))] max-w-[calc(100vw-24px)] overflow-hidden p-1.5"
          position="popper"
          sideOffset={6}
          collisionPadding={12}
        >
          <SE.Viewport className="a-scrollbar max-h-[min(320px,var(--radix-select-content-available-height))] space-y-1 p-0.5">
            {options.map((o) => (
              <SE.Item
                key={o.value}
                value={o.value}
                disabled={o.disabled}
                textValue={o.label}
                className="relative flex min-h-11 cursor-default items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none data-[state=checked]:bg-surface data-[highlighted]:ring-1 data-[highlighted]:ring-inset data-[highlighted]:ring-terracotta data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
              >
                {o.swatch && (
                  <span
                    aria-hidden="true"
                    className="size-5 shrink-0 rounded-full border border-line"
                    style={{ backgroundColor: o.swatch }}
                  />
                )}
                <span className="min-w-0 flex-1 break-words">
                  <SE.ItemText>{o.label}</SE.ItemText>
                  {o.description && (
                    <span className="mt-1 block text-xs leading-relaxed text-muted">
                      {o.description}
                    </span>
                  )}
                </span>
                <span className="flex size-4 shrink-0 items-center justify-center">
                  <SE.ItemIndicator>
                    <Check className="size-4" />
                  </SE.ItemIndicator>
                </span>
              </SE.Item>
            ))}
          </SE.Viewport>
        </SE.Content>
      </SE.Portal>
    </SE.Root>
  );
}
export function Slider({
  label,
  ...props
}: React.ComponentProps<typeof SL.Root> & { label: string }) {
  const values = props.value || props.defaultValue || [50];
  return (
    <SL.Root
      {...props}
      defaultValue={props.defaultValue || (!props.value ? [50] : undefined)}
      className="relative flex h-8 w-full touch-none items-center"
    >
      <SL.Track className="relative h-1.5 grow rounded-full bg-surface">
        <SL.Range className="absolute h-full rounded-full bg-terracotta" />
      </SL.Track>
      {values.map((_, i) => (
        <SL.Thumb
          key={i}
          aria-label={values.length > 1 ? label + " " + (i + 1) : label}
          className="block size-5 rounded-full border border-line bg-card shadow-sm"
        />
      ))}
    </SL.Root>
  );
}
export function Toggle({
  children,
  ...props
}: React.ComponentProps<typeof TO.Root>) {
  return (
    <TO.Root
      {...props}
      className="a-button min-h-10 border border-line px-3 text-sm data-[state=on]:bg-ink data-[state=on]:text-paper"
    >
      {children}
    </TO.Root>
  );
}
export function ToggleGroup({
  label,
  options,
  value,
  onValueChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onValueChange?: (v: string) => void;
}) {
  return (
    <TG.Root
      type="single"
      aria-label={label}
      value={value}
      onValueChange={onValueChange}
      className="inline-flex gap-1 rounded-lg bg-surface p-1"
    >
      {options.map((o) => (
        <TG.Item
          key={o}
          value={o}
          className="rounded-md px-3 py-2 text-sm data-[state=on]:bg-card"
        >
          {o}
        </TG.Item>
      ))}
    </TG.Root>
  );
}
export function Calendar({
  className,
  showOutsideDays = true,
  navLayout = "after",
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      {...props}
      className={cx("a-calendar", className)}
      showOutsideDays={showOutsideDays}
      navLayout={navLayout}
    />
  );
}
export function DatePicker(
  props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
) {
  return <Input {...props} type="date" />;
}
export function Combobox({
  label,
  options,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  options: string[];
}) {
  const id = React.useId();
  return (
    <>
      <Input {...props} aria-label={label} list={id} />
      <datalist id={id}>
        {options.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </>
  );
}
export function InputOTP({
  length = 6,
  label = "Verification code",
  value,
  onChange,
  disabled,
}: {
  length?: number;
  label?: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <Input
      aria-label={label}
      inputMode="numeric"
      autoComplete="one-time-code"
      value={value}
      disabled={disabled}
      maxLength={length}
      pattern={"[0-9]{" + length + "}"}
      onChange={(e) =>
        onChange(e.target.value.replace(/\D/g, "").slice(0, length))
      }
      className="max-w-64 text-center font-mono text-xl tracking-[0.5em]"
    />
  );
}
