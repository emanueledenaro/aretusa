import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Menubar, type MenuEntry } from "../packages/ui/src/navigation";

function menus(onSelect: (label: string) => void) {
  const file: MenuEntry[] = [
    { label: "New letter", onSelect: () => onSelect("New letter"), shortcut: "⌘N" },
    { label: "Open recent", onSelect: () => onSelect("Open recent"), disabled: true },
    { type: "separator" },
    { label: "Close", onSelect: () => onSelect("Close") },
  ];
  const edit: MenuEntry[] = [
    { label: "Undo", onSelect: () => onSelect("Undo") },
    { type: "checkbox", label: "Spelling", checked: true, onCheckedChange: () => onSelect("Spelling") },
  ];
  return [
    { label: "File", items: file },
    { label: "Edit", items: edit },
    { label: "Print", items: [{ label: "Print", onSelect: () => onSelect("Print") }], disabled: true },
  ];
}

test("triggers form a named menubar, ArrowDown opens the first menu, arrow keys skip disabled items and Enter selects", async () => {
  const onSelect = vi.fn();
  render(<Menubar label="Editor" menus={menus(onSelect)} />);
  expect(screen.getByRole("menubar", { name: "Editor" })).toBeInTheDocument();
  const file = screen.getByRole("menuitem", { name: "File" });
  expect(screen.getByRole("menuitem", { name: "Print" })).toHaveAttribute("data-disabled");
  file.focus();
  await userEvent.keyboard("{ArrowDown}");
  const menu = await screen.findByRole("menu", { name: "File" });
  expect(menu).toBeInTheDocument();
  expect(file).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("menuitem", { name: /New letter/ })).toHaveFocus();
  await userEvent.keyboard("{ArrowDown}");
  expect(screen.getByRole("menuitem", { name: "Close" })).toHaveFocus();
  await userEvent.keyboard("{Enter}");
  expect(onSelect).toHaveBeenLastCalledWith("Close");
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(file).toHaveFocus();
});

test("ArrowRight moves to the next menu while one is open, Escape closes and keeps focus on the trigger", async () => {
  const onSelect = vi.fn();
  render(<Menubar menus={menus(onSelect)} />);
  const file = screen.getByRole("menuitem", { name: "File" });
  fireEvent(file, new MouseEvent("pointerdown", { bubbles: true, button: 0 }));
  await screen.findByRole("menu", { name: "File" });
  await userEvent.keyboard("{ArrowRight}");
  expect(await screen.findByRole("menu", { name: "Edit" })).toBeInTheDocument();
  expect(screen.getByRole("menuitemcheckbox", { name: "Spelling" })).toHaveAttribute("aria-checked", "true");
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
  expect(onSelect).not.toHaveBeenCalled();
});

test("a controlled value follows the caller", async () => {
  const onValueChange = vi.fn();
  function Controlled() {
    const [value, setValue] = React.useState("");
    return (
      <>
        <Menubar menus={menus(() => {})} value={value} onValueChange={(next) => { onValueChange(next); setValue(next); }} />
        <button onClick={() => setValue("Edit")}>Open Edit</button>
      </>
    );
  }
  render(<Controlled />);
  fireEvent.click(screen.getByRole("button", { name: "Open Edit" }));
  expect(await screen.findByRole("menu", { name: "Edit" })).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(onValueChange).toHaveBeenLastCalledWith("");
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
});
