import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "../packages/ui/src/spinner";

test("exposes one polite status with the label while the drawing stays hidden", () => {
  render(<Spinner label="Loading projects" />);
  const status = screen.getByRole("status");
  expect(status).toHaveTextContent("Loading projects");
  expect(status.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  expect(screen.queryByRole("img")).toBeNull();
});

test("a hidden label is still read by assistive technology", () => {
  render(<Spinner label="Saving" labelHidden />);
  const status = screen.getByRole("status");
  expect(status).toHaveTextContent("Saving");
  expect(screen.getByText("Saving").className).toContain("sr-only");
});

test("defaults to a Loading label and forwards ref, size, attributes and className", () => {
  const ref = React.createRef<HTMLSpanElement>();
  render(<Spinner ref={ref} size="lg" id="busy" className="text-terracotta" />);
  const status = screen.getByRole("status");
  expect(ref.current).toBe(status);
  expect(status).toHaveTextContent("Loading");
  expect(status).toHaveAttribute("id", "busy");
  expect(status).toHaveAttribute("data-size", "lg");
  expect(status.className).toContain("text-terracotta");
});
