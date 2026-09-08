import React from "react";
import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Avatar } from "../packages/ui/src/basic";
test("a consumer can hold a ref to the avatar element", () => {
  const ref = React.createRef<HTMLSpanElement>();
  render(<Avatar ref={ref} name="Alex Rivers" />);
  expect(ref.current).toBe(screen.getByRole("img", { name: "Alex Rivers" }));
});
test("a new source can load after an earlier image error", () => {
  const { container, rerender } = render(
    <Avatar src="/bad.jpg" name="Alex Rivers" />,
  );
  fireEvent.error(container.querySelector("img")!);
  expect(screen.getByRole("img", { name: "Alex Rivers" })).toHaveTextContent(
    "AR",
  );
  rerender(<Avatar src="/good.jpg" name="Alex Rivers" />);
  expect(container.querySelector("img")).toHaveAttribute("src", "/good.jpg");
  fireEvent.load(container.querySelector("img")!);
  expect(screen.getByRole("img", { name: "Alex Rivers" })).toHaveAttribute(
    "data-state",
    "loaded",
  );
});
test("initials normalize whitespace", () => {
  render(<Avatar name="  Alex   Rivers  " />);
  expect(screen.getByRole("img", { name: "Alex Rivers" })).toHaveTextContent(
    "AR",
  );
});
test("decorative avatars do not duplicate a neighboring visible name", () => {
  render(
    <div>
      <Avatar name="Alex Rivers" decorative />
      <span>Alex Rivers</span>
    </div>,
  );
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.getByText("Alex Rivers")).toBeVisible();
});
test("an empty name still has a useful accessible fallback", () => {
  render(<Avatar name="  " />);
  expect(screen.getByRole("img", { name: "Profile" })).toHaveAttribute(
    "data-state",
    "fallback",
  );
});
test("an earlier failed URL may be retried after another source loads", () => {
  const { container, rerender } = render(<Avatar src="/a.jpg" name="Alex" />);
  fireEvent.error(container.querySelector("img")!);
  rerender(<Avatar src="/b.jpg" name="Alex" />);
  fireEvent.load(container.querySelector("img")!);
  rerender(<Avatar src="/a.jpg" name="Alex" />);
  expect(container.querySelector("img")).toHaveAttribute("src", "/a.jpg");
});
