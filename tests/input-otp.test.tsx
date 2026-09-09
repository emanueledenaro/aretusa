import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Field, InputOTP } from "../packages/ui/src/forms";

const slot = (n: number, length = 6) => screen.getByRole("textbox", { name: `Verification code: character ${n} of ${length}` });

test("typing fills one slot at a time, moves focus forward and reports the code and its completion", async () => {
  const onChange = vi.fn();
  const onComplete = vi.fn();
  render(<InputOTP length={4} onChange={onChange} onComplete={onComplete} autoFocus />);
  expect(screen.getByRole("group", { name: "Verification code" })).toBeInTheDocument();
  expect(slot(1, 4)).toHaveFocus();
  await userEvent.keyboard("1");
  expect(slot(1, 4)).toHaveValue("1");
  expect(slot(2, 4)).toHaveFocus();
  expect(onChange).toHaveBeenLastCalledWith("1");
  await userEvent.keyboard("2a3");
  expect(slot(3, 4)).toHaveValue("3");
  expect(onChange).toHaveBeenLastCalledWith("123");
  expect(onComplete).not.toHaveBeenCalled();
  await userEvent.keyboard("4");
  expect(onComplete).toHaveBeenCalledWith("1234");
  expect(onComplete).toHaveBeenCalledTimes(1);
  expect(slot(4, 4)).toHaveFocus();
});

test("Backspace clears the current slot or steps back, Delete clears, arrows and Home and End move", async () => {
  const onChange = vi.fn();
  render(<InputOTP defaultValue="123" onChange={onChange} />);
  slot(4).focus();
  await userEvent.keyboard("{Backspace}");
  expect(onChange).toHaveBeenLastCalledWith("12");
  expect(slot(3)).toHaveFocus();
  await userEvent.keyboard("{Backspace}");
  expect(onChange).toHaveBeenLastCalledWith("1");
  expect(slot(2)).toHaveFocus();
  await userEvent.keyboard("{ArrowLeft}");
  expect(slot(1)).toHaveFocus();
  await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
  expect(slot(2)).toHaveFocus();
  await userEvent.keyboard("{Home}");
  expect(slot(1)).toHaveFocus();
  await userEvent.keyboard("{Delete}");
  expect(onChange).toHaveBeenLastCalledWith("");
  await userEvent.keyboard("9{End}");
  expect(slot(2)).toHaveFocus();
});

test("pasting distributes the characters, drops separators and a full code always starts from the first slot", async () => {
  const onChange = vi.fn();
  const onComplete = vi.fn();
  render(<InputOTP defaultValue="12" onChange={onChange} onComplete={onComplete} />);
  slot(3).focus();
  await userEvent.paste("34");
  expect(onChange).toHaveBeenLastCalledWith("1234");
  expect(slot(5)).toHaveFocus();
  await userEvent.paste("987-654");
  expect(onChange).toHaveBeenLastCalledWith("987654");
  expect(onComplete).toHaveBeenCalledWith("987654");
  expect(slot(6)).toHaveFocus();
});

test("device autofill delivered to the first slot fills every slot", async () => {
  const onComplete = vi.fn();
  render(<InputOTP onComplete={onComplete} />);
  const first = slot(1);
  expect(first).toHaveAttribute("autocomplete", "one-time-code");
  expect(first).toHaveAttribute("inputmode", "numeric");
  await userEvent.type(first, "246810");
  expect(onComplete).toHaveBeenCalledWith("246810");
  expect(slot(6)).toHaveValue("0");
});

test("a controlled value follows the caller, alphanumeric codes are upper-cased and groups draw a separator", async () => {
  const onChange = vi.fn();
  const { rerender, container } = render(<InputOTP value="" onChange={onChange} pattern="alphanumeric" groupSize={3} autoFocus />);
  await userEvent.keyboard("a");
  expect(onChange).toHaveBeenLastCalledWith("A");
  expect(slot(1)).toHaveValue("");
  rerender(<InputOTP value="AB" onChange={onChange} pattern="alphanumeric" groupSize={3} />);
  expect(slot(1)).toHaveValue("A");
  expect(slot(2)).toHaveValue("B");
  expect(container.querySelectorAll("[aria-hidden='true']")).toHaveLength(1);
  expect(slot(1)).toHaveAttribute("inputmode", "text");
});

test("Field links the label, description and error to the slots, and the code submits under its name", async () => {
  const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit.submitted = Object.fromEntries(new FormData(event.currentTarget));
  }) as ReturnType<typeof vi.fn> & { submitted?: Record<string, FormDataEntryValue> };
  render(
    <form onSubmit={onSubmit}>
      <Field label="Code" hint="Sent by SMS." error="The code has expired.">
        <InputOTP name="code" defaultValue="112233" length={6} />
      </Field>
      <button type="submit">Verify</button>
    </form>,
  );
  const first = slot(1);
  expect(first).toHaveAttribute("aria-invalid", "true");
  expect(first).toHaveAccessibleDescription("Sent by SMS. The code has expired.");
  expect(screen.getByText("Code").closest("label")).toHaveAttribute("for", first.id);
  const group = screen.getByRole("group", { name: "Verification code" });
  expect(group).toHaveAccessibleDescription("Sent by SMS. The code has expired.");
  await userEvent.click(screen.getByRole("button", { name: "Verify" }));
  expect(onSubmit.submitted).toEqual({ code: "112233" });
  const disabled = render(<InputOTP disabled defaultValue="1" label="Locked" />);
  expect(disabled.getByRole("textbox", { name: "Locked: character 1 of 6" })).toBeDisabled();
});
