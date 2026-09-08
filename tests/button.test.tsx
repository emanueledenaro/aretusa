import React from "react";
import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../packages/ui/src/basic";
test("loading owns the busy state while preserving caller descriptions", () => {
  render(
    <Button loading aria-busy={false} aria-describedby="save-help">
      Save
    </Button>,
  );
  expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
    "aria-busy",
    "true",
  );
  expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
    "aria-describedby",
    "save-help",
  );
});
test("keyboard navigation skips unavailable and pending actions", async () => {
  const blocked = vi.fn(),
    ready = vi.fn();
  render(
    <>
      <Button disabled onClick={blocked}>
        Unavailable
      </Button>
      <Button loading onClick={blocked}>
        Pending
      </Button>
      <Button onClick={ready}>Ready</Button>
    </>,
  );
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "Ready" })).toHaveFocus();
  await userEvent.keyboard("{Enter}");
  expect(ready).toHaveBeenCalledOnce();
  expect(blocked).not.toHaveBeenCalled();
});
test("button defaults to a non-submitting action", async () => {
  const submit = vi.fn();
  const action = vi.fn();
  render(
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <Button onClick={action}>Save</Button>
    </form>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(action).toHaveBeenCalledOnce();
  expect(submit).not.toHaveBeenCalled();
});
test("explicit submit is preserved", async () => {
  const submit = vi.fn();
  render(
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <Button type="submit">Send</Button>
    </form>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Send" }));
  expect(submit).toHaveBeenCalledOnce();
});
test("keyboard activation and refs remain native", async () => {
  const action = vi.fn(),
    ref = React.createRef<HTMLButtonElement>();
  render(
    <Button ref={ref} onClick={action}>
      Open
    </Button>,
  );
  ref.current?.focus();
  await userEvent.keyboard("{Enter}");
  await userEvent.keyboard(" ");
  expect(action).toHaveBeenCalledTimes(2);
  expect(ref.current).toBe(screen.getByRole("button", { name: "Open" }));
});
test("pending action preserves its accessible name and cannot fire", async () => {
  const action = vi.fn();
  const { rerender } = render(<Button onClick={action}>Save changes</Button>);
  rerender(
    <Button loading onClick={action}>
      Save changes
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Save changes" });
  expect(button).toHaveAttribute("aria-busy", "true");
  expect(button).toBeDisabled();
  await userEvent.click(button);
  expect(action).not.toHaveBeenCalled();
});
