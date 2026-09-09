import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "../packages/ui/src/alert";

test("errors are assertive, the other tones are polite and live can be switched off", () => {
  const { rerender } = render(<Alert tone="error" title="Upload failed" />);
  expect(screen.getByRole("alert")).toHaveAttribute("data-tone", "error");
  rerender(<Alert tone="warning" title="Storage almost full" />);
  expect(screen.getByRole("status")).toHaveAttribute("data-tone", "warning");
  rerender(<Alert tone="success" title="Saved" live="assertive" />);
  expect(screen.getByRole("alert")).toHaveTextContent("Saved");
  rerender(<Alert title="An early release" live="off" />);
  expect(screen.queryByRole("status")).toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.getByText("An early release")).toBeInTheDocument();
});

test("the dismiss control is named, calls back and the root forwards ref and attributes", async () => {
  const onDismiss = vi.fn();
  const ref = React.createRef<HTMLDivElement>();
  render(<Alert ref={ref} id="saved" title="Your work is saved" onDismiss={onDismiss} className="mt-4" />);
  expect(ref.current).toHaveAttribute("id", "saved");
  expect(ref.current?.className).toContain("mt-4");
  await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
  expect(onDismiss).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
});

test("actions, links and a replaceable hidden icon live inside the message", () => {
  const { rerender } = render(
    <Alert tone="error" title="The archive could not be loaded" action={<button>Try again</button>}>
      Check the <a href="#/status">service status</a> before retrying.
    </Alert>,
  );
  const alert = screen.getByRole("alert");
  expect(alert.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "service status" })).toHaveAttribute("href", "#/status");
  rerender(<Alert tone="error" title="Quiet" icon={null} />);
  expect(screen.getByRole("alert").querySelector("svg")).toBeNull();
  rerender(<Alert title="Custom" icon={<span data-testid="glyph" />} />);
  expect(screen.getByTestId("glyph")).toBeInTheDocument();
});
