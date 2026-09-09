import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HoverCard } from "../packages/ui/src/overlays";

test("keyboard focus opens the card and blur closes it, keeping the link usable", async () => {
  render(
    <div>
      <HoverCard trigger={<a href="/aretusa">Aretusa</a>} openDelay={0} closeDelay={0}>
        <p>Original interfaces by TrinacriaLabs.</p>
      </HoverCard>
      <button>Next control</button>
    </div>,
  );
  await userEvent.tab();
  expect(screen.getByRole("link", { name: "Aretusa" })).toHaveFocus();
  expect(await screen.findByText("Original interfaces by TrinacriaLabs.")).toBeInTheDocument();
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "Next control" })).toHaveFocus();
  await waitFor(() => expect(screen.queryByText("Original interfaces by TrinacriaLabs.")).not.toBeInTheDocument());
});

test("hover opens after the delay, leaving closes it and onOpenChange reports both", async () => {
  const onOpenChange = vi.fn();
  render(
    <HoverCard trigger={<a href="/profile">Profile</a>} openDelay={0} closeDelay={0} onOpenChange={onOpenChange}>
      <p>Profile details</p>
    </HoverCard>,
  );
  await userEvent.hover(screen.getByRole("link", { name: "Profile" }));
  expect(await screen.findByText("Profile details")).toBeInTheDocument();
  expect(onOpenChange).toHaveBeenLastCalledWith(true);
  await userEvent.unhover(screen.getByRole("link", { name: "Profile" }));
  await waitFor(() => expect(screen.queryByText("Profile details")).not.toBeInTheDocument());
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
});

test("controlled open shows the card without pointer input and the surface is not a focus trap", async () => {
  const { rerender } = render(
    <HoverCard open trigger={<a href="/studio">Studio</a>}>
      <p>Studio card</p>
    </HoverCard>,
  );
  expect(screen.getByText("Studio card")).toBeInTheDocument();
  await userEvent.tab();
  expect(screen.getByRole("link", { name: "Studio" })).toHaveFocus();
  rerender(
    <HoverCard open={false} trigger={<a href="/studio">Studio</a>}>
      <p>Studio card</p>
    </HoverCard>,
  );
  await waitFor(() => expect(screen.queryByText("Studio card")).not.toBeInTheDocument());
});

test("the trigger keeps its own semantics and the card content is supplementary", async () => {
  render(
    <HoverCard trigger={<button type="button">Alex Rivers</button>} openDelay={0}>
      <p>Alex is a designer at the studio.</p>
    </HoverCard>,
  );
  const trigger = screen.getByRole("button", { name: "Alex Rivers" });
  expect(trigger).toHaveAttribute("type", "button");
  expect(screen.queryByText("Alex is a designer at the studio.")).not.toBeInTheDocument();
  await userEvent.hover(trigger);
  expect(await screen.findByText("Alex is a designer at the studio.")).toBeInTheDocument();
});
