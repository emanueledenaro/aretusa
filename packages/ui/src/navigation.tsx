import * as React from "react";
import {
  Tabs as TB,
  Accordion as AC,
  Collapsible as CO,
  DropdownMenu as DM,
  ContextMenu as CM,
  Menubar as MB,
  NavigationMenu as NM,
  ScrollArea as SA,
} from "radix-ui";
import { Search, Menu, ChevronRight, ChevronLeft, Ellipsis, Check } from "lucide-react";
import { Button } from "./button";
import { Modal } from "./overlays";
import { ScrollFade, useScrollFade } from "./scroll-fade";
import { cx } from "./utils";
export type TabItem = {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  /** Optional leading icon, rendered aria-hidden next to the label. */
  icon?: React.ReactNode;
};
export type TabsProps = Omit<
  React.ComponentPropsWithoutRef<typeof TB.Root>,
  "orientation"
> & {
  items: TabItem[];
  /** Accessible name of the tab list. */
  label?: string;
  /** pill: segmented control on a surface. line: underline indicator on a hairline. */
  variant?: "pill" | "line";
};
/**
 * Automatic activation: arrow keys move focus and selection, Home and End jump to the edges,
 * disabled tabs are skipped. Controlled through value/onValueChange or uncontrolled through defaultValue.
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, label = "Sections", variant = "pill", defaultValue, className, ...props },
  ref,
) {
  const first = items.find((i) => !i.disabled)?.value;
  return (
    <TB.Root
      ref={ref}
      defaultValue={props.value === undefined ? defaultValue || first : undefined}
      className={cx("w-full min-w-0", className)}
      {...props}
    >
      <TB.List
        aria-label={label}
        data-variant={variant}
        className={cx(
          "mb-5 flex max-w-full flex-wrap",
          variant === "pill"
            ? "w-fit gap-1 rounded-lg bg-surface p-1"
            : "gap-x-5 gap-y-0 border-b border-line",
        )}
      >
        {items.map((i) => (
          <TB.Trigger
            key={i.value}
            value={i.value}
            disabled={i.disabled}
            className={cx(
              "inline-flex min-h-10 items-center gap-2 text-sm font-medium text-muted transition-colors [overflow-wrap:anywhere] hover:text-ink data-[state=active]:text-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0",
              variant === "pill"
                ? "rounded-md px-3.5 py-2 text-start focus-visible:outline-offset-2 data-[state=active]:bg-card data-[state=active]:shadow-xs"
                : "-mb-px border-b-2 border-transparent px-1 py-2.5 text-start focus-visible:rounded-md focus-visible:outline-offset-[-2px] data-[state=active]:border-terracotta",
            )}
          >
            {i.icon && <span aria-hidden="true">{i.icon}</span>}
            {i.label}
          </TB.Trigger>
        ))}
      </TB.List>
      {items.map((i) => (
        <TB.Content
          key={i.value}
          value={i.value}
          className="a-tabs-content min-w-0 rounded-lg [overflow-wrap:anywhere] focus-visible:outline-offset-4"
        >
          {i.content}
        </TB.Content>
      ))}
    </TB.Root>
  );
});
export type AccordionItem = {
  /** Defaults to the item index as a string. */
  value?: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};
