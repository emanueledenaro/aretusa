import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleGroup } from "../packages/ui/src/forms";

test("single selection keeps one pressed item, moves with arrow keys and still accepts string options", async () => {
  const onValueChange = vi.fn();
  render(<ToggleGroup label="View" options={["List", "Grid", "Board"]} defaultValue="List" onValueChange={onValueChange} />);
  const group = screen.getByRole("radiogroup", { name: "View" });
  const list = screen.getByRole("radio", { name: "List" });
  const grid = screen.getByRole("radio", { name: "Grid" });
  expect(group).toBeInTheDocument();
  expect(list).toHaveAttribute("aria-checked", "true");
  await userEvent.click(grid);
  expect(grid).toHaveAttribute("aria-checked", "true");
  expect(list).toHaveAttribute("aria-checked", "false");
  expect(onValueChange).toHaveBeenLastCalledWith("Grid");
  await userEvent.keyboard("{ArrowRight}");
  expect(screen.getByRole("radio", { name: "Board" })).toHaveFocus();
  await userEvent.keyboard("{Enter}");
  expect(onValueChange).toHaveBeenLastCalledWith("Board");
});

test("multiple selection reports arrays and disabled options cannot be pressed", async () => {
  const onValueChange = vi.fn();
  render(
    <ToggleGroup
      type="multiple"
      label="Days"
      defaultValue={["mon"]}
      onValueChange={onValueChange}
      options={[
        { value: "mon", label: "Mon" },
        { value: "tue", label: "Tue" },
        { value: "sun", label: "Sun", disabled: true },
      ]}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "Tue" }));
  expect(onValueChange).toHaveBeenLastCalledWith(["mon", "tue"]);
  expect(screen.getByRole("button", { name: "Mon" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("button", { name: "Tue" })).toHaveAttribute("aria-pressed", "true");
  const sunday = screen.getByRole("button", { name: "Sun" });
  expect(sunday).toBeDisabled();
  await userEvent.click(sunday);
  expect(onValueChange).toHaveBeenCalledTimes(1);
});

test("required keeps the last item selected and a controlled group follows the caller", async () => {
  const onValueChange = vi.fn();
  const { rerender } = render(<ToggleGroup label="Density" options={["Compact", "Comfortable"]} value="Compact" onValueChange={onValueChange} required />);
  const compact = screen.getByRole("radio", { name: "Compact" });
  await userEvent.click(compact);
  expect(onValueChange).not.toHaveBeenCalled();
  expect(compact).toHaveAttribute("aria-checked", "true");
  await userEvent.click(screen.getByRole("radio", { name: "Comfortable" }));
  expect(onValueChange).toHaveBeenCalledWith("Comfortable");
  expect(compact).toHaveAttribute("aria-checked", "true");
  rerender(<ToggleGroup label="Density" options={["Compact", "Comfortable"]} value="Comfortable" onValueChange={onValueChange} required />);
  expect(screen.getByRole("radio", { name: "Comfortable" })).toHaveAttribute("aria-checked", "true");
});
