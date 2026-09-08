import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AlertDialog } from "../packages/ui/src/overlays";

function open() {
  return userEvent.click(screen.getByRole("button", { name: "Archive" }));
}

test("cancel receives initial focus, Escape closes and focus returns to the trigger", async () => {
  const onConfirm = vi.fn();
  render(
    <AlertDialog trigger={<button>Archive</button>} title="Archive this project?" description="Members keep read access." confirmLabel="Archive project" onConfirm={onConfirm} />,
  );
  await open();
  const dialog = screen.getByRole("alertdialog", { name: "Archive this project?" });
  expect(dialog).toHaveAccessibleDescription("Members keep read access.");
  expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Archive" })).toHaveFocus();
  expect(onConfirm).not.toHaveBeenCalled();
});

test("a pending confirmation blocks dismissal and closes on success", async () => {
  let resolve = () => {};
  const onConfirm = vi.fn(() => new Promise<void>((r) => { resolve = r; }));
  render(
    <AlertDialog trigger={<button>Archive</button>} title="Archive this project?" description="Members keep read access." confirmLabel="Archive project" onConfirm={onConfirm} />,
  );
  await open();
  await userEvent.click(screen.getByRole("button", { name: "Archive project" }));
  expect(onConfirm).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Archive project" })).toHaveAttribute("aria-busy", "true");
  expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  await userEvent.keyboard("{Escape}");
  expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  resolve();
  await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
});

test("a rejected confirmation shows its message, keeps the dialog open and allows a retry", async () => {
  const onConfirm = vi
    .fn<() => Promise<void>>()
    .mockRejectedValueOnce(new Error("The server did not respond."))
    .mockResolvedValueOnce(undefined);
  const onOpenChange = vi.fn();
  render(
    <AlertDialog trigger={<button>Archive</button>} title="Archive this project?" description="Members keep read access." confirmLabel="Archive project" onConfirm={onConfirm} onOpenChange={onOpenChange} />,
  );
  await open();
  await userEvent.click(screen.getByRole("button", { name: "Archive project" }));
  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent("The server did not respond.");
  expect(screen.getByRole("button", { name: "Archive project" })).toHaveAccessibleDescription("The server did not respond.");
  expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Archive project" }));
  await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  expect(onConfirm).toHaveBeenCalledTimes(2);
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
});

test("neutral tone, custom labels and controlled open work without a trigger", async () => {
  const onOpenChange = vi.fn();
  const { rerender } = render(
    <AlertDialog tone="neutral" open title="Leave without saving?" description="Unsaved changes will be lost." confirmLabel="Leave" cancelLabel="Keep editing" onConfirm={() => {}} onOpenChange={onOpenChange} />,
  );
  expect(screen.getByRole("alertdialog", { name: "Leave without saving?" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Keep editing" }));
  expect(onOpenChange).toHaveBeenCalledWith(false);
  rerender(
    <AlertDialog tone="neutral" open={false} title="Leave without saving?" description="Unsaved changes will be lost." confirmLabel="Leave" cancelLabel="Keep editing" onConfirm={() => {}} onOpenChange={onOpenChange} />,
  );
  expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
});
