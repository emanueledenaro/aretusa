import React from "react";
import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Table } from "../packages/ui/src/data";

test("string columns keep the original contract: a caption names the scroll region and the table", () => {
  render(<Table caption="Projects" columns={["Name", "Status"]} rows={[["Field notes", "Draft"]]} />);
  const region = screen.getByRole("region", { name: "Projects" });
  expect(region).toHaveAttribute("tabindex", "0");
  expect(region.className).toContain("a-scrollbar");
  const table = screen.getByRole("table", { name: "Projects" });
  expect(within(table).getAllByRole("columnheader").map((h) => h.textContent)).toEqual(["Name", "Status"]);
  expect(within(table).getByRole("cell", { name: "Draft" })).toBeInTheDocument();
});

test("column objects align numbers to the end and keep the alignment in every cell", () => {
  render(
    <Table
      caption="Budget"
      columns={["Project", { header: "Amount", align: "end" }]}
      rows={[["Field notes", "120"], ["Open studio", "1,200"]]}
    />,
  );
  const header = screen.getByRole("columnheader", { name: "Amount" });
  expect(header.className).toContain("text-end");
  const cells = screen.getAllByRole("cell").filter((cell) => cell.className.includes("text-end"));
  expect(cells.map((cell) => cell.textContent)).toEqual(["120", "1,200"]);
});

test("no rows renders one explanatory row across every column", () => {
  render(<Table caption="Projects" columns={["Name", "Status", "Amount"]} rows={[]} emptyMessage="No projects match." />);
  const cell = screen.getByRole("cell", { name: "No projects match." });
  expect(cell).toHaveAttribute("colspan", "3");
});

test("loading marks the region busy and keeps the header visible", () => {
  render(<Table caption="Projects" columns={["Name", "Status"]} rows={[]} loading />);
  expect(screen.getByRole("region", { name: "Projects" })).toHaveAttribute("aria-busy", "true");
  expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
  expect(screen.getByText("Loading Projects")).toBeInTheDocument();
});

test("row objects carry a key, a selected state and per-row cells; hideCaption keeps the caption for assistive technology", () => {
  render(
    <Table
      caption="Projects"
      hideCaption
      columns={["Name", "Status"]}
      rows={[
        { key: "a", cells: ["Field notes", "Draft"], selected: true },
        { key: "b", cells: ["Open studio", "Review"] },
      ]}
    />,
  );
  const table = screen.getByRole("table", { name: "Projects" });
  const rows = within(table).getAllByRole("row").slice(1);
  expect(rows[0]).toHaveAttribute("aria-selected", "true");
  expect(rows[1]).not.toHaveAttribute("aria-selected");
  expect(screen.getByText("Projects").className).toContain("sr-only");
});
