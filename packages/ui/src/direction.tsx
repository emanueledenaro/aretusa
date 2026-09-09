import * as React from "react";
import { Direction as RadixDirection } from "radix-ui";
import { cx } from "./utils";

export type TextDirection = "ltr" | "rtl";

export type DirectionProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Reading direction for everything inside, including overlays that render through a portal. */
  dir: TextDirection;
};

/**
 * Sets the reading direction for a subtree. The dir attribute drives text, logical spacing and
 * borders in nested components; the Radix direction context carries the same value into portaled
 * menus, popovers and sheets, which otherwise read the document direction.
 */
export const Direction = React.forwardRef<HTMLDivElement, DirectionProps>(function Direction(
  { dir, className, children, ...props },
  ref,
) {
  return (
    <RadixDirection.Provider dir={dir}>
      <div {...props} ref={ref} dir={dir} className={cx("min-w-0", className)}>
        {children}
      </div>
    </RadixDirection.Provider>
  );
});

/** The direction of the nearest Direction ancestor; ltr when there is none. */
export function useDirection(): TextDirection {
  return RadixDirection.useDirection();
}
