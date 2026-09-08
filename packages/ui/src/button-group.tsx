import * as React from "react";

export const ButtonGroup = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => (
  <div role="group" aria-label={label} className="flex flex-wrap gap-2">
    {children}
  </div>
);
