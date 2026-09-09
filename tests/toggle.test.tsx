import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "../packages/ui/src/forms";

test("pointer, Space and Enter flip aria-pressed and report the new state", async () => {
  const onPressedChange = vi.fn();
  render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);
  const toggle = screen.getByRole("button", { name: "Bold" });
  expect(toggle).toHaveAttribute("aria-pressed", "false");
  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  await userEvent.keyboard(" ");
  expect(toggle).toHaveAttribute("aria-pressed", "false");
  await userEvent.keyboard("{Enter}");
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(onPressedChange.mock.calls.map((call) => call[0])).toEqual([true, false, true]);
});

test("a controlled toggle follows the caller and disabled stays inert", async () => {
  const onPressedChange = vi.fn();
  const { rerender } = render(<Toggle pressed={false} onPressedChange={onPressedChange}>Italic</Toggle>);
  const toggle = screen.getByRole("button", { name: "Italic" });
  await userEvent.click(toggle);
  expect(onPressedChange).toHaveBeenCalledWith(true);
  expect(toggle).toHaveAttribute("aria-pressed", "false");
  rerender(<Toggle pressed onPressedChange={onPressedChange} disabled>Italic</Toggle>);
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(toggle).toBeDisabled();
  await userEvent.click(toggle);
  expect(onPressedChange).toHaveBeenCalledTimes(1);
});

test("icon-only toggles keep an accessible name, forward the ref and never submit a form", async () => {
  const ref = React.createRef<HTMLButtonElement>();
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
  render(
    <form onSubmit={onSubmit}>
      <Toggle ref={ref} aria-label="Favorite" size="sm" className="extra">
        <svg aria-hidden="true" />
      </Toggle>
    </form>,
  );
  const toggle = screen.getByRole("button", { name: "Favorite" });
  expect(ref.current).toBe(toggle);
  expect(toggle).toHaveAttribute("type", "button");
  expect(toggle).toHaveClass("extra");
  await userEvent.click(toggle);
  expect(onSubmit).not.toHaveBeenCalled();
});
