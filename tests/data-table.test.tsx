import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "../packages/ui/src/data";

const rows = [
  { id: "1", name: "Field notes", status: "Published", amount: 120 },
  { id: "2", name: "Quiet interfaces", status: "Draft", amount: 85 },
  { id: "3", name: "The workshop", status: "Published", amount: 240 },
  { id: "4", name: "Open studio", status: "Review", amount: 160 },
  { id: "5", name: "Small details", status: "Draft", amount: 40 },
  { id: "6", name: "A new beginning", status: "Published", amount: 300 },
];
function bodyRows() {
  return within(screen.getByRole("table")).getAllByRole("row").slice(1);
}
function firstCells() {
  return bodyRows().map((row) => within(row).getAllByRole("cell")[0].textContent);
}

test("the default columns keep the original order, format amounts and page five rows at a time", async () => {
  render(<DataTable rows={rows} />);
  expect(screen.getByRole("table", { name: "6 records" })).toBeInTheDocument();
  expect(firstCells()).toEqual(["Field notes", "Quiet interfaces", "The workshop", "Open studio", "Small details"]);
  expect(screen.getByRole("cell", { name: "€120.00" })).toBeInTheDocument();
  expect(screen.getByText("Showing 1 to 5 of 6")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(firstCells()).toEqual(["A new beginning"]);
});

test("filtering narrows the rows, returns to the first page and shows the empty state when nothing matches", async () => {
  render(<DataTable rows={rows} />);
  await userEvent.click(screen.getByRole("button", { name: "Next" }));
  await userEvent.type(screen.getByRole("searchbox", { name: "Filter records" }), "studio");
  expect(firstCells()).toEqual(["Open studio"]);
  expect(screen.getByText("Showing 1 to 1 of 1")).toBeInTheDocument();
  await userEvent.type(screen.getByRole("searchbox", { name: "Filter records" }), "zzz");
  expect(screen.getByRole("heading", { name: "No matching records" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Clear filter" }));
  expect(firstCells()).toHaveLength(5);
});

test("a sortable header cycles ascending and descending and exposes aria-sort", async () => {
  const onSortChange = vi.fn();
  render(<DataTable rows={rows} onSortChange={onSortChange} />);
  const amount = screen.getByRole("columnheader", { name: "Amount" });
  expect(amount).toHaveAttribute("aria-sort", "none");
  await userEvent.click(within(amount).getByRole("button"));
  expect(amount).toHaveAttribute("aria-sort", "ascending");
  expect(firstCells()).toEqual(["Small details", "Quiet interfaces", "Field notes", "Open studio", "The workshop"]);
  expect(onSortChange).toHaveBeenLastCalledWith({ key: "amount", direction: "ascending" });
  await userEvent.click(within(amount).getByRole("button"));
  expect(amount).toHaveAttribute("aria-sort", "descending");
  expect(firstCells()[0]).toBe("A new beginning");
  await userEvent.click(within(screen.getByRole("columnheader", { name: "Name" })).getByRole("button"));
  expect(firstCells()[0]).toBe("A new beginning");
  expect(amount).toHaveAttribute("aria-sort", "none");
});

test("selection uses named checkboxes, a page-level select all with a mixed state and reports the ids", async () => {
  const onSelectionChange = vi.fn();
  render(<DataTable rows={rows} selectable onSelectionChange={onSelectionChange} bulkActions={(ids) => <button>Archive {ids.length}</button>} />);
  await userEvent.click(screen.getByRole("checkbox", { name: "Select Field notes" }));
  expect(onSelectionChange).toHaveBeenLastCalledWith(["1"]);
  expect(bodyRows()[0]).toHaveAttribute("aria-selected", "true");
  const all = screen.getByRole("checkbox", { name: "Select all rows on this page" });
  expect(all).toHaveAttribute("aria-checked", "mixed");
  expect(screen.getByText("1 selected")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Archive 1" })).toBeInTheDocument();
  await userEvent.click(all);
  expect(onSelectionChange).toHaveBeenLastCalledWith(["1", "2", "3", "4", "5"]);
  expect(all).toHaveAttribute("aria-checked", "true");
  await userEvent.click(all);
  expect(onSelectionChange).toHaveBeenLastCalledWith([]);
});

test("controlled selection follows the caller", async () => {
  function Owner() {
    const [selected, setSelected] = React.useState<string[]>(["2"]);
    return (
      <>
        <button onClick={() => setSelected([])}>Reset</button>
        <DataTable rows={rows} selectable selected={selected} onSelectionChange={setSelected} />
      </>
    );
  }
  render(<Owner />);
  expect(screen.getByRole("checkbox", { name: "Select Quiet interfaces" })).toHaveAttribute("aria-checked", "true");
  await userEvent.click(screen.getByRole("button", { name: "Reset" }));
  expect(screen.getByRole("checkbox", { name: "Select Quiet interfaces" })).toHaveAttribute("aria-checked", "false");
});

test("loading marks the table busy and an error offers a retry", async () => {
  const onRetry = vi.fn();
  const { rerender } = render(<DataTable rows={[]} loading />);
  expect(screen.getByRole("region", { name: "Loading records" })).toHaveAttribute("aria-busy", "true");
  rerender(<DataTable rows={[]} error="The records could not be loaded." onRetry={onRetry} />);
  expect(screen.getByRole("alert")).toHaveTextContent("The records could not be loaded.");
  await userEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(onRetry).toHaveBeenCalledTimes(1);
});

test("custom columns render their own cells and filter over the declared keys", async () => {
  type Member = { id: string; name: string; role: string; notes: number };
  const members: Member[] = [
    { id: "a", name: "Alex Rivers", role: "Design", notes: 42 },
    { id: "b", name: "Sam Odell", role: "Engineering", notes: 7 },
  ];
  render(
    <DataTable<Member>
      rows={members}
      caption="Members"
      filterKeys={["role"]}
      columns={[
        { key: "name", header: "Member", sortable: true },
        { key: "role", header: "Role" },
        { key: "notes", header: "Notes", align: "end", sortable: true, cell: (row) => row.notes + " notes" },
      ]}
    />,
  );
  expect(screen.getByRole("cell", { name: "42 notes" })).toBeInTheDocument();
  await userEvent.type(screen.getByRole("searchbox", { name: "Filter Members" }), "engineering");
  expect(firstCells()).toEqual(["Sam Odell"]);
});
