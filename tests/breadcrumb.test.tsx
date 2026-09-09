import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Breadcrumb } from "../packages/ui/src/navigation";

const trail = [
  { label: "Home", href: "/" },
  { label: "Archive", href: "/archive" },
  { label: "Letters", href: "/archive/letters" },
  { label: "Ortigia", href: "/archive/letters/ortigia" },
  { label: "A letter from Ortigia, 12 October" },
];

test("renders an ordered navigation with named links and the current page marked", () => {
  render(<Breadcrumb items={trail.slice(0, 3)} />);
  const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
  const list = within(nav).getByRole("list");
  expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  expect(screen.getByRole("link", { name: "Letters" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "Archive" })).not.toHaveAttribute("aria-current");
  expect(nav.querySelectorAll("li > span[aria-hidden='true']")).toHaveLength(2);
});

test("long trails collapse the middle and a named control reveals every ancestor", async () => {
  render(<Breadcrumb items={trail} maxItems={4} />);
  expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Archive" })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Ortigia" })).toBeInTheDocument();
  const reveal = screen.getByRole("button", { name: "Show 2 hidden pages" });
  await userEvent.click(reveal);
  expect(screen.getByRole("link", { name: "Archive" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Letters" })).toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Archive" })).toHaveFocus();
});

test("click handlers, a custom separator, label and native attributes are preserved", async () => {
  const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
  const ref = React.createRef<HTMLElement>();
  render(
    <Breadcrumb
      ref={ref}
      label="You are here"
      separator="/"
      className="mb-2"
      items={[{ label: "Projects", href: "/projects", onClick }, { label: "Salt gardens" }]}
    />,
  );
  expect(screen.getByText("Salt gardens")).toHaveAttribute("aria-current", "page");
  expect(ref.current).toBe(screen.getByRole("navigation", { name: "You are here" }));
  expect(ref.current).toHaveClass("mb-2");
  expect(screen.getByText("/")).toHaveAttribute("aria-hidden", "true");
  await userEvent.click(screen.getByRole("link", { name: "Projects" }));
  expect(onClick).toHaveBeenCalledTimes(1);
});
