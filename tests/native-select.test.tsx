import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Field, NativeSelect } from "../packages/ui/src/forms";

const options = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "archive", label: "Archive, by invitation only", disabled: true },
];

test("forwards the ref, keeps native semantics and submits the chosen value under its name", async () => {
  const ref = React.createRef<HTMLSelectElement>();
  const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return new FormData(event.currentTarget).get("discipline");
  });
  render(
    <form onSubmit={onSubmit}>
      <NativeSelect ref={ref} name="discipline" aria-label="Discipline" options={options} defaultValue="design" required />
      <button type="submit">Save</button>
    </form>,
  );
  const select = screen.getByRole("combobox", { name: "Discipline" });
  expect(ref.current).toBe(select);
  expect(select).toBeRequired();
  await userEvent.selectOptions(select, "engineering");
  expect(select).toHaveValue("engineering");
  expect(screen.getByRole("option", { name: "Archive, by invitation only" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(onSubmit).toHaveReturnedWith("engineering");
});

test("a placeholder renders as an empty disabled option and groups keep their labels", async () => {
  const onChange = vi.fn();
  render(
    <NativeSelect
      aria-label="Room"
      placeholder="Choose a room"
      onChange={onChange}
      options={[
        { label: "Ground floor", options: [{ value: "print", label: "Printing room" }] },
        { label: "Upstairs", options: [{ value: "terrace", label: "Terrace" }, { value: "library", label: "Library" }] },
      ]}
    />,
  );
  const select = screen.getByRole("combobox", { name: "Room" });
  expect(select).toHaveValue("");
  expect(select).toHaveAttribute("data-placeholder", "true");
  const placeholder = screen.getByRole("option", { name: "Choose a room" });
  expect(placeholder).toBeDisabled();
  expect(screen.getByRole("group", { name: "Upstairs" })).toBeInTheDocument();
  await userEvent.selectOptions(select, "library");
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(select).toHaveValue("library");
  expect(select).not.toHaveAttribute("data-placeholder");
});

test("Field links the label, hint and error and disabled keeps the value", () => {
  render(
    <>
      <Field label="Discipline" hint="You can change this later." error="Choose a discipline.">
        <NativeSelect options={options} placeholder="Choose" />
      </Field>
      <NativeSelect aria-label="Plan" options={[{ value: "studio", label: "Studio, yearly" }]} value="studio" disabled onChange={() => {}} />
    </>,
  );
  const select = screen.getByRole("combobox", { name: "Discipline" });
  expect(select).toHaveAttribute("aria-invalid", "true");
  expect(select).toHaveAccessibleDescription("You can change this later. Choose a discipline.");
  const plan = screen.getByRole("combobox", { name: "Plan" });
  expect(plan).toBeDisabled();
  expect(plan).toHaveValue("studio");
});
