import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "../packages/ui/src/navigation";

const items = [
  { title: "Can I customize the source?", content: "Yes. The source is yours to adapt." },
  { title: "Does it support keyboard navigation?", content: "Each component documents its keyboard behavior." },
  { title: "Archived question", content: "Hidden", disabled: true },
  { title: "Where do I report a problem?", content: <input aria-label="Report" /> },
];

test("single mode opens one item at a time, arrow keys move between headers and disabled ones are skipped", async () => {
  render(<Accordion items={items} />);
  const first = screen.getByRole("button", { name: "Can I customize the source?" });
  const second = screen.getByRole("button", { name: "Does it support keyboard navigation?" });
  expect(first).toHaveAttribute("aria-expanded", "false");
  await userEvent.click(first);
  expect(first).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("region", { name: "Can I customize the source?" })).toHaveTextContent("Yes.");
  await userEvent.keyboard("{ArrowDown}");
  expect(second).toHaveFocus();
  await userEvent.keyboard("{Enter}");
  expect(second).toHaveAttribute("aria-expanded", "true");
  expect(first).toHaveAttribute("aria-expanded", "false");
  await userEvent.keyboard("{ArrowDown}");
  expect(screen.getByRole("button", { name: "Where do I report a problem?" })).toHaveFocus();
  expect(screen.getByRole("button", { name: "Archived question" })).toBeDisabled();
  await userEvent.keyboard("{Home}");
  expect(first).toHaveFocus();
  await userEvent.keyboard("{End}");
  expect(screen.getByRole("button", { name: "Where do I report a problem?" })).toHaveFocus();
  await userEvent.keyboard(" ");
  await userEvent.keyboard(" ");
  expect(screen.getByRole("button", { name: "Where do I report a problem?" })).toHaveAttribute("aria-expanded", "false");
});

test("multiple mode keeps several items open and reports the open values", async () => {
  const onValueChange = vi.fn();
  render(<Accordion type="multiple" items={items} defaultValue={["0"]} onValueChange={onValueChange} />);
  await userEvent.click(screen.getByRole("button", { name: "Does it support keyboard navigation?" }));
  expect(onValueChange).toHaveBeenLastCalledWith(["0", "1"]);
  expect(screen.getAllByRole("region")).toHaveLength(2);
});

test("a form inside the content keeps typing to itself and a controlled single value follows the caller", async () => {
  function Controlled() {
    const [value, setValue] = React.useState("3");
    return (
      <>
        <Accordion items={items} value={value} onValueChange={setValue} headingLevel={2} />
        <button onClick={() => setValue("0")}>Open first</button>
      </>
    );
  }
  render(<Controlled />);
  const field = screen.getByRole("textbox", { name: "Report" });
  await userEvent.type(field, "Broken link ");
  expect(field).toHaveValue("Broken link ");
  expect(screen.getByRole("button", { name: "Where do I report a problem?" })).toHaveAttribute("aria-expanded", "true");
  expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(4);
  await userEvent.click(screen.getByRole("button", { name: "Open first" }));
  expect(screen.getByRole("button", { name: "Can I customize the source?" })).toHaveAttribute("aria-expanded", "true");
  expect(screen.queryByRole("textbox", { name: "Report" })).not.toBeInTheDocument();
});

test("custom item values, class and ref reach the root", () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <Accordion
      ref={ref}
      className="mt-4"
      items={[{ value: "faq-billing", title: "Billing", content: "Monthly." }]}
      defaultValue="faq-billing"
    />,
  );
  expect(ref.current).toHaveClass("mt-4");
  expect(screen.getByRole("button", { name: "Billing" })).toHaveAttribute("aria-expanded", "true");
});
