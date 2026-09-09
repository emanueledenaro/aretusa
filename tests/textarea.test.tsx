import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Field, Textarea } from "../packages/ui/src/forms";

test("forwards the ref, native attributes, rows and a controlled value", async () => {
  const ref = React.createRef<HTMLTextAreaElement>();
  const onChange = vi.fn();
  render(<Textarea ref={ref} name="notes" rows={2} aria-label="Notes" value="Draft" onChange={onChange} />);
  const textarea = screen.getByRole("textbox", { name: "Notes" });
  expect(ref.current).toBe(textarea);
  expect(textarea).toHaveAttribute("name", "notes");
  expect(textarea).toHaveAttribute("rows", "2");
  expect(textarea).toHaveValue("Draft");
  await userEvent.type(textarea, "!");
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(textarea).toHaveValue("Draft");
});

test("the character count joins the Field hint in the description and flags an overflowing value", async () => {
  render(
    <Field label="Bio" hint="Shown on your public page.">
      <Textarea maxLength={20} showCount defaultValue="Printmaker in Ortigia" />
    </Field>,
  );
  const textarea = screen.getByRole("textbox", { name: "Bio" });
  expect(textarea).toHaveAccessibleDescription("Shown on your public page. 21 of 20 characters");
  expect(textarea).toHaveAttribute("aria-invalid", "true");
  await userEvent.type(textarea, "{Backspace}");
  expect(textarea).toHaveAccessibleDescription("Shown on your public page. 20 of 20 characters");
  expect(textarea).not.toHaveAttribute("aria-invalid");
});

test("autoResize follows the content height between the row minimum and maxRows", async () => {
  const heights: number[] = [];
  const spy = vi.spyOn(HTMLTextAreaElement.prototype, "scrollHeight", "get").mockImplementation(function (this: HTMLTextAreaElement) {
    return 24 * (this.value.split("\n").length + 1);
  });
  render(<Textarea aria-label="Message" autoResize rows={2} maxRows={4} defaultValue="one" />);
  const textarea = screen.getByRole("textbox", { name: "Message" });
  heights.push(parseFloat(textarea.style.height));
  await userEvent.type(textarea, "\ntwo\nthree\nfour\nfive\nsix");
  heights.push(parseFloat(textarea.style.height));
  spy.mockRestore();
  // Two rows minimum, four rows maximum: the box grows by exactly two 24px lines.
  expect(heights[0]).toBeGreaterThanOrEqual(48);
  expect(heights[1] - heights[0]).toBe(48);
  expect(textarea).toHaveStyle({ overflowY: "auto" });
});

test("disabled and read-only keep their value and the value reaches native submission", async () => {
  const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return new FormData(event.currentTarget).get("notes");
  });
  render(
    <form onSubmit={onSubmit}>
      <Textarea name="notes" defaultValue="Field notes" aria-label="Notes" />
      <Textarea readOnly value="Archived" aria-label="Archived" />
      <Textarea disabled value="Closed" aria-label="Closed" />
      <button type="submit">Save</button>
    </form>,
  );
  await userEvent.type(screen.getByRole("textbox", { name: "Archived" }), "x");
  expect(screen.getByRole("textbox", { name: "Archived" })).toHaveValue("Archived");
  expect(screen.getByRole("textbox", { name: "Closed" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(onSubmit).toHaveReturnedWith("Field notes");
});
