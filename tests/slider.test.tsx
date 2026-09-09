import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Slider } from "../packages/ui/src/forms";

test("arrow keys move by step, Home and End reach the bounds and the caller receives arrays", async () => {
  const onValueChange = vi.fn();
  render(<Slider label="Contrast" min={0} max={20} step={5} defaultValue={[10]} onValueChange={onValueChange} />);
  const thumb = screen.getByRole("slider", { name: "Contrast" });
  expect(thumb).toHaveAttribute("aria-valuenow", "10");
  thumb.focus();
  await userEvent.keyboard("{ArrowRight}");
  expect(thumb).toHaveAttribute("aria-valuenow", "15");
  expect(onValueChange).toHaveBeenLastCalledWith([15]);
  await userEvent.keyboard("{ArrowRight}{ArrowRight}");
  expect(thumb).toHaveAttribute("aria-valuenow", "20");
  await userEvent.keyboard("{Home}");
  expect(thumb).toHaveAttribute("aria-valuenow", "0");
  await userEvent.keyboard("{End}");
  expect(thumb).toHaveAttribute("aria-valuenow", "20");
});

test("a range names each thumb, formats the value for assistive technology and shows it beside the label", async () => {
  render(<Slider label="Price" min={0} max={500} step={10} defaultValue={[120, 340]} showValue formatValue={(value) => `${value} EUR`} minStepsBetweenThumbs={1} />);
  const low = screen.getByRole("slider", { name: "Price 1" });
  const high = screen.getByRole("slider", { name: "Price 2" });
  expect(low).toHaveAttribute("aria-valuetext", "120 EUR");
  expect(high).toHaveAttribute("aria-valuetext", "340 EUR");
  expect(screen.getByText("120 EUR to 340 EUR")).toBeInTheDocument();
  high.focus();
  await userEvent.keyboard("{ArrowLeft}");
  expect(screen.getByText("120 EUR to 330 EUR")).toBeInTheDocument();
  low.focus();
  await userEvent.keyboard("{PageUp}{PageUp}");
  expect(low).toHaveAttribute("aria-valuenow", "320");
  expect(screen.getByText("320 EUR to 330 EUR")).toBeInTheDocument();
  // Radix keeps the values sorted, so a thumb pushed past its neighbour swaps places instead of being blocked.
  await userEvent.keyboard("{PageUp}");
  expect(screen.getByText("330 EUR to 420 EUR")).toBeInTheDocument();
});

test("marks label the track from the caller's values and stay hidden from assistive technology", () => {
  const { container } = render(<Slider label="Quality" min={0} max={4} step={1} defaultValue={[2]} marks={[{ value: 0, label: "Draft" }, { value: 2 }, { value: 4, label: "Final" }]} />);
  const marks = container.querySelector("[aria-hidden='true']");
  expect(marks).not.toBeNull();
  expect(Array.from(marks!.children).map((node) => node.textContent)).toEqual(["Draft", "2", "Final"]);
  expect((marks!.children[1] as HTMLElement).style.insetInlineStart).toBe("50%");
  expect(screen.queryByText("Draft", { ignore: "[aria-hidden] *" })).toBeNull();
});

test("disabled sliders ignore the keyboard and a controlled value follows the caller", async () => {
  const onValueChange = vi.fn();
  const { rerender } = render(<Slider label="Volume" value={[30]} onValueChange={onValueChange} disabled />);
  const thumb = screen.getByRole("slider", { name: "Volume" });
  expect(thumb).toHaveAttribute("data-disabled");
  thumb.focus();
  await userEvent.keyboard("{ArrowRight}");
  expect(onValueChange).not.toHaveBeenCalled();
  rerender(<Slider label="Volume" value={[30]} onValueChange={onValueChange} />);
  thumb.focus();
  await userEvent.keyboard("{ArrowRight}");
  expect(onValueChange).toHaveBeenCalledWith([31]);
  expect(thumb).toHaveAttribute("aria-valuenow", "30");
  rerender(<Slider label="Volume" value={[31]} onValueChange={onValueChange} />);
  expect(thumb).toHaveAttribute("aria-valuenow", "31");
});
