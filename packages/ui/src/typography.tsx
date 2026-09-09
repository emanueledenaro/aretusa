import * as React from "react";
import { cx } from "./utils";

export type TypographyVariant =
  | "display"
  | "title"
  | "heading"
  | "subheading"
  | "lead"
  | "body"
  | "small"
  | "caption"
  | "overline";

export type TypographyProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  /** The element, chosen for document structure. h1 to h4 pick a matching variant by default. */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "blockquote" | "figcaption";
  /** The visual scale, independent from the element. */
  variant?: TypographyVariant;
  /** Lora for editorial moments; DM Sans otherwise. */
  editorial?: boolean;
  muted?: boolean;
};

const defaults: Partial<Record<NonNullable<TypographyProps["as"]>, TypographyVariant>> = {
  h1: "display",
  h2: "title",
  h3: "heading",
  h4: "subheading",
  h5: "subheading",
  h6: "small",
  figcaption: "caption",
};

/* Sizes grow with the viewport between 320 and 1440px; line height tightens as size grows and tracking follows optical size. */
const variants: Record<TypographyVariant, string> = {
  display: "text-[clamp(2.25rem,1.55rem+3vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-balance",
  title: "text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.015em] text-balance",
  heading: "text-xl font-medium leading-snug tracking-[-0.01em] text-balance sm:text-2xl",
  subheading: "text-lg font-medium leading-snug",
  lead: "text-lg leading-relaxed text-pretty",
  body: "text-base leading-relaxed text-pretty",
  small: "text-sm leading-relaxed",
  caption: "text-xs leading-relaxed text-muted",
  overline: "text-xs font-medium uppercase leading-relaxed tracking-[0.08em] text-muted",
};

/** Text with the Aretusa scale. Semantics come from `as`, size from `variant`. */
export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  function Typography({ children, as: Tag = "p", variant, editorial = false, muted = false, className, ...props }, ref) {
    const scale = variant ?? defaults[Tag] ?? "body";
    return (
      <Tag
        ref={ref as React.Ref<HTMLParagraphElement & HTMLHeadingElement & HTMLDivElement & HTMLQuoteElement>}
        data-variant={scale}
        className={cx(
          editorial ? "font-editorial" : "font-sans",
          "[overflow-wrap:anywhere] [&_a]:underline [&_a]:decoration-terracotta/60 [&_a]:underline-offset-4 [&_a:hover]:decoration-terracotta [&_a]:rounded-xs",
          variants[scale],
          muted && "text-muted",
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);
