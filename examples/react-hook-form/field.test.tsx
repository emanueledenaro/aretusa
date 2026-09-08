import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { expect, test } from "vitest";
import { HookFormField } from "../../packages/ui/src/react-hook-form";

function RequiredName() {
  const form = useForm({ defaultValues: { name: "" } });
  return (
    <form onSubmit={form.handleSubmit(() => {})}>
      <HookFormField
        control={form.control}
        name="name"
        label="Name"
        id="name"
        description="Your public name"
        describedBy="privacy"
        rules={{ required: "Enter your name." }}
      >
        {({ field, controlProps }) => <input {...field} {...controlProps} />}
      </HookFormField>
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
