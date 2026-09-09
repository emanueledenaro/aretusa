import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../packages/ui/src/basic";

test("forwards the ref, native attributes and a merged className", () => {
  const ref = React.createRef<HTMLSpanElement>();
  render(
    <Badge ref={ref} title="Published two days ago" data-testid="status" className="ms-2" tone="success">
      Published
    </Badge>,
  );
  expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  expect(screen.getByTestId("status")).toHaveAttribute("title", "Published two days ago");
  expect(screen.getByTestId("status")).toHaveClass("ms-2");
  expect(screen.getByTestId("status")).toHaveAttribute("data-tone", "success");
});

test("icon and dot are decorative; the label alone carries the meaning", () => {
  render(
    <>
      <Badge tone="warning" icon={<svg data-testid="icon" />}>In review</Badge>
      <Badge tone="danger" dot>Failed</Badge>
    </>,
  );
  expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
  const failed = screen.getByText("Failed");
  expect(failed.firstElementChild).toHaveAttribute("aria-hidden", "true");
  expect(failed).toHaveTextContent(/^Failed$/);
});

test("variants and sizes render every tone with visible text and exposed data attributes", () => {
  const tones = ["neutral", "info", "success", "warning", "danger"] as const;
  render(
    <>
      {tones.map((tone) => (
        <Badge key={tone} tone={tone} variant="outline" size="sm">{tone}</Badge>
      ))}
    </>,
  );
  for (const tone of tones) {
    const badge = screen.getByText(tone);
    expect(badge).toHaveAttribute("data-variant", "outline");
    expect(badge).toHaveAttribute("data-size", "sm");
  }
});

test("a long label stays inside the badge and can sit next to a control", () => {
  render(
    <div style={{ width: 240 }}>
      <Badge>Waiting for the printing room to confirm the reservation</Badge>
      <button type="button">Open</button>
    </div>,
  );
  expect(screen.getByText(/printing room/)).toBeVisible();
  expect(screen.getByRole("button", { name: "Open" })).toBeVisible();
});
