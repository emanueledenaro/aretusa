import * as React from "react";
import { cx } from "./utils";

export type SpinnerProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Read by assistive technology and shown beside the drawing unless hidden. */
  label?: string;
  /** Keep the label for screen readers only, for tight inline placements. */
  labelHidden?: boolean;
  /** sm sits inside small text and buttons, md beside body text, lg on its own. */
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { box: "size-3.5", text: "text-xs", stroke: 2.75 },
  md: { box: "size-4", text: "text-sm", stroke: 2.5 },
  lg: { box: "size-6", text: "text-base", stroke: 2.25 },
};

/**
 * A short loading indicator. One polite status region per spinner; keep the
 * label stable across rerenders so it is announced once. Under reduced motion
 * the drawing stops on its arc and the label carries the state.
 */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  function Spinner({ label = "Loading", labelHidden = false, size = "md", className, ...props }, ref) {
    const dimension = sizes[size];
    return (
      <span
        ref={ref}
        role="status"
        data-size={size}
        className={cx("inline-flex max-w-full items-center gap-2 align-middle", dimension.text, className)}
        {...props}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={cx("shrink-0 animate-spin motion-reduce:animate-none", dimension.box)}
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.22" strokeWidth={dimension.stroke} />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeLinecap="round" strokeWidth={dimension.stroke} />
        </svg>
        <span className={labelHidden ? "sr-only" : "min-w-0 leading-snug"}>{label}</span>
      </span>
    );
  },
);
