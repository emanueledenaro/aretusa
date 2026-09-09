import * as React from "react";
import { cx } from "./utils";
import "./progress.css";

export type ProgressProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Names the bar. Shown above the track unless hidden. */
  label: React.ReactNode;
  /** Current amount. Omit or pass null while the total is unknown. */
  value?: number | null;
  /** Total amount; non-positive or invalid totals fall back to 100. */
  max?: number;
  /** Help text linked to the bar through aria-describedby. */
  description?: React.ReactNode;
  /** Text for the value; also used as aria-valuetext. Defaults to a rounded percentage. */
  formatValue?: (value: number, max: number) => string;
  /** Keep the label for assistive technology only. */
  labelHidden?: boolean;
  tone?: "default" | "success" | "danger";
};

const fills = {
  default: "bg-terracotta text-terracotta",
  success: "bg-success text-success",
  danger: "bg-danger text-danger",
};

/**
 * A determinate or indeterminate progress bar. The bar carries no live region:
 * frequent updates stay quiet, and callers announce milestones separately.
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(
    {
      label,
      value,
      max = 100,
      description,
      formatValue,
      labelHidden = false,
      tone = "default",
      className,
      "aria-describedby": describedBy,
      ...props
    },
    ref,
  ) {
    const generatedId = React.useId();
    const id = props.id ?? generatedId;
    const labelId = `${id}-label`;
    const descriptionId = description ? `${id}-description` : undefined;
    const total = Number.isFinite(max) && max > 0 ? max : 100;
    const indeterminate = value === undefined || value === null;
    const current = indeterminate ? 0 : Math.min(total, Math.max(0, Number.isFinite(value) ? value : 0));
    const percent = (current / total) * 100;
    const text = indeterminate ? undefined : formatValue ? formatValue(current, total) : `${Math.round(percent)}%`;
    const state = indeterminate ? "indeterminate" : current >= total ? "complete" : "determinate";
    return (
      <div ref={ref} className={cx("min-w-0", className)} {...props} id={id} data-state={state}>
        <div className={cx("flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm", labelHidden ? "mb-0" : "mb-2")}>
          <span id={labelId} className={labelHidden ? "sr-only" : "min-w-0 font-medium leading-snug [overflow-wrap:anywhere]"}>
            {label}
          </span>
          {text && (
            <span className={cx("ms-auto tabular-nums text-muted", labelHidden && "mb-2")} aria-hidden="true">
              {text}
            </span>
          )}
        </div>
        <div
          role="progressbar"
          aria-labelledby={labelId}
          aria-describedby={[describedBy, descriptionId].filter(Boolean).join(" ") || undefined}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={indeterminate ? undefined : current}
          aria-valuetext={text}
          data-state={state}
          className="h-2 w-full overflow-hidden rounded-full bg-surface"
        >
          <div
            data-indeterminate={indeterminate ? "true" : undefined}
            className={cx(
              "a-progress-fill h-full rounded-full transition-[width] duration-(--motion-normal) ease-(--motion-settle) motion-reduce:transition-none",
              fills[tone],
            )}
            style={indeterminate ? undefined : { width: `${percent}%` }}
          />
        </div>
        {description && (
          <p id={descriptionId} className="mt-2 text-xs leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
    );
  },
);
