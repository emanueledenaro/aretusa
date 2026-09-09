import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Bubble } from "../packages/ui/src/conversation";

test("incoming and outgoing bubbles differ by side and corner shape, not only by color", () => {
  render(
    <>
      <Bubble data-testid="in">Incoming</Bubble>
      <Bubble side="end" data-testid="out">Outgoing</Bubble>
    </>,
  );
  const incoming = screen.getByTestId("in");
  const outgoing = screen.getByTestId("out");
  expect(incoming).toHaveAttribute("data-side", "start");
  expect(outgoing).toHaveAttribute("data-side", "end");
  expect(incoming.className).toContain("rounded-es-md");
  expect(outgoing.className).toContain("rounded-ee-md");
  expect(outgoing.className).toContain("ms-auto");
});

test("caller props, ref and className merge without losing the base surface", () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <Bubble ref={ref} id="b1" aria-label="Reply from Alex" className="max-w-xs">
      Hello
    </Bubble>,
  );
  const bubble = screen.getByLabelText("Reply from Alex");
  expect(ref.current).toBe(bubble);
  expect(bubble).toHaveAttribute("id", "b1");
  expect(bubble.className).toContain("max-w-xs");
  expect(bubble.className).not.toContain("max-w-[min(");
  expect(bubble.className).toContain("bg-surface");
});

test("long words, links and code stay inside the bubble and keep their semantics", () => {
  render(
    <Bubble>
      <p>See https://example.com/a-very-long-path/that-keeps-going/without-any-spaces-at-all</p>
      <p>
        Run <code>npm run check</code> then open <a href="https://example.com">the preview</a>.
      </p>
      <pre>
        <code>{"const a = 1;\nconst b = 2;"}</code>
      </pre>
    </Bubble>,
  );
  const bubble = screen.getByRole("link", { name: "the preview" }).closest("[data-side]") as HTMLElement;
  expect(bubble.className).toContain("[overflow-wrap:anywhere]");
  expect(bubble.className).toContain("[&_pre]:a-scrollbar");
  expect(bubble.querySelector("pre")).not.toBeNull();
});
