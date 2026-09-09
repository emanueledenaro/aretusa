import * as React from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { cx } from "./utils";

export type AlertProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  title: React.ReactNode;
  children?: React.ReactNode;
  tone?: "info" | "success" | "warning" | "error";
  /** Replaces the tone icon; null removes it. */
  icon?: React.ReactNode;
  /** Recovery or follow-up controls, rendered under the message. */
  action?: React.ReactNode;
  /** Renders a dismiss control and receives its activation. */
  onDismiss?: () => void;
  dismissLabel?: string;
  /**
   * Announcement urgency. Defaults to assertive for errors and polite
   * otherwise. Use off for content that is present on page load, so it is not
   * announced a second time.
   */
  live?: "polite" | "assertive" | "off";
};

const tones = {
  info: { surface: "border-line bg-surface/50", icon: "text-muted", glyph: <Info /> },
  success: { surface: "border-success/40 bg-success/5", icon: "text-success", glyph: <CircleCheck /> },
  warning: { surface: "border-gold/70 bg-gold/10", icon: "text-ink", glyph: <TriangleAlert /> },
  error: { surface: "border-danger/40 bg-danger/5", icon: "text-danger", glyph: <CircleAlert /> },
};

/** An inline message with a tone, an optional icon, actions and a dismiss control. One live region per alert; keep the content stable across rerenders. */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(
    { title, children, tone = "info", icon, action, onDismiss, dismissLabel = "Dismiss", live, className, ...props },
    ref,
  ) {
    const urgency = live ?? (tone === "error" ? "assertive" : "polite");
    const role = props.role ?? (urgency === "assertive" ? "alert" : urgency === "polite" ? "status" : undefined);
    const glyph = icon === undefined ? tones[tone].glyph : icon;
    return (
      <div
        ref={ref}
        data-tone={tone}
        className={cx("flex min-w-0 gap-3 rounded-xl border p-4 text-sm text-ink", tones[tone].surface, className)}
        {...props}
        role={role}
      >
        {glyph && (
          <span aria-hidden="true" className={cx("mt-0.5 shrink-0 [&_svg]:size-5", tones[tone].icon)}>
            {glyph}
          </span>
        )}
        <div className="min-w-0 flex-1 [overflow-wrap:anywhere]">
          <p className="font-semibold leading-6">{title}</p>
          {children && (
            <div className="mt-1 leading-relaxed text-ink/85 [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:decoration-terracotta/60 [&_a]:underline-offset-4 [&_a:hover]:decoration-terracotta">
              {children}
            </div>
          )}
          {action && <div className="mt-3 flex flex-wrap items-center gap-2">{action}</div>}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={dismissLabel}
            className="-my-2 -me-2 flex size-11 shrink-0 items-center justify-center self-start rounded-lg text-muted transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-offset-[-2px]"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  },
);
