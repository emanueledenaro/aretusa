import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip, TooltipProvider } from "../packages/ui/src/overlays";

test("keyboard focus shows the tooltip, describes the trigger and Escape hides it", async () => {
  render(
    <Tooltip content="Add to favorites">
      <button>Favorite</button>
    </Tooltip>,
  );
  const trigger = screen.getByRole("button", { name: "Favorite" });
  await userEvent.tab();
  expect(trigger).toHaveFocus();
  const tooltip = await screen.findByRole("tooltip");
  expect(tooltip).toHaveTextContent("Add to favorites");
  expect(trigger).toHaveAccessibleDescription("Add to favorites");
  await userEvent.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  expect(trigger).toHaveFocus();
});

test("hover opens after the delay and leaving closes it", async () => {
  const onOpenChange = vi.fn();
  render(
    <Tooltip content="Save this project" delay={0} onOpenChange={onOpenChange}>
      <button>Save</button>
    </Tooltip>,
  );
  await userEvent.hover(screen.getByRole("button", { name: "Save" }));
  expect(await screen.findByRole("tooltip")).toHaveTextContent("Save this project");
  expect(onOpenChange).toHaveBeenLastCalledWith(true);
  await userEvent.unhover(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
});

test("a disabled trigger stays reachable through a focusable wrapper that carries the description", async () => {
  render(
    <Tooltip content="Publishing needs a title">
      <button disabled>Publish</button>
    </Tooltip>,
  );
  await userEvent.tab();
  const tooltip = await screen.findByRole("tooltip");
  expect(tooltip).toHaveTextContent("Publishing needs a title");
  const wrapper = screen.getByRole("button", { name: "Publish" }).parentElement as HTMLElement;
  expect(wrapper).toHaveFocus();
  expect(wrapper).toHaveAccessibleDescription("Publishing needs a title");
});

test("controlled open renders rich content and a shared provider keeps one tooltip at a time", async () => {
  const { rerender } = render(
    <TooltipProvider>
      <Tooltip open content={<span>Shortcut <kbd>S</kbd></span>}>
        <button>Search</button>
      </Tooltip>
      <Tooltip content="Second">
        <button>Other</button>
      </Tooltip>
    </TooltipProvider>,
  );
  expect(screen.getByRole("tooltip")).toHaveTextContent("Shortcut S");
  rerender(
    <TooltipProvider>
      <Tooltip open={false} content="Shortcut">
        <button>Search</button>
      </Tooltip>
      <Tooltip content="Second">
        <button>Other</button>
      </Tooltip>
    </TooltipProvider>,
  );
  await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
});
