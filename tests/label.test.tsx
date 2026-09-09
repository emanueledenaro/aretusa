import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Label, Input, Checkbox } from "../packages/ui/src/forms";

test("forwards the ref and native attributes and activates the associated control", async () => {
  const ref = React.createRef<HTMLLabelElement>();
  render(
    <>
      <Label ref={ref} htmlFor="name" data-testid="label">Display name</Label>
      <Input id="name" />
    </>,
  );
  expect(ref.current).toBe(screen.getByTestId("label"));
  await userEvent.click(screen.getByText("Display name"));
  expect(screen.getByRole("textbox", { name: "Display name" })).toHaveFocus();
});

test("the required marker and the secondary text stay out of the accessible name", () => {
  render(
    <>
      <Label htmlFor="email" required secondary="Work address">Email</Label>
      <Input id="email" type="email" />
    </>,
  );
  expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
  expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByText("Work address")).toBeInTheDocument();
});

test("a disabled label reports its state and still names a compound control", async () => {
  render(
    <>
      <Label htmlFor="terms" disabled>Terms</Label>
      <Checkbox id="terms" label="" disabled />
    </>,
  );
  const label = screen.getByText("Terms").closest("label")!;
  expect(label).toHaveAttribute("data-disabled", "true");
  const box = screen.getByRole("checkbox", { name: "Terms" });
  await userEvent.click(label);
  expect(box).not.toBeChecked();
});
