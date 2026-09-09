import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContextMenu, type MenuEntry } from "../packages/ui/src/navigation";

function entries(onSelect: (label: string) => void): MenuEntry[] {
  return [
    { label: "Open", onSelect: () => onSelect("Open") },
    { label: "Rename", onSelect: () => onSelect("Rename"), disabled: true },
    { type: "separator" },
    { type: "group", label: "Share", items: [{ label: "Copy link", onSelect: () => onSelect("Copy link") }] },
    { label: "Delete", onSelect: () => onSelect("Delete"), danger: true },
  ];
}

test("the context-menu event opens a named menu, arrow keys skip disabled items, Enter selects and focus returns to the target", async () => {
  const onSelect = vi.fn();
  render(
    <ContextMenu label="File actions" items={entries(onSelect)}>
      <div tabIndex={0}>Letter from Ortigia</div>
    </ContextMenu>,
  );
  const target = screen.getByText("Letter from Ortigia");
  target.focus();
  fireEvent.contextMenu(target, { clientX: 20, clientY: 20 });
  const menu = await screen.findByRole("menu", { name: "File actions" });
  expect(menu).toBeInTheDocument();
  await userEvent.keyboard("{ArrowDown}");
  expect(screen.getByRole("menuitem", { name: "Open" })).toHaveFocus();
  await userEvent.keyboard("{ArrowDown}");
  expect(screen.getByRole("menuitem", { name: "Copy link" })).toHaveFocus();
  expect(screen.getByRole("group", { name: "Share" })).toBeInTheDocument();
  expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveAttribute("data-danger", "true");
  await userEvent.keyboard("{Enter}");
  expect(onSelect).toHaveBeenLastCalledWith("Copy link");
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(target).toHaveFocus();
});

test("Escape closes without selecting and a disabled target does not open", async () => {
  const onSelect = vi.fn();
  const { rerender } = render(
    <ContextMenu items={entries(onSelect)}>
      <div tabIndex={0}>Target</div>
    </ContextMenu>,
  );
  fireEvent.contextMenu(screen.getByText("Target"));
  expect(await screen.findByRole("menu")).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(onSelect).not.toHaveBeenCalled();
  rerender(
    <ContextMenu items={entries(onSelect)} disabled>
      <div tabIndex={0}>Target</div>
    </ContextMenu>,
  );
  fireEvent.contextMenu(screen.getByText("Target"));
  await new Promise((resolve) => setTimeout(resolve, 20));
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
});

test("the optional button offers the same entries without a right click", async () => {
  const onSelect = vi.fn();
  render(
    <ContextMenu label="File actions" items={entries(onSelect)} buttonLabel="Actions for the letter">
      <div>Letter</div>
    </ContextMenu>,
  );
  const button = screen.getByRole("button", { name: "Actions for the letter" });
  expect(button).toHaveAttribute("aria-haspopup", "menu");
  fireEvent(button, new MouseEvent("pointerdown", { bubbles: true, button: 0 }));
  const menu = await screen.findByRole("menu", { name: "File actions" });
  expect(menu).toBeInTheDocument();
  await userEvent.keyboard("{ArrowDown}{Enter}");
  expect(onSelect).toHaveBeenLastCalledWith("Open");
  expect(button).toHaveFocus();
});
