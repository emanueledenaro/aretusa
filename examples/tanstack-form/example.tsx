import * as React from "react";
import { useForm, useStore } from "@tanstack/react-form";
import {
  Input,
  Checkbox,
  Select,
  RadioGroup,
  Switch,
} from "../../packages/ui/src/forms";
import { Button } from "../../packages/ui/src/button";
import {
  TanStackFormField,
  focusFirstInvalidField,
} from "../../packages/ui/src/tanstack-form";

export type VisitRequest = {
  name: string;
  studio: string;
  slot: string;
  reminder: boolean;
  terms: boolean;
  companions: { name: string }[];
};

export const visitDefaults: VisitRequest = {
  name: "",
  studio: "",
  slot: "morning",
  reminder: true,
  terms: false,
  companions: [{ name: "" }],
};

export type TanStackFormExampleProps = {
  defaultValues?: VisitRequest;
  onSave?: (values: VisitRequest) => Promise<void>;
  checkName?: (name: string) => Promise<boolean>;
};

const SAVE_FAILURE =
  "We could not send your request. Your details are still here. Try again.";
const pause = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
const demoCheckName = async (name: string) => {
  await pause(250);
  return name.trim().toLowerCase() !== "reserved";
};
const booleanRow =
  "min-h-11 grid-cols-[1fr_auto] items-center [&>label]:flex [&>label]:min-h-11 [&>label]:items-center [&>p]:col-span-2";

