import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fr } from "react-day-picker/locale";
import type { DateRange } from "react-day-picker";
import { Calendar } from "../packages/ui/src/forms";

const september = new Date(2026, 8, 1);

test("callers can hide adjacent month dates", () => {
  render(
    <Calendar mode="single" defaultMonth={september} showOutsideDays={false} />,
  );
  expect(
    screen.queryByRole("button", { name: /August 31st, 2026/ }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /September 1st, 2026/ }),
  ).toBeVisible();
});

test("single selection toggles without a controlled callback and required prevents clearing", async () => {
  const { rerender } = render(
    <Calendar mode="single" defaultMonth={september} />,
  );
  const day = screen.getByRole("button", { name: /September 8th, 2026/ });
  await userEvent.click(day);
  expect(day.closest("td")).toHaveAttribute("aria-selected", "true");
  await userEvent.click(day);
  expect(day.closest("td")).not.toHaveAttribute("aria-selected");
  rerender(
    <Calendar
      mode="single"
      defaultMonth={september}
      required
      selected={undefined}
    />,
  );
  await userEvent.click(day);
  await userEvent.click(day);
  expect(day.closest("td")).toHaveAttribute("aria-selected", "true");
});

test("controlled selection waits for the caller and preserves selection event details", async () => {
  const onSelect = vi.fn();
  const initial = new Date(2026, 8, 8);
  const { rerender } = render(
    <Calendar
      mode="single"
      defaultMonth={september}
      selected={initial}
      onSelect={onSelect}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: /September 9th, 2026/ }),
  );
  expect(onSelect).toHaveBeenCalledWith(
    new Date(2026, 8, 9),
    new Date(2026, 8, 9),
    expect.objectContaining({ disabled: false }),
    expect.objectContaining({ type: "click" }),
  );
  expect(
    screen.getByRole("button", { name: /September 8th, 2026/ }).closest("td"),
  ).toHaveAttribute("aria-selected", "true");
  rerender(
    <Calendar
      mode="single"
      defaultMonth={september}
      selected={new Date(2026, 8, 9)}
      onSelect={onSelect}
    />,
  );
  expect(
    screen.getByRole("button", { name: /September 9th, 2026/ }).closest("td"),
  ).toHaveAttribute("aria-selected", "true");
});

test("multiple selection protects its minimum and restarts when its maximum is exceeded", async () => {
  render(<Calendar mode="multiple" defaultMonth={september} min={1} max={2} />);
  const first = screen.getByRole("button", { name: /September 8th, 2026/ });
  const second = screen.getByRole("button", { name: /September 9th, 2026/ });
  await userEvent.click(first);
  await userEvent.click(first);
  expect(first.closest("td")).toHaveAttribute("aria-selected", "true");
  await userEvent.click(second);
  expect(screen.getAllByRole("gridcell", { selected: true })).toHaveLength(2);
  await userEvent.click(
    screen.getByRole("button", { name: /September 10th, 2026/ }),
  );
  expect(screen.getAllByRole("gridcell", { selected: true })).toHaveLength(1);
  expect(
    screen.getByRole("button", { name: /September 10th, 2026/ }).closest("td"),
  ).toHaveAttribute("aria-selected", "true");
  await userEvent.click(second);
  expect(screen.getAllByRole("gridcell", { selected: true })).toHaveLength(2);
  await userEvent.click(second);
  expect(screen.getAllByRole("gridcell", { selected: true })).toHaveLength(1);
});

test("range selection spans month boundaries with start, middle and end states", async () => {
  function Booking() {
    const [range, setRange] = React.useState<DateRange>();
    return (
      <Calendar
        mode="range"
        defaultMonth={september}
        numberOfMonths={2}
        showOutsideDays={false}
        selected={range}
        onSelect={setRange}
        footer={range?.to ? "Dates selected" : "Choose dates"}
      />
    );
  }
  render(<Booking />);
  await userEvent.click(
    screen.getByRole("button", { name: /September 29th, 2026/ }),
  );
  await userEvent.click(
    screen.getByRole("button", { name: /October 2nd, 2026/ }),
  );
  expect(
    screen
      .getAllByRole("button")
      .filter((button) => button.closest("[aria-selected=true]")),
  ).toHaveLength(4);
  expect(
    screen.getByRole("button", { name: /September 29th, 2026/ }).closest("td"),
  ).toHaveClass("rdp-range_start");
  expect(
    screen.getByRole("button", { name: /September 30th, 2026/ }).closest("td"),
  ).toHaveClass("rdp-range_middle");
  expect(
    screen.getByRole("button", { name: /October 2nd, 2026/ }).closest("td"),
  ).toHaveClass("rdp-range_end");
  expect(screen.getByText("Dates selected")).toHaveAttribute("role", "status");
});

