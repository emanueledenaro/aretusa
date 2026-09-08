import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Input,
  Checkbox,
  Select,
  RadioGroup,
  Switch,
} from "../../packages/ui/src/forms";
import { Button } from "../../packages/ui/src/button";
import { HookFormField } from "../../packages/ui/src/react-hook-form";

export type Reservation = {
  name: string;
  workshop: string;
  session: string;
  reminder: boolean;
  terms: boolean;
  guests: { name: string }[];
};

export const reservationDefaults: Reservation = {
  name: "",
  workshop: "",
  session: "morning",
  reminder: true,
  terms: false,
  guests: [{ name: "" }],
};

export type ReactHookFormExampleProps = {
  defaultValues?: Reservation;
  onSave?: (values: Reservation) => Promise<void>;
  checkName?: (name: string) => Promise<boolean>;
};

const pause = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
const demoCheckName = async (name: string) => {
  await pause(250);
  return name.trim().toLowerCase() !== "reserved";
};

export function ReactHookFormExample({
  defaultValues = reservationDefaults,
  onSave = async () => {
    await pause(600);
  },
  checkName = demoCheckName,
}: ReactHookFormExampleProps) {
  const form = useForm<Reservation>({ defaultValues });
  const guests = useFieldArray({ control: form.control, name: "guests" });
  const [saved, setSaved] = React.useState(false);
  const [simulateFailure, setSimulateFailure] = React.useState(false);
  const pending = form.formState.isSubmitting;

  return (
    <form
      noValidate
      className="grid min-w-0 gap-6"
      aria-label="Workshop reservation"
      aria-busy={pending}
      onSubmit={form.handleSubmit(
        async (values) => {
          setSaved(false);
          form.clearErrors("root");
          try {
            if (simulateFailure) {
              await pause(400);
              throw new Error("Demo failure");
            }
            await onSave(values);
            setSaved(true);
          } catch {
            form.setError("root.server", {
              message:
                "We could not save your reservation. Your details are still here. Try again.",
            });
          }
        },
        () => {
          setSaved(false);
        },
      )}
      onReset={(event) => {
        event.preventDefault();
        if (pending) return;
        form.reset(defaultValues);
        setSaved(false);
        setSimulateFailure(false);
      }}
    >
      <fieldset disabled={pending} className="grid min-w-0 gap-6">
        <legend className="sr-only">Reservation details</legend>
        <HookFormField
          control={form.control}
          name="name"
          label="Name"
          rules={{
            required: "Enter your name.",
            validate: async (value) => {
              if (!value.trim()) return "Enter your name.";
              try {
                return (
                  (await checkName(value)) ||
                  "This name is reserved. Choose another name."
                );
              } catch {
                return "Name checking is unavailable. Try again.";
              }
            },
          }}
        >
          {({ field, controlProps, fieldState }) => (
            <>
              <Input {...field} {...controlProps} autoComplete="name" />
              {fieldState.isValidating && (
                <p role="status" className="text-xs text-muted">
                  Checking name...
                </p>
              )}
            </>
          )}
        </HookFormField>
        <HookFormField
          control={form.control}
          name="workshop"
          label="Workshop"
          rules={{ required: "Choose a workshop." }}
        >
          {({ field, controlProps }) => (
            <Select
              {...controlProps}
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              triggerRef={field.ref}
              triggerOnBlur={field.onBlur}
              label="Workshop"
              disabled={pending}
              options={[
                { value: "engineering", label: "Frontend engineering" },
                { value: "design", label: "Interface design" },
              ]}
            />
          )}
        </HookFormField>
        <HookFormField
          control={form.control}
          name="session"
          label="Session"
          group
          className="[&_[role=radiogroup]_label]:flex [&_[role=radiogroup]_label]:min-h-11 [&_[role=radiogroup]_label]:flex-1 [&_[role=radiogroup]_label]:items-center"
          rules={{ required: "Choose a session." }}
        >
          {({ field, controlProps }) => (
            <RadioGroup
              {...controlProps}
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              focusRef={field.ref}
              label="Session"
              disabled={pending}
              options={[
                { value: "morning", label: "Morning" },
                { value: "afternoon", label: "Afternoon" },
              ]}
            />
          )}
        </HookFormField>
        <HookFormField
          control={form.control}
          name="reminder"
          label="Send a reminder"
          className="min-h-11 grid-cols-[1fr_auto] items-center [&>label]:flex [&>label]:min-h-11 [&>label]:items-center [&>p]:col-span-2"
        >
          {({ field, controlProps }) => (
            <Switch
              {...controlProps}
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              label=""
              disabled={pending}
            />
          )}
        </HookFormField>
        <HookFormField
          control={form.control}
          name="terms"
          label="I accept the booking terms"
          className="min-h-11 grid-cols-[1fr_auto] items-center [&>label]:flex [&>label]:min-h-11 [&>label]:items-center [&>p]:col-span-2"
          rules={{
            validate: (value) =>
              value || "Accept the booking terms to continue.",
          }}
        >
          {({ field, controlProps }) => (
            <Checkbox
              {...controlProps}
              name={field.name}
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              onBlur={field.onBlur}
              ref={field.ref}
              label=""
              disabled={pending}
            />
          )}
        </HookFormField>
        <section className="grid min-w-0 gap-4" aria-label="Guests">
          <div>
            <h3 className="font-medium">Guests</h3>
            <p className="text-sm text-muted">
              Add people joining your reservation. Guests are optional.
            </p>
          </div>
          {guests.fields.length === 0 && (
            <p role="status" className="text-sm text-muted">
              No guests added.
            </p>
          )}
          {guests.fields.map((guest, index) => (
            <div key={guest.id} className="grid min-w-0 gap-2">
              <HookFormField
                control={form.control}
                name={`guests.${index}.name`}
                label={`Guest ${index + 1} name`}
                rules={{
                  required: "Enter the guest name or remove this guest.",
                }}
              >
                {({ field, controlProps }) => (
                  <Input {...field} {...controlProps} />
                )}
              </HookFormField>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  tone="secondary"
                  onClick={() => guests.remove(index)}
                >
                  Remove guest {index + 1}
                </Button>
                {index > 0 && (
                  <Button
                    type="button"
                    tone="quiet"
                    onClick={() => guests.move(index, index - 1)}
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
            onClick={() => guests.append({ name: "" })}
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
      {form.formState.errors.root?.server?.message && (
        <p role="alert" className="text-sm text-danger">
          {form.formState.errors.root.server.message}
        </p>
      )}
    </form>
  );
}
