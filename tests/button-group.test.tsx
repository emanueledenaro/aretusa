import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, ButtonGroup } from "../packages/ui/src/basic";

test("names the group through label or aria-labelledby and forwards ref, className and attributes", () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <>
      <ButtonGroup ref={ref} label="Formatting" className="mt-2" data-testid="formatting">
        <Button tone="outline">Bold</Button>
      </ButtonGroup>
      <p id="view-label">View</p>
      <ButtonGroup aria-labelledby="view-label">
        <Button tone="outline">Grid</Button>
      </ButtonGroup>
    </>,
  );
  expect(ref.current).toBe(screen.getByRole("group", { name: "Formatting" }));
  expect(screen.getByTestId("formatting")).toHaveClass("mt-2");
  expect(screen.getByRole("group", { name: "View" })).toBeInTheDocument();
});

test("buttons keep their native type, disabled state and handlers inside the group", async () => {
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
  const save = vi.fn();
  const blocked = vi.fn();
  render(
    <form onSubmit={onSubmit}>
      <ButtonGroup label="Actions" attached>
        <Button tone="outline" onClick={save}>Save draft</Button>
        <Button tone="outline" disabled onClick={blocked}>Archive</Button>
        <Button type="submit">Publish</Button>
      </ButtonGroup>
    </form>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Save draft" }));
  await userEvent.click(screen.getByRole("button", { name: "Archive" }));
  await userEvent.click(screen.getByRole("button", { name: "Publish" }));
  expect(save).toHaveBeenCalledOnce();
  expect(blocked).not.toHaveBeenCalled();
  expect(onSubmit).toHaveBeenCalledOnce();
});

test("keyboard order stays the DOM order and skips unavailable actions; layout props are exposed as data", async () => {
  render(
    <ButtonGroup label="Layout" attached orientation="vertical">
      <Button tone="outline">List</Button>
      <Button tone="outline" disabled>Map</Button>
      <Button tone="outline">Grid</Button>
    </ButtonGroup>,
  );
  const group = screen.getByRole("group", { name: "Layout" });
  expect(group).toHaveAttribute("data-orientation", "vertical");
  expect(group).toHaveAttribute("data-attached", "true");
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "List" })).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "Grid" })).toHaveFocus();
});

test("mixed action lengths in a narrow parent keep every action visible", () => {
  render(
    <div style={{ width: 240 }}>
      <ButtonGroup label="Reservation">
        <Button tone="outline">Cancel</Button>
        <Button>Reserve the printing room for Saturday morning</Button>
      </ButtonGroup>
    </div>,
  );
  expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
  expect(screen.getByRole("button", { name: /printing room/ })).toBeVisible();
});
