import * as React from "react";
import { CircleAlert, Inbox, Lock, SearchX } from "lucide-react";
import { cx } from "./utils";

export type EmptyProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  title: React.ReactNode;
  /** The explanation: what is absent and what the reader can do about it. */
  children?: React.ReactNode;
  /** One primary action, optionally followed by a quieter second one. */
  action?: React.ReactNode;
  /**
   * default: nothing created yet. search: a query matched nothing.
   * permission: the reader cannot see this. error: loading failed and can be retried.
   */
  variant?: "default" | "search" | "permission" | "error";
  /** Replaces the variant icon; null removes it. */
  icon?: React.ReactNode;
  /** Heading level for the title, matching the surrounding document outline. */
  headingLevel?: 2 | 3 | 4;
  /** Tighter padding for cards, lists and panels. */
  compact?: boolean;
};

const icons = {
  default: null,
  search: <SearchX />,
  permission: <Lock />,
  error: <CircleAlert />,
};

/** Explains absence and offers the next step. Not a live region; wrap it in one when the state arrives asynchronously. */
export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  function Empty(
    { title, children, action, variant = "default", icon, headingLevel = 3, compact = false, className, ...props },
    ref,
  ) {
    const Heading = `h${headingLevel}` as const;
    const glyph = icon === undefined ? icons[variant] : icon;
    return (
      <div
        ref={ref}
        data-variant={variant}
        className={cx(
          "flex min-w-0 flex-col items-center rounded-xl border text-center",
          compact ? "px-4 py-6" : "px-5 py-10 sm:px-8 sm:py-12",
          variant === "error"
            ? "border-danger/40 bg-danger/5"
            : variant === "permission"
              ? "border-line bg-surface/40"
              : "border-dashed border-line",
          className,
        )}
        {...props}
      >
        {glyph && (
          <div
            aria-hidden="true"
            className={cx(
              "mb-4 flex size-12 items-center justify-center rounded-full [&_svg]:size-6",
              variant === "error" ? "bg-danger/10 text-danger" : "bg-surface text-muted",
            )}
          >
            {glyph}
          </div>
        )}
        <Heading className={cx("max-w-prose font-editorial leading-snug text-balance [overflow-wrap:anywhere]", compact ? "text-lg" : "text-xl sm:text-2xl")}>
          {title}
        </Heading>
        {children && (
          <div className="mt-2 max-w-sm text-sm leading-relaxed text-pretty text-muted [overflow-wrap:anywhere]">{children}</div>
        )}
        {action && (
          <div className={cx("flex w-full flex-wrap items-center justify-center gap-3", compact ? "mt-4" : "mt-6")}>{action}</div>
        )}
      </div>
    );
  },
);
