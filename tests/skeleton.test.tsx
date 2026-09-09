import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton, SkeletonGroup } from "../packages/ui/src/skeleton";

test("shapes stay out of the accessibility tree and forward ref, attributes and className", () => {
  const ref = React.createRef<HTMLDivElement>();
  render(<Skeleton ref={ref} data-testid="shape" shape="circle" className="size-12" />);
  const shape = screen.getByTestId("shape");
  expect(ref.current).toBe(shape);
  expect(shape).toHaveAttribute("aria-hidden", "true");
  expect(shape).toHaveAttribute("data-shape", "circle");
  expect(shape.className).toContain("size-12");
  expect(shape.className).not.toContain("size-10");
});

test("text lines render one bar per line with a shorter closing line", () => {
  render(<Skeleton data-testid="paragraph" lines={3} />);
  const paragraph = screen.getByTestId("paragraph");
  expect(paragraph).toHaveAttribute("data-lines", "3");
  const bars = Array.from(paragraph.children);
  expect(bars).toHaveLength(3);
  expect(bars[2].className).toContain("w-3/5");
  expect(bars[0].className).not.toContain("w-3/5");
});

test("invalid line counts fall back to a single bar", () => {
  render(
    <>
      <Skeleton data-testid="zero" lines={0} />
      <Skeleton data-testid="fraction" lines={2.5} />
    </>,
  );
  expect(screen.getByTestId("zero").children).toHaveLength(0);
  expect(screen.getByTestId("fraction").children).toHaveLength(0);
});

test("the group announces loading once while its shapes remain hidden", () => {
  render(
    <SkeletonGroup label="Loading projects">
      <Skeleton lines={2} />
      <Skeleton shape="rectangle" />
    </SkeletonGroup>,
  );
  const status = screen.getByRole("status");
  expect(status).toHaveTextContent("Loading projects");
  expect(status).toHaveAttribute("aria-busy", "true");
  expect(status.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  expect(screen.queryAllByRole("img")).toHaveLength(0);
});
