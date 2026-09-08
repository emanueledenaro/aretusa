# Formisch

`FormischField` connects Formisch field state to Aretusa field labels, help text and errors. Formisch is schema-first: a Valibot schema defines the form's types and its validation, and the adapter reads one field of that schema through `useField`. The render function keeps the library's typed input value, events and element registration available to each control. Your form owns submission, reset and array operations through Formisch methods.

The [complete reservation example](../../examples/formisch/example.tsx) uses Aretusa Input, Select, Checkbox, RadioGroup and Switch. It includes an asynchronous name check inside the schema, a save failure toggle and a guest field array.

## Installation

The `formisch` registry item installs `formisch.tsx` with the shared stylesheet and declares `@formisch/react` and `valibot` as runtime dependencies. From a local checkout of this repository:

```sh
node packages/cli/src/cli.mjs init --cwd /path/to/your-app
node packages/cli/src/cli.mjs add formisch --cwd /path/to/your-app
npm install @formisch/react@^1.1.0 valibot@^1.4.2
```

The React package on npm is `@formisch/react`; there is no unscoped `formisch` package. Version 1.1.0 declares peer dependencies `react >=16.8.0 <20`, `react-dom >=16.8.0 <20`, `typescript >=5 <8` and `valibot >=1.4.1 <2`. Install the controls you compose with it the same way, for example `input`, `select`, `checkbox`, `radio-group` and `switch`. Keep the Aretusa theme stylesheet in your application. The field adapter imports React, `@formisch/react` and Valibot types only. Both Formisch and Valibot use the MIT license; preserve their package licenses when redistributing dependencies.

In this repository, run the standalone example with:

```sh
npm ci
npm ci --prefix examples/formisch
npm run dev --prefix examples/formisch
npm test --prefix examples/formisch
npm run build --prefix examples/formisch
```

The example uses the actual UI source in this checkout and is also rendered on the documentation site under Forms. The clean-consumer check in CI installs the registry item into a fresh Vite project and compiles it.

## Basic use

```tsx
import { Form, useForm } from "@formisch/react";
import * as v from "valibot";
import { Input } from "./aretusa/forms";
import { FormischField } from "./aretusa/formisch";

const ProfileSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Enter your name.")),
});

export function ProfileForm() {
  const form = useForm({ schema: ProfileSchema, initialInput: { name: "" } });
  return (
    <Form of={form} onSubmit={(output) => console.log(output)}>
      <FormischField
        of={form}
        path={["name"]}
        label="Name"
        description="Shown to your team."
      >
        {({ field, controlProps }) => (
          <Input {...field.props} {...controlProps} value={field.input ?? ""} />
        )}
      </FormischField>
      <button type="submit">Save</button>
    </Form>
  );
}
```

`path` is a tuple checked against the schema's input type, so `["profile", "name"]` and `["guests", 0, "name"]` compile and an unknown key does not. `field.input` is typed from the schema but may be `undefined` before the field has a value; supply an `initialInput` for every controlled field, or coalesce to `""` and `false`. Formisch fills required string fields with `""` by default (`emptyInput`), and leaves booleans undefined.

`Form` is the library's thin wrapper over a native `form`: it sets `noValidate`, runs validation on submit and calls `onSubmit` with the parsed schema output. A native `form` with `handleSubmit(form, handler)` from `@formisch/react` behaves the same way.

## API

`FormischField<TSchema, TPath>` accepts these props:

| Prop          | Contract                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------- |
| `of`          | The `FormStore` returned by `useForm`                                                    |
| `path`        | Field path tuple, validated against `v.InferInput<TSchema>`                              |
| `label`       | Required React node, rendered as a label or group legend                                 |
| `description` | Optional React node linked to the control                                                |
| `describedBy` | Existing description IDs, preserved before help and error IDs                            |
| `id`          | Caller control ID; otherwise generated with `useId`                                      |
| `group`       | Uses fieldset/legend for grouped controls; default `false`                               |
| `className`   | Classes for the field wrapper                                                            |
| `children`    | Render function receiving `field`, `controlProps`, `errors` and `invalid`                |

