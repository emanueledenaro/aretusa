# TanStack Form

`TanStackFormField` connects a TanStack Form field to Aretusa field labels, help text and errors. You create the field with the library's own `form.Field` or `useField`, hand it to the adapter, and the render function keeps the typed value, handlers and validation state available to each control. `focusFirstInvalidField` adds invalid-submit focus, which the library does not provide. Your form owns validation, submission and reset.

The [complete visit request example](../../examples/tanstack-form/example.tsx) uses Aretusa Input, Select, Checkbox, RadioGroup and Switch. It includes a debounced asynchronous name check, a save failure toggle and a companion field array.

## Installation

The `tanstack-form` registry item installs `tanstack-form.tsx` with the shared stylesheet and declares `@tanstack/react-form` as its runtime dependency. From a local checkout of this repository:

```sh
node packages/cli/src/cli.mjs init --cwd /path/to/your-app
node packages/cli/src/cli.mjs add tanstack-form --cwd /path/to/your-app
npm install @tanstack/react-form@^1.33.5
```

Install the controls you compose with it the same way, for example `input`, `select`, `checkbox`, `radio-group` and `switch`. Keep the Aretusa theme stylesheet in your application. The adapter file imports only React: it reads the field through a structural type that `form.Field` render props and `useField` results satisfy, so the library is required by your form code rather than by the adapter file. TanStack Form uses the MIT license; preserve its package license when redistributing dependencies.

In this repository, run the standalone example with:

```sh
npm ci
npm ci --prefix examples/tanstack-form
npm run dev --prefix examples/tanstack-form
npm test --prefix examples/tanstack-form
npm run build --prefix examples/tanstack-form
```

The example uses the actual UI source in this checkout.

## Basic use

```tsx
import { useForm } from "@tanstack/react-form";
import { Input } from "./aretusa/forms";
import {
  TanStackFormField,
  focusFirstInvalidField,
} from "./aretusa/tanstack-form";

type Profile = { name: string };

export function ProfileForm() {
  const form = useForm({
    defaultValues: { name: "" } as Profile,
    onSubmit: async ({ value }) => console.log(value),
    onSubmitInvalid: ({ formApi }) =>
      setTimeout(() => focusFirstInvalidField(formApi), 0),
  });
  return (
    <form
      noValidate
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
            description="Shown to your team."
          >
            {({ controlProps }) => (
              <Input
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
      <button type="submit">Save</button>
    </form>
  );
}
```

`useForm({ defaultValues })` infers the form data type and `form.Field` checks the `name` path against it. Supply defaults for every field. Use an empty string or `false` instead of `undefined`.

## API

`TanStackFormField<TField>` accepts these props:

| Prop             | Contract                                                                               |
| ---------------- | -------------------------------------------------------------------------------------- |
| `field`          | Required field from `form.Field` or `useField`; its concrete type reaches children     |
| `label`          | Required React node, rendered as a label or group legend                               |
| `description`    | Optional React node linked to the control                                              |
| `describedBy`    | Existing description IDs, preserved before help and error IDs                          |
| `id`             | Caller control ID; otherwise generated with `useId`                                    |
| `group`          | Uses fieldset/legend for grouped controls; default `false`                             |
| `invalidMessage` | Fallback when a validator result has no readable message; default `Check this field.`  |
| `className`      | Classes for the field wrapper                                                          |
| `children`       | Render function receiving `field`, `controlProps`, `invalid`, `errors`, `isValidating` |

`controlProps` contains `id`, `aria-describedby`, `aria-labelledby` for groups and `aria-invalid`. Spread it onto the interactive control or radio group. Error text has `role="alert"`. For normal fields, the label targets the same control ID. A grouped field supplies its legend ID through `aria-labelledby`.

`errors` is derived from `field.state.meta.errors`: strings are shown as they are, objects with a string `message` (for example Standard Schema issues) show that message, anything else shows `invalidMessage`. Duplicate messages are collapsed and joined into one alert. `formatTanStackError` is exported for the same conversion elsewhere.

The wrapper carries `data-tanstack-field="<field name>"`. `focusFirstInvalidField(formApi, root?)` reads `formApi.state.fieldMeta`, walks the wrappers in document order and focuses the first enabled focusable descendant of the first invalid field. It returns whether an element received focus. Call it from `onSubmitInvalid`, deferred with `setTimeout(..., 0)`: the callback runs before React commits the invalid state, and a fieldset disabled for the pending request cannot receive focus until that commit. Pass the form element as `root` when several forms are mounted.

## Control mapping

| Control                 | Value and change                                                                            | Blur                               |
| ----------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------- |
| `Input`, `NativeSelect` | `value={field.state.value}`, `onChange={(e) => field.handleChange(e.target.value)}`, `name` | `onBlur={field.handleBlur}`        |
| `Select`                | `value={field.state.value}`, `onValueChange={field.handleChange}`, `name={field.name}`      | `triggerOnBlur={field.handleBlur}` |
| `Checkbox`              | `checked={field.state.value}`, `onCheckedChange={(v) => field.handleChange(v === true)}`    | `onBlur={field.handleBlur}`        |
| `Switch`                | `checked={field.state.value}`, `onCheckedChange={field.handleChange}`                       | `onBlur={field.handleBlur}`        |
| `RadioGroup`            | `value={field.state.value}`, `onValueChange={field.handleChange}`, `name={field.name}`      | `onBlur={field.handleBlur}`        |

