import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "@tanstack/react-form";
import { expect, test } from "vitest";
import {
  TanStackFormField,
  focusFirstInvalidField,
  formatTanStackError,
} from "../../packages/ui/src/tanstack-form";

function RequiredName() {
  const form = useForm({
    defaultValues: { name: "" },
    onSubmitInvalid: ({ formApi }) => {
      focusFirstInvalidField(formApi);
    },
  });
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => (value ? undefined : "Enter your name."),
        }}
      >
        {(field) => (
          <TanStackFormField
            field={field}
            label="Name"
            id="name"
            description="Your public name"
            describedBy="privacy"
          >
            {({ controlProps }) => (
              <input
                {...controlProps}
                name={field.name}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            )}
          </TanStackFormField>
        )}
      </form.Field>
      <p id="privacy">Visible to your team</p>
      <button>Save</button>
    </form>
  );
}

test("invalid submission focuses the named input and links both help and error text", async () => {
  render(<RequiredName />);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Save" }));
  const input = screen.getByRole("textbox", { name: "Name" });
  await waitFor(() => expect(input).toHaveFocus());
  expect(input).toHaveAttribute("id", "name");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAccessibleDescription(
    "Visible to your team Your public name Enter your name.",
  );
  await user.type(input, "Ada");
  await waitFor(() =>
    expect(screen.queryByRole("alert")).not.toBeInTheDocument(),
  );
  expect(input).toHaveAccessibleDescription(
    "Visible to your team Your public name",
  );
});

test("validator results become readable messages", () => {
  expect(formatTanStackError("Too short.")).toBe("Too short.");
  expect(formatTanStackError({ message: "Issue text." })).toBe("Issue text.");
  expect(formatTanStackError(true, "Fallback.")).toBe("Fallback.");
});
