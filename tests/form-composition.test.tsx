import React from "react";
import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormBlock } from "../packages/ui/src/blocks";
import { Modal } from "../packages/ui/src/overlays";
import { Select } from "../packages/ui/src/forms";

test("a form inside a modal submits its named fields and restores focus", async () => {
  const submit = vi.fn();
  render(
    <Modal
      title="Invite"
      description="Add a person"
      trigger={<button>Open invite</button>}
    >
      <FormBlock onSubmit={submit} />
    </Modal>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open invite" }));
  await userEvent.type(
    screen.getByRole("textbox", { name: "Your name" }),
    "Ada",
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: "Email" }),
    "ada@example.com",
  );
  await userEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(submit).toHaveBeenCalledWith({
    name: "Ada",
    email: "ada@example.com",
  });
  await userEvent.keyboard("{Escape}");
  expect(screen.getByRole("button", { name: "Open invite" })).toHaveFocus();
});

test("rich select options keep a concise selected value and disabled semantics", () => {
  render(
    <Select
      label="Accent"
      open
      defaultValue="clay"
      options={[
        {
          value: "clay",
          label: "Clay",
          description: "A warm accent",
          swatch: "#bf745d",
        },
        { value: "sage", label: "Sage", disabled: true },
      ]}
    />,
  );
  expect(screen.getByRole("combobox", { hidden: true })).toHaveTextContent(
    "Clay",
  );
  expect(screen.getByRole("combobox", { hidden: true })).not.toHaveTextContent(
    "A warm accent",
  );
  expect(screen.getByText("A warm accent")).toBeVisible();
  expect(screen.getByRole("option", { name: "Sage" })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
});
