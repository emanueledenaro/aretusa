import * as React from "react";

export function Direction({
  dir,
  children,
}: {
  dir: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  return <div dir={dir}>{children}</div>;
}
