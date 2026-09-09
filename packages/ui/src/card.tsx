import * as React from "react";
import { cx } from "./utils";

export type CardProps = React.HTMLAttributes<HTMLElement> & {
  /** Semantic wrapper. article for self-contained items, section for a labelled region, div or li inside lists. */
  as?: "article" | "section" | "div" | "li";
};

/**
 * A surface for one self-contained piece of content. The card itself is never a click target:
 * put actions in CardHeader's action slot or in CardFooter so the rest of the surface stays inert.
 */
export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  { as: Tag = "article", className, ...props },
  ref,
) {
  // The element type is chosen at runtime; React resolves the ref against the rendered tag.
  const Element = Tag as React.ElementType;
  return (
    <Element
      {...props}
      ref={ref}
      data-slot="card"
      className={cx(
        "a-card flex min-w-0 flex-col rounded-xl bg-card text-ink [overflow-wrap:anywhere]",
        className,
      )}
    />
  );
});

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Control aligned to the end of the header, for example a menu or a remove button. */
  action?: React.ReactNode;
};

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ action, className, children, ...props }, ref) {
    if (!action) {
      return (
        <div
          {...props}
          ref={ref}
          data-slot="card-header"
          className={cx("mb-5 flex min-w-0 flex-col gap-2", className)}
        >
          {children}
        </div>
      );
    }
    return (
      <div
        {...props}
        ref={ref}
        data-slot="card-header"
        className={cx("mb-5 flex items-start justify-between gap-4", className)}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">{children}</div>
        <div data-slot="card-action" className="flex shrink-0 items-center gap-2">
          {action}
        </div>
      </div>
    );
  },
);

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  /** Heading level. Choose it from the page outline; h3 is the default inside a titled section. */
  as?: "h1" | "h2" | "h3" | "h4" | "p";
};

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ as: Tag = "h3", className, ...props }, ref) {
    return (
      <Tag
        {...props}
        ref={ref}
        data-slot="card-title"
        className={cx("text-xl font-medium leading-snug tracking-tight", className)}
      />
    );
  },
);

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      {...props}
      ref={ref}
      data-slot="card-description"
      className={cx("text-sm leading-relaxed text-muted", className)}
    />
  );
});

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardContent({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="card-content"
      className={cx("min-w-0 text-sm leading-relaxed", className)}
    />
  );
});

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Where actions sit on the row. start is the default; end for a single primary action; between for a status beside actions. */
  align?: "start" | "end" | "between";
};

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ align = "start", className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        data-slot="card-footer"
        data-align={align}
        className={cx(
          "mt-auto flex flex-wrap items-center gap-3 pt-6",
          align === "end" && "justify-end",
          align === "between" && "justify-between",
          className,
        )}
      />
    );
  },
);
