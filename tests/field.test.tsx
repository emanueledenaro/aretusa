import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field, Input, Select } from "../packages/ui/src/forms";

test("keeps an explicit control id and merges the control's own description and invalid flag", () => {
  render(
    <>
      <p id="policy">Stored for thirty days.</p>
      <Field label="Work email" hint="Use your work address." error="Enter a valid email address.">
        <Input id="email" type="email" aria-describedby="policy" />
      </Field>
      <Field label="Nickname">
        <Input aria-invalid="true" />
      </Field>
    </>,
  );
  const email = screen.getByRole("textbox", { name: "Work email" });
  expect(email).toHaveAttribute("id", "email");
  expect(email).toHaveAccessibleDescription("Stored for thirty days. Use your work address. Enter a valid email address.");
  expect(email).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByRole("textbox", { name: "Nickname" })).toHaveAttribute("aria-invalid", "true");
});

test("required and disabled reach the control and the label without changing the accessible name", () => {
  render(
    <>
      <Field label="Name" required secondary="Shown to members">
        <Input />
      </Field>
      <Field label="Plan" disabled>
        <Input value="Studio" readOnly />
      </Field>
      <Field label="Room" hint="Custom controls receive the same id and description.">
        <Select label="Room" options={[{ value: "print", label: "Printing room" }]} />
      </Field>
    </>,
  );
  const name = screen.getByRole("textbox", { name: "Name" });
  expect(name).toBeRequired();
  expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  const plan = screen.getByRole("textbox", { name: "Plan" });
  expect(plan).toBeDisabled();
  expect(screen.getByText("Plan").closest("label")).toHaveAttribute("data-disabled", "true");
  expect(screen.getByRole("combobox", { name: "Room" })).toHaveAccessibleDescription("Custom controls receive the same id and description.");
});

test("an error that arrives later is announced and the description follows it", () => {
  const hint = (
    <>
      First line of help.
      <br />
      Second line of help.
    </>
  );
  const { rerender } = render(
    <Field label="Code" hint={hint}>
      <Input />
    </Field>,
  );
  const input = screen.getByRole("textbox", { name: "Code" });
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(input).toHaveAccessibleDescription("First line of help. Second line of help.");
  rerender(
    <Field label="Code" hint={hint} error="That code has expired.">
      <Input />
    </Field>,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("That code has expired.");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAccessibleDescription("First line of help. Second line of help. That code has expired.");
  rerender(
    <Field label="Code" hint={hint}>
      <Input />
    </Field>,
  );
  expect(input).not.toHaveAttribute("aria-invalid");
});
