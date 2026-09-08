import * as React from "react";
import { cx } from "./utils";
import "./shimmer.css";

export type ShimmerProps = React.ComponentPropsWithRef<"span"> & {
  enabled?: boolean;
  /** Seconds per sweep. Invalid values fall back to 2.8 seconds. */
  speed?: number;
  /** Custom highlight color. Check its contrast against the actual surface. */
  highlight?: string;
};

export function Shimmer({ enabled = true, speed = 2.8, highlight, className, style, ...props }: ShimmerProps) {
  const duration = Number.isFinite(speed) && speed > 0 ? speed : 2.8;
  const variables = {
    "--shimmer-duration": `${duration}s`,
    ...(highlight ? { "--shimmer-highlight": highlight } : {}),
    ...style,
  } as React.CSSProperties;
  return <span {...props} data-enabled={enabled} className={cx("a-shimmer", className)} style={variables} />;
}
