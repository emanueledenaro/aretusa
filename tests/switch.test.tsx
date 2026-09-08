import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "../packages/ui/src/forms";

test("Space and Enter toggle the switch and the caller receives booleans", async () => {
  const onCheckedChange = vi.fn();
  render(<Switch label="Email notifications" onCheckedChange={onCheckedChange} />);
  const control = screen.getByRole("switch", { name: "Email notifications" });
  control.focus();
  await userEvent.keyboard(" ");
  expect(control).toBeChecked();
  await userEvent.keyboard("{Enter}");
  expect(control).not.toBeChecked();
  expect(onCheckedChange.mock.calls.map((c) => c[0])).toEqual([true, false]);
});

test("controlled value follows the caller and a multiline label toggles it", async () => {
  function Controlled() {
    const [on, setOn] = React.useState(false);
    return <Switch label="Let other members see when I am at the studio" checked={on} onCheckedChange={setOn} />;
  }
  render(<Controlled />);
  await userEvent.click(screen.getByText(/other members/));
  expect(screen.getByRole("switch")).toBeChecked();
});

test("description and error are linked and the error marks the control invalid", () => {
  render(<Switch label="Share my calendar" description="Members see busy slots." error="Sharing is required." />);
  const control = screen.getByRole("switch", { name: "Share my calendar" });
  expect(control).toHaveAttribute("aria-invalid", "true");
  expect(control).toHaveAccessibleDescription("Members see busy slots. Sharing is required.");
  expect(screen.getByRole("alert")).toHaveTextContent("Sharing is required.");
});

test("the value reaches native form submission and disabled stays inert", async () => {
  const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return new FormData(event.currentTarget).get("digest");
  });
  render(
    <form onSubmit={onSubmit}>
      <Switch name="digest" value="weekly" label="Digest" defaultChecked />
      <Switch label="Beta" disabled />
      <button type="submit">Save</button>
    </form>,
  );
  await userEvent.click(screen.getByRole("switch", { name: "Beta" }));
  expect(screen.getByRole("switch", { name: "Beta" })).not.toBeChecked();
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(onSubmit).toHaveReturnedWith("weekly");
});