test("excluded disabled dates restart a range instead of selecting through them", async () => {
  render(
    <Calendar
      mode="range"
      defaultMonth={september}
      disabled={new Date(2026, 8, 10)}
      excludeDisabled
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: /September 8th, 2026/ }),
  );
  const disabled = screen.getByRole("button", { name: /September 10th, 2026/ });
  expect(disabled).toBeDisabled();
  await userEvent.click(disabled);
  expect(disabled.closest("td")).not.toHaveAttribute("aria-selected");
  await userEvent.click(
    screen.getByRole("button", { name: /September 12th, 2026/ }),
  );
  expect(screen.getAllByRole("gridcell", { selected: true })).toHaveLength(1);
  expect(
    screen.getByRole("button", { name: /September 12th, 2026/ }).closest("td"),
  ).toHaveAttribute("aria-selected", "true");
});

test("arrow keys skip disabled dates and cross the visible month boundary", async () => {
  render(
    <Calendar
      mode="single"
      defaultMonth={september}
      selected={new Date(2026, 8, 29)}
      disabled={new Date(2026, 8, 30)}
      autoFocus
    />,
  );
  expect(
    screen.getByRole("button", { name: /September 29th, 2026/ }),
  ).toHaveFocus();
  await userEvent.keyboard("{ArrowRight}");
  expect(
    screen.getByRole("button", { name: /October 1st, 2026/ }),
  ).toHaveFocus();
  expect(screen.getByRole("grid", { name: "October 2026" })).toBeVisible();
  await userEvent.keyboard("{Enter}");
  expect(
    screen.getByRole("button", { name: /October 1st, 2026/ }).closest("td"),
  ).toHaveAttribute("aria-selected", "true");
});

test("Home, End and PageUp/PageDown keep keyboard focus on the expected date", async () => {
  render(
    <Calendar
      mode="single"
      defaultMonth={september}
      selected={new Date(2026, 8, 16)}
      autoFocus
      weekStartsOn={1}
    />,
  );
  await userEvent.keyboard("{Home}");
  expect(
    screen.getByRole("button", { name: /September 14th, 2026/ }),
  ).toHaveFocus();
  await userEvent.keyboard("{End}");
  expect(
    screen.getByRole("button", { name: /September 20th, 2026/ }),
  ).toHaveFocus();
  await userEvent.keyboard("{PageDown}");
  expect(
    screen.getByRole("button", { name: /October 20th, 2026/ }),
  ).toHaveFocus();
  await userEvent.keyboard("{PageUp}");
  expect(
    screen.getByRole("button", { name: /September 20th, 2026/ }),
  ).toHaveFocus();
});

test("controlled month navigation respects both bounds and does not submit forms", async () => {
  const onMonthChange = vi.fn();
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
  const { rerender } = render(
    <form onSubmit={onSubmit}>
      <Calendar
        mode="single"
        month={september}
        onMonthChange={onMonthChange}
        startMonth={september}
        endMonth={new Date(2026, 9)}
      />
    </form>,
  );
  expect(
    screen.getByRole("button", { name: /previous month/i }),
  ).toHaveAttribute("aria-disabled", "true");
  await userEvent.click(
    screen.getByRole("button", { name: /previous month/i }),
  );
  expect(onMonthChange).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole("button", { name: /next month/i }));
  expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 9, 1));
  expect(screen.getByRole("grid", { name: "September 2026" })).toBeVisible();
  await userEvent.click(
    screen.getByRole("button", { name: /September 8th, 2026/ }),
  );
  expect(onSubmit).not.toHaveBeenCalled();
  rerender(
    <Calendar
      mode="single"
      month={new Date(2026, 9)}
      onMonthChange={onMonthChange}
      startMonth={september}
      endMonth={new Date(2026, 9)}
    />,
  );
  expect(screen.getByRole("button", { name: /next month/i })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
});

