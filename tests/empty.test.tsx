import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Empty } from "../packages/ui/src/empty";

test("renders a heading at the requested level with the explanation and a working action", async () => {
  const onCreate = vi.fn();
  const ref = React.createRef<HTMLDivElement>();
  render(
    <Empty ref={ref} id="projects-empty" title="No projects yet" headingLevel={2} action={<button onClick={onCreate}>Create project</button>}>
      Your first project belongs here.
    </Empty>,
  );
  expect(ref.current).toHaveAttribute("id", "projects-empty");
  expect(screen.getByRole("heading", { level: 2, name: "No projects yet" })).toBeInTheDocument();
  expect(screen.getByText("Your first project belongs here.")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Create project" }));
  expect(onCreate).toHaveBeenCalledTimes(1);
});

test("defaults to a level three heading with no icon", () => {
  render(<Empty title="Choose a component" />);
  expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Choose a component");
  expect(document.querySelector("svg")).toBeNull();
});

test("variants carry a hidden default icon that the caller can replace or remove", () => {
  const { rerender } = render(<Empty variant="search" title="No results" />);
  const root = screen.getByRole("heading").closest("[data-variant]");
  expect(root).toHaveAttribute("data-variant", "search");
  expect(root?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  rerender(<Empty variant="error" title="Could not load" icon={<span data-testid="custom" />} />);
  expect(screen.getByTestId("custom")).toBeInTheDocument();
  expect(document.querySelector("svg")).toBeNull();
  rerender(<Empty variant="permission" title="Members only" icon={null} />);
  expect(document.querySelector("svg")).toBeNull();
  expect(screen.queryByTestId("custom")).toBeNull();
});
