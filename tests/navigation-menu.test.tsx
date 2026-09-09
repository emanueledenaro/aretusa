import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavigationMenu, type NavigationMenuItem } from "../packages/ui/src/navigation";

const items: NavigationMenuItem[] = [
  { label: "Prints", href: "#/prints", active: true },
  {
    label: "Archive",
    items: [
      { label: "Letters", href: "#/archive/letters", description: "Forty-two letters, transcribed." },
      { label: "Maps", href: "#/archive/maps" },
    ],
  },
  { label: "About", href: "#/about" },
];

test("links keep their semantics, the active one is current and the landmark is named", () => {
  render(<NavigationMenu label="Site" items={items} />);
  expect(screen.getByRole("navigation", { name: "Site" })).toBeInTheDocument();
  const prints = screen.getByRole("link", { name: "Prints" });
  expect(prints).toHaveAttribute("href", "#/prints");
  expect(prints).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
  expect(screen.queryByRole("link", { name: /Letters/ })).not.toBeInTheDocument();
});

test("a grouped entry opens on click, exposes its links and closes on Escape with focus back on the trigger", async () => {
  render(<NavigationMenu items={items} />);
  const trigger = screen.getByRole("button", { name: "Archive" });
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(trigger);
  const letters = await screen.findByRole("link", { name: /Letters/ });
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(letters).toHaveAttribute("href", "#/archive/letters");
  expect(letters).toHaveTextContent("Forty-two letters, transcribed.");
  expect(screen.getByRole("link", { name: "Maps" })).toBeInTheDocument();
  trigger.focus();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("link", { name: /Letters/ })).not.toBeInTheDocument();
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(trigger).toHaveFocus();
});

test("onClick reaches the caller and a controlled value follows it", async () => {
  const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
  const onValueChange = vi.fn();
  render(<NavigationMenu items={[{ label: "Prints", href: "#/prints", onClick }, ...items.slice(1)]} value="Archive" onValueChange={onValueChange} />);
  expect(await screen.findByRole("link", { name: "Maps" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("link", { name: "Prints" }));
  expect(onClick).toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Archive" }));
  expect(onValueChange).toHaveBeenLastCalledWith("");
});
