import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "../packages/ui/src/progress";

test("clamps out-of-range and invalid values and marks completion", () => {
  const { rerender } = render(<Progress label="Import" value={140} />);
  const bar = screen.getByRole("progressbar", { name: "Import" });
  expect(bar).toHaveAttribute("aria-valuenow", "100");
  expect(bar).toHaveAttribute("aria-valuetext", "100%");
  expect(bar).toHaveAttribute("data-state", "complete");
  rerender(<Progress label="Import" value={-5} />);
  expect(bar).toHaveAttribute("aria-valuenow", "0");
  expect(bar).toHaveAttribute("data-state", "determinate");
  rerender(<Progress label="Import" value={Number.NaN} max={0} />);
  expect(bar).toHaveAttribute("aria-valuenow", "0");
  expect(bar).toHaveAttribute("aria-valuemax", "100");
});

test("a missing value is indeterminate and no live region is attached to the bar", () => {
  const { rerender } = render(<Progress label="Preparing export" />);
  const bar = screen.getByRole("progressbar", { name: "Preparing export" });
  expect(bar).not.toHaveAttribute("aria-valuenow");
  expect(bar).toHaveAttribute("data-state", "indeterminate");
  expect(bar).not.toHaveAttribute("aria-live");
  expect(screen.queryByText("%", { exact: false })).toBeNull();
  rerender(<Progress label="Preparing export" value={33.333} />);
  expect(bar).toHaveAttribute("aria-valuenow", "33.333");
  expect(screen.getByText("33%")).toBeInTheDocument();
});

test("max, a custom value text, description, ref and native attributes reach the caller", () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <Progress
      ref={ref}
      id="upload"
      label="Uploading photographs"
      description="Large files are compressed first."
      value={3}
      max={12}
      formatValue={(value, max) => `${value} of ${max} files`}
    />,
  );
  const bar = screen.getByRole("progressbar", { name: "Uploading photographs" });
  expect(ref.current).toHaveAttribute("id", "upload");
  expect(bar).toHaveAttribute("aria-valuemax", "12");
  expect(bar).toHaveAttribute("aria-valuetext", "3 of 12 files");
  expect(bar).toHaveAccessibleDescription("Large files are compressed first.");
  expect(screen.getByText("3 of 12 files")).toBeInTheDocument();
});

test("a hidden label still names the bar", () => {
  render(<Progress label="Sync" labelHidden value={50} />);
  expect(screen.getByRole("progressbar", { name: "Sync" })).toBeInTheDocument();
  expect(screen.getByText("Sync").className).toContain("sr-only");
});
