import * as React from "react";
import { cx } from "./utils";

/** Spoken names for the key glyphs commonly shown in shortcut hints. Unknown keys are read as typed. */
const spokenNames: Record<string, string> = {
  "⌘": "Command",
  "⇧": "Shift",
  "⌥": "Option",
  "⌃": "Control",
  "↵": "Enter",
  "⏎": "Enter",
  "⌫": "Backspace",
  "⌦": "Delete",
  "⎋": "Escape",
  "⇥": "Tab",
  "␣": "Space",
  "←": "Left arrow",
  "→": "Right arrow",
  "↑": "Up arrow",
  "↓": "Down arrow",
  "⇞": "Page up",
  "⇟": "Page down",
  "↖": "Home",
  "↘": "End",
};

/** Returns the spoken name of a key glyph, or the key itself when it is already readable text. */
export function kbdKeyName(key: string): string {
  return spokenNames[key] ?? key;
}

export type KbdProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * Keys of one combination, each rendered as its own keycap inside the outer kbd.
   * Use platform glyphs (⌘, ⌥) or words (Ctrl, Alt); the spoken name is generated from the glyphs.
   */
  keys?: string[];
  /** Spoken name of the combination when the generated one is not right. */
  label?: string;
  /** md is a 20px keycap matching body text; sm is a 16px keycap for dense menus. */
  size?: "sm" | "md";
};

const cap =
  "inline-flex min-w-[1.5em] items-center justify-center rounded-[5px] border border-line border-b-2 bg-card px-1.5 font-sans font-medium tabular-nums whitespace-nowrap text-muted";
const sizes = {
  md: "h-5 text-[0.6875rem] leading-none",
  sm: "h-4 min-w-[1.4em] px-1 text-[0.625rem] leading-none",
};

/**
 * Keyboard input shown as a keycap. Single keys render as one kbd; combinations render nested
 * keycaps with a visually hidden spoken name so glyphs like ⌘ are announced as words.
 */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  { keys, label, size = "md", className, children, ...props },
  ref,
) {
  if (!keys || keys.length === 0) {
    return (
      <kbd
        {...props}
        ref={ref}
        data-size={size}
        className={cx(cap, sizes[size], "align-middle", className)}
      >
        {children}
      </kbd>
    );
  }
  const spoken = label ?? keys.map(kbdKeyName).join(" ");
  const needsSpoken = label !== undefined || spoken !== keys.join(" ");
  return (
    <kbd
      {...props}
      ref={ref}
      data-size={size}
      className={cx("inline-flex items-center gap-0.5 align-middle whitespace-nowrap", className)}
    >
      {keys.map((key, index) => (
        <kbd
          key={index + key}
          aria-hidden={needsSpoken ? true : undefined}
          className={cx(cap, sizes[size])}
        >
          {key}
        </kbd>
      ))}
      {needsSpoken && <span className="sr-only">{spoken}</span>}
      {children}
    </kbd>
  );
});
