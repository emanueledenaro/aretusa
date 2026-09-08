import * as React from "react";
import { cx } from "./utils";

export function Typography({
  children,
  as: Tag = "p",
  editorial = false,
  className,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  editorial?: boolean;
  className?: string;
}) {
  return (
    <Tag
      className={cx(
        editorial ? "font-editorial" : "font-sans",
        Tag === "h1"
          ? "text-5xl leading-tight tracking-tight"
          : Tag === "h2"
            ? "text-3xl tracking-tight"
            : Tag === "h3"
              ? "text-xl"
              : "leading-relaxed",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
