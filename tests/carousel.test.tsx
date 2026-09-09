import React from "react";
import { expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Carousel } from "../packages/ui/src/data";

const slides = [
  { title: "A space for ideas.", description: "Start with what matters." },
  { title: "Make a little progress.", description: "One thoughtful step at a time." },
  { title: "Build it together.", description: "Share the work and what you learn." },
];
function current() {
  return screen.getAllByRole("group", { hidden: true }).find((g) => g.getAttribute("aria-hidden") !== "true" && g.getAttribute("aria-roledescription") === "slide");
}

test("previous and next move between labelled slides, respect the bounds and report the index", async () => {
  const onIndexChange = vi.fn();
  render(<Carousel slides={slides} label="Studio highlights" onIndexChange={onIndexChange} />);
  const section = screen.getByRole("region", { name: "Studio highlights" });
  expect(section).toHaveAttribute("aria-roledescription", "carousel");
  expect(current()).toHaveAccessibleName("1 of 3");
  expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(current()).toHaveAccessibleName("2 of 3");
  expect(onIndexChange).toHaveBeenLastCalledWith(1);
  await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  expect(screen.getByText("3 / 3")).toBeInTheDocument();
});

test("indicators jump to a slide and mark the current one", async () => {
  render(<Carousel slides={slides} />);
  const dots = screen.getAllByRole("button", { name: /Go to slide/ });
  expect(dots).toHaveLength(3);
  expect(dots[0]).toHaveAttribute("aria-current", "true");
  await userEvent.click(dots[2]);
  expect(dots[2]).toHaveAttribute("aria-current", "true");
  expect(dots[0]).not.toHaveAttribute("aria-current");
  expect(current()).toHaveAccessibleName("3 of 3");
});

test("arrow, Home and End keys move the slides when the slide group has focus", async () => {
  render(<Carousel slides={slides} />);
  const group = screen.getByRole("group", { name: "Slides" });
  group.focus();
  await userEvent.keyboard("{ArrowRight}");
  expect(current()).toHaveAccessibleName("2 of 3");
  await userEvent.keyboard("{End}");
  expect(current()).toHaveAccessibleName("3 of 3");
  await userEvent.keyboard("{ArrowLeft}");
  expect(current()).toHaveAccessibleName("2 of 3");
  await userEvent.keyboard("{Home}");
  expect(current()).toHaveAccessibleName("1 of 3");
});

test("loop wraps around in both directions and keeps both controls enabled", async () => {
  render(<Carousel slides={slides} loop />);
  expect(screen.getByRole("button", { name: "Previous slide" })).toBeEnabled();
  await userEvent.click(screen.getByRole("button", { name: "Previous slide" }));
  expect(current()).toHaveAccessibleName("3 of 3");
  await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(current()).toHaveAccessibleName("1 of 3");
});

test("a horizontal swipe moves one slide and hidden slides are inert", () => {
  render(<Carousel slides={slides.map((s, i) => ({ ...s, content: <a href={"#" + i}>Read more</a> }))} />);
  const group = screen.getByRole("group", { name: "Slides" });
  fireEvent.pointerDown(group, { clientX: 220, clientY: 40, pointerId: 1 });
  fireEvent.pointerUp(group, { clientX: 120, clientY: 44, pointerId: 1 });
  expect(current()).toHaveAccessibleName("2 of 3");
  const hidden = screen.getAllByRole("group", { hidden: true }).filter((g) => g.getAttribute("aria-hidden") === "true");
  expect(hidden).toHaveLength(2);
  expect(hidden[0]).toHaveAttribute("inert");
});

test("controlled index follows the caller and an empty list shows the empty state", () => {
  const { rerender } = render(<Carousel slides={slides} index={2} />);
  expect(current()).toHaveAccessibleName("3 of 3");
  rerender(<Carousel slides={slides} index={0} />);
  expect(current()).toHaveAccessibleName("1 of 3");
  rerender(<Carousel slides={[]} />);
  expect(screen.getByRole("heading", { name: "No slides" })).toBeInTheDocument();
});
