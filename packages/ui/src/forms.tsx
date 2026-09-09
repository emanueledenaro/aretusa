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
type FieldControlProps = {
  id?: string;
  required?: boolean;
  disabled?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};
export type FieldProps = {
  label: React.ReactNode;
  /** Help text under the control; may hold line breaks or inline elements. */
  hint?: React.ReactNode;
  /** Validation message announced as an alert; marks the control invalid. */
  error?: React.ReactNode;
  /** Adds the label marker and the `required` attribute to the control. */
  required?: boolean;
  /** Trailing muted text beside the label, for example "Optional". */
  secondary?: React.ReactNode;
  /** Dims the label and disables the control. */
  disabled?: boolean;
  /** Explicit id for the control; the control's own id wins when set. */
  id?: string;
  className?: string;
  /** The control. It receives id, aria-describedby, aria-invalid, required and disabled. */
  children: React.ReactElement<FieldControlProps>;
};
export function Field({
  label,
  hint,
  error,
  required,
  secondary,
  disabled,
  id: explicitId,
  className,
  children,
}: FieldProps) {
  const generatedId = React.useId();
  const id = children.props.id ?? explicitId ?? generatedId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const controlInvalid = children.props["aria-invalid"];
  return (
    <div className={cx("grid gap-2", className)}>
      <Label htmlFor={id} required={required} secondary={secondary} disabled={disabled}>
        {label}
      </Label>
      {React.cloneElement(children, {
        id,
        "aria-describedby": joinIds(children.props["aria-describedby"], hintId, errorId),
        "aria-invalid": error ? true : controlInvalid,
        ...(required !== undefined && { required }),
        ...(disabled !== undefined && { disabled }),
      })}
      {hint && (
        <p id={hintId} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p role="alert" id={errorId} className="text-xs leading-relaxed text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
export type InputGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, "prefix"> & {
  /** Text or icon before the input; pressing it focuses the input. */
  prefix?: React.ReactNode;
  /** Text or icon after the input; pressing it focuses the input. */
  suffix?: React.ReactNode;
  /** A button at the end of the group; it becomes type="button" unless it declares a type. */
  action?: React.ReactNode;
  /** The control; Field ids, descriptions, required and disabled are forwarded to it. */
  children: React.ReactElement<FieldControlProps>;
  required?: boolean;
  disabled?: boolean;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};
export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(
    {
      prefix,
      suffix,
      action,
      children,
      className,
      id,
      required,
      disabled,
      "aria-describedby": describedBy,
      "aria-invalid": invalid,
      ...props
    },
    ref,
  ) {
    const root = React.useRef<HTMLDivElement | null>(null);
    const focusControl = () => {
      const control = root.current?.querySelector<HTMLElement>("input, textarea, select");
      control?.focus();
    };
    const control = React.cloneElement(children, {
      ...(id !== undefined && { id }),
      ...(describedBy !== undefined && { "aria-describedby": describedBy }),
      ...(invalid !== undefined && { "aria-invalid": invalid }),
      ...(required !== undefined && { required }),
      ...(disabled !== undefined && { disabled }),
    });
    const isInvalid = invalid === true || invalid === "true";
    const isDisabled = disabled || children.props.disabled;
    const actionNode =
      React.isValidElement<{ type?: string }>(action) && action.type === "button" && !action.props.type
        ? React.cloneElement(action, { type: "button" })
        : action;
    return (
      <div
        ref={mergeRefs(ref, root)}
        data-invalid={isInvalid || undefined}
        data-disabled={isDisabled || undefined}
        {...props}
        className={cx(
          "flex min-h-11 w-full min-w-0 items-stretch rounded-lg border border-line bg-paper/50 text-sm text-ink shadow-xs transition-colors focus-within:bg-card data-[invalid]:border-danger data-[disabled]:opacity-50",
          "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-terracotta",
          "[&_input]:min-h-0 [&_input]:flex-1 [&_input]:rounded-none [&_input]:border-0 [&_input]:bg-transparent [&_input]:shadow-none [&_input]:outline-none [&_input]:focus-visible:bg-transparent",
          className,
        )}
      >
        {prefix && (
          <span
            onClick={focusControl}
            className="flex max-w-[45%] shrink-0 select-none items-center ps-3 text-muted [&_svg]:size-4 [&_svg]:shrink-0"
          >
            <span className="truncate">{prefix}</span>
          </span>
        )}
        {control}
        {suffix && (
          <span
            onClick={focusControl}
            className="flex max-w-[45%] shrink-0 select-none items-center pe-3 text-muted [&_svg]:size-4 [&_svg]:shrink-0"
          >
            <span className="truncate">{suffix}</span>
          </span>
        )}
        {actionNode && (
          <span className="flex shrink-0 items-center gap-1 pe-1 [&>button]:min-h-9 [&>button]:min-w-9 [&>button]:rounded-md [&>button]:px-2 [&>button]:text-sm [&>button]:font-medium [&>button]:text-ink [&>button]:hover:bg-surface [&>button]:disabled:opacity-45 [&>button_svg]:size-4">
            {actionNode}
          </span>
        )}
      </div>
    );
  },
);
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
export type NativeSelectOption = { value: string; label: string; disabled?: boolean };
export type NativeSelectGroup = { label: string; options: NativeSelectOption[]; disabled?: boolean };
export type NativeSelectProps = React.ComponentPropsWithoutRef<"select"> & {
  /** Flat options or labelled groups rendered as optgroup. */
  options: (NativeSelectOption | NativeSelectGroup)[];
  /** Empty first option shown until a value is chosen; it cannot be re-selected. */
  placeholder?: string;
};
export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect({ options, placeholder, className, onChange, ...props }, ref) {
    const [internal, setInternal] = React.useState(String(props.defaultValue ?? ""));
    const current = props.value !== undefined ? String(props.value) : internal;
    const empty = placeholder !== undefined && current === "";
    const renderOption = (o: NativeSelectOption) => (
      <option key={o.value} value={o.value} disabled={o.disabled}>
        {o.label}
      </option>
    );
    return (
      <span className="relative block min-w-0">
        <select
          ref={ref}
          {...props}
          defaultValue={
            props.value === undefined ? (props.defaultValue ?? (placeholder !== undefined ? "" : undefined)) : undefined
          }
          data-placeholder={empty || undefined}
          onChange={(event) => {
            if (props.value === undefined) setInternal(event.target.value);
            onChange?.(event);
          }}
          className={cx(
            "a-input min-h-11 appearance-none truncate pe-10 data-[placeholder]:text-muted/75",
            className,
          )}
        >
          {placeholder !== undefined && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) =>
            "options" in o ? (
              <optgroup key={o.label} label={o.label} disabled={o.disabled}>
                {o.options.map(renderOption)}
              </optgroup>
            ) : (
              renderOption(o)
            ),
          )}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        />
      </span>
    );
  },
);
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
export type SliderProps = React.ComponentPropsWithoutRef<typeof SL.Root> & {
  /** Accessible name; range thumbs are numbered from it. */
  label: string;
  /** Shows the label and the current value above the track. */
  showValue?: boolean;
  /** Formats a value for display and for aria-valuetext. */
  formatValue?: (value: number) => string;
  /** Optional tick labels under a horizontal track; ignored when vertical. */
  marks?: { value: number; label?: React.ReactNode }[];
};
export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  { label, showValue = false, formatValue, marks, className, onValueChange, ...props },
  ref,
) {
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const vertical = props.orientation === "vertical";
  const [internal, setInternal] = React.useState<number[]>(props.defaultValue ?? [50]);
  const values = props.value ?? internal;
  const format = formatValue ?? ((value: number) => String(value));
  const shown =
    values.length > 1 ? `${format(values[0])} to ${format(values[values.length - 1])}` : format(values[0]);
  const thumbId = React.useId();
  return (
    <div className={cx("grid gap-2", vertical ? "justify-items-start" : "w-full", className)}>
      {showValue && (
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span id={`${thumbId}-label`} className="font-medium">
            {label}
          </span>
          <output aria-live="polite" htmlFor={values.map((_, i) => `${thumbId}-${i}`).join(" ")} className="tabular-nums text-muted">
            {shown}
          </output>
        </div>
      )}
      <SL.Root
        ref={ref}
        {...props}
        value={props.value}
        defaultValue={props.value === undefined ? (props.defaultValue ?? [50]) : undefined}
        onValueChange={(next) => {
          if (props.value === undefined) setInternal(next);
          onValueChange?.(next);
        }}
        className={cx(
          "relative flex touch-none select-none items-center data-[disabled]:opacity-45",
          vertical ? "h-48 w-11 flex-col" : "h-11 w-full",
        )}
      >
        <SL.Track
          className={cx(
            "relative grow rounded-full bg-control/40",
            vertical ? "w-1.5" : "h-1.5",
          )}
        >
          <SL.Range className={cx("absolute rounded-full bg-terracotta", vertical ? "w-full" : "h-full")} />
        </SL.Track>
        {values.map((value, i) => (
          <SL.Thumb
            key={i}
            id={`${thumbId}-${i}`}
            aria-label={values.length > 1 ? `${label} ${i + 1}` : label}
            aria-valuetext={format(value)}
            className="relative block size-5 rounded-full border border-control bg-card shadow-sm transition-[box-shadow,border-color] before:absolute before:-inset-3 before:content-[''] hover:border-ink focus-visible:border-terracotta data-[disabled]:cursor-default motion-reduce:transition-none"
          />
        ))}
      </SL.Root>
      {marks && marks.length > 0 && !vertical && (
        <div aria-hidden="true" className="relative h-4 text-[11px] leading-4 text-muted">
          {marks.map((mark) => (
            <span
              key={mark.value}
              className="absolute -translate-x-1/2 whitespace-nowrap tabular-nums"
              style={{ insetInlineStart: `${((mark.value - min) / (max - min)) * 100}%` }}
            >
              {mark.label ?? format(mark.value)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
export type ToggleProps = React.ComponentPropsWithoutRef<typeof TO.Root> & {
  /** sm keeps a 44px target on touch and 36px from the sm breakpoint. */
  size?: "sm" | "md";
  /** outline draws the border at rest; quiet only shows a surface on hover. */
  tone?: "outline" | "quiet";
};
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { children, size = "md", tone = "outline", className, ...props },
  ref,
) {
  return (
    <TO.Root
      ref={ref}
      type="button"
      {...props}
      className={cx(
        "a-button min-w-11 border text-sm text-ink hover:bg-surface data-[state=on]:border-ink data-[state=on]:bg-ink data-[state=on]:text-paper data-[state=on]:shadow-[inset_0_1px_2px_rgb(0_0_0/0.25)] disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0",
        tone === "outline" ? "border-control bg-transparent" : "border-transparent bg-transparent",
        size === "sm" ? "min-h-11 px-2.5 sm:min-h-9" : "min-h-11 px-3",
        className,
      )}
    >
      {children}
    </TO.Root>
  );
});
export type ToggleGroupOption =
  | string
  | { value: string; label: React.ReactNode; icon?: React.ReactNode; disabled?: boolean };
type ToggleGroupBase = {
  /** Accessible name of the group. */
  label: string;
  /** Plain strings are both value and label. */
  options: ToggleGroupOption[];
  disabled?: boolean;
  /** Prevents deselecting the last pressed item in single mode. */
  required?: boolean;
  /** sm keeps a 44px target on touch and 36px from the sm breakpoint. */
  size?: "sm" | "md";
  /** Items wrap to new lines by default; vertical stacks them. */
  orientation?: "horizontal" | "vertical";
  className?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};
export type ToggleGroupProps =
  | (ToggleGroupBase & {
      type?: "single";
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string) => void;
    })
  | (ToggleGroupBase & {
      type: "multiple";
      value?: string[];
      defaultValue?: string[];
      onValueChange?: (value: string[]) => void;
    });
export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
  props,
  ref,
) {
  const {
    label,
    options,
    disabled,
    required = false,
    size = "md",
    orientation = "horizontal",
    className,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
  } = props;
  const items = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
  const itemClass = cx(
    "a-button min-w-11 rounded-md text-sm text-muted hover:text-ink data-[state=on]:bg-card data-[state=on]:text-ink data-[state=on]:shadow-xs disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0",
    size === "sm" ? "min-h-11 px-2.5 sm:min-h-9" : "min-h-11 px-3",
    orientation === "vertical" && "w-full justify-start",
  );
  const rootClass = cx(
    "inline-flex max-w-full gap-1 rounded-lg bg-surface p-1",
    orientation === "vertical" ? "flex-col" : "flex-wrap",
    className,
  );
  const children = items.map((o) => (
    <TG.Item key={o.value} value={o.value} disabled={o.disabled} className={itemClass}>
      {o.icon}
      <span className="min-w-0 break-words">{o.label}</span>
    </TG.Item>
  ));
  const shared = {
    ref,
    "aria-label": label,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
    disabled,
    orientation,
    className: rootClass,
  };
  if (props.type === "multiple") {
    return (
      <TG.Root type="multiple" {...shared} value={props.value} defaultValue={props.defaultValue} onValueChange={props.onValueChange}>
        {children}
      </TG.Root>
    );
  }
  return (
    <TG.Root
      type="single"
      {...shared}
      value={props.value}
      defaultValue={props.defaultValue}
      onValueChange={(next) => {
        if (required && next === "") return;
        props.onValueChange?.(next);
      }}
    >
      {children}
    </TG.Root>
  );
});
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
export type InputOTPProps = {
  /** Number of characters; defaults to 6. */
  length?: number;
  /** Accessible name of the group; each slot is named "Digit n of length" from it. */
  label?: string;
  /** Controlled code without separators. */
  value?: string;
  /** Initial code when uncontrolled. */
  defaultValue?: string;
  /** Fires with the sanitized code on every edit, paste and autofill. */
  onChange?: (value: string) => void;
  /** Fires once when every slot is filled. */
  onComplete?: (value: string) => void;
  /** numeric (default) accepts digits only; alphanumeric accepts letters and digits and upper-cases them. */
  pattern?: "numeric" | "alphanumeric";
  /** Slot count per visual group, for example 3 renders 123 456 with a separator between. */
  groupSize?: number;
  /** Submits the code under this name through a hidden input. */
  name?: string;
  /** Applied to the first slot so a Label or Field can point at the control. */
  id?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  className?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};
const otpPatterns = { numeric: /[^0-9]/g, alphanumeric: /[^0-9a-zA-Z]/g };
export const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(function InputOTP(
  {
    length = 6,
    label = "Verification code",
    value,
    defaultValue = "",
    onChange,
    onComplete,
    pattern = "numeric",
    groupSize,
    name,
    id,
    disabled,
    required,
    autoFocus,
    className,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
  },
  ref,
) {
  const [internal, setInternal] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const code = (controlled ? value : internal).slice(0, length);
  const slots = React.useRef<(HTMLInputElement | null)[]>([]);
  // Focus handlers run before the next render, so they read the latest code from here.
  const latest = React.useRef(code);
  latest.current = code;
  const completed = React.useRef(code.length === length);
  const sanitize = (text: string) => {
    const clean = text.replace(otpPatterns[pattern], "");
    return (pattern === "alphanumeric" ? clean.toUpperCase() : clean).slice(0, length);
  };
  const focusSlot = (index: number) => {
    const slot = slots.current[Math.max(0, Math.min(index, length - 1))];
    slot?.focus();
    slot?.select();
  };
  const commit = (next: string, focusIndex: number) => {
    latest.current = next;
    if (!controlled) setInternal(next);
    if (next !== code) onChange?.(next);
    if (next.length === length && !completed.current) onComplete?.(next);
    completed.current = next.length === length;
    focusSlot(focusIndex);
  };
  /** Writes text starting at a slot; a full code always starts from the first slot. */
  const insert = (text: string, at: number) => {
    const chars = sanitize(text);
    if (!chars) return;
    const start = chars.length >= length ? 0 : Math.min(at, code.length);
    const next = (code.slice(0, start) + chars).slice(0, length);
    commit(next, next.length);
  };
  const handleChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    if (text === "") {
      commit(code.slice(0, index) + code.slice(index + 1), index);
      return;
    }
    // A slot already holding a character receives "old new" or "new old"; keep what was typed last.
    const typed = text.length === 2 && code[index] ? text.replace(code[index], "") : text;
    insert(typed, index);
  };
  const handleKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const target = code[index] ? index : index - 1;
      if (target < 0) return;
      commit(code.slice(0, target) + code.slice(target + 1), target);
    } else if (event.key === "Delete") {
      event.preventDefault();
      commit(code.slice(0, index) + code.slice(index + 1), index);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusSlot(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusSlot(Math.min(index + 1, code.length));
    } else if (event.key === "Home") {
      event.preventDefault();
      focusSlot(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusSlot(code.length);
    }
  };
  const handlePaste = (index: number) => (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    insert(event.clipboardData.getData("text"), index);
  };
  const size = groupSize && groupSize > 0 ? groupSize : length;
  return (
    <div
      role="group"
      aria-label={label}
      aria-describedby={describedBy}
      className={cx("flex w-full max-w-full items-center gap-2", disabled && "opacity-50", className)}
    >
      {name && <input type="hidden" name={name} value={code} />}
      {Array.from({ length }, (_, index) => (
        <React.Fragment key={index}>
          {index > 0 && index % size === 0 && (
            <span aria-hidden="true" className="h-px w-2 shrink-0 rounded-full bg-control" />
          )}
          <input
            ref={index === 0 ? mergeRefs(ref, (node) => { slots.current[0] = node; }) : (node) => { slots.current[index] = node; }}
            id={index === 0 ? id : undefined}
            aria-label={`${label}: character ${index + 1} of ${length}`}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            type="text"
            inputMode={pattern === "numeric" ? "numeric" : "text"}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            autoFocus={autoFocus && index === 0}
            disabled={disabled}
            required={required}
            value={code[index] ?? ""}
            onChange={handleChange(index)}
            onKeyDown={handleKeyDown(index)}
            onPaste={handlePaste(index)}
            onFocus={(event) => {
              // Keep entry contiguous: focusing a slot past the code moves to the first empty slot.
              if (index > latest.current.length) focusSlot(latest.current.length);
              else event.target.select();
            }}
            className="a-input h-11 min-w-8 flex-1 basis-0 px-0 text-center font-mono text-lg tabular-nums caret-terracotta selection:bg-terracotta/20 sm:max-w-12"
          />
        </React.Fragment>
      ))}
    </div>
  );
});
