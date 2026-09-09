import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Field, Input, InputGroup } from "../packages/ui/src/forms";

test("prefix and suffix decorate the input, keep its name and focus it when pressed", async () => {
  render(
    <InputGroup prefix="https://" suffix=".design">
      <Input aria-label="Website name" placeholder="your-studio" />
    </InputGroup>,
  );
  const input = screen.getByRole("textbox", { name: "Website name" });
  expect(screen.getByText("https://")).toBeInTheDocument();
  expect(screen.getByText(".design")).toBeInTheDocument();
  await userEvent.click(screen.getByText("https://"));
  expect(input).toHaveFocus();
});

test("Field ids, description, error, required and disabled reach the inner input", () => {
  render(
    <>
      <Field label="Domain" hint="Letters and dashes only." error="This domain is taken." required>
        <InputGroup prefix="https://">
          <Input defaultValue="studio" />
        </InputGroup>
      </Field>
      <Field label="Handle" disabled>
        <InputGroup prefix="@">
          <Input defaultValue="ortigia" />
        </InputGroup>
      </Field>
    </>,
  );
  const domain = screen.getByRole("textbox", { name: "Domain" });
  expect(domain).toHaveAttribute("aria-invalid", "true");
  expect(domain).toBeRequired();
  expect(domain).toHaveAccessibleDescription("Letters and dashes only. This domain is taken.");
  expect(domain.closest("[data-invalid]")).not.toBeNull();
  const handle = screen.getByRole("textbox", { name: "Handle" });
  expect(handle).toBeDisabled();
  expect(handle.closest("[data-disabled]")).not.toBeNull();
});

test("an addon action never submits the form unless it is an explicit submit button", async () => {
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
  const onClear = vi.fn();
  render(
    <form onSubmit={onSubmit}>
      <InputGroup action={<button onClick={onClear}>Clear</button>}>
        <Input aria-label="Search" defaultValue="maps" />
      </InputGroup>
      <InputGroup action={<button type="submit">Go</button>}>
        <Input aria-label="Query" />
      </InputGroup>
    </form>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Clear" }));
  expect(onClear).toHaveBeenCalledTimes(1);
  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Clear" })).toHaveAttribute("type", "button");
  await userEvent.click(screen.getByRole("button", { name: "Go" }));
  expect(onSubmit).toHaveBeenCalledTimes(1);
});
