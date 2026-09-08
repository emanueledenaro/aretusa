import * as React from "react";
import { cx } from "./utils";

export const Separator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) => (
  <hr className={cx("my-5 border-line", className)} {...props} />
);
