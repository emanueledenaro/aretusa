import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../packages/ui/src/basic";

test("forwards the ref, renders the requested element and heading level and keeps native attributes", () => {
  const ref = React.createRef<HTMLElement>();
  render(
    <Card ref={ref} as="section" aria-labelledby="card-title" data-testid="card" className="max-w-sm">
      <CardHeader>
        <CardTitle as="h2" id="card-title">Open studio</CardTitle>
        <CardDescription>Saturday, 10:00 to 18:00.</CardDescription>
      </CardHeader>
    </Card>,
  );
  expect(ref.current).toBeInstanceOf(HTMLElement);
  expect(ref.current?.tagName).toBe("SECTION");
  expect(screen.getByRole("region", { name: "Open studio" })).toHaveClass("max-w-sm");
  expect(screen.getByRole("heading", { level: 2, name: "Open studio" })).toBeInTheDocument();
});

test("only the explicit actions are click targets; text and surface stay inert", async () => {
  const open = vi.fn();
  const remove = vi.fn();
  render(
    <Card>
      <CardHeader action={<button type="button" onClick={remove}>Remove</button>}>
        <CardTitle>Field notes</CardTitle>
        <CardDescription>Updated today</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Twelve pages of notes from the salt gardens.</p>
      </CardContent>
      <CardFooter align="end">
        <button type="button" onClick={open}>Open</button>
      </CardFooter>
    </Card>,
  );
  await userEvent.click(screen.getByText("Field notes"));
  await userEvent.click(screen.getByText(/salt gardens/));
  expect(open).not.toHaveBeenCalled();
  expect(remove).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  await userEvent.click(screen.getByRole("button", { name: "Remove" }));
  expect(open).toHaveBeenCalledOnce();
  expect(remove).toHaveBeenCalledOnce();
  expect(screen.getByRole("button", { name: "Open" }).parentElement).toHaveAttribute("data-align", "end");
});

test("keyboard order follows the reading order: header action, then footer actions", async () => {
  render(
    <Card>
      <CardHeader action={<button type="button">Menu</button>}>
        <CardTitle>Workshop</CardTitle>
      </CardHeader>
      <CardFooter>
        <button type="button">Cancel</button>
        <button type="button">Book</button>
      </CardFooter>
    </Card>,
  );
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "Menu" })).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "Book" })).toHaveFocus();
});

test("long words and a narrow parent keep title, body and actions visible", () => {
  render(
    <div style={{ width: 240 }}>
      <Card>
        <CardHeader>
          <CardTitle>Straordinariamenteinterminabile</CardTitle>
        </CardHeader>
        <CardContent>https://aretusa.example/a-very-long-path-that-should-wrap-inside-the-card</CardContent>
        <CardFooter>
          <button type="button">Reserve the printing room</button>
        </CardFooter>
      </Card>
    </div>,
  );
  expect(screen.getByRole("heading")).toBeVisible();
  expect(screen.getByText(/very-long-path/)).toBeVisible();
  expect(screen.getByRole("button")).toBeVisible();
});