export function TanStackFormExample({
  defaultValues = visitDefaults,
  onSave = async () => {
    await pause(600);
  },
  checkName = demoCheckName,
}: TanStackFormExampleProps) {
  const uid = React.useId();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [saved, setSaved] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [simulateFailure, setSimulateFailure] = React.useState(false);
  const [focusCompanion, setFocusCompanion] = React.useState<number | null>(
    null,
  );

  const form = useForm({
    defaultValues,
    // A first submit while an async check is in flight would otherwise return
    // early; with this option handleSubmit always runs full validation first.
    canSubmitWhenInvalid: true,
    onSubmit: async ({ value }) => {
      if (simulateFailure) {
        await pause(400);
        throw new Error("Demo failure");
      }
      await onSave(value);
      setSaved(true);
    },
    onSubmitInvalid: ({ formApi }) => {
      setSaved(false);
      // Defer until React commits the invalid state and re-enables the
      // pending fieldset; a disabled control cannot receive focus.
      setTimeout(() => focusFirstInvalidField(formApi, formRef.current), 0);
    },
  });
  const pending = useStore(form.store, (state) => state.isSubmitting);
  const companionId = (index: number) => `${uid}-companion-${index}`;

  React.useEffect(() => {
    if (focusCompanion === null) return;
    document.getElementById(companionId(focusCompanion))?.focus();
    setFocusCompanion(null);
  }, [focusCompanion]);

  return (
    <form
      ref={formRef}
      noValidate
      className="grid min-w-0 gap-6"
      aria-label="Studio visit request"
      aria-busy={pending}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setSaved(false);
        setServerError(null);
        void form.handleSubmit().catch(() => setServerError(SAVE_FAILURE));
      }}
      onReset={(event) => {
        event.preventDefault();
        if (pending) return;
        form.reset(defaultValues);
        setSaved(false);
        setServerError(null);
        setSimulateFailure(false);
      }}
    >
      <fieldset disabled={pending} className="grid min-w-0 gap-6">
        <legend className="sr-only">Visit details</legend>
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) =>
              value.trim() ? undefined : "Enter your name.",
            onChangeAsyncDebounceMs: 300,
            onChangeAsync: async ({ value }) => {
              try {
                return (await checkName(value))
                  ? undefined
                  : "This name is reserved. Choose another name.";
              } catch {
                return "Name checking is unavailable. Try again.";
              }
            },
          }}
        >
          {(field) => (
            <TanStackFormField field={field} label="Name">
              {({ controlProps, isValidating }) => (
                <>
                  <Input
                    {...controlProps}
                    name={field.name}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="name"
                  />
                  {isValidating && (
                    <p role="status" className="text-xs text-muted">
                      Checking name...
                    </p>
                  )}
                </>
              )}
            </TanStackFormField>
          )}
        </form.Field>
        <form.Field
          name="studio"
          validators={{
            onChange: ({ value }) => (value ? undefined : "Choose a studio."),
          }}
        >
          {(field) => (
            <TanStackFormField field={field} label="Studio">
              {({ controlProps }) => (
                <Select
                  {...controlProps}
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  triggerOnBlur={field.handleBlur}
                  label="Studio"
                  disabled={pending}
                  options={[
                    { value: "ceramics", label: "Ceramics studio" },
                    { value: "print", label: "Print workshop" },
                  ]}
                />
              )}
            </TanStackFormField>
          )}
        </form.Field>
        <form.Field
          name="slot"
          validators={{
            onChange: ({ value }) =>
              value ? undefined : "Choose a time slot.",
          }}
        >
          {(field) => (
            <TanStackFormField
              field={field}
              label="Time slot"
              group
              className="[&_[role=radiogroup]_label]:flex [&_[role=radiogroup]_label]:min-h-11 [&_[role=radiogroup]_label]:flex-1 [&_[role=radiogroup]_label]:items-center"
            >
              {({ controlProps }) => (
                <RadioGroup
                  {...controlProps}
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  onBlur={field.handleBlur}
                  label="Time slot"
                  disabled={pending}
                  options={[
                    { value: "morning", label: "Morning" },
                    { value: "afternoon", label: "Afternoon" },
                  ]}
                />
              )}
            </TanStackFormField>
          )}
        </form.Field>
        <form.Field name="reminder">
          {(field) => (
            <TanStackFormField
              field={field}
              label="Send a reminder"
              className={booleanRow}
            >
              {({ controlProps }) => (
                <Switch
                  {...controlProps}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                  onBlur={field.handleBlur}
                  label=""
                  disabled={pending}
                />
              )}
            </TanStackFormField>
          )}
        </form.Field>
        <form.Field
          name="terms"
          validators={{
            onChange: ({ value }) =>
              value ? undefined : "Accept the visit terms to continue.",
          }}
        >
          {(field) => (
            <TanStackFormField
              field={field}
              label="I accept the visit terms"
              className={booleanRow}
            >
              {({ controlProps }) => (
                <Checkbox
                  {...controlProps}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                  onBlur={field.handleBlur}
                  label=""
                  disabled={pending}
                />
              )}
            </TanStackFormField>
          )}
        </form.Field>
        <form.Field name="companions" mode="array">
          {(companions) => (
            <section className="grid min-w-0 gap-4" aria-label="Companions">
              <div>
                <h3 className="font-medium">Companions</h3>
                <p className="text-sm text-muted">
                  Add people visiting with you. Companions are optional.
                </p>
              </div>
              {companions.state.value.length === 0 && (
                <p role="status" className="text-sm text-muted">
                  No companions added.
                </p>
              )}
              {companions.state.value.map((_, index) => (
                <div key={index} className="grid min-w-0 gap-2">
                  <form.Field
                    name={`companions[${index}].name`}
                    validators={{
                      onChange: ({ value }) =>
                        value.trim()
                          ? undefined
                          : "Enter the companion name or remove this companion.",
                    }}
                  >
                    {(field) => (
                      <TanStackFormField
                        field={field}
                        id={companionId(index)}
                        label={`Companion ${index + 1} name`}
                      >
                        {({ controlProps }) => (
                          <Input
                            {...controlProps}
                            name={field.name}
                            value={field.state.value}
                            onChange={(event) =>
                              field.handleChange(event.target.value)
                            }
                            onBlur={field.handleBlur}
                          />
                        )}
                      </TanStackFormField>
                    )}
                  </form.Field>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      tone="secondary"
                      onClick={() => companions.removeValue(index)}
                    >
                      Remove companion {index + 1}
                    </Button>
                    {index > 0 && (
                      <Button
                        type="button"
                        tone="quiet"
                        onClick={() => companions.moveValue(index, index - 1)}
                      >
                        Move companion {index + 1} up
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                tone="secondary"
                onClick={() => {
                  setFocusCompanion(companions.state.value.length);
                  companions.pushValue({ name: "" });
                }}
              >
                Add companion
              </Button>
            </section>
          )}
        </form.Field>
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
            {pending ? "Sending request..." : "Send request"}
          </Button>
          <Button type="reset" tone="secondary" disabled={pending}>
            Reset form
          </Button>
        </div>
      </fieldset>
      <div aria-live="polite" role="status">
        {pending ? "Sending request..." : saved ? "Request sent." : ""}
      </div>
      {serverError && (
        <p role="alert" className="text-sm text-danger">
          {serverError}
        </p>
      )}
    </form>
  );
}
