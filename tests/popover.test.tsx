import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from "../packages/ui/src/overlays";

test("opens from the trigger, is named, and Escape closes it and returns focus", async () => {
  render(
    <Popover trigger={<button>Quick settings</button>} label="Quick settings">
      <p>Controls</p>
    </Popover>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Quick settings" }));
  const dialog = screen.getByRole("dialog", { name: "Quick settings" });
  expect(dialog).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Quick settings" })).toHaveAttribute("aria-expanded", "true");
  await userEvent.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(screen.getByRole("button", { name: "Quick settings" })).toHaveFocus();
});

test("a title and description name and describe the surface, and the close control is named", async () => {
  render(
    <Popover
      trigger={<button>Share</button>}
      title="Share this board"
      description="Anyone with the link can view."
    >
      <input aria-label="Link" defaultValue="https://example.test" />
    </Popover>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Share" }));
  const dialog = screen.getByRole("dialog", { name: "Share this board" });
  expect(dialog).toHaveAccessibleDescription("Anyone with the link can view.");
  expect(screen.getByRole("textbox", { name: "Link" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Close" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(screen.getByRole("button", { name: "Share" })).toHaveFocus();
});

test("an outside press closes the surface and controlled open reports changes", async () => {
  const onOpenChange = vi.fn();
  render(
    <div>
      <p>Outside text</p>
      <Popover trigger={<button>Filters</button>} label="Filters" defaultOpen onOpenChange={onOpenChange}>
        <p>Filter controls</p>
      </Popover>
    </div>,
  );
  expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();
  await userEvent.click(screen.getByText("Outside text"));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
});

test("controlled open renders without a trigger and Tab moves through the popover controls", async () => {
  const { rerender } = render(
    <Popover open label="Editor" onOpenChange={() => {}}>
      <button>First</button>
      <button>Second</button>
    </Popover>,
  );
  expect(screen.getByRole("dialog", { name: "Editor" })).toBeInTheDocument();
  screen.getByRole("button", { name: "First" }).focus();
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
  rerender(
    <Popover open={false} label="Editor" onOpenChange={() => {}}>
      <button>First</button>
    </Popover>,
  );
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});
