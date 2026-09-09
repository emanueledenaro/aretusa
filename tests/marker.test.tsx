import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Marker } from "../packages/ui/src/conversation";

test("a date marker keeps its text readable, carries a machine readable value and is not a live region", () => {
  render(<Marker dateTime="2026-03-04">Today</Marker>);
  const label = screen.getByText("Today");
  expect(label.tagName).toBe("TIME");
  expect(label).toHaveAttribute("datetime", "2026-03-04");
  const marker = label.closest("[data-tone]") as HTMLElement;
  expect(marker).not.toHaveAttribute("aria-live");
  expect(marker).not.toHaveAttribute("role");
  expect(marker.querySelectorAll("[aria-hidden]")).toHaveLength(2);
});

test("accent tone, sticky placement, ref and caller props are exposed", () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <Marker ref={ref} tone="accent" sticky id="unread" data-testid="marker">
      3 unread messages
    </Marker>,
  );
  const marker = screen.getByTestId("marker");
  expect(ref.current).toBe(marker);
  expect(marker).toHaveAttribute("id", "unread");
  expect(marker).toHaveAttribute("data-tone", "accent");
  expect(marker.className).toContain("sticky");
  expect(marker.className).toContain("text-terracotta");
});

test("a long label wraps in the centre while the lines keep a minimum length", () => {
  render(<Marker>Conversation moved to the printing room channel on Wednesday afternoon after the review</Marker>);
  const label = screen.getByText(/printing room/);
  expect(label.className).toContain("text-center");
  expect(label.className).toContain("min-w-0");
  const line = label.parentElement?.querySelector("[aria-hidden]") as HTMLElement;
  expect(line.className).toContain("min-w-4");
});
