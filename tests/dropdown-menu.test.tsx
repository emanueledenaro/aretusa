import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DropdownMenu, type MenuEntry } from "../packages/ui/src/navigation";

// jsdom has no PointerEvent; Radix triggers open on a primary-button pointerdown, so dispatch one directly.
const open = (element: HTMLElement) => fireEvent(element, new MouseEvent("pointerdown", { bubbles: true, button: 0 }));

function entries(onSelect: (label: string) => void): MenuEntry[] {
  return [
    { label: "Rename", onSelect: () => onSelect("Rename"), shortcut: "⌘R" },
    { label: "Duplicate", onSelect: () => onSelect("Duplicate") },
    { label: "Archived copy", onSelect: () => onSelect("Archived"), disabled: true },
    { type: "separator" },
    {
      type: "submenu",
      label: "Move to",
      items: [
        { label: "Prints", onSelect: () => onSelect("Prints") },
        { label: "Maps", onSelect: () => onSelect("Maps") },
      ],
    },
    { type: "group", label: "View", items: [{ type: "checkbox", label: "Show archived", checked: true, onCheckedChange: () => onSelect("Toggle") }] },
    { type: "separator" },
    { label: "Delete", onSelect: () => onSelect("Delete"), danger: true },
  ];
}

test("opens from the trigger, arrow keys skip disabled items, Enter selects and focus returns to the trigger", async () => {
  const onSelect = vi.fn();
  render(<DropdownMenu label="Project actions" trigger={<button>Actions</button>} items={entries(onSelect)} />);
  const trigger = screen.getByRole("button", { name: "Actions" });
  expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  open(trigger);
  const menu = await screen.findByRole("menu", { name: "Project actions" });
  expect(menu).toBeInTheDocument();
  await userEvent.keyboard("{ArrowDown}");
  expect(screen.getByRole("menuitem", { name: /Rename/ })).toHaveFocus();
  await userEvent.keyboard("{ArrowDown}{ArrowDown}");
  expect(screen.getByRole("menuitem", { name: "Move to" })).toHaveFocus();
  expect(screen.getByRole("menuitem", { name: "Archived copy" })).toHaveAttribute("aria-disabled", "true");
  await userEvent.keyboard("{ArrowUp}");
  expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
  await userEvent.keyboard("{Enter}");
  expect(onSelect).toHaveBeenLastCalledWith("Duplicate");
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test("submenus open with ArrowRight, checkbox items expose their state and the danger item is marked", async () => {
  const onSelect = vi.fn();
  render(<DropdownMenu trigger={<button>Actions</button>} items={entries(onSelect)} />);
  open(screen.getByRole("button", { name: "Actions" }));
  await screen.findByRole("menu");
  const sub = screen.getByRole("menuitem", { name: "Move to" });
  expect(sub).toHaveAttribute("aria-haspopup", "menu");
  sub.focus();
  await userEvent.keyboard("{ArrowRight}");
  expect(await screen.findByRole("menuitem", { name: "Prints" })).toHaveFocus();
  await userEvent.keyboard("{Enter}");
  expect(onSelect).toHaveBeenLastCalledWith("Prints");
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  open(screen.getByRole("button", { name: "Actions" }));
  await screen.findByRole("menu");
  expect(screen.getByRole("menuitemcheckbox", { name: "Show archived" })).toHaveAttribute("aria-checked", "true");
  expect(screen.getByRole("group", { name: "View" })).toBeInTheDocument();
  expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveAttribute("data-danger", "true");
  expect(screen.getByRole("menuitem", { name: /Rename/ })).toHaveTextContent("⌘R");
});

test("Escape closes without selecting and a controlled open state follows the caller", async () => {
  const onOpenChange = vi.fn();
  const onSelect = vi.fn();
  function Controlled() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <DropdownMenu trigger={<button>Actions</button>} items={[{ label: "Rename", onSelect }]} open={open} onOpenChange={(next) => { onOpenChange(next); setOpen(next); }} />
        <button onClick={() => setOpen(true)}>Open from outside</button>
      </>
    );
  }
  render(<Controlled />);
  fireEvent.click(screen.getByRole("button", { name: "Open from outside" }));
  expect(await screen.findByRole("menu")).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(onSelect).not.toHaveBeenCalled();
});
