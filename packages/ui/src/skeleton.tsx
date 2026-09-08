import * as React from "react";
import { cx } from "./utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cx(
        "h-4 rounded bg-surface animate-pulse motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}
