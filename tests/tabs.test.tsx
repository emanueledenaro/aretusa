import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "../packages/ui/src/navigation";

const items = [
  { value: "overview", label: "Overview", content: <p>Overview panel</p> },
  { value: "activity", label: "Activity", content: <p>Activity panel</p> },
  { value: "billing", label: "Billing", content: <p>Billing panel</p>, disabled: true },
  { value: "settings", label: "Settings", content: <input aria-label="Workspace name" /> },
];

test("arrow keys move focus and selection, Home and End jump, disabled tabs are skipped", async () => {
  render(<Tabs label="Project sections" items={items} />);
  const list = screen.getByRole("tablist", { name: "Project sections" });
  expect(list).toBeInTheDocument();
  const overview = screen.getByRole("tab", { name: "Overview" });
  expect(overview).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel", { name: "Overview" })).toHaveTextContent("Overview panel");
  await userEvent.tab();
  expect(overview).toHaveFocus();
  await userEvent.keyboard("{ArrowRight}");
  const activity = screen.getByRole("tab", { name: "Activity" });
  expect(activity).toHaveFocus();
  expect(activity).toHaveAttribute("aria-selected", "true");
  await userEvent.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: "Settings" })).toHaveFocus();
  expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute("data-disabled");
  await userEvent.keyboard("{Home}");
  expect(overview).toHaveFocus();
  await userEvent.keyboard("{End}");
  expect(screen.getByRole("tab", { name: "Settings" })).toHaveFocus();
  expect(screen.getByRole("tabpanel", { name: "Settings" })).toBeInTheDocument();
  await userEvent.tab();
  expect(screen.getByRole("tabpanel", { name: "Settings" })).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole("textbox", { name: "Workspace name" })).toHaveFocus();
});

test("each tab controls its panel and only the selected panel is rendered", () => {
  render(<Tabs items={items} defaultValue="activity" />);
  const activity = screen.getByRole("tab", { name: "Activity" });
  const panel = screen.getByRole("tabpanel", { name: "Activity" });
  expect(activity).toHaveAttribute("aria-controls", panel.id);
  expect(panel).toHaveAttribute("aria-labelledby", activity.id);
  expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
  expect(screen.queryByText("Overview panel")).not.toBeInTheDocument();
});

test("controlled value follows the caller and reports changes", async () => {
  const onValueChange = vi.fn();
  function Controlled() {
    const [value, setValue] = React.useState("overview");
    return (
      <>
        <Tabs items={items} value={value} onValueChange={(next) => { onValueChange(next); setValue(next); }} />
        <button onClick={() => setValue("settings")}>Jump to settings</button>
      </>
    );
  }
  render(<Controlled />);
  await userEvent.click(screen.getByRole("tab", { name: "Activity" }));
  expect(onValueChange).toHaveBeenLastCalledWith("activity");
  expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute("aria-selected", "true");
  await userEvent.click(screen.getByRole("button", { name: "Jump to settings" }));
  expect(screen.getByRole("tab", { name: "Settings" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel", { name: "Settings" })).toBeInTheDocument();
});

test("variants, native attributes and the ref reach the root", () => {
  const ref = React.createRef<HTMLDivElement>();
  const { container } = render(<Tabs ref={ref} items={items} variant="line" className="mt-2" data-testid="tabs-root" />);
  expect(ref.current).toBe(screen.getByTestId("tabs-root"));
  expect(ref.current).toHaveClass("mt-2");
  expect(container.querySelector("[data-variant='line']")).toBe(screen.getByRole("tablist"));
});
