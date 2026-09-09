import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Typography } from "../packages/ui/src/typography";

test("each element gets a matching default variant", () => {
  render(
    <>
      <Typography as="h1">Display</Typography>
      <Typography as="h2">Title</Typography>
      <Typography as="h3">Heading</Typography>
      <Typography as="h4">Subheading</Typography>
      <Typography>Body</Typography>
    </>,
  );
  expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute("data-variant", "display");
  expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("data-variant", "title");
  expect(screen.getByRole("heading", { level: 3 })).toHaveAttribute("data-variant", "heading");
  expect(screen.getByRole("heading", { level: 4 })).toHaveAttribute("data-variant", "subheading");
  expect(screen.getByText("Body").tagName).toBe("P");
  expect(screen.getByText("Body")).toHaveAttribute("data-variant", "body");
});

test("the visual variant is independent from the heading level", () => {
  render(
    <>
      <Typography as="h2" variant="heading">Section</Typography>
      <Typography as="p" variant="overline">Chapter one</Typography>
      <Typography as="span" variant="caption">Photograph, 1962</Typography>
    </>,
  );
  expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("data-variant", "heading");
  expect(screen.getByText("Chapter one").tagName).toBe("P");
  expect(screen.getByText("Photograph, 1962").tagName).toBe("SPAN");
});

test("forwards ref, id, attributes and merges className, muted and the editorial face", () => {
  const ref = React.createRef<HTMLElement>();
  render(
    <Typography ref={ref} as="h2" id="intro" editorial muted className="mt-8" aria-describedby="note">
      A considered beginning.
    </Typography>
  );
  const heading = screen.getByRole("heading", { level: 2 });
  expect(ref.current).toBe(heading);
  expect(heading).toHaveAttribute("id", "intro");
  expect(heading).toHaveAttribute("aria-describedby", "note");
  expect(heading.className).toContain("mt-8");
  expect(heading.className).toContain("font-editorial");
  expect(heading.className).toContain("text-muted");
});
