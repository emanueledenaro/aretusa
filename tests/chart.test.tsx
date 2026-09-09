import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chart } from "../packages/ui/src/data";

const data = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 28 },
  { name: "Wed", value: 21 },
  { name: "Thu", value: 45 },
  { name: "Fri", value: 38 },
];

test("the figure is named by its label, summarises the range and offers the data as a table", async () => {
  render(<Chart label="Weekly contributions" data={data} />);
  const figure = screen.getByRole("figure", { name: "Weekly contributions" });
  expect(within(figure).getByText("Weekly contributions ranges from 12 (Mon) to 45 (Thu) across 5 periods.")).toBeInTheDocument();
  await userEvent.click(screen.getByText("View data as a table"));
  const table = screen.getByRole("table", { name: "Weekly contributions" });
  expect(within(table).getAllByRole("columnheader").map((h) => h.textContent)).toEqual(["Period", "Weekly contributions"]);
  expect(within(table).getByRole("cell", { name: "45" })).toBeInTheDocument();
});

test("several series get a legend, one table column each and their own formatted values", async () => {
  const rows = [
    { name: "Jan", plates: 12, prints: 30 },
    { name: "Feb", plates: 18, prints: 26 },
  ];
  render(
    <Chart
      label="Studio output"
      kind="bar"
      data={rows}
      series={[
        { key: "plates", label: "Plates" },
        { key: "prints", label: "Prints" },
      ]}
      valueFormatter={(value) => value + " pcs"}
    />,
  );
  const legend = screen.getByRole("list", { name: "Series" });
  expect(within(legend).getAllByRole("listitem").map((item) => item.textContent)).toEqual(["Plates", "Prints"]);
  await userEvent.click(screen.getByText("View data as a table"));
  const table = screen.getByRole("table", { name: "Studio output" });
  expect(within(table).getAllByRole("columnheader").map((h) => h.textContent)).toEqual(["Period", "Plates", "Prints"]);
  expect(within(table).getByRole("cell", { name: "30 pcs" })).toBeInTheDocument();
  expect(screen.getByText("Plates ranges from 12 pcs (Jan) to 18 pcs (Feb) across 2 periods.")).toBeInTheDocument();
});

test("no data shows the empty state instead of an empty drawing", () => {
  render(<Chart label="Weekly contributions" data={[]} />);
  expect(screen.getByRole("heading", { name: "No chart data" })).toBeInTheDocument();
  expect(screen.queryByText("View data as a table")).not.toBeInTheDocument();
});

test("loading marks the figure busy and an error offers a retry", async () => {
  const onRetry = vi.fn();
  const { rerender } = render(<Chart label="Weekly contributions" data={[]} loading />);
  expect(screen.getByRole("figure", { name: "Weekly contributions" })).toHaveAttribute("aria-busy", "true");
  expect(screen.getByText("Loading Weekly contributions")).toBeInTheDocument();
  rerender(<Chart label="Weekly contributions" data={[]} error="The series could not be loaded." onRetry={onRetry} />);
  expect(screen.getByRole("alert")).toHaveTextContent("The series could not be loaded.");
  await userEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(onRetry).toHaveBeenCalledTimes(1);
});

test("line, bar and area kinds render the same accessible frame and the table can start open", () => {
  for (const kind of ["line", "bar", "area"] as const) {
    const { unmount } = render(<Chart label={kind + " chart"} kind={kind} data={data} tableOpen description="Example data." />);
    expect(screen.getByRole("figure", { name: kind + " chart" })).toBeInTheDocument();
    expect(screen.getByText("Example data.")).toBeInTheDocument();
    expect(screen.getByRole("table", { name: kind + " chart" })).toBeInTheDocument();
    unmount();
  }
});

test("compact keeps the caption for assistive technology and a single value still summarises", () => {
  render(<Chart label="Today" data={[{ name: "Now", value: 3 }]} compact />);
  const figure = screen.getByRole("figure", { name: "Today" });
  expect(figure.querySelector("figcaption")?.className).toContain("sr-only");
  expect(screen.getByText("Today is 3 (Now).")).toBeInTheDocument();
});
