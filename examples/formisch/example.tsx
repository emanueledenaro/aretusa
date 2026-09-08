import * as React from "react";
import {
  Form,
  focus,
  insert,
  move,
  remove,
  reset,
  useFieldArray,
  useForm,
} from "@formisch/react";
import * as v from "valibot";
import {
  Input,
  Checkbox,
  Select,
  RadioGroup,
  Switch,
} from "../../packages/ui/src/forms";
import { Button } from "../../packages/ui/src/button";
import { FormischField } from "../../packages/ui/src/formisch";

export type CheckName = (name: string) => Promise<boolean>;

/** The schema owns validation. The name check is asynchronous. */
export function createReservationSchema(checkName: CheckName) {
  return v.objectAsync({
    name: v.pipeAsync(
      v.string(),
      v.nonEmpty("Enter your name."),
      v.rawCheckAsync(async ({ dataset, addIssue }) => {
        if (!dataset.typed || !dataset.value) return;
        try {
          if (!(await checkName(dataset.value))) {
            addIssue({
              message: "This name is reserved. Choose another name.",
            });
          }
        } catch {
          addIssue({ message: "Name checking is unavailable. Try again." });
        }
      }),
    ),
    workshop: v.pipe(v.string(), v.nonEmpty("Choose a workshop.")),
    session: v.picklist(["morning", "afternoon"], "Choose a session."),
    reminder: v.boolean(),
    terms: v.pipe(
      v.boolean(),
      v.check((accepted) => accepted, "Accept the booking terms to continue."),
    ),
    guests: v.array(
      v.object({
        name: v.pipe(
          v.string(),
          v.nonEmpty("Enter the guest name or remove this guest."),
        ),
      }),
    ),
  });
}

export type ReservationSchema = ReturnType<typeof createReservationSchema>;
export type Reservation = v.InferInput<ReservationSchema>;
export type ReservationOutput = v.InferOutput<ReservationSchema>;

export const reservationDefaults: Reservation = {
  name: "",
  workshop: "",
  session: "morning",
  reminder: true,
  terms: false,
  guests: [{ name: "" }],
};

export type FormischExampleProps = {
  /** Merged over the demo defaults. Omit `session` to start without a choice. */
  initialInput?: Partial<Reservation>;
  onSave?: (values: ReservationOutput) => Promise<void>;
  checkName?: CheckName;
};

const pause = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
const demoCheckName: CheckName = async (name) => {
  await pause(250);
  return name.trim().toLowerCase() !== "reserved";
};

