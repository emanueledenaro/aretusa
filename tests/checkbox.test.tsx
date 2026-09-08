import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../packages/ui/src/forms";

test("description and error are linked and the error marks the control invalid", () => {
  render(
    <Checkbox label="I accept the booking terms" description="You can cancel up to two days before." error="Accept the booking terms to continue." />,
  );
  const box = screen.getByRole("checkbox", { name: "I accept the booking terms" });
  expect(box).toHaveAttribute("aria-invalid", "true");
  expect(box).toHaveAccessibleDescription("You can cancel up to two days before. Accept the booking terms to continue.");
  expect(screen.getByRole("alert")).toHaveTextContent("Accept the booking terms to continue.");
});

test("indeterminate reports mixed and resolves through the caller", async () => {
  const onCheckedChange = vi.fn();
  render(<Checkbox label="All rooms" checked="indeterminate" onCheckedChange={onCheckedChange} />);
  const box = screen.getByRole("checkbox", { name: "All rooms" });
  expect(box).toHaveAttribute("aria-checked", "mixed");
  await userEvent.click(box);
  expect(onCheckedChange).toHaveBeenCalledWith(true);
});

test("keyboard Space and a multiline label both toggle the control", async () => {
  render(<Checkbox label="Send me the monthly letter about workshops, open studios and new prints" />);
  const box = screen.getByRole("checkbox");
  box.focus();
  await userEvent.keyboard(" ");
  expect(box).toBeChecked();
  await userEvent.click(screen.getByText(/monthly letter/));
  expect(box).not.toBeChecked();
});

test("the checked value reaches native form submission and disabled stays inert", async () => {
  const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return new FormData(event.currentTarget).get("newsletter");
  });
  render(
    <form onSubmit={onSubmit}>
      <Checkbox name="newsletter" value="yes" label="Newsletter" defaultChecked />
      <Checkbox label="Unavailable" disabled />
      <button type="submit">Save</button>
    </form>,
  );
  await userEvent.click(screen.getByRole("checkbox", { name: "Unavailable" }));
  expect(screen.getByRole("checkbox", { name: "Unavailable" })).not.toBeChecked();
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(onSubmit).toHaveReturnedWith("yes");
});
