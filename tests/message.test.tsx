import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Attachment, Message } from "../packages/ui/src/conversation";

test("the article is named after the author and the timestamp keeps a machine readable value", () => {
  render(
    <Message author="Alex Rivers" time="09:41" dateTime="2026-03-04T09:41:00Z">
      I have a first draft to share.
    </Message>,
  );
  const article = screen.getByRole("article", { name: "Alex Rivers" });
  const time = article.querySelector("time");
  expect(time).toHaveAttribute("datetime", "2026-03-04T09:41:00Z");
  expect(time).toHaveTextContent("09:41");
  expect(article).toHaveAttribute("data-side", "start");
});

test("sending is announced as busy and a failed message offers a named retry", async () => {
  const onRetry = vi.fn();
  const { rerender } = render(
    <Message author="You" side="end" status="sending">
      Sending this now.
    </Message>,
  );
  const article = screen.getByRole("article", { name: "You" });
  expect(article).toHaveAttribute("aria-busy", "true");
  expect(screen.getByRole("status")).toHaveTextContent("Sending");
  rerender(
    <Message author="You" side="end" status="failed" onRetry={onRetry}>
      Sending this now.
    </Message>,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Not sent");
  await userEvent.click(screen.getByRole("button", { name: "Retry sending" }));
  expect(onRetry).toHaveBeenCalledTimes(1);
});

test("attachments and actions render with the message and stay reachable by keyboard", async () => {
  const onOpen = vi.fn();
  render(
    <Message
      author="Sam"
      attachments={<Attachment name="brief.pdf" kind="PDF" size={248000} href="/brief.pdf" />}
      actions={<button type="button" onClick={onOpen}>Reply</button>}
    >
      Attached the brief.
    </Message>,
  );
  const article = screen.getByRole("article", { name: "Sam" });
  expect(article).toContainElement(screen.getByRole("link", { name: "Download brief.pdf" }));
  await userEvent.tab();
  expect(screen.getByRole("link", { name: "Download brief.pdf" })).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "Reply" })).toHaveFocus();
  await userEvent.keyboard("{Enter}");
  expect(onOpen).toHaveBeenCalledTimes(1);
});
