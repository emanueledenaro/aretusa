import * as React from "react";
import { cx } from "./utils";

export type ItemProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Short secondary facts such as a date or a size, set in small tabular text. */
  meta?: React.ReactNode;
  /** Avatar, icon or thumbnail aligned with the first line of the title. */
  leading?: React.ReactNode;
  /** Trailing controls. Give each one an explicit name that includes the item. */
  action?: React.ReactNode;
  /** Makes the whole row a link; the title is the link text. */
  href?: string;
  /** Makes the whole row a button; the title is the button text. Ignored when href is set. */
  onActivate?: () => void;
  selected?: boolean;
  disabled?: boolean;
  /** Use li inside ul or ol. */
  as?: "div" | "li";
};

/**
 * A list row with leading content, title, description, meta and trailing
 * actions. When linked or activatable, only the title is the control and the
 * row is reached through a stretched overlay, so trailing actions never nest
 * inside another control.
 */
export const Item = React.forwardRef<HTMLElement, ItemProps>(
  function Item(
    { title, description, meta, leading, action, href, onActivate, selected = false, disabled = false, as: Tag = "div", className, ...props },
    ref,
  ) {
    const interactive = Boolean(href) || Boolean(onActivate);
    const control =
      "a-item-control text-start font-medium leading-6 text-ink underline-offset-4 decoration-terracotta/60 hover:underline focus-visible:outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] disabled:no-underline";
    const heading = href ? (
      <a href={disabled ? undefined : href} aria-disabled={disabled || undefined} aria-current={selected ? "true" : undefined} className={control}>
        {title}
      </a>
    ) : onActivate ? (
      <button type="button" onClick={onActivate} disabled={disabled} aria-pressed={selected || undefined} className={control}>
        {title}
      </button>
    ) : (
      <p className="font-medium leading-6">{title}</p>
    );
    return (
      <Tag
        ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
        data-interactive={interactive || undefined}
        data-selected={selected || undefined}
        data-disabled={disabled || undefined}
        className={cx(
          "@container relative flex min-h-11 flex-wrap items-start gap-x-4 gap-y-2 border-b border-line py-3",
          interactive && "rounded-lg transition-colors has-[.a-item-control:hover]:bg-surface/50 has-[.a-item-control:focus-visible]:outline-2 has-[.a-item-control:focus-visible]:outline-terracotta has-[.a-item-control:focus-visible]:-outline-offset-2",
          selected && "bg-surface/70",
          disabled && "opacity-50",
          className,
        )}
        {...props}
      >
        {leading && <div className="flex shrink-0 items-center self-start [&_svg]:size-5">{leading}</div>}
        <div className="min-w-0 flex-1 basis-40">
          {heading}
          {description && <p className="text-sm leading-relaxed text-muted [overflow-wrap:anywhere]">{description}</p>}
          {meta && <p className="mt-1 text-xs tabular-nums leading-relaxed text-muted [overflow-wrap:anywhere]">{meta}</p>}
        </div>
        {action && (
          <div className="relative z-10 flex basis-full flex-wrap items-center gap-2 @sm:ms-auto @sm:basis-auto @sm:self-center">
            {action}
          </div>
        )}
      </Tag>
    );
  },
);