Invalid-submit focus does not need refs: the helper finds the Select trigger, the first enabled radio and the Checkbox or Switch button inside the wrapper. For Checkbox and Switch, the example supplies the visible label through `TanStackFormField` and sets the control's `label=""` to avoid duplicate label text, keeping a 44px clickable label row. Map your pending state to each custom control's `disabled` prop; a disabled native fieldset does not reach Radix buttons.

## Validation timing

Field validators run per event, in the [validation guide's](https://tanstack.com/form/latest/docs/framework/react/guides/validation) order:

- `onChange` runs synchronously on every `handleChange` call. Errors appear immediately, before blur, so the example uses short repair messages.
- `onChangeAsync` runs only after the synchronous `onChange` validator passes (set `asyncAlways` to change this). During typing it waits `onChangeAsyncDebounceMs` (300ms in the example) and aborts superseded runs through the supplied `AbortSignal`. `field.state.meta.isValidating` is true while it runs; the example announces `Checking name...`.
- `onBlur` and `onBlurAsync` run on `handleBlur`; `onSubmit` and `onSubmitAsync` run only on submit.
- On submit, `handleSubmit` marks every field touched and runs the change, blur and submit validators of every mounted field with debounce set to 0, then the form-level validators. Async results are awaited before `onSubmit` or `onSubmitInvalid` is called.

Catch rejected requests inside async validators and return a repair message; the example returns `Name checking is unavailable. Try again.` The reserved name `reserved` is a local demonstration with a 250ms delay, not a remote availability guarantee. Standard Schema validators (Zod, Valibot, ArkType) are accepted by the same `validators` keys; this example does not install one.

## Submission, pending, failure and reset

Call `event.preventDefault()` and `form.handleSubmit()` from the form's `onSubmit`. `handleSubmit` sets `state.isSubmitting` while validating and while awaiting your `onSubmit`; the example reads it with `useStore(form.store, (s) => s.isSubmitting)`, disables the fieldset, composite controls and both actions, and announces the pending state.

The example sets `canSubmitWhenInvalid: true`. Without it the library's first submission attempt returns early through `onSubmitInvalid` when `state.canSubmit` is false, which includes the moment a debounced async check is still running; with it, `handleSubmit` always runs full validation and still calls `onSubmitInvalid` when any field has errors.

A rejected `onSubmit` is rethrown by `handleSubmit`. The example catches that promise, shows a retry message with `role="alert"` and keeps every entered value; `isSubmitSuccessful` stays false. Success is tracked only after the supplied save promise resolves.

Reset calls `form.reset(defaultValues)`, which restores values, clears errors, touched and dirty state and the submission counter. The example passes its latest `defaultValues` prop so a caller can deliberately restore updated defaults. Do not reset during a pending request; the example disables that action. Asynchronous loading of defaults is possible through the library, but this example uses synchronous defaults.

## Field arrays

Use `<form.Field name="companions" mode="array">`. Render rows from `field.state.value` with `key={index}` and nested fields named `companions[${index}].name`, as in the [arrays guide](https://tanstack.com/form/latest/docs/framework/react/guides/arrays). `pushValue` appends a complete row (the example then focuses the new input by ID), `removeValue(index)` deletes its value and metadata, `moveValue(from, to)` preserves entered values in the reordered positions. An empty list has a visible status. Reset restores the initial list.

The library keys rows by index, so controlled inputs are updated in place after a move. The example offers add, remove and move-up controls; it does not include drag-and-drop, file inputs, nested arrays or `insertValue`/`swapValues`, which are the same API family.

## Primary references

- [Validation guide](https://tanstack.com/form/latest/docs/framework/react/guides/validation) covers `onChange`, `onBlur`, `onSubmit`, the async variants, `onChangeAsyncDebounceMs` and `asyncAlways`.
- [Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts) covers `useForm`, `form.Field`, `field.state.meta` (`errors`, `isTouched`, `isValidating`), `useStore`/`form.Subscribe` and `form.reset`.
- [Arrays guide](https://tanstack.com/form/latest/docs/framework/react/guides/arrays) covers `mode="array"`, `pushValue` and nested names.
- [Submission handling](https://tanstack.com/form/latest/docs/framework/react/guides/submission-handling) covers `handleSubmit` and submit meta.
- Installed declarations at `@tanstack/react-form@1.33.5` and `@tanstack/form-core@1.33.5` (`dist/esm/FormApi.d.ts`, `FieldApi.d.ts`, `types.d.ts`) for `onSubmitInvalid`, `canSubmitWhenInvalid`, `isSubmitting`, `removeValue`, `moveValue` and the field meta shape; `dist/esm/FormApi.js` and `utils.js` for the submit sequence and the zero debounce on submit.
