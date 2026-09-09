import * as React from "react";
import { cx } from "./utils";

export type SeparatorProps = React.HTMLAttributes<HTMLElement> & {
  /** horizontal draws a full-width rule; vertical draws a rule that stretches to the height of its flex row. */
  orientation?: "horizontal" | "vertical";
  /**
   * Decorative rules are hidden from assistive technology. Leave it false when the rule marks
   * a thematic break between sections, so screen readers announce it.
   */
  decorative?: boolean;
  /** Short text set inside the rule, for example "or" between two sign-in options. Horizontal only. */
  label?: React.ReactNode;
  /** Outer spacing: md is 20px above and below (12px beside a vertical rule); none lets the parent decide. */
  spacing?: "none" | "sm" | "md" | "lg";
};

const horizontalSpacing = { none: "", sm: "my-3", md: "my-5", lg: "my-8" };
const verticalSpacing = { none: "", sm: "mx-2", md: "mx-3", lg: "mx-4" };

/**
 * A rule between groups of content. Semantic by default (an hr, or a div with role separator
 * when vertical or labelled); set decorative for purely visual spacing.
 */
export const Separator = React.forwardRef<HTMLElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", decorative = false, label, spacing = "md", className, ...props },
  ref,
) {
  const vertical = orientation === "vertical";
  if (vertical) {
    return (
      <div
        {...props}
        ref={ref as React.Ref<HTMLDivElement>}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : "vertical"}
        data-orientation="vertical"
        className={cx("w-px min-h-4 shrink-0 self-stretch bg-line", verticalSpacing[spacing], className)}
      />
    );
  }
  if (label !== undefined && label !== null && label !== false) {
    return (
      <div
        {...props}
        ref={ref as React.Ref<HTMLDivElement>}
        role={decorative ? "none" : "separator"}
        aria-label={!decorative && typeof label === "string" ? label : props["aria-label"]}
        data-orientation="horizontal"
        className={cx(
          "flex w-full items-center gap-3 text-xs font-medium tracking-[0.06em] text-muted uppercase",
          horizontalSpacing[spacing],
          className,
        )}
      >
        <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-line" />
        <span className="shrink-0 [overflow-wrap:anywhere]">{label}</span>
        <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-line" />
      </div>
    );
  }
  if (decorative) {
    return (
      <div
        {...props}
        ref={ref as React.Ref<HTMLDivElement>}
        role="none"
        data-orientation="horizontal"
        className={cx("h-px w-full bg-line", horizontalSpacing[spacing], className)}
      />
    );
  }
  return (
    <hr
      {...props}
      ref={ref as React.Ref<HTMLHRElement>}
      data-orientation="horizontal"
      className={cx("h-px w-full border-0 bg-line", horizontalSpacing[spacing], className)}
    />
  );
});
