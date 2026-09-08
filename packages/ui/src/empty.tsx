import * as React from "react";

export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-line p-10 text-center">
      <h3 className="font-editorial text-2xl">{title}</h3>
      <div className="mx-auto my-4 max-w-sm text-sm text-muted">{children}</div>
      {action}
    </div>
  );
}
