import * as React from "react";

export const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-xs">
    {children}
  </kbd>
);
