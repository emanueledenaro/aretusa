import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup } from "../packages/ui/src/forms";

const options = [
  { value: "morning", label: "Morning", description: "09:00 to 12:30" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening", disabled: true },
];

test("one option is selected at a time and disabled options cannot be chosen", async () => {
  const onValueChange = vi.fn();
  render(<RadioGroup label="Session" options={options} defaultValue="morning" onValueChange={onValueChange} />);
  await userEvent.click(screen.getByRole("radio", { name: "Afternoon" }));
  expect(screen.getByRole("radio", { name: "Afternoon" })).toBeChecked();
  expect(screen.getByRole("radio", { name: "Morning" })).not.toBeChecked();
  expect(onValueChange).toHaveBeenLastCalledWith("afternoon");
  await userEvent.click(screen.getByRole("radio", { name: "Evening" }));
  expect(screen.getByRole("radio", { name: "Evening" })).not.toBeChecked();
  expect(screen.getByRole("radio", { name: "Afternoon" })).toBeChecked();
});

test("option descriptions, group description and error are linked and the error marks the group invalid", () => {
  render(<RadioGroup label="Session" options={options} description="Morning includes the printing room." error="Choose a session." />);
  expect(screen.getByRole("radio", { name: "Morning" })).toHaveAccessibleDescription("09:00 to 12:30");
  const group = screen.getByRole("radiogroup", { name: "Session" });
  expect(group).toHaveAttribute("aria-invalid", "true");
  expect(group).toHaveAccessibleDescription("Morning includes the printing room. Choose a session.");
  expect(screen.getByRole("alert")).toHaveTextContent("Choose a session.");
});

test("card variant selects through the whole card and keeps disabled cards inert", async () => {
  render(<RadioGroup label="Plan" variant="cards" options={[{ value: "studio", label: "Studio", description: "Shared desk." }, { value: "visitor", label: "Visitor", disabled: true }]} />);
  await userEvent.click(screen.getByText("Shared desk."));
  expect(screen.getByRole("radio", { name: "Studio" })).toBeChecked();
  await userEvent.click(screen.getByText("Visitor"));
  expect(screen.getByRole("radio", { name: "Visitor" })).not.toBeChecked();
});

test("the selected value reaches native form submission under the group name", async () => {
  const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return new FormData(event.currentTarget).get("session");
  });
  render(
    <form onSubmit={onSubmit}>
      <RadioGroup name="session" label="Session" options={options} defaultValue="afternoon" />
      <button type="submit">Save</button>
    </form>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(onSubmit).toHaveReturnedWith("afternoon");
});
