import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Field, Input } from "../packages/ui/src/forms";

test("forwards the ref, native attributes and caller handlers", async () => {
  const ref = React.createRef<HTMLInputElement>();
  const onChange = vi.fn();
  render(
    <Input ref={ref} type="email" name="email" autoComplete="email" aria-label="Email" onChange={onChange} />,
  );
  const input = screen.getByRole("textbox", { name: "Email" });
  expect(ref.current).toBe(input);
  expect(input).toHaveAttribute("type", "email");
  expect(input).toHaveAttribute("name", "email");
  expect(input).toHaveAttribute("autocomplete", "email");
  await userEvent.type(input, "a");
  expect(onChange).toHaveBeenCalledTimes(1);
});

test("Field links label, hint and error and marks the control invalid", () => {
  render(
    <Field label="Work email" hint="Use your work address." error="Enter a valid email address.">
      <Input type="email" defaultValue="not-an-email" />
    </Field>,
  );
  const input = screen.getByRole("textbox", { name: "Work email" });
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAccessibleDescription("Use your work address. Enter a valid email address.");
});

test("read-only and disabled inputs keep their value and refuse edits", async () => {
  render(
    <>
      <Input readOnly value="studio-ortigia-2026" aria-label="Workspace ID" />
      <Input disabled value="Studio, yearly" aria-label="Plan" />
    </>,
  );
  const readOnly = screen.getByRole("textbox", { name: "Workspace ID" });
  await userEvent.type(readOnly, "x");
  expect(readOnly).toHaveValue("studio-ortigia-2026");
  expect(screen.getByRole("textbox", { name: "Plan" })).toBeDisabled();
});

test("the value reaches native form submission under its name", () => {
  const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return new FormData(event.currentTarget).get("project");
  });
  render(
    <form onSubmit={onSubmit}>
      <Input name="project" defaultValue="Field notes" aria-label="Project" />
      <button type="submit">Save</button>
    </form>,
  );
  screen.getByRole("button", { name: "Save" }).click();
  expect(onSubmit).toHaveReturnedWith("Field notes");
});