`field` is the Formisch `FieldStore`: `input`, `errors`, `isTouched`, `isEdited`, `isDirty`, `isValid`, `onChange(value)` for custom controls and `props` (`name`, `ref`, `onFocus`, `onChange`, `onBlur`, `autoFocus`) for native elements. `errors` is the field's message list or `null`; `invalid` is `errors !== null`. Every message in the list is rendered inside one paragraph with `role="alert"`, so a Valibot pipe that reports two issues shows both.

`controlProps` contains `id`, `aria-describedby`, `aria-labelledby` for groups, `aria-invalid` and `ref`. Spread it onto the interactive control or radio group. For normal fields, the label targets the same control ID. A grouped field supplies its legend ID through `aria-labelledby`.

`controlProps.ref` registers the focusable element with Formisch. The library types its field ref for native inputs, selects and textareas, but at runtime it only calls `focus()` on registered elements, so the adapter accepts any `HTMLElement` and hands it to the library. Invalid submissions and `focus(form, { path })` use these elements. Attach it to the element that should receive focus: the native input, the Select trigger, the first radio, or the checkbox and switch buttons.

## Control mapping

| Control                 | Value and change                                                                                             | Blur and invalid-submit focus                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `Input`, `NativeSelect` | Spread `field.props`, then `controlProps`; set `value={field.input ?? ""}`                                   | `field.props.onBlur` and `controlProps.ref` reach the native element                 |
| `Select`                | `value={field.input ?? ""}`, `onValueChange={field.onChange}`, `name={field.props.name}`                     | `triggerOnBlur={field.props.onBlur}`, `triggerRef={controlProps.ref}`                |
| `Checkbox`              | `checked={field.input === true}`, `onCheckedChange={(value) => field.onChange(value === true)}`              | `onBlur={field.props.onBlur}`; `ref` arrives through the spread `controlProps`       |
| `Switch`                | `checked={field.input === true}`, `onCheckedChange={field.onChange}`                                         | `onBlur={field.props.onBlur}`; `ref` arrives through the spread `controlProps`       |
| `RadioGroup`            | `value={field.input ?? ""}`, `onValueChange={field.onChange}`, `name={field.props.name}`                     | `onBlur={field.props.onBlur}`, `focusRef={controlProps.ref}` targets the first radio |

For Select and RadioGroup, destructure `ref` out of `controlProps` before spreading so only the trigger or the first radio registers, as the example does. `field.props.onFocus` marks the field touched; pass it to custom controls when your `validate` mode is `touch`. `field.props.name` is the library's serialized path, for example `["workshop"]`; it is a valid form control name. `field.onChange` is typed with the schema value, so a picklist field needs a matching literal type from the control (the example narrows the RadioGroup string).

For Checkbox and Switch, the example supplies the visible label through `FormischField` and sets the control's `label=""` to avoid duplicate label text. The example keeps the label clickable and uses a 44px label height. Formisch has no per-field disabled state; pass your own `disabled` to each control.

## Validation and submission

Validation lives in the schema. Use `v.pipe` for synchronous rules and `v.objectAsync` with `v.pipeAsync` and `v.rawCheckAsync` for asynchronous checks; Formisch always parses with `safeParseAsync`. A rejected asynchronous request would otherwise surface as a form-level error, so catch it inside the check and add a repair message with `addIssue`. The example reserves the name `reserved` with a local delay. This is a demonstration, not a remote availability guarantee. `form.isValidating` is true while any validation runs.

`useForm` accepts `validate` (`initial`, `touch`, `input`, `change`, `blur`, `submit`; default `submit`) and `revalidate` (default `input`). With the defaults, fields stay quiet until the first submission and then correct themselves as the user types. The library's `validate(form, { shouldFocus })` method runs the same validation on demand.