type AccordionShared = {
  items: AccordionItem[];
  className?: string;
  dir?: "ltr" | "rtl";
  /** Heading level of each header; 3 by default. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};
type AccordionSingle = {
  type?: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Allow the open item to close again; true by default. */
  collapsible?: boolean;
};
type AccordionMultiple = {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};
export type AccordionProps = AccordionShared & (AccordionSingle | AccordionMultiple);
/**
 * Headers are buttons inside headings: Enter and Space toggle, ArrowUp/ArrowDown, Home and End move between headers,
 * disabled items are skipped. Single mode keeps one item open (collapsible by default); multiple mode keeps any number open.
 */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { items, className, dir, headingLevel = 3, ...mode },
  ref,
) {
  const Heading = ("h" + headingLevel) as "h3";
  const rootProps =
    mode.type === "multiple"
      ? { type: "multiple" as const, value: mode.value, defaultValue: mode.defaultValue, onValueChange: mode.onValueChange }
      : { type: "single" as const, value: mode.value, defaultValue: mode.defaultValue, onValueChange: mode.onValueChange, collapsible: mode.collapsible ?? true };
  return (
    <AC.Root ref={ref} dir={dir} className={cx("w-full min-w-0 border-t border-line", className)} {...rootProps}>
      {items.map((i, n) => (
        <AC.Item key={i.value ?? n} value={i.value ?? String(n)} disabled={i.disabled} className="border-b border-line">
          <AC.Header asChild>
            <Heading className="m-0 text-[length:inherit] font-normal">
              <AC.Trigger className="a-accordion-trigger flex min-h-11 w-full items-center justify-between gap-4 rounded-md py-4 text-start text-[0.9375rem] font-medium leading-snug text-ink transition-colors [overflow-wrap:anywhere] hover:text-terracotta focus-visible:outline-offset-[-2px] disabled:pointer-events-none disabled:opacity-40 data-[state=open]:text-ink">
                <span className="min-w-0 flex-1">{i.title}</span>
                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted" />
              </AC.Trigger>
            </Heading>
          </AC.Header>
          <AC.Content className="a-accordion-content text-sm leading-relaxed text-muted [overflow-wrap:anywhere]">
            <div className="pb-5 pe-8">{i.content}</div>
          </AC.Content>
        </AC.Item>
      ))}
    </AC.Root>
  );
});
export type CollapsibleProps = Omit<
  React.ComponentPropsWithoutRef<typeof CO.Root>,
  "title"
> & {
  /** Label of the trigger and accessible name of the revealed region. */
  title: React.ReactNode;
  /** Short line under the trigger label, linked through aria-describedby. */
  description?: React.ReactNode;
  children: React.ReactNode;
  /** Visual weight of the trigger; outline by default. */
  tone?: "outline" | "quiet";
};
/** Returns focus to the target when the content unmounts while focus was inside it. */
function FocusReturn({
  inside,
  target,
}: {
  inside: React.RefObject<boolean>;
  target: React.RefObject<HTMLElement | null>;
}) {
  React.useLayoutEffect(
    () => () => {
      if (inside.current) target.current?.focus({ preventScroll: true });
    },
    [inside, target],
  );
  return null;
}
/**
 * A single disclosure. The trigger is a button with aria-expanded and aria-controls; the content is a named region.
 * When the content closes while focus is inside it, focus returns to the trigger.
 */
