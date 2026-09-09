import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast, ToastProvider, useToast } from "../packages/ui/src/overlays";

function toasts() {
  return screen
    .queryAllByRole("region", { name: /Notifications/ })
    .flatMap((region) => Array.from(region.querySelectorAll<HTMLElement>("li[data-tone]")));
}

function Notifier({ tone, action }: { tone?: "success" | "danger" | "neutral"; action?: () => void }) {
  const { toast, dismiss } = useToast();
  const last = React.useRef("");
  return (
    <div>
      <button
        onClick={() => {
          last.current = toast({
            title: "Changes saved",
            description: "Your draft is up to date.",
            tone,
            duration: Infinity,
            action: action ? { label: "Undo", onClick: action } : undefined,
          });
        }}
      >
        Notify
      </button>
      <button onClick={() => dismiss(last.current)}>Dismiss last</button>
    </div>
  );
}

test("useToast enqueues a notification with title, description and a named dismiss control", async () => {
  render(
    <ToastProvider>
      <Notifier tone="success" />
    </ToastProvider>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Notify" }));
  const [item] = toasts();
  expect(item).toHaveTextContent("Changes saved");
  expect(item).toHaveTextContent("Your draft is up to date.");
  expect(item).toHaveAttribute("data-tone", "success");
  expect(screen.getByRole("region", { name: /Notifications/ })).toBeInTheDocument();
  await userEvent.click(within(item).getByRole("button", { name: "Dismiss" }));
  await waitFor(() => expect(toasts()).toHaveLength(0));
});

test("repeated notifications stack and dismiss(id) removes only the targeted one", async () => {
  render(
    <ToastProvider>
      <Notifier />
    </ToastProvider>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Notify" }));
  await userEvent.click(screen.getByRole("button", { name: "Notify" }));
  expect(toasts()).toHaveLength(2);
  await userEvent.click(screen.getByRole("button", { name: "Dismiss last" }));
  await waitFor(() => expect(toasts()).toHaveLength(1));
});

test("the action runs its handler and closes the notification", async () => {
  const undo = vi.fn();
  render(
    <ToastProvider>
      <Notifier action={undo} />
    </ToastProvider>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Notify" }));
  await userEvent.click(within(toasts()[0]).getByRole("button", { name: "Undo" }));
  expect(undo).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(toasts()).toHaveLength(0));
});

test("a notification closes on its own after the duration", async () => {
  function Short() {
    const { toast } = useToast();
    return <button onClick={() => toast({ title: "Copied", duration: 40 })}>Copy</button>;
  }
  render(
    <ToastProvider>
      <Short />
    </ToastProvider>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Copy" }));
  expect(toasts()).toHaveLength(1);
  await waitFor(() => expect(toasts()).toHaveLength(0), { timeout: 2000 });
});

test("the controlled Toast keeps working on its own and reports dismissal", async () => {
  const onOpenChange = vi.fn();
  render(<Toast open onOpenChange={onOpenChange} title="Saved" description="Your changes are stored." tone="danger" />);
  const [item] = toasts();
  expect(item).toHaveTextContent("Saved");
  expect(item).toHaveAttribute("data-tone", "danger");
  await userEvent.click(within(item).getByRole("button", { name: "Dismiss" }));
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
});
