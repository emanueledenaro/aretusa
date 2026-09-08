import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form, useForm } from "@formisch/react";
import * as v from "valibot";
import { expect, test } from "vitest";
import { FormischField } from "../../packages/ui/src/formisch";

const NameSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Enter your name.")),
});

function RequiredName() {
  const form = useForm({ schema: NameSchema, initialInput: { name: "" } });
  return (
    <Form of={form} onSubmit={() => {}}>
      <FormischField
        of={form}
        path={["name"]}
        label="Name"
        id="name"
        description="Your public name"
        describedBy="privacy"
      >
        {({ field, controlProps }) => (
          <input {...field.props} {...controlProps} value={field.input ?? ""} />
        )}
      </FormischField>
      <p id="privacy">Visible to your team</p>
      <button>Save</button>
    </Form>
  );
}

test("invalid submission focuses the named input and links both help and error text", async () => {
  render(<RequiredName />);
  const user = userEvent.setup();
  const input = screen.getByRole("textbox", { name: "Name" });
  expect(input).toHaveAttribute("aria-invalid", "false");
  expect(input).toHaveAccessibleDescription(
    "Visible to your team Your public name",
  );
  await user.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => expect(input).toHaveFocus());
  expect(input).toHaveAttribute("id", "name");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByRole("alert")).toHaveTextContent("Enter your name.");
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

const ChoiceSchema = v.object({
  plan: v.picklist(["basic", "team"], "Choose a plan."),
});

function GroupedChoice() {
  const form = useForm({ schema: ChoiceSchema });
  return (
    <Form of={form} onSubmit={() => {}}>
      <FormischField of={form} path={["plan"]} label="Plan" group id="plan">
        {({ field, controlProps }) => (
          <div role="radiogroup" {...controlProps}>
            {(["basic", "team"] as const).map((plan, index) => (
              <label key={plan}>
                <input
                  type="radio"
                  name={field.props.name}
                  value={plan}
                  checked={field.input === plan}
                  ref={index === 0 ? controlProps.ref : undefined}
                  onChange={() => field.onChange(plan)}
                  onBlur={field.props.onBlur}
                />
                {plan}
              </label>
            ))}
          </div>
        )}
      </FormischField>
      <button>Continue</button>
    </Form>
  );
}

test("grouped fields expose a legend, mark the group invalid and focus the registered control", async () => {
  render(<GroupedChoice />);
  const user = userEvent.setup();
  const group = screen.getByRole("radiogroup", { name: "Plan" });
  expect(group).toHaveAttribute("id", "plan");
  expect(group).toHaveAttribute("aria-labelledby", "plan-label");
  await user.click(screen.getByRole("button", { name: "Continue" }));
  await waitFor(() =>
    expect(screen.getByRole("radio", { name: "basic" })).toHaveFocus(),
  );
  expect(group).toHaveAttribute("aria-invalid", "true");
  expect(group).toHaveAccessibleDescription("Choose a plan.");
  await user.click(screen.getByRole("radio", { name: "team" }));
  await waitFor(() => expect(group).toHaveAttribute("aria-invalid", "false"));
});