Submission validates the whole schema and, when it fails, focuses the first field with errors that has a registered element, in schema order. The adapter preserves the library's registration rather than searching the DOM by name. `form.isSubmitting` is true during validation and the handler. Disabling a fieldset while `isSubmitting` is true blocks that focus, because the browser cannot focus a disabled control; the example therefore keeps a local `saving` flag that is set only inside the submit handler and uses it to disable the fieldset, composite controls and both actions.

An error thrown by the handler is stored as the form's root error, readable as `form.errors`, and `isSubmitting` returns to false. The example catches the save rejection, throws a repair message, renders `form.errors` with `role="alert"` and retains all entered values for the retry. Success is tracked only after the supplied save promise resolves. Formisch guards concurrent submissions with an internal submission ID; a later submission wins.

## Reset and defaults

`initialInput` is read once by `useForm`. `reset(form)` restores it and clears errors, touched, edited and submitted state; `reset(form, { initialInput })` also replaces the stored initial input, which the example's Reset action uses so a caller can deliberately restore updated defaults. `keepInput`, `keepErrors`, `keepTouched`, `keepEdited` and `keepSubmitted` options exist, and `reset(form, { path })` resets one field. Do not reset during a pending request; this example disables that action. Asynchronous loading of defaults is left to the consumer, for example by rendering the form only once the record has loaded.

## Field arrays

The example uses `useFieldArray(form, { path: ["guests"] })`. Its `items` are stable string IDs; render each row with `key={item}` and address fields as `["guests", index, "name"]`. The methods `insert`, `remove`, `move`, `swap` and `replace` take the form and a config with the array path. `insert` accepts `at` and `initialInput`. Reordering keeps entered values in their moved positions and the schema validates each row, so an empty guest reports its own error and receives focus.

Formisch does not focus a new row on insert. The example records the new index, calls `focus(form, { path: ["guests", index, "name"] })` from an effect after the row has mounted, and the test verifies that the new input has focus. An empty list has a visible status. Reset restores the initial list. The example offers add, remove and move-up controls; it does not include drag-and-drop, file inputs or nested arrays.

## Not supported or not applicable

- Per-field rules outside the schema. Formisch has no `rules` prop or resolver concept; every constraint is a Valibot schema. Use `setErrors(form, { path, errors })` for server-side messages.
- Per-field disabled state. There is no `disabled` in `FieldStore` or `FieldElementProps`; disable controls yourself.
- Focus of a new array row. Not part of `insert`; implemented in the example with `focus`.
- Typed refs for custom controls. `FieldElementProps.ref` is typed for native inputs; the adapter widens it because the runtime only calls `focus()`.

## Primary references

- Installed package `@formisch/react` 1.1.0: `README.md`, `dist/index.d.ts` (`FieldStore`, `FieldElementProps`, `FormStore`, `Form`, `useField`, `useFieldArray`, `focus`, `insert`, `move`, `remove`, `reset`, `setErrors`, `validate`) and `dist/internals.d.ts` (`FormConfig`, `ValidationMode`, `SubmitEventHandler`). Runtime behavior for submit focus and root errors was read in `dist/index.js` (`handleSubmit`) and `dist/internals.js` (`validateFormInput`, `focusFieldElement`, `reset`).
- [Formisch React documentation](https://formisch.dev/react/guides/introduction/): [validation](https://formisch.dev/react/guides/validation/), [handle submission](https://formisch.dev/react/guides/handle-submission/), [controlled fields](https://formisch.dev/react/guides/controlled-fields/), [field arrays](https://formisch.dev/react/guides/field-arrays/), [FormConfig](https://formisch.dev/react/api/FormConfig/) and [FieldElementProps](https://formisch.dev/react/api/FieldElementProps/).
- [Formisch repository](https://github.com/open-circle/formisch), MIT license.
- [Valibot rawCheckAsync](https://valibot.dev/api/rawCheckAsync/), used for the asynchronous name check with a custom repair message.
