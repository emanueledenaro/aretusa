import * as React from "react";
import { cx } from "./utils";

export function AspectRatio({
  ratio = 16 / 9,
  children,
  className,
}: {
  ratio?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={cx("overflow-hidden rounded-xl", className)}
    >
      {children}
    </div>
  );
}