export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  { title, description, children, tone = "outline", className, onOpenChange, ...props },
  ref,
) {
  const id = React.useId();
  const trigger = React.useRef<HTMLButtonElement>(null);
  const content = React.useRef<HTMLDivElement>(null);
  const focusInside = React.useRef(false);
  return (
    <CO.Root ref={ref} className={cx("w-full min-w-0", className)} onOpenChange={onOpenChange} {...props}>
      <div className="flex flex-col items-start gap-1.5">
        <CO.Trigger asChild>
          <Button
            ref={trigger}
            id={id + "-trigger"}
            tone={tone}
            aria-describedby={description ? id + "-description" : undefined}
            aria-controls={id + "-content"}
            className="a-collapsible-trigger max-w-full justify-start text-start [&_svg]:transition-[rotate] [&_svg]:duration-[var(--motion-normal)] data-[state=open]:[&_svg]:rotate-90"
          >
            <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted" />
            <span className="min-w-0 [overflow-wrap:anywhere]">{title}</span>
          </Button>
        </CO.Trigger>
        {description && (
          <p id={id + "-description"} className="ps-1 text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      <CO.Content
        ref={content}
        id={id + "-content"}
        role="region"
        aria-labelledby={id + "-trigger"}
        onFocusCapture={() => {
          focusInside.current = true;
        }}
        onBlurCapture={(event) => {
          if (!content.current?.contains(event.relatedTarget as Node | null)) focusInside.current = false;
        }}
        className="a-collapsible mt-3 min-w-0 rounded-lg border border-line bg-surface/60 p-4 text-sm leading-relaxed text-ink [overflow-wrap:anywhere]"
      >
        <FocusReturn inside={focusInside} target={trigger} />
        {children}
      </CO.Content>
    </CO.Root>
  );
});
export type MenuOption = {
  type?: "item";
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  /** Marks a destructive action. */
  danger?: boolean;
  /** Leading icon, rendered aria-hidden. */
  icon?: React.ReactNode;
  /** Keyboard hint shown at the end of the row; the row itself does not bind the key. */
  shortcut?: string;
  /** Second, muted line under the label. */
  description?: string;
};
export type MenuEntry =
  | MenuOption
  | { type: "separator" }
  | { type: "group"; label: string; items: MenuEntry[] }
  | { type: "submenu"; label: string; items: MenuEntry[]; icon?: React.ReactNode; disabled?: boolean }
  | { type: "checkbox"; label: string; checked: boolean; onCheckedChange: (checked: boolean) => void; disabled?: boolean; icon?: React.ReactNode; shortcut?: string };
const menuItemClass =
  "group/item relative flex min-h-10 cursor-default select-none items-center gap-3 rounded-md px-3 py-2 text-sm leading-snug text-ink outline-none transition-colors [overflow-wrap:anywhere] data-[highlighted]:bg-surface data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[danger=true]:text-danger data-[danger=true]:data-[highlighted]:bg-danger/10 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted data-[danger=true]:[&_svg]:text-danger";
export const menuContentClass =
  "a-popup a-scrollbar min-w-48 max-w-[min(20rem,calc(100vw-24px))] p-1.5";
const menuSeparatorClass = "-mx-1.5 my-1.5 h-px bg-line";
const menuLabelClass = "px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted";
/** The subset of a Radix menu namespace the shared renderer needs; DropdownMenu, ContextMenu and Menubar all provide it. */
type MenuKit = {
  Item: React.ElementType;
  CheckboxItem: React.ElementType;
  ItemIndicator: React.ElementType;
  Separator: React.ElementType;
  Group: React.ElementType;
  Label: React.ElementType;
  Sub: React.ElementType;
  SubTrigger: React.ElementType;
  SubContent: React.ElementType;
  Portal: React.ElementType;
};
function MenuRow({ icon, label, description, shortcut }: { icon?: React.ReactNode; label: string; description?: string; shortcut?: string }) {
  return (
    <>
      {icon && <span aria-hidden="true" className="flex shrink-0">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-muted">{description}</span>}
      </span>
      {shortcut && (
        <span aria-hidden="true" className="ms-4 shrink-0 text-xs tracking-wide text-muted">
          {shortcut}
        </span>
      )}
    </>
  );
}
function renderMenuEntries(M: MenuKit, entries: MenuEntry[], prefix = ""): React.ReactNode {
  return entries.map((entry, n) => {
    const key = prefix + n;
    if (entry.type === "separator") return <M.Separator key={key} className={menuSeparatorClass} />;
    if (entry.type === "group") {
      const id = key + "-label";
      return (
        <M.Group key={key} aria-labelledby={id}>
          <M.Label id={id} className={menuLabelClass}>{entry.label}</M.Label>
          {renderMenuEntries(M, entry.items, key + ".")}
        </M.Group>
      );
    }
    if (entry.type === "submenu")
      return (
        <M.Sub key={key}>
          <M.SubTrigger disabled={entry.disabled} className={menuItemClass + " data-[state=open]:bg-surface"}>
            <MenuRow icon={entry.icon} label={entry.label} />
            <ChevronRight aria-hidden="true" className="ms-auto" />
          </M.SubTrigger>
          <M.Portal>
            <M.SubContent className={menuContentClass} sideOffset={6} alignOffset={-6} collisionPadding={12}>
              {renderMenuEntries(M, entry.items, key + ".")}
            </M.SubContent>
          </M.Portal>
        </M.Sub>
      );
    if (entry.type === "checkbox")
      return (
        <M.CheckboxItem key={key} checked={entry.checked} onCheckedChange={entry.onCheckedChange} disabled={entry.disabled} className={menuItemClass + " ps-9"}>
          <span className="absolute start-3 flex size-4 items-center justify-center">
            <M.ItemIndicator>
              <Check aria-hidden="true" className="!text-ink" />
            </M.ItemIndicator>
          </span>
          <MenuRow icon={entry.icon} label={entry.label} shortcut={entry.shortcut} />
        </M.CheckboxItem>
      );
    return (
      <M.Item key={key} disabled={entry.disabled} onSelect={entry.onSelect} data-danger={entry.danger ? "true" : undefined} className={menuItemClass}>
        <MenuRow icon={entry.icon} label={entry.label} description={entry.description} shortcut={entry.shortcut} />
      </M.Item>
    );
  });
}
export type DropdownMenuProps = Omit<React.ComponentPropsWithoutRef<typeof DM.Root>, "children"> & {
  trigger: React.ReactElement;
  items: MenuEntry[];
  /** Accessible name of the menu. */
  label?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
};
/**
 * Actions behind a trigger. Arrow keys move between items and skip disabled ones, ArrowRight opens a submenu,
 * Enter and Space select, Escape closes and focus returns to the trigger. Items may carry icons, shortcut hints,
 * descriptions and a danger tone; entries may be separators, labelled groups, submenus or checkbox items.
 */
export function DropdownMenu({ trigger, items, label, align = "start", side = "bottom", ...props }: DropdownMenuProps) {
  return (
    <DM.Root {...props}>
      <DM.Trigger asChild>{trigger}</DM.Trigger>
      <DM.Portal>
        <DM.Content {...(label ? { "aria-label": label, "aria-labelledby": undefined } : {})} align={align} side={side} sideOffset={6} collisionPadding={12} className={menuContentClass}>
          {renderMenuEntries(DM, items)}
        </DM.Content>
      </DM.Portal>
    </DM.Root>
  );
}
const menuClass = menuItemClass;
export function ContextMenu({
  children,
  items,
}: {
  children: React.ReactNode;
  items: MenuOption[];
}) {
  return (
    <CM.Root>
      <CM.Trigger className="block">{children}</CM.Trigger>
      <CM.Portal>
        <CM.Content className="a-popup min-w-44">
          {items.map((i) => (
            <CM.Item
              key={i.label}
              disabled={i.disabled}
              onSelect={i.onSelect}
              className={menuClass}
            >
              {i.label}
            </CM.Item>
          ))}
        </CM.Content>
      </CM.Portal>
    </CM.Root>
  );
}
export function Menubar({
  menus,
}: {
  menus: { label: string; items: MenuOption[] }[];
}) {
  return (
    <MB.Root className="flex rounded-lg border border-line p-1">
      {menus.map((m) => (
        <MB.Menu key={m.label}>
          <MB.Trigger className="rounded px-3 py-2 text-sm data-[state=open]:bg-surface">
            {m.label}
          </MB.Trigger>
          <MB.Portal>
            <MB.Content className="a-popup min-w-44">
              {m.items.map((i) => (
                <MB.Item
                  key={i.label}
                  disabled={i.disabled}
                  onSelect={i.onSelect}
                  className={menuClass}
                >
                  {i.label}
                </MB.Item>
              ))}
            </MB.Content>
          </MB.Portal>
        </MB.Menu>
      ))}
    </MB.Root>
  );
}
export function NavigationMenu({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <NM.Root aria-label="Main navigation">
      <NM.List className="flex flex-wrap gap-5">
        {items.map((i) => (
          <NM.Item key={i.href}>
            <NM.Link
              href={i.href}
              className="text-sm underline-offset-4 hover:underline"
            >
              {i.label}
            </NM.Link>
          </NM.Item>
        ))}
      </NM.List>
    </NM.Root>
  );
}
export type BreadcrumbItem = {
  label: React.ReactNode;
  /** Destination of an ancestor. The last item is the current page whether or not it links to itself. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};
export type BreadcrumbProps = Omit<React.ComponentPropsWithoutRef<"nav">, "children"> & {
  items: BreadcrumbItem[];
  /** Accessible name of the navigation landmark. */
  label?: string;
  /** Rendered aria-hidden between items; a chevron by default. */
  separator?: React.ReactNode;
  /** Trails longer than this collapse their middle behind a control that reveals every ancestor. 0 disables collapsing. */
  maxItems?: number;
};
/**
 * Ordered navigation: ancestors are links, the last item is the current page (aria-current, as a link when it has an href). Long trails keep the first item and the
 * last two visible and fold the rest behind a "Show hidden pages" button that moves focus to the first revealed link.
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, label = "Breadcrumb", separator, maxItems = 4, className, ...props },
  ref,
) {
  const [expanded, setExpanded] = React.useState(false);
  const list = React.useRef<HTMLOListElement>(null);
  const pendingFocus = React.useRef(false);
  React.useEffect(() => {
    if (!expanded || !pendingFocus.current) return;
    pendingFocus.current = false;
    const links = list.current ? Array.from(list.current.querySelectorAll("a")) : [];
    links[1]?.focus();
  }, [expanded]);
  const hidden = maxItems > 0 && !expanded && items.length > maxItems ? items.length - maxItems + 1 : 0;
  const visible = hidden
    ? [items[0], { label: "", href: undefined, collapsed: true } as BreadcrumbItem & { collapsed: true }, ...items.slice(1 + hidden)]
    : items;
  const mark = <span aria-hidden="true" className="flex shrink-0 items-center text-muted/70 [&_svg]:size-3.5">{separator ?? <ChevronRight strokeWidth={1.75} />}</span>;
  return (
    <nav ref={ref} aria-label={label} className={cx("min-w-0 max-w-full", className)} {...props}>
      <ol ref={list} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {visible.map((i, n) => {
          const current = n === visible.length - 1;
          const collapsed = "collapsed" in i;
          return (
            <li key={n} className="flex min-w-0 items-center gap-2">
              {n > 0 && mark}
              {collapsed ? (
                <button
                  type="button"
                  aria-label={"Show " + hidden + " hidden pages"}
                  onClick={() => {
                    pendingFocus.current = true;
                    setExpanded(true);
                  }}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-2 text-muted transition-colors hover:bg-surface hover:text-ink sm:min-h-8 sm:min-w-8"
                >
                  <Ellipsis aria-hidden="true" className="size-4" />
                </button>
              ) : i.href ? (
                <a
                  href={i.href}
                  onClick={i.onClick}
                  aria-current={current ? "page" : undefined}
                  className={cx(
                    "inline-flex min-h-11 items-center rounded-sm underline-offset-4 transition-colors [overflow-wrap:anywhere] hover:text-ink hover:underline sm:min-h-8",
                    current ? "font-medium text-ink" : "text-muted",
                  )}
                >
                  {i.label}
                </a>
              ) : (
                <span aria-current={current ? "page" : undefined} className="inline-flex min-h-11 items-center font-medium text-ink [overflow-wrap:anywhere] sm:min-h-8">
                  {i.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
export type PaginationProps = Omit<React.ComponentPropsWithoutRef<"nav">, "onChange"> & {
  /** Current page, 1-based. Values outside 1..total are clamped. */
  page: number;
  /** Number of pages; 0 renders an empty state with both controls disabled. */
  total: number;
  onChange: (page: number) => void;
  /** Accessible name of the navigation landmark. */
  label?: string;
  /** Numbered pages shown on each side of the current one; 1 by default. */
  siblings?: number;
  /** Visible text of the previous and next controls; the accessible name follows it. */
  previousLabel?: string;
  nextLabel?: string;
};
function pageRange(page: number, total: number, siblings: number): (number | "gap")[] {
  if (total <= 0) return [];
  const window = 2 * siblings + 3;
  if (total <= window + 2) return Array.from({ length: total }, (_, n) => n + 1);
  const start = Math.max(2, Math.min(page - siblings, total - window + 2));
  const end = Math.min(total - 1, start + window - 3);
  const middle = Array.from({ length: end - start + 1 }, (_, n) => start + n);
  return [1, ...(start > 2 ? ["gap" as const] : []), ...middle, ...(end < total - 1 ? ["gap" as const] : []), total];
}
/**
 * Previous and next controls with the current position. Numbered pages appear from the sm breakpoint with the first,
 * last and neighbouring pages always visible; narrower viewports show "Page x of y" instead. A live status announces
 * the position to assistive technology.
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, total, onChange, label = "Pagination", siblings = 1, previousLabel = "Previous", nextLabel = "Next", className, ...props },
  ref,
) {
  const count = Math.max(0, Math.floor(total));
  const current = count ? Math.min(Math.max(1, Math.floor(page)), count) : 0;
  const position = count ? "Page " + current + " of " + count : "No pages";
  const previousName = previousLabel === "Previous" ? "Previous page" : previousLabel;
  const nextName = nextLabel === "Next" ? "Next page" : nextLabel;
  return (
    <nav ref={ref} aria-label={label} className={cx("flex min-w-0 max-w-full flex-wrap items-center gap-2", className)} {...props}>
      <Button
        tone="outline"
        size="sm"
        aria-label={previousName}
        disabled={current <= 1}
        onClick={() => onChange(current - 1)}
        className="min-w-11 px-2.5 sm:px-3"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline">{previousLabel}</span>
      </Button>
      <ul className="hidden items-center gap-1 sm:flex" aria-hidden={count === 0 ? true : undefined}>
        {pageRange(current, count, Math.max(0, siblings)).map((entry, n) =>
          entry === "gap" ? (
            <li key={"gap" + n} aria-hidden="true" className="flex min-w-6 items-center justify-center text-sm text-muted">
              …
            </li>
          ) : (
            <li key={entry}>
              <button
                type="button"
                aria-label={"Page " + entry}
                aria-current={entry === current ? "page" : undefined}
                onClick={() => entry !== current && onChange(entry)}
                className={cx(
                  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 text-sm tabular-nums transition-colors sm:min-h-9 sm:min-w-9",
                  entry === current ? "bg-ink font-medium text-paper" : "text-ink hover:bg-surface",
                )}
              >
                {entry}
              </button>
            </li>
          ),
        )}
      </ul>
      <span aria-hidden="true" className="px-1 text-sm tabular-nums text-muted sm:hidden">
        {position}
      </span>
      <Button
        tone="outline"
        size="sm"
        aria-label={nextName}
        disabled={current === 0 || current >= count}
        onClick={() => onChange(current + 1)}
        className="min-w-11 px-2.5 sm:px-3"
      >
        <span className="hidden sm:inline">{nextLabel}</span>
        <ChevronRight aria-hidden="true" className="size-4" />
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {position}
      </span>
    </nav>
  );
});
export function ScrollArea({
  children,
  className = "h-44",
  label = "Scrollable content",
  fade = false,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
  fade?: boolean;
}) {
  const { ref, edges } = useScrollFade({ enabled: fade });
  return (
    <SA.Root type="auto" data-fade-top={edges.top} data-fade-bottom={edges.bottom} className={"a-scroll-area relative overflow-hidden " + className}>
      <SA.Viewport ref={ref} role="region" aria-label={label} tabIndex={0} className="size-full rounded-[inherit] focus-visible:outline-offset-[-2px]">
        {children}
      </SA.Viewport>
      <ScrollFade edges={edges} depth="min(48px, 12%)" style={{ insetInlineEnd: 14 }} />
      <SA.Scrollbar orientation="vertical" className="a-scroll-track">
        <SA.Thumb className="a-scroll-thumb" />
      </SA.Scrollbar>
    </SA.Root>
  );
}
export function Sidebar({
  items,
  children,
}: {
  items: { label: string; href: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-60 gap-6 sm:grid-cols-[160px_1fr]">
      <aside className="border-b border-line pb-4 sm:border-b-0 sm:border-e sm:pe-4">
        <NavigationMenu items={items} />
      </aside>
      <div>{children}</div>
    </div>
  );
}
export function Command({
  items,
}: {
  items: { label: string; onSelect: () => void }[];
}) {
  const [open, setOpen] = React.useState(false),
    [q, setQ] = React.useState("");
  const input = React.useRef<HTMLInputElement>(null);
  const [active, setActive] = React.useState(0);
  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button tone="outline">
          <Search className="size-4" />
          Search commands
        </Button>
      }
      title="Commands"
      description="Search and run a command."
    >
      <input
        ref={input}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
        }}
        aria-label="Search commands"
        role="combobox"
        aria-expanded="true"
        aria-controls="a-command-list"
        aria-activedescendant={
          filtered.length ? "a-command-" + active : undefined
        }
        className="a-input"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, filtered.length - 1));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          }
          if (e.key === "Enter" && filtered[active]) {
            filtered[active].onSelect();
            setOpen(false);
          }
        }}
      />
      <ul
        id="a-command-list"
        role="listbox"
        aria-label="Commands"
        className="mt-3"
      >
        {filtered.map((i, n) => (
          <li
            role="option"
            aria-selected={n === active}
            id={"a-command-" + n}
            key={i.label}
            className={
              "cursor-pointer rounded p-3 text-sm " +
              (n === active ? "bg-surface" : "")
            }
            onClick={() => {
              i.onSelect();
              setOpen(false);
            }}
          >
            {i.label}
          </li>
        ))}
      </ul>
      {!filtered.length && (
        <p role="status" className="p-3 text-sm text-muted">
          No commands found.
        </p>
      )}
    </Modal>
  );
}
