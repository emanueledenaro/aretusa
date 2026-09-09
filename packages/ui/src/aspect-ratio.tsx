import * as React from "react";
import { cx } from "./utils";

export type AspectRatioProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Width divided by height, for example 16 / 9 or 3 / 4. Non-positive or non-finite values fall back to 16 / 9. */
  ratio?: number;
  /** How a direct img, video or iframe child fills the box: cover crops, contain letterboxes on the surface token. */
  fit?: "cover" | "contain";
};

/**
 * A box that keeps one ratio at any width. Media children fill it without stretching;
 * anything wider than the box is clipped so the surrounding layout never shifts.
 * Alt text, loading and error handling belong to the media element you place inside.
 */
export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  function AspectRatio({ ratio = 16 / 9, fit = "cover", className, style, children, ...props }, ref) {
    const value = Number.isFinite(ratio) && ratio > 0 ? ratio : 16 / 9;
    return (
      <div
        {...props}
        ref={ref}
        data-fit={fit}
        style={{ ...style, aspectRatio: value }}
        className={cx(
          "relative w-full min-w-0 overflow-hidden rounded-xl bg-surface",
          "[&>img]:block [&>img]:size-full [&>video]:block [&>video]:size-full [&>iframe]:block [&>iframe]:size-full [&>iframe]:border-0",
          fit === "contain"
            ? "[&>img]:object-contain [&>video]:object-contain"
            : "[&>img]:object-cover [&>video]:object-cover",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);
