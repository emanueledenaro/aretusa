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
import { Search, Menu, ChevronRight } from "lucide-react";
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
export function Collapsible({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <CO.Root>
      <CO.Trigger asChild>
        <Button tone="outline">{title}</Button>
      </CO.Trigger>
      <CO.Content className="a-collapsible mt-4 rounded-lg bg-surface p-4 text-sm">
        {children}
      </CO.Content>
    </CO.Root>
  );
}
export type MenuOption = {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
};
const menuClass =
  "cursor-pointer rounded-md px-3 py-2 text-sm outline-none data-[highlighted]:bg-surface data-[disabled]:opacity-40";
export function DropdownMenu({
  trigger,
  items,
}: {
  trigger: React.ReactElement;
  items: MenuOption[];
}) {
  return (
    <DM.Root>
      <DM.Trigger asChild>{trigger}</DM.Trigger>
      <DM.Portal>
        <DM.Content className="a-popup min-w-44" sideOffset={6}>
          {items.map((i) => (
            <DM.Item
              key={i.label}
              disabled={i.disabled}
              onSelect={i.onSelect}
              className={menuClass + (i.danger ? " text-danger" : "")}
            >
              {i.label}
            </DM.Item>
          ))}
        </DM.Content>
      </DM.Portal>
    </DM.Root>
  );
}
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
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((i, n) => (
          <li key={n} className="flex items-center gap-2">
            {n > 0 && (
              <ChevronRight aria-hidden className="size-3 text-muted" />
            )}
            {i.href ? (
              <a href={i.href} className="text-muted hover:underline">
                {i.label}
              </a>
            ) : (
              <span aria-current="page">{i.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  return (
    <nav aria-label="Pagination" className="flex items-center gap-3">
      <Button
        tone="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm" aria-live="polite">
        Page {page} of {total}
      </span>
      <Button
        tone="outline"
        size="sm"
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
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
