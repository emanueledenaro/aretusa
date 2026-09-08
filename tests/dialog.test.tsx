import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal, ModalClose } from "../packages/ui/src/overlays";

test("footer actions wrapped in ModalClose close the dialog and return focus to the trigger", async () => {
  const onSave = vi.fn();
  render(
    <Modal
      trigger={<button>Open</button>}
      title="Make it yours."
      description="A focused space."
      footer={
        <>
          <ModalClose><button>Cancel</button></ModalClose>
          <ModalClose><button onClick={onSave}>Save changes</button></ModalClose>
        </>
      }
    >
      <input aria-label="Display name" />
    </Modal>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  const dialog = screen.getByRole("dialog", { name: "Make it yours." });
  expect(dialog).toHaveAccessibleDescription("A focused space.");
  expect(screen.getByRole("textbox", { name: "Display name" })).toHaveFocus();
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
  expect(onSave).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
});

test("the close control is named, and outside interaction is refused while content keeps focus inside", async () => {
  render(
    <Modal trigger={<button>Open</button>} title="Profile" description="Edit your profile.">
      <input aria-label="First" />
      <input aria-label="Second" />
    </Modal>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  const close = screen.getByRole("button", { name: "Close dialog" });
  await userEvent.tab();
  await userEvent.tab();
  expect(close).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole("textbox", { name: "First" })).toHaveFocus();
  await userEvent.click(close);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
