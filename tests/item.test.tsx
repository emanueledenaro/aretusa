import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Item } from "../packages/ui/src/item";

test("a linked item keeps its trailing action outside the link", async () => {
  const onOpen = vi.fn();
  render(
    <Item
      href="#/notes/field-notes"
      title="Field notes"
      description="Updated today"
      action={<button onClick={onOpen}>Share Field notes</button>}
    />,
  );
  const link = screen.getByRole("link", { name: "Field notes" });
  const share = screen.getByRole("button", { name: "Share Field notes" });
  expect(link).toHaveAttribute("href", "#/notes/field-notes");
  expect(link.contains(share)).toBe(false);
  await userEvent.click(share);
  expect(onOpen).toHaveBeenCalledTimes(1);
});

test("onActivate renders the title as a button and disabled makes it inert", async () => {
  const onActivate = vi.fn();
  const { rerender } = render(<Item title="Quiet interfaces" onActivate={onActivate} />);
  await userEvent.click(screen.getByRole("button", { name: "Quiet interfaces" }));
  expect(onActivate).toHaveBeenCalledTimes(1);
  rerender(<Item title="Quiet interfaces" onActivate={onActivate} disabled />);
  const button = screen.getByRole("button", { name: "Quiet interfaces" });
  expect(button).toBeDisabled();
  await userEvent.click(button);
  expect(onActivate).toHaveBeenCalledTimes(1);
});

test("renders as a list item with ref, attributes, leading, description and meta content", () => {
  const ref = React.createRef<HTMLElement>();
  render(
    <ul>
      <Item
        as="li"
        ref={ref}
        id="row-1"
        title="The salt gardens"
        leading={<span data-testid="avatar">AL</span>}
        description={<span>Photographs from <em>Marsala</em></span>}
        meta="12 files, 48 MB"
      />
    </ul>,
  );
  const row = screen.getByRole("listitem");
  expect(ref.current).toBe(row);
  expect(row).toHaveAttribute("id", "row-1");
  expect(screen.getByTestId("avatar")).toBeInTheDocument();
  expect(screen.getByText("Marsala")).toBeInTheDocument();
  expect(screen.getByText("12 files, 48 MB")).toBeInTheDocument();
  expect(screen.queryByRole("link")).toBeNull();
  expect(screen.queryByRole("button")).toBeNull();
});

test("a selected link reports aria-current", () => {
  render(<Item href="#/a" title="Arrival" selected />);
  expect(screen.getByRole("link", { name: "Arrival" })).toHaveAttribute("aria-current", "true");
});
