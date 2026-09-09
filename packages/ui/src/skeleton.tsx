import * as React from "react";
import { cx } from "./utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * text: one line of running text, sized from the surrounding font so it
   * takes the same space as the copy it replaces. circle: avatars and icons.
   * rectangle: media, cards and controls.
   */
  shape?: "text" | "circle" | "rectangle";
  /** Text shape only. Renders this many lines; the last one is shorter. */
  lines?: number;
};

const pulse = "animate-pulse motion-reduce:animate-none bg-ink/10";
const line = "h-[1em] my-[0.25em] rounded";

/**
 * A placeholder shape. Always hidden from assistive technology; announce the
 * loading state once from the parent with SkeletonGroup.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ shape = "text", lines = 1, className, ...props }, ref) {
    const count = Number.isInteger(lines) && lines > 1 ? lines : 1;
    if (shape === "text" && count > 1) {
      return (
        <div
          ref={ref}
          data-shape="text"
          data-lines={count}
          className={cx("flex flex-col", className)}
          {...props}
          aria-hidden
        >
          {Array.from({ length: count }, (_, index) => (
            <span
              key={index}
              className={cx("block", pulse, line, index === count - 1 && "w-3/5")}
            />
          ))}
        </div>
      );
    }
    return (
      <div
        ref={ref}
        data-shape={shape}
        className={cx(
          pulse,
          shape === "text" && line,
          shape === "circle" && "size-10 shrink-0 rounded-full",
          shape === "rectangle" && "h-24 rounded-lg",
          className,
        )}
        {...props}
        aria-hidden
      />
    );
  },
);

export type SkeletonGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Read once by assistive technology; the shapes inside stay hidden. */
  label: string;
};

/** Wraps a loading layout and announces it once as a busy status region. */
export const SkeletonGroup = React.forwardRef<HTMLDivElement, SkeletonGroupProps>(
  function SkeletonGroup({ label, className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        role="status"
        aria-busy="true"
        className={cx("min-w-0", className)}
        {...props}
      >
        <span className="sr-only">{label}</span>
        {children}
      </div>
    );
  },
);
