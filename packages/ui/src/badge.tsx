import * as React from "react";
import { cx } from "./utils";

export function Badge({
  tone = "neutral",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        {
          "bg-surface text-ink": tone === "neutral",
          "bg-success/10 text-success": tone === "success",
          "bg-gold/20 text-ink": tone === "warning",
          "bg-danger/10 text-danger": tone === "danger",
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
