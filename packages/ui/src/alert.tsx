import * as React from "react";
import { cx } from "./utils";

export function Alert({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children?: React.ReactNode;
  tone?: "info" | "error" | "success";
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx(
        "rounded-xl border p-4 text-sm",
        tone === "error"
          ? "border-danger/40 bg-danger/5"
          : tone === "success"
            ? "border-success/40 bg-success/5"
            : "border-line bg-surface/50",
      )}
    >
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-2 leading-relaxed">{children}</div>}
    </div>
  );
}
