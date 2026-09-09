import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Collapsible } from "../packages/ui/src/navigation";

test("the trigger announces the expanded state and toggles hidden content with Space and Enter", async () => {
  render(
    <Collapsible title="Show project details" description="Budget, dates and people.">
      <p>Hidden details</p>
    </Collapsible>,
  );
  const trigger = screen.getByRole("button", { name: "Show project details" });
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(trigger).toHaveAccessibleDescription("Budget, dates and people.");
  expect(screen.queryByText("Hidden details")).not.toBeInTheDocument();
  trigger.focus();
  await userEvent.keyboard(" ");
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  const region = screen.getByRole("region", { name: "Show project details" });
  expect(region).toHaveTextContent("Hidden details");
  expect(trigger).toHaveAttribute("aria-controls", region.id);
  await userEvent.keyboard("{Enter}");
  expect(screen.queryByText("Hidden details")).not.toBeInTheDocument();
});

test("closing while focus sits inside the content returns focus to the trigger", async () => {
  function Example() {
    const [open, setOpen] = React.useState(true);
    return (
      <Collapsible title="Filters" open={open} onOpenChange={setOpen}>
        <input aria-label="Search" />
        <button onClick={() => setOpen(false)}>Done</button>
      </Collapsible>
    );
  }
  render(<Example />);
  await userEvent.click(screen.getByRole("button", { name: "Done" }));
  expect(screen.queryByRole("textbox", { name: "Search" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Filters" })).toHaveFocus();
  expect(screen.getByRole("button", { name: "Filters" })).toHaveAttribute("aria-expanded", "false");
});

test("defaultOpen, disabled and the change callback follow the contract", async () => {
  const onOpenChange = vi.fn();
  const { rerender } = render(
    <Collapsible title="Notes" defaultOpen onOpenChange={onOpenChange}>
      <p>Note body</p>
    </Collapsible>,
  );
  expect(screen.getByText("Note body")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Notes" }));
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
  rerender(
    <Collapsible title="Notes" disabled>
      <p>Note body</p>
    </Collapsible>,
  );
  expect(screen.getByRole("button", { name: "Notes" })).toBeDisabled();
});

test("class and ref reach the root", () => {
  const ref = React.createRef<HTMLDivElement>();
  render(<Collapsible ref={ref} className="mt-2" title="More"><p>x</p></Collapsible>);
  expect(ref.current).toHaveClass("mt-2");
});
