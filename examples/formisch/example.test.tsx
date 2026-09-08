import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import {
  FormischExample,
  type Reservation,
  type ReservationOutput,
} from "./example";

const validDefaults: Reservation = {
  name: "Ada",
  workshop: "design",
  session: "morning",
  reminder: true,
  terms: true,
  guests: [],
};

test("schema errors are linked to their controls and the first invalid input is focused", async () => {
  render(<FormischExample />);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Save reservation" }));
  const name = screen.getByRole("textbox", { name: "Name" });
  await waitFor(() => expect(name).toHaveFocus());
  expect(name).toHaveAccessibleDescription("Enter your name.");
  expect(name).toHaveAttribute("aria-invalid", "true");
  expect(
    screen.getByRole("checkbox", { name: "I accept the booking terms" }),
  ).toHaveAttribute("aria-invalid", "true");
  expect(
    screen.getByRole("checkbox", { name: "I accept the booking terms" }),
  ).toHaveAccessibleDescription("Accept the booking terms to continue.");
});

test("async schema validation rejects reserved names and recovers after correction", async () => {
  render(<FormischExample initialInput={{ ...validDefaults, name: "reserved" }} />);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Save reservation" }));
  await screen.findByText("This name is reserved. Choose another name.");
  const name = screen.getByRole("textbox", { name: "Name" });
  await waitFor(() => expect(name).toHaveFocus());
  expect(name).toHaveAccessibleDescription(
    "This name is reserved. Choose another name.",
  );
  await user.clear(name);
  await user.type(name, "Lin");
  await user.click(screen.getByRole("button", { name: "Save reservation" }));
  await screen.findByText("Reservation saved.");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("pending saves disable repeat submission and failure preserves entered values for retry", async () => {
  let rejectSave: (reason?: unknown) => void = () => {};
  let fail = true;
  render(
    <FormischExample
      initialInput={validDefaults}
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
  await user.click(screen.getByRole("button", { name: "Save reservation" }));
  expect(
    await screen.findByRole("button", { name: "Saving reservation..." }),
  ).toBeDisabled();
  expect(screen.getByRole("button", { name: "Reset form" })).toBeDisabled();
  expect(screen.getByRole("form", { name: "Workshop reservation" })).toHaveAttribute(
    "aria-busy",
    "true",
  );
  await act(async () => {
    rejectSave(new Error("Server unavailable"));
  });
  await screen.findByText(
    "We could not save your reservation. Your details are still here. Try again.",
  );
  expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Ada");
  expect(screen.getByRole("button", { name: "Save reservation" })).toBeEnabled();
  fail = false;
  await user.click(screen.getByRole("button", { name: "Save reservation" }));
  await screen.findByText("Reservation saved.");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("field arrays preserve values through reordering and reset removes added rows", async () => {
  render(<FormischExample initialInput={validDefaults} />);
  const user = userEvent.setup();
  expect(screen.getByText("No guests added.")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Add guest" }));
  await waitFor(() =>
    expect(screen.getByRole("textbox", { name: "Guest 1 name" })).toHaveFocus(),
  );
  await user.type(screen.getByRole("textbox", { name: "Guest 1 name" }), "Lin");
  await user.click(screen.getByRole("button", { name: "Add guest" }));
  await user.type(screen.getByRole("textbox", { name: "Guest 2 name" }), "Sam");
  await user.click(screen.getByRole("button", { name: "Move guest 2 up" }));
  expect(screen.getByRole("textbox", { name: "Guest 1 name" })).toHaveValue(
    "Sam",
  );
  expect(screen.getByRole("textbox", { name: "Guest 2 name" })).toHaveValue(
    "Lin",
  );
  await user.click(screen.getByRole("button", { name: "Remove guest 1" }));
  expect(screen.getByRole("textbox", { name: "Guest 1 name" })).toHaveValue(
    "Lin",
  );
  await user.click(screen.getByRole("button", { name: "Reset form" }));
  expect(
    screen.queryByRole("textbox", { name: "Guest 1 name" }),
  ).not.toBeInTheDocument();
  expect(screen.getByText("No guests added.")).toBeInTheDocument();
});

test("an empty guest row reports its own error and focuses that row", async () => {
  render(
    <FormischExample
      initialInput={{ ...validDefaults, guests: [{ name: "Lin" }, { name: "" }] }}
      checkName={async () => true}
    />,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Save reservation" }));
  const second = screen.getByRole("textbox", { name: "Guest 2 name" });
  await waitFor(() => expect(second).toHaveFocus());
  expect(second).toHaveAccessibleDescription(
    "Enter the guest name or remove this guest.",
  );
  expect(screen.getByRole("textbox", { name: "Guest 1 name" })).toHaveAttribute(
    "aria-invalid",
    "false",
  );
});

test.each([
  [{ workshop: "" }, "combobox", "Workshop", "Choose a workshop."],
  [{ session: undefined }, "radio", "Morning", "Choose a session."],
] as const)(
  "invalid %o focuses its real interactive control",
  async (override, role, name, error) => {
    render(
      <FormischExample
        initialInput={{ ...validDefaults, ...override }}
        checkName={async () => true}
      />,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Save reservation" }));
    await screen.findByText(error);
    await waitFor(() => expect(screen.getByRole(role, { name })).toHaveFocus());
  },
);

test("a rejected validation request shows a field error rather than a root failure", async () => {
  render(
    <FormischExample
      initialInput={validDefaults}
      checkName={async () => {
        throw new Error("Offline");
      }}
    />,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Save reservation" }));
  await screen.findByText("Name checking is unavailable. Try again.");
  expect(screen.getByRole("textbox", { name: "Name" })).toHaveAccessibleDescription(
    "Name checking is unavailable. Try again.",
  );
  expect(screen.queryByText("Offline")).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Save reservation" }),
  ).toBeEnabled();
});

test("invalid checkbox is focused and links its repair message", async () => {
  render(
    <FormischExample
      initialInput={{ ...validDefaults, terms: false }}
      checkName={async () => true}
    />,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Save reservation" }));
  const checkbox = screen.getByRole("checkbox", {
    name: "I accept the booking terms",
  });
  await waitFor(() => expect(checkbox).toHaveFocus());
  expect(checkbox).toHaveAccessibleDescription(
    "Accept the booking terms to continue.",
  );
  await user.click(checkbox);
  await waitFor(() =>
    expect(screen.queryByRole("alert")).not.toBeInTheDocument(),
  );
});

test("all control values reach the submit callback as schema output and reset restores defaults", async () => {
  let reservation: ReservationOutput | undefined;
  render(
    <FormischExample
      initialInput={{
        name: "",
        workshop: "design",
        session: "morning",
        reminder: true,
        terms: false,
        guests: [{ name: "" }],
      }}
      onSave={async (values) => {
        reservation = values;
      }}
    />,
  );
  const user = userEvent.setup();
  await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada");
  await user.click(screen.getByRole("radio", { name: "Afternoon" }));
  await user.click(screen.getByRole("switch", { name: "Send a reminder" }));
  await user.click(
    screen.getByRole("checkbox", { name: "I accept the booking terms" }),
  );
  await user.type(screen.getByRole("textbox", { name: "Guest 1 name" }), "Lin");
  await user.click(screen.getByRole("button", { name: "Save reservation" }));
  await screen.findByText("Reservation saved.");
  expect(reservation).toEqual({
    name: "Ada",
    workshop: "design",
    session: "afternoon",
    reminder: false,
    terms: true,
    guests: [{ name: "Lin" }],
  });
  await user.click(screen.getByRole("button", { name: "Reset form" }));
  expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("");
  expect(screen.getByRole("radio", { name: "Morning" })).toBeChecked();
  expect(screen.getByRole("switch", { name: "Send a reminder" })).toBeChecked();
  expect(
    screen.getByRole("checkbox", { name: "I accept the booking terms" }),
  ).not.toBeChecked();
  expect(screen.getByRole("textbox", { name: "Guest 1 name" })).toHaveValue("");
  expect(screen.queryByText("Reservation saved.")).not.toBeInTheDocument();
});
