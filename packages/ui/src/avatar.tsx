import * as React from "react";
import { UserRound } from "lucide-react";
import { cx } from "./utils";

export type AvatarProps = Omit<
  React.ComponentPropsWithRef<"span">,
  "children"
> & {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "rounded";
  decorative?: boolean;
};

export function Avatar({
  src,
  name,
  size = "md",
  shape = "circle",
  decorative = false,
  className,
  ...props
}: AvatarProps) {
  const [image, setImage] = React.useState<{
    source?: string;
    status: "loading" | "loaded" | "failed";
  }>({ source: src, status: "loading" });
  const displayName = name.trim().replace(/\s+/g, " ") || "Profile";
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join("")
    .toLocaleUpperCase();
  const status = src
    ? image.source === src
      ? image.status
      : "loading"
    : "fallback";
  return (
    <span
      {...props}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : displayName}
      aria-hidden={decorative ? true : undefined}
      data-state={status}
      className={cx(
        "a-avatar relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-surface font-medium text-ink",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        {
          "size-8 text-[11px]": size === "sm",
          "size-10 text-xs": size === "md",
          "size-14 text-base": size === "lg",
          "size-20 text-2xl": size === "xl",
        },
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-full items-center justify-center"
      >
        {initials || (
          <UserRound className="size-1/2 min-h-4 min-w-4" aria-hidden />
        )}
      </span>
      {src && status !== "failed" && (
        <img
          key={src}
          src={src}
          alt=""
          onError={() => setImage({ source: src, status: "failed" })}
          onLoad={() => setImage({ source: src, status: "loaded" })}
          className={cx(
            "absolute inset-0 size-full object-cover transition-opacity motion-reduce:transition-none",
            status === "loaded" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </span>
  );
}
