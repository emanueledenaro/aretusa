import * as React from "react";
import { cx } from "./utils";

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Accessible name of the group. Omit only when aria-labelledby points at a visible label. */
  label?: string;
  /** Share edges between adjacent buttons: inner radii are removed and a hairline separates the actions. */
  attached?: boolean;
  /** vertical stacks the actions at full width; use it for attached groups inside narrow parents. */
  orientation?: "horizontal" | "vertical";
};

/**
 * Groups related actions under one accessible name without changing the buttons inside it:
 * type, disabled, loading and handlers stay native. Spaced groups wrap on narrow containers;
 * attached groups let long labels wrap inside their button instead of overflowing.
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(
    { label, attached = false, orientation = "horizontal", className, children, ...props },
    ref,
  ) {
    const vertical = orientation === "vertical";
    return (
      <div
        role="group"
        aria-label={label}
        {...props}
        ref={ref}
        data-orientation={orientation}
        data-attached={attached ? "true" : undefined}
        className={cx(
          "flex max-w-full",
          vertical ? "flex-col [&>*]:w-full" : "flex-wrap items-center",
          attached
            ? cx(
                "gap-0 [&>*]:relative [&>*]:min-w-0 [&>*]:shrink [&>*:focus-visible]:z-10 [&>*+*]:border-current/20",
                vertical
                  ? "[&>*+*]:-mt-px [&>*+*]:border-t [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none"
                  : "flex-nowrap [&>*+*]:-ms-px [&>*+*]:border-s [&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none",
              )
            : "gap-2",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);
