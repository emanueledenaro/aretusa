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
export function Tabs({
  items,
  defaultValue,
}: {
  items: { value: string; label: string; content: React.ReactNode }[];
  defaultValue?: string;
}) {
  return (
    <TB.Root defaultValue={defaultValue || items[0]?.value}>
      <TB.List
        aria-label="Sections"
        className="mb-5 flex flex-wrap gap-1 rounded-lg bg-surface p-1"
      >
        {items.map((i) => (
          <TB.Trigger
            key={i.value}
            value={i.value}
            className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-card"
          >
            {i.label}
          </TB.Trigger>
        ))}
      </TB.List>
      {items.map((i) => (
        <TB.Content key={i.value} value={i.value} className="a-tabs-content">
          {i.content}
        </TB.Content>
      ))}
    </TB.Root>
  );
}
export function Accordion({
  items,
}: {
  items: { title: string; content: React.ReactNode }[];
}) {
  return (
    <AC.Root type="single" collapsible>
      {items.map((i, n) => (
        <AC.Item key={n} value={String(n)} className="border-b border-line">
          <AC.Header>
            <AC.Trigger className="a-accordion-trigger flex w-full items-center justify-between gap-3 py-5 text-start text-sm font-medium">
              {i.title}
              <ChevronRight className="size-4 shrink-0" />
            </AC.Trigger>
          </AC.Header>
          <AC.Content className="a-accordion-content text-sm leading-relaxed text-muted">
            <div className="pb-5">{i.content}</div>
          </AC.Content>
        </AC.Item>
      ))}
    </AC.Root>
  );
}
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
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SA.Root className={"relative overflow-hidden " + className}>
      <SA.Viewport className="size-full rounded-inherit">
        {children}
      </SA.Viewport>
      <SA.Scrollbar orientation="vertical" className="w-2 bg-surface p-0.5">
        <SA.Thumb className="rounded-full bg-muted/50" />
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
