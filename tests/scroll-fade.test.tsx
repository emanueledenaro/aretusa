import React from "react";
import { expect, test, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  ScrollFade,
  useScrollFade,
  type ScrollFadeOptions,
} from "../packages/ui/src/scroll-fade";

test("overlay preserves its caller's DOM ref and native attributes", () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <ScrollFade
      ref={ref}
      id="decoration"
      edges={{ top: false, bottom: false, left: false, right: false }}
    />,
  );
  expect(ref.current).toHaveAttribute("id", "decoration");
});

function Example(options: ScrollFadeOptions) {
  const { ref, edges } = useScrollFade(options);
  return (
    <div>
      <div ref={ref} role="region" aria-label="Content" tabIndex={0}>
        Content
      </div>
      <ScrollFade edges={edges} data-testid="fade" />
    </div>
  );
}

function dimensions(node: HTMLElement, values: Record<string, number>) {
  for (const [key, value] of Object.entries(values))
    Object.defineProperty(node, key, {
      value,
      configurable: true,
      writable: true,
    });
}

test("vertical fades expose only edges with remaining content and disable immediately", () => {
  const { rerender } = render(<Example />);
  const viewport = screen.getByRole("region");
  const fade = screen.getByTestId("fade");
  dimensions(viewport, { scrollHeight: 600, clientHeight: 200, scrollTop: 0 });
  fireEvent.scroll(viewport);
  expect(fade).toHaveAttribute("data-fade-top", "false");
  expect(fade).toHaveAttribute("data-fade-bottom", "true");
  viewport.scrollTop = 150;
  fireEvent.scroll(viewport);
  expect(fade).toHaveAttribute("data-fade-top", "true");
  viewport.scrollTop = 400;
  fireEvent.scroll(viewport);
  expect(fade).toHaveAttribute("data-fade-bottom", "false");
  rerender(<Example enabled={false} />);
  expect(fade).toHaveAttribute("data-fade-top", "false");
  expect(fade).toHaveAttribute("aria-hidden", "true");
});

test.each(["ltr", "rtl"])(
  "horizontal fades track physical edges in %s and clamp overscroll",
  (direction) => {
    render(<Example axis="both" />);
    const viewport = screen.getByRole("region");
    viewport.style.direction = direction;
    const fade = screen.getByTestId("fade");
    dimensions(viewport, { scrollWidth: 600, clientWidth: 200, scrollLeft: 0 });
    fireEvent.scroll(viewport);
    expect(fade).toHaveAttribute("data-fade-left", String(direction === "rtl"));
    expect(fade).toHaveAttribute(
      "data-fade-right",
      String(direction === "ltr"),
    );
    viewport.scrollLeft = direction === "rtl" ? -200 : 200;
    fireEvent.scroll(viewport);
    expect(fade).toHaveAttribute("data-fade-left", "true");
    expect(fade).toHaveAttribute("data-fade-right", "true");
    viewport.scrollLeft = direction === "rtl" ? -450 : 450;
    fireEvent.scroll(viewport);
    expect(fade).toHaveAttribute("data-fade-left", String(direction === "ltr"));
    expect(fade).toHaveAttribute(
      "data-fade-right",
      String(direction === "rtl"),
    );
    dimensions(viewport, { scrollWidth: 200, scrollLeft: 0 });
    fireEvent.scroll(viewport);
    expect(fade).toHaveAttribute("data-fade-left", "false");
    expect(fade).toHaveAttribute("data-fade-right", "false");
  },
);

test("content mutations, asynchronous child resize and viewport resize refresh overflow without scrolling", async () => {
  let resize = () => {};
  const disconnect = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      unobserve() {}
      disconnect = disconnect;
    },
  );
  try {
    const { unmount } = render(<Example />);
    const viewport = screen.getByRole("region");
    const fade = screen.getByTestId("fade");
    dimensions(viewport, { scrollHeight: 600, clientHeight: 200 });
    viewport.append(document.createElement("p"));
    await waitFor(() =>
      expect(fade).toHaveAttribute("data-fade-bottom", "true"),
    );
    dimensions(viewport, { clientHeight: 700 });
    act(() => resize());
    expect(fade).toHaveAttribute("data-fade-bottom", "false");
    dimensions(viewport, { scrollHeight: 1000 });
    act(() => resize());
    expect(fade).toHaveAttribute("data-fade-bottom", "true");
    unmount();
    expect(disconnect).toHaveBeenCalled();
  } finally {
    vi.unstubAllGlobals();
  }
});

test("replacing the viewport detaches the old container and refresh stays available without ResizeObserver", () => {
  vi.stubGlobal("ResizeObserver", undefined);
  function Replaceable({ version }: { version: number }) {
    const { ref, edges, refresh } = useScrollFade<HTMLElement>({
      axis: "horizontal",
    });
    return (
      <>
        <section
          key={version}
          ref={ref}
          aria-label="Replaceable"
          role="region"
        />
        <button onClick={refresh}>Refresh</button>
        <ScrollFade edges={edges} data-testid="fade" depth={24} color="red" />
      </>
    );
  }
  try {
    const { rerender, unmount } = render(<Replaceable version={1} />);
    const old = screen.getByRole("region");
    dimensions(old, { scrollWidth: 600, clientWidth: 200 });
    fireEvent.scroll(old);
    expect(screen.getByTestId("fade")).toHaveAttribute(
      "data-fade-right",
      "true",
    );
    rerender(<Replaceable version={2} />);
    const current = screen.getByRole("region");
    expect(current).not.toBe(old);
    expect(screen.getByTestId("fade")).toHaveAttribute(
      "data-fade-right",
      "false",
    );
    fireEvent.scroll(old);
    expect(screen.getByTestId("fade")).toHaveAttribute(
      "data-fade-right",
      "false",
    );
    dimensions(current, { scrollWidth: 600, clientWidth: 200 });
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    expect(screen.getByTestId("fade")).toHaveAttribute(
      "data-fade-right",
      "true",
    );
    expect(
      screen.getByTestId("fade").style.getPropertyValue("--scroll-fade-depth"),
    ).toBe("24px");
    expect(
      screen.getByTestId("fade").style.getPropertyValue("--scroll-fade-color"),
    ).toBe("red");
    unmount();
    fireEvent.scroll(current);
  } finally {
    vi.unstubAllGlobals();
  }
});

test("axis switches exclude unrelated edges and re-enabling measures current overflow", () => {
  const { rerender } = render(<Example axis="both" />);
  const viewport = screen.getByRole("region");
  dimensions(viewport, {
    scrollWidth: 600,
    clientWidth: 200,
    scrollHeight: 600,
    clientHeight: 200,
  });
  fireEvent.scroll(viewport);
  const fade = screen.getByTestId("fade");
  expect(fade).toHaveAttribute("data-fade-bottom", "true");
  expect(fade).toHaveAttribute("data-fade-right", "true");
  rerender(<Example axis="horizontal" />);
  expect(fade).toHaveAttribute("data-fade-bottom", "false");
  rerender(<Example enabled={false} />);
  expect(fade).toHaveAttribute("data-fade-right", "false");
  rerender(<Example />);
  expect(fade).toHaveAttribute("data-fade-bottom", "true");
});