test("localized captions and weekday names follow locale and week-start options", () => {
  render(
    <Calendar
      mode="single"
      defaultMonth={september}
      locale={fr}
      today={new Date(2026, 8, 8)}
      weekStartsOn={1}
    />,
  );
  expect(screen.getByRole("grid", { name: "septembre 2026" })).toBeVisible();
  expect(
    screen.getAllByRole("columnheader", { hidden: true })[0],
  ).toHaveAttribute("aria-label", "lundi");
  expect(
    screen.getByRole("button", { name: /mardi 8 septembre 2026/ }),
  ).toHaveAccessibleName(/aujourd'hui/i);
});

test("dropdown month and year choices update the displayed calendar", async () => {
  render(
    <Calendar
      mode="single"
      defaultMonth={september}
      captionLayout="dropdown"
      startMonth={new Date(2025, 0)}
      endMonth={new Date(2027, 11)}
    />,
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Choose the Month" }),
    "11",
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Choose the Year" }),
    "2027",
  );
  expect(screen.getByRole("grid", { name: "December 2027" })).toBeVisible();
});

test("RTL changes horizontal keyboard movement and custom day labels are retained", async () => {
  render(
    <Calendar
      mode="single"
      dir="rtl"
      defaultMonth={september}
      selected={new Date(2026, 8, 8)}
      autoFocus
      labels={{
        labelDayButton: (date) =>
          `Book ${date.getDate()}/${date.getMonth() + 1}`,
      }}
    />,
  );
  await userEvent.keyboard("{ArrowRight}");
  expect(screen.getByRole("button", { name: "Book 7/9" })).toHaveFocus();
});

test("week numbers and fixed weeks preserve the seven weekday columns", () => {
  render(
    <Calendar
      mode="single"
      defaultMonth={september}
      fixedWeeks
      showWeekNumber
      ISOWeek
    />,
  );
  const grid = screen.getByRole("grid", { name: "September 2026" });
  expect(within(grid).getAllByRole("row")).toHaveLength(6);
  expect(
    within(grid).getAllByRole("columnheader", { hidden: true }),
  ).toHaveLength(8);
  expect(within(grid).getAllByRole("rowheader")).toHaveLength(6);
});

test("custom components, day modifiers, styles and day events remain available", async () => {
  const onDayClick = vi.fn();
  render(
    <Calendar
      defaultMonth={september}
      onDayClick={onDayClick}
      classNames={{ month_caption: "custom-caption" }}
      styles={{ month_caption: { color: "red" } }}
      modifiers={{ booked: new Date(2026, 8, 8) }}
      modifiersClassNames={{ booked: "booked-date" }}
      components={{
        Footer: (props) => <div {...props} data-testid="custom-footer" />,
      }}
      footer="Availability updated"
    />,
  );
  const date = screen.getByRole("button", { name: /September 8th, 2026/ });
  await userEvent.click(date);
  expect(onDayClick).toHaveBeenCalledWith(
    new Date(2026, 8, 8),
    expect.objectContaining({ booked: true }),
    expect.objectContaining({ type: "click" }),
  );
  expect(date.closest("td")).toHaveClass("booked-date");
  expect(screen.getByText("September 2026").parentElement).toHaveClass(
    "custom-caption",
  );
  expect(screen.getByText("September 2026").parentElement).toHaveStyle({
    color: "rgb(255, 0, 0)",
  });
  expect(screen.getByTestId("custom-footer")).toHaveTextContent(
    "Availability updated",
  );
});

test("read-only, fully disabled and hidden days keep their distinct public behavior", () => {
  const { rerender } = render(
    <Calendar defaultMonth={september} hideNavigation />,
  );
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(screen.getByRole("grid", { name: "September 2026" })).toBeVisible();
  rerender(
    <Calendar
      mode="single"
      defaultMonth={september}
      disabled
      hidden={new Date(2026, 8, 10)}
      hideNavigation
    />,
  );
  expect(
    screen.queryByRole("button", { name: /September 10th, 2026/ }),
  ).not.toBeInTheDocument();
  expect(
    screen
      .getAllByRole("button")
      .every((button) => button.hasAttribute("disabled")),
  ).toBe(true);
});

test("explicit around navigation keeps its caller-selected keyboard order", async () => {
  render(
    <Calendar
      mode="single"
      defaultMonth={september}
      captionLayout="dropdown"
      navLayout="around"
      startMonth={new Date(2025, 0)}
      endMonth={new Date(2027, 11)}
    />,
  );
  await userEvent.tab();
  expect(screen.getByRole("button", { name: /previous month/i })).toHaveFocus();
  await userEvent.tab();
  expect(
    screen.getByRole("combobox", { name: "Choose the Month" }),
  ).toHaveFocus();
});

test("dropdown captions precede navigation in the default keyboard order", async () => {
  render(
    <Calendar
      mode="single"
      defaultMonth={september}
      captionLayout="dropdown"
      startMonth={new Date(2025, 0)}
      endMonth={new Date(2027, 11)}
    />,
  );
  await userEvent.tab();
  expect(
    screen.getByRole("combobox", { name: "Choose the Month" }),
  ).toHaveFocus();
  await userEvent.tab();
  expect(
    screen.getByRole("combobox", { name: "Choose the Year" }),
  ).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole("button", { name: /previous month/i })).toHaveFocus();
});

test("caller root styling, identity and accessible name survive composition", () => {
  render(
    <Calendar
      id="booking-calendar"
      role="application"
      aria-label="Booking dates"
      className="booking-calendar"
      style={{ maxWidth: "40rem" }}
    />,
  );
  const calendar = screen.getByRole("application", { name: "Booking dates" });
  expect(calendar).toHaveClass("a-calendar", "booking-calendar");
  expect(calendar).toHaveAttribute("id", "booking-calendar");
  expect(calendar).toHaveStyle({ maxWidth: "40rem" });
});
