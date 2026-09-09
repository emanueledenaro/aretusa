import React from "react";
import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AspectRatio } from "../packages/ui/src/basic";

test("applies the ratio as a CSS aspect-ratio and forwards ref, className and attributes", () => {
  const ref = React.createRef<HTMLDivElement>();
  render(<AspectRatio ref={ref} ratio={4 / 3} className="rounded-none" data-testid="box" aria-label="Cover" />);
  const box = screen.getByTestId("box");
  expect(ref.current).toBe(box);
  expect(box.style.aspectRatio).toBe(String(4 / 3));
  expect(box).toHaveClass("rounded-none");
  expect(box).toHaveAttribute("aria-label", "Cover");
  expect(box).toHaveAttribute("data-fit", "cover");
});

test("an invalid ratio falls back to 16:9 and fit is exposed for media children", () => {
  render(
    <>
      <AspectRatio ratio={0} data-testid="zero" />
      <AspectRatio ratio={Number.NaN} data-testid="nan" fit="contain" />
      <AspectRatio ratio={-2} data-testid="negative" />
    </>,
  );
  expect(screen.getByTestId("zero").style.aspectRatio).toBe(String(16 / 9));
  expect(screen.getByTestId("nan").style.aspectRatio).toBe(String(16 / 9));
  expect(screen.getByTestId("negative").style.aspectRatio).toBe(String(16 / 9));
  expect(screen.getByTestId("nan")).toHaveAttribute("data-fit", "contain");
});

test("a picture keeps its alt text and the documented fallback replaces it after a load error", () => {
  function Cover() {
    const [failed, setFailed] = React.useState(false);
    return (
      <AspectRatio ratio={3 / 2}>
        {failed ? (
          <p role="img" aria-label="Harbour at dawn, image unavailable">Image unavailable</p>
        ) : (
          <img src="/missing.jpg" alt="Harbour at dawn" onError={() => setFailed(true)} />
        )}
      </AspectRatio>
    );
  }
  render(<Cover />);
  const picture = screen.getByRole("img", { name: "Harbour at dawn" });
  fireEvent.error(picture);
  expect(screen.getByRole("img", { name: "Harbour at dawn, image unavailable" })).toBeVisible();
  expect(screen.queryByRole("img", { name: "Harbour at dawn" })).toBeNull();
});

test("content with an intrinsic minimum width stays inside the box in a narrow parent", () => {
  render(
    <div style={{ width: 240 }}>
      <AspectRatio ratio={1}>
        <div style={{ minWidth: 400 }} data-testid="wide">A wide map</div>
      </AspectRatio>
    </div>,
  );
  expect(screen.getByTestId("wide")).toBeVisible();
  expect(screen.getByTestId("wide").parentElement).toHaveClass("overflow-hidden");
});