export function FormischExample({
  initialInput: suppliedInput,
  onSave = async () => {
    await pause(600);
  },
  checkName = demoCheckName,
}: FormischExampleProps) {
  const initialInput = React.useMemo(
    () => ({ ...reservationDefaults, ...suppliedInput }),
    [suppliedInput],
  );
  // useForm reads the schema and initial input once, on the first render.
  const [schema] = React.useState(() => createReservationSchema(checkName));
  const form = useForm({ schema, initialInput });
  const guests = useFieldArray(form, { path: ["guests"] });
  const [saved, setSaved] = React.useState(false);
  const [simulateFailure, setSimulateFailure] = React.useState(false);
  const [focusGuest, setFocusGuest] = React.useState<number | null>(null);
  // Formisch reports isSubmitting during validation too. Disabling controls
  // at that point would block its focus on the first invalid field, so the
  // example only locks the form while the save request runs.
  const [saving, setSaving] = React.useState(false);
  const pending = saving;

  // Formisch registers the new row's input during commit; focus it afterwards.
  React.useEffect(() => {
    if (focusGuest === null) return;
    focus(form, { path: ["guests", focusGuest, "name"] });
    setFocusGuest(null);
  }, [focusGuest, form]);

  return (
    <Form
      of={form}
      className="grid min-w-0 gap-6"
      aria-label="Workshop reservation"
      aria-busy={pending}
      onSubmit={async (output) => {
        setSaved(false);
        setSaving(true);
        try {
          if (simulateFailure) {
            await pause(400);
            throw new Error("Demo failure");
          }
          await onSave(output);
          setSaved(true);
        } catch {
          // Formisch stores a thrown message as the form's root error.
          throw new Error(
            "We could not save your reservation. Your details are still here. Try again.",
          );
        } finally {
          setSaving(false);
        }
      }}
      onReset={(event) => {
        event.preventDefault();
        if (pending) return;
        reset(form, { initialInput });
        setSaved(false);
        setSimulateFailure(false);
      }}
    >
      <fieldset disabled={pending} className="grid min-w-0 gap-6">
        <legend className="sr-only">Reservation details</legend>
        <FormischField of={form} path={["name"]} label="Name">
          {({ field, controlProps }) => (
            <>
              <Input
                {...field.props}
                {...controlProps}
                value={field.input ?? ""}
                autoComplete="name"
              />
              {form.isValidating && (
                <p role="status" className="text-xs text-muted">
                  Checking name...
                </p>
              )}
            </>
          )}
        </FormischField>
        <FormischField of={form} path={["workshop"]} label="Workshop">
          {({ field, controlProps: { ref, ...controlProps } }) => (
            <Select
              {...controlProps}
              triggerRef={ref}
              triggerOnBlur={field.props.onBlur}
              name={field.props.name}
              value={field.input ?? ""}
              onValueChange={field.onChange}
              label="Workshop"
              disabled={pending}
              options={[
                { value: "engineering", label: "Frontend engineering" },
                { value: "design", label: "Interface design" },
              ]}
            />
          )}
        </FormischField>
        <FormischField
          of={form}
          path={["session"]}
          label="Session"
          group
          className="[&_[role=radiogroup]_label]:flex [&_[role=radiogroup]_label]:min-h-11 [&_[role=radiogroup]_label]:flex-1 [&_[role=radiogroup]_label]:items-center"
        >
          {({ field, controlProps: { ref, ...controlProps } }) => (
            <RadioGroup
              {...controlProps}
              focusRef={ref}
              name={field.props.name}
              value={field.input ?? ""}
              onValueChange={(value) =>
                field.onChange(value as Reservation["session"])
              }
              onBlur={field.props.onBlur}
              label="Session"
              disabled={pending}
              options={[
                { value: "morning", label: "Morning" },
                { value: "afternoon", label: "Afternoon" },
              ]}
            />
          )}
        </FormischField>
        <FormischField
          of={form}
          path={["reminder"]}
          label="Send a reminder"
          className="min-h-11 grid-cols-[1fr_auto] items-center [&>label]:flex [&>label]:min-h-11 [&>label]:items-center [&>p]:col-span-2"
        >
          {({ field, controlProps }) => (
            <Switch
              {...controlProps}
              name={field.props.name}
              checked={field.input === true}
              onCheckedChange={field.onChange}
              onBlur={field.props.onBlur}
              label=""
              disabled={pending}
            />
          )}
        </FormischField>
        <FormischField
          of={form}
          path={["terms"]}
          label="I accept the booking terms"
          className="min-h-11 grid-cols-[1fr_auto] items-center [&>label]:flex [&>label]:min-h-11 [&>label]:items-center [&>p]:col-span-2"
        >
          {({ field, controlProps }) => (
            <Checkbox
              {...controlProps}
              name={field.props.name}
              checked={field.input === true}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              onBlur={field.props.onBlur}
              label=""
              disabled={pending}
            />
          )}
        </FormischField>
        <section className="grid min-w-0 gap-4" aria-label="Guests">
          <div>
            <h3 className="font-medium">Guests</h3>
            <p className="text-sm text-muted">
              Add people joining your reservation. Guests are optional.
            </p>
          </div>
          {guests.items.length === 0 && (
            <p role="status" className="text-sm text-muted">
              No guests added.
            </p>
          )}
          {guests.items.map((item, index) => (
            <div key={item} className="grid min-w-0 gap-2">
              <FormischField
                of={form}
                path={["guests", index, "name"]}
                label={`Guest ${index + 1} name`}
              >
                {({ field, controlProps }) => (
                  <Input
                    {...field.props}
                    {...controlProps}
                    value={field.input ?? ""}
                  />
                )}
              </FormischField>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  tone="secondary"
                  onClick={() => remove(form, { path: ["guests"], at: index })}
                >
                  Remove guest {index + 1}
                </Button>
                {index > 0 && (
                  <Button
                    type="button"
                    tone="quiet"
                    onClick={() =>
                      move(form, {
                        path: ["guests"],
                        from: index,
                        to: index - 1,
                      })
                    }
                  >
                    Move guest {index + 1} up
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button
            type="button"
            tone="secondary"
            onClick={() => {
              const index = guests.items.length;
              insert(form, { path: ["guests"], initialInput: { name: "" } });
              setFocusGuest(index);
            }}
          >
            Add guest
          </Button>
        </section>
        <div className="[&_label]:flex [&_label]:min-h-11 [&_label]:flex-1 [&_label]:items-center">
          <Checkbox
            label="Simulate a save failure"
            checked={simulateFailure}
            onCheckedChange={(checked) => setSimulateFailure(checked === true)}
            disabled={pending}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving reservation..." : "Save reservation"}
          </Button>
          <Button type="reset" tone="secondary" disabled={pending}>
            Reset form
          </Button>
        </div>
      </fieldset>
      <div aria-live="polite" role="status">
        {pending ? "Saving reservation..." : saved ? "Reservation saved." : ""}
      </div>
      {form.errors && (
        <p role="alert" className="text-sm text-danger">
          {form.errors.join(" ")}
        </p>
      )}
    </Form>
  );
}
