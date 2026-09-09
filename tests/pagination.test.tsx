import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../packages/ui/src/navigation";

test("previous and next move by one, edges are disabled and the position is announced", async () => {
  const onChange = vi.fn();
  const { rerender } = render(<Pagination page={1} total={5} onChange={onChange} />);
  const nav = screen.getByRole("navigation", { name: "Pagination" });
  expect(nav).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  expect(screen.getByRole("status")).toHaveTextContent("Page 1 of 5");
  await userEvent.click(screen.getByRole("button", { name: "Next page" }));
  expect(onChange).toHaveBeenLastCalledWith(2);
  rerender(<Pagination page={5} total={5} onChange={onChange} />);
  expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "Previous page" }));
  expect(onChange).toHaveBeenLastCalledWith(4);
});

test("large page counts show the first, last and neighbours with gaps, and the current page is marked", async () => {
  const onChange = vi.fn();
  render(<Pagination page={7} total={20} onChange={onChange} />);
  const numbers = screen.getAllByRole("button", { name: /^Page \d+$/ }).map((b) => b.textContent);
  expect(numbers).toEqual(["1", "6", "7", "8", "20"]);
  expect(screen.getByRole("button", { name: "Page 7" })).toHaveAttribute("aria-current", "page");
  expect(screen.getAllByText("…")).toHaveLength(2);
  await userEvent.click(screen.getByRole("button", { name: "Page 20" }));
  expect(onChange).toHaveBeenLastCalledWith(20);
  await userEvent.click(screen.getByRole("button", { name: "Page 7" }));
  expect(onChange).toHaveBeenCalledTimes(1);
});

test("zero and one pages disable navigation without breaking the layout", () => {
  const onChange = vi.fn();
  const { rerender } = render(<Pagination page={1} total={0} onChange={onChange} />);
  expect(screen.getByRole("status")).toHaveTextContent("No pages");
  expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  expect(screen.queryByRole("button", { name: /^Page \d+$/ })).not.toBeInTheDocument();
  rerender(<Pagination page={1} total={1} onChange={onChange} />);
  expect(screen.getByRole("status")).toHaveTextContent("Page 1 of 1");
  expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
});

test("a page outside the range is clamped, labels can be changed and the ref reaches the nav", () => {
  const ref = React.createRef<HTMLElement>();
  render(<Pagination ref={ref} page={9} total={3} onChange={() => {}} label="Results" previousLabel="Back" nextLabel="Forward" className="mt-2" />);
  expect(ref.current).toBe(screen.getByRole("navigation", { name: "Results" }));
  expect(ref.current).toHaveClass("mt-2");
  expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Forward" })).toBeDisabled();
});
