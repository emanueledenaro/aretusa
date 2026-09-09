import React from "react";
import { expect, test } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Message, MessageScroller } from "../packages/ui/src/conversation";

function layout(node: HTMLElement, scrollHeight: number, clientHeight: number) {
  Object.defineProperty(node, "scrollHeight", { configurable: true, get: () => scrollHeight });
  Object.defineProperty(node, "clientHeight", { configurable: true, get: () => clientHeight });
}

const messages = (count: number) =>
  Array.from({ length: count }, (_, i) => (
    <Message key={i} author={i % 2 ? "Sam" : "Alex"}>
      Message {i + 1}
    </Message>
  ));

test("the log is named, polite, focusable, styled with the Aretusa scrollbar and shows empty and loading states", () => {
  const { rerender } = render(<MessageScroller label="Project conversation">{[]}</MessageScroller>);
  const log = screen.getByRole("log", { name: "Project conversation" });
  expect(log).toHaveAttribute("aria-live", "polite");
  expect(log).toHaveAttribute("tabindex", "0");
  expect(log.className).toContain("a-scrollbar");
  expect(screen.getByText("No messages yet.")).toBeInTheDocument();
  rerender(
    <MessageScroller label="Project conversation" loading>
      {messages(2)}
    </MessageScroller>,
  );
  expect(screen.queryByText("No messages yet.")).not.toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("Loading earlier messages");
});

test("new messages keep the reader pinned to the newest one while they sit at the bottom", () => {
  const { rerender } = render(<MessageScroller>{messages(3)}</MessageScroller>);
  const log = screen.getByRole("log");
  // jsdom has no layout at mount, so the first measurement happens once sizes exist.
  layout(log, 900, 200);
  rerender(<MessageScroller>{messages(4)}</MessageScroller>);
  expect(log.scrollTop).toBe(900);
  layout(log, 1200, 200);
  rerender(<MessageScroller>{messages(5)}</MessageScroller>);
  expect(log.scrollTop).toBe(1200);
  expect(screen.queryByRole("button", { name: "New messages" })).not.toBeInTheDocument();
});

test("a reader who scrolled up is not moved and gets a control to jump to the latest message", async () => {
  const { rerender } = render(<MessageScroller>{messages(3)}</MessageScroller>);
  const log = screen.getByRole("log");
  layout(log, 600, 200);
  act(() => {
    log.scrollTop = 100;
    fireEvent.scroll(log);
  });
  layout(log, 900, 200);
  rerender(<MessageScroller>{messages(4)}</MessageScroller>);
  expect(log.scrollTop).toBe(100);
  const jump = screen.getByRole("button", { name: "New messages" });
  await userEvent.click(jump);
  expect(log.scrollTop).toBe(900);
  expect(screen.queryByRole("button", { name: "New messages" })).not.toBeInTheDocument();
  expect(log).toHaveFocus();
});
