import * as React from "react";
import { LoaderCircle, UserRound } from "lucide-react";
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
export function Badge({
  tone = "neutral",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        {
          "bg-surface text-ink": tone === "neutral",
          "bg-success/10 text-success": tone === "success",
          "bg-gold/20 text-ink": tone === "warning",
          "bg-danger/10 text-danger": tone === "danger",
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={cx("rounded-xl border border-line bg-card p-6", className)}
      {...props}
    />
  );
}
export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("mb-5 space-y-2", className)} {...props} />;
}
export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cx("text-xl font-medium tracking-tight", className)}
      {...props}
    />
  );
}
export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cx("text-sm leading-relaxed text-muted", className)}
      {...props}
    />
  );
}
export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx("mt-6 flex flex-wrap items-center gap-3", className)}
      {...props}
    />
  );
}
export const Separator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) => (
  <hr className={cx("my-5 border-line", className)} {...props} />
);
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cx(
        "h-4 rounded bg-surface animate-pulse motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}
export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-sm">
      <LoaderCircle
        className="size-4 animate-spin motion-reduce:animate-none"
        aria-hidden
      />
      {label}
    </span>
  );
}
export function Alert({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children?: React.ReactNode;
  tone?: "info" | "error" | "success";
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx(
        "rounded-xl border p-4 text-sm",
        tone === "error"
          ? "border-danger/40 bg-danger/5"
          : tone === "success"
            ? "border-success/40 bg-success/5"
            : "border-line bg-surface/50",
      )}
    >
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-2 leading-relaxed">{children}</div>}
    </div>
  );
}
export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-line p-10 text-center">
      <h3 className="font-editorial text-2xl">{title}</h3>
      <div className="mx-auto my-4 max-w-sm text-sm text-muted">{children}</div>
      {action}
    </div>
  );
}
export function Progress({ value, label }: { value: number; label: string }) {
  const current = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span>{label}</span>
        <span>{current}%</span>
      </div>
      <progress
        aria-label={label}
        value={current}
        max={100}
        className="h-2 w-full overflow-hidden rounded-full accent-terracotta"
      />
    </div>
  );
}
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
export function AspectRatio({
  ratio = 16 / 9,
  children,
  className,
}: {
  ratio?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={cx("overflow-hidden rounded-xl", className)}
    >
      {children}
    </div>
  );
}
export const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-xs">
    {children}
  </kbd>
);
export const ButtonGroup = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => (
  <div role="group" aria-label={label} className="flex flex-wrap gap-2">
    {children}
  </div>
);
export function Item({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-4">
      <div>
        <p className="font-medium">{title}</p>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Typography({
  children,
  as: Tag = "p",
  editorial = false,
  className,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  editorial?: boolean;
  className?: string;
}) {
  return (
    <Tag
      className={cx(
        editorial ? "font-editorial" : "font-sans",
        Tag === "h1"
          ? "text-5xl leading-tight tracking-tight"
          : Tag === "h2"
            ? "text-3xl tracking-tight"
            : Tag === "h3"
              ? "text-xl"
              : "leading-relaxed",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
export function Direction({
  dir,
  children,
}: {
  dir: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  return <div dir={dir}>{children}</div>;
}
