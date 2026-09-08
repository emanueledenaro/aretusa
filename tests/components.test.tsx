import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../packages/ui/src/basic";
import { Field, Input } from "../packages/ui/src/forms";
import { Modal } from "../packages/ui/src/overlays";
test("a loading action cannot be activated", async () => {
  let calls = 0;
  render(
    <Button loading onClick={() => calls++}>
      Save
    </Button>,
  );
  await userEvent.click(screen.getByRole("button"));
  expect(calls).toBe(0);
  expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
});
test("a field connects its validation message to the control", () => {
  render(
    <Field label="Email" error="Enter a valid email">
      <Input />
    </Field>,
  );
  const input = screen.getByRole("textbox", { name: "Email" });
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAccessibleDescription("Enter a valid email");
});
test("a modal returns focus to its trigger on escape", async () => {
  render(
    <Modal
      trigger={<Button>Open profile</Button>}
      title="Profile"
      description="Edit your information"
    >
      <Input aria-label="Name" />
    </Modal>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open profile" }));
  expect(screen.getByRole("dialog", { name: "Profile" })).toBeVisible();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Open profile" })).toHaveFocus();
});
