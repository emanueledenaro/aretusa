import * as React from "react";
import { cx } from "./utils";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Semantic colour of the label. The text always carries the meaning; colour is a secondary cue. */
  tone?: BadgeTone;
  /** soft tints the surface with the tone; outline keeps the surface transparent with a line border. */
  variant?: "soft" | "outline";
  /** md is the default 24px label; sm is a 20px label for dense rows and table cells. */
  size?: "sm" | "md";
  /** Leading icon, hidden from assistive technology. */
  icon?: React.ReactNode;
  /** Small dot before the text, useful when scanning lists; decorative. */
  dot?: boolean;
};

const soft: Record<BadgeTone, string> = {
  neutral: "bg-surface text-ink",
  info: "bg-terracotta/10 text-terracotta",
  success: "bg-success/10 text-success",
  warning: "bg-gold/25 text-ink",
  danger: "bg-danger/10 text-danger",
};
const outline: Record<BadgeTone, string> = {
  neutral: "border-line text-ink",
  info: "border-terracotta/50 text-terracotta",
  success: "border-success/50 text-success",
  warning: "border-gold text-ink",
  danger: "border-danger/50 text-danger",
};
const dots: Record<BadgeTone, string> = {
  neutral: "bg-muted",
  info: "bg-terracotta",
  success: "bg-success",
  warning: "bg-gold",
  danger: "bg-danger",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    { tone = "neutral", variant = "soft", size = "md", icon, dot = false, className, children, ...props },
    ref,
  ) {
    return (
      <span
        {...props}
        ref={ref}
        data-tone={tone}
        data-variant={variant}
        data-size={size}
        className={cx(
          "inline-flex max-w-full items-center rounded-full border border-transparent align-middle font-medium tracking-[0.01em] [overflow-wrap:anywhere] [&_svg]:shrink-0",
          size === "sm"
            ? "min-h-5 gap-1 px-2 text-[0.6875rem] leading-4 [&_svg]:size-3"
            : "min-h-6 gap-1.5 px-2.5 text-xs leading-5 [&_svg]:size-3.5",
          variant === "outline" ? cx("bg-transparent", outline[tone]) : soft[tone],
          className,
        )}
      >
        {dot && (
          <span
            aria-hidden="true"
            className={cx("size-1.5 shrink-0 rounded-full", dots[tone])}
          />
        )}
        {icon && (
          <span aria-hidden="true" className="inline-flex shrink-0 items-center">
            {icon}
          </span>
        )}
        {children}
      </span>
    );
  },
);
