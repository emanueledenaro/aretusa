import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { TanStackFormExample, type VisitRequest } from "./example";

const validDefaults: VisitRequest = {
  name: "Ada",
  studio: "print",
  slot: "morning",
  reminder: true,
  terms: true,
  companions: [],
};

test("required fields show associated errors and focus the first invalid input", async () => {
  render(<TanStackFormExample />);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Send request" }));
  const name = screen.getByRole("textbox", { name: "Name" });
  await waitFor(() => expect(name).toHaveFocus());
  expect(name).toHaveAccessibleDescription("Enter your name.");
  expect(screen.getByRole("combobox", { name: "Studio" })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(
    screen.getByRole("checkbox", { name: "I accept the visit terms" }),
  ).toHaveAttribute("aria-invalid", "true");
  expect(
    screen.getByRole("textbox", { name: "Companion 1 name" }),
  ).toHaveAccessibleDescription(
    "Enter the companion name or remove this companion.",
  );
});

test("async validation rejects reserved names and recovers after correction", async () => {
  render(
    <TanStackFormExample
      defaultValues={{ ...validDefaults, name: "reserved" }}
    />,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Send request" }));
  await screen.findByText("This name is reserved. Choose another name.");
  const name = screen.getByRole("textbox", { name: "Name" });
  await waitFor(() => expect(name).toHaveFocus());
  expect(name).toHaveAccessibleDescription(
    "This name is reserved. Choose another name.",
  );
  await user.clear(name);
  await user.type(name, "Lin");
  await user.click(screen.getByRole("button", { name: "Send request" }));
  await screen.findByText("Request sent.");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("typing runs the debounced async check and shows its status", async () => {
  let calls = 0;
  render(
    <TanStackFormExample
      defaultValues={validDefaults}
      checkName={async (value) => {
        calls += 1;
        await new Promise((resolve) => setTimeout(resolve, 20));
        return value !== "reserved";
      }}
    />,
  );
  const user = userEvent.setup();
  const name = screen.getByRole("textbox", { name: "Name" });
  await user.clear(name);
  await user.type(name, "reserved");
  await screen.findByText("Checking name...", undefined, { timeout: 2000 });
  await screen.findByText(
    "This name is reserved. Choose another name.",
    undefined,
    { timeout: 2000 },
  );
  expect(calls).toBeLessThan(8);
  expect(name).toHaveAttribute("aria-invalid", "true");
});

test("pending requests disable repeat submission and failure preserves entered values for retry", async () => {
  let rejectSave: (reason?: unknown) => void = () => {};
  let fail = true;
  render(
    <TanStackFormExample
      defaultValues={validDefaults}
      checkName={async () => true}
      onSave={() =>
        fail
          ? new Promise<void>((_, reject) => {
              rejectSave = reject;
            })
          : Promise.resolve()
      }
    />,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Send request" }));
  expect(
    await screen.findByRole("button", { name: "Sending request..." }),
  ).toBeDisabled();
  expect(screen.getByRole("button", { name: "Reset form" })).toBeDisabled();
  await act(async () => {
    rejectSave(new Error("Server unavailable"));
  });
  await screen.findByText(
    "We could not send your request. Your details are still here. Try again.",
  );
  expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Ada");
  expect(screen.getByRole("button", { name: "Send request" })).toBeEnabled();
  fail = false;
  await user.click(screen.getByRole("button", { name: "Send request" }));
  await screen.findByText("Request sent.");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("field arrays preserve values through reordering and reset removes added rows", async () => {
  render(<TanStackFormExample defaultValues={validDefaults} />);
  const user = userEvent.setup();
  expect(screen.getByText("No companions added.")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Add companion" }));
  await waitFor(() =>
    expect(
      screen.getByRole("textbox", { name: "Companion 1 name" }),
    ).toHaveFocus(),
  );
  await user.type(
    screen.getByRole("textbox", { name: "Companion 1 name" }),
    "Lin",
  );
  await user.click(screen.getByRole("button", { name: "Add companion" }));
  await user.type(
    screen.getByRole("textbox", { name: "Companion 2 name" }),
    "Sam",
  );
  await user.click(screen.getByRole("button", { name: "Move companion 2 up" }));
  expect(screen.getByRole("textbox", { name: "Companion 1 name" })).toHaveValue(
    "Sam",
  );
  expect(screen.getByRole("textbox", { name: "Companion 2 name" })).toHaveValue(
    "Lin",
  );
  await user.click(screen.getByRole("button", { name: "Remove companion 1" }));
  expect(screen.getByRole("textbox", { name: "Companion 1 name" })).toHaveValue(
    "Lin",
  );
  await user.click(screen.getByRole("button", { name: "Reset form" }));
  expect(
    screen.queryByRole("textbox", { name: "Companion 1 name" }),
  ).not.toBeInTheDocument();
  expect(screen.getByText("No companions added.")).toBeInTheDocument();
});

test.each([
  ["studio", "combobox", "Studio", "Choose a studio."],
  ["slot", "radio", "Morning", "Choose a time slot."],
] as const)(
  "invalid %s focuses its real interactive control",
  async (field, role, name, error) => {
    render(
      <TanStackFormExample
        defaultValues={{ ...validDefaults, [field]: "" }}
        checkName={async () => true}
      />,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Send request" }));
    await screen.findByText(error);
    await waitFor(() => expect(screen.getByRole(role, { name })).toHaveFocus());
  },
);

test("a rejected validation request shows a field error rather than an unhandled rejection", async () => {
  render(
    <TanStackFormExample
      defaultValues={validDefaults}
      checkName={async () => {
        throw new Error("Offline");
      }}
    />,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Send request" }));
  await screen.findByText("Name checking is unavailable. Try again.");
  expect(screen.getByRole("button", { name: "Send request" })).toBeEnabled();
});

test("invalid checkbox is focused and links its repair message", async () => {
  render(
    <TanStackFormExample
      defaultValues={{ ...validDefaults, terms: false }}
      checkName={async () => true}
    />,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Send request" }));
  const checkbox = screen.getByRole("checkbox", {
    name: "I accept the visit terms",
  });
  await waitFor(() => expect(checkbox).toHaveFocus());
  expect(checkbox).toHaveAccessibleDescription(
    "Accept the visit terms to continue.",
  );
  await user.click(checkbox);
  await waitFor(() =>
    expect(screen.queryByRole("alert")).not.toBeInTheDocument(),
  );
});

test("all control values reach the submit callback and reset restores defaults", async () => {
  let request: VisitRequest | undefined;
  render(
    <TanStackFormExample
      defaultValues={{
        name: "",
        studio: "print",
        slot: "morning",
        reminder: true,
        terms: false,
        companions: [{ name: "" }],
      }}
      onSave={async (values) => {
        request = values;
      }}
    />,
  );
  const user = userEvent.setup();
  await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada");
  await user.click(screen.getByRole("radio", { name: "Afternoon" }));
  await user.click(screen.getByRole("switch", { name: "Send a reminder" }));
  await user.click(
    screen.getByRole("checkbox", { name: "I accept the visit terms" }),
  );
  await user.type(
    screen.getByRole("textbox", { name: "Companion 1 name" }),
    "Lin",
  );
  await user.click(screen.getByRole("button", { name: "Send request" }));
  await screen.findByText("Request sent.");
  expect(request).toEqual({
    name: "Ada",
    studio: "print",
    slot: "afternoon",
    reminder: false,
    terms: true,
    companions: [{ name: "Lin" }],
  });
  await user.click(screen.getByRole("button", { name: "Reset form" }));
  expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("");
  expect(screen.getByRole("radio", { name: "Morning" })).toBeChecked();
  expect(screen.getByRole("switch", { name: "Send a reminder" })).toBeChecked();
  expect(
    screen.getByRole("checkbox", { name: "I accept the visit terms" }),
  ).not.toBeChecked();
  expect(screen.queryByText("Request sent.")).not.toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
