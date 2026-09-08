import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { cx } from "./utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary" | "outline" | "quiet" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      tone = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      className,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading ? true : props["aria-busy"]}
        className={cx(
          "a-button relative",
          {
            "bg-ink text-paper hover:bg-ink/85": tone === "primary",
            "bg-surface text-ink hover:bg-surface/70": tone === "secondary",
            "border border-control bg-transparent text-ink": tone === "outline",
            "bg-transparent text-ink hover:bg-surface": tone === "quiet",
            "bg-danger text-on-danger": tone === "danger",
            "bg-gold text-[#181818]": tone === "accent",
          },
          {
            "min-h-11 sm:min-h-9 px-3 py-2 text-xs": size === "sm",
            "min-h-11 px-4 py-2 text-sm": size === "md",
            "min-h-13 px-6 py-3 text-base": size === "lg",
          },
          loading && "disabled:opacity-100",
          className,
        )}
      >
        <span
          className="inline-flex min-w-0 items-center justify-center gap-2 [&_svg]:shrink-0"
          style={{ opacity: loading ? 0 : undefined }}
        >
          {children}
        </span>
        {loading && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
          </span>
        )}
      </button>
    );
  },
);
