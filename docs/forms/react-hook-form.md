# React Hook Form

`HookFormField` connects React Hook Form state to Aretusa field labels, help text and errors. The render function keeps the library's typed value, events and focus ref available to each control. Your form owns validation, submission and reset.

The [complete reservation example](../../examples/react-hook-form/example.tsx) uses Aretusa Input, Select, Checkbox, RadioGroup and Switch. It includes an asynchronous name check, a save failure toggle and a guest field array.

## Installation

The `react-hook-form` registry item installs `react-hook-form.tsx` with the shared stylesheet and declares `react-hook-form` as its runtime dependency. From a local checkout of this repository:

```sh
node packages/cli/src/cli.mjs init --cwd /path/to/your-app
node packages/cli/src/cli.mjs add react-hook-form --cwd /path/to/your-app
npm install react-hook-form@^7.87.0
```

Install the controls you compose with it the same way, for example `input`, `select`, `checkbox`, `radio-group` and `switch`. Keep the Aretusa theme stylesheet in your application. The field adapter imports only React and React Hook Form. React Hook Form uses the MIT license; preserve its package license when redistributing dependencies.

In this repository, run the standalone example with:

```sh
npm ci
npm ci --prefix examples/react-hook-form
npm run dev --prefix examples/react-hook-form
npm test --prefix examples/react-hook-form
npm run build --prefix examples/react-hook-form
```

The example uses the actual UI source in this checkout and is also rendered on the documentation site under Forms. The clean-consumer check in CI installs the registry item into a fresh Vite project and compiles it.

## Basic use

```tsx
import { useForm } from "react-hook-form";
import { Input } from "./aretusa/forms";
import { HookFormField } from "./aretusa/react-hook-form";

type Profile = { name: string };

export function ProfileForm() {
  const form = useForm<Profile>({ defaultValues: { name: "" } });
  return (
    <form noValidate onSubmit={form.handleSubmit(console.log)}>
      <HookFormField
        control={form.control}
        name="name"
        label="Name"
        description="Shown to your team."
        rules={{ required: "Enter your name." }}
      >
        {({ field, controlProps }) => <Input {...field} {...controlProps} />}
      </HookFormField>
      <button type="submit">Save</button>
    </form>
  );
}
```

Use `control={form.control}` for inferred field names and value types. `FormProvider` is also supported through `useController`; when omitting `control`, specify the generic value type explicitly to retain path checks. Supply defaults for every controlled field. Use an empty string or `false` instead of `undefined`.

## API

`HookFormField<TValues, TName>` accepts `UseControllerProps<TValues, TName>` and these presentation props:

| Prop             | Contract                                                                        |
| ---------------- | ------------------------------------------------------------------------------- |
| `label`          | Required React node, rendered as a label or group legend                        |
| `description`    | Optional React node linked to the control                                       |
| `describedBy`    | Existing description IDs, preserved before help and error IDs                   |
| `id`             | Caller control ID; otherwise generated with `useId`                             |
| `group`          | Uses fieldset/legend for grouped controls; default `false`                      |
| `invalidMessage` | Fallback when the library error has no message; default `Check this field.`     |
| `className`      | Classes for the field wrapper                                                   |
| `children`       | Render function receiving `field`, `fieldState`, `formState` and `controlProps` |

`controlProps` contains `id`, `aria-describedby`, `aria-labelledby` for groups and `aria-invalid`. Spread it onto the interactive control or radio group. Error text has `role="alert"`. For normal fields, the label targets the same control ID. A grouped field supplies its legend ID through `aria-labelledby`.

Do not register the same controlled field again with `register`. Keep the forwarded ref attached to the focusable element. Your render function can compose extra event handlers or refs; call the corresponding RHF handler/ref as well.

## Control mapping

| Control                 | Value and change                                                                       | Blur and invalid-submit focus                                                   |
| ----------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Input`, `NativeSelect` | Spread `field`, then `controlProps`                                                    | `field.onBlur` and `field.ref` reach the native input                           |
| `Select`                | `value={field.value}`, `onValueChange={field.onChange}`, `name={field.name}`           | `triggerOnBlur={field.onBlur}`, `triggerRef={field.ref}`                        |
| `Checkbox`              | `checked={field.value}`, `onCheckedChange={(value) => field.onChange(value === true)}` | `onBlur={field.onBlur}`, `ref={field.ref}`                                      |
| `Switch`                | `checked={field.value}`, `onCheckedChange={field.onChange}`                            | `onBlur={field.onBlur}`, `ref={field.ref}`                                      |
| `RadioGroup`            | `value={field.value}`, `onValueChange={field.onChange}`, `name={field.name}`           | `onBlur={field.onBlur}`, `focusRef={field.ref}` targets the first enabled radio |

The Select mapping requires the Aretusa `triggerRef`/`triggerOnBlur` API, and RadioGroup requires `focusRef`. For Checkbox and Switch, the example supplies the visible label through `HookFormField` and sets the control's `label=""` to avoid duplicate label text. The example keeps the label clickable and uses a 44px label height. Map `field.disabled` to each custom control's `disabled` prop when configuring disabled fields through RHF.

## Validation and submission

Pass synchronous rules or an async `rules.validate` callback. Return `true` on success or a message on failure. Catch rejected validation requests and return a repair message; an unavailable service should not cause an unhandled rejection. The example reserves the name `reserved` with a local delay. This is a demonstration, not a remote availability guarantee.

RHF's default invalid-submit focus depends on the field ref, registration order and enabled controls. The adapter preserves the ref rather than finding controls by name. `mode`, `reValidateMode`, resolvers and `shouldFocusError` remain `useForm` options. Schema resolvers are compatible library configuration, but this example does not install or verify a resolver package.

Use `formState.isSubmitting` to announce pending work and prevent repeated submit/reset actions. The example disables a native fieldset while saving and explicitly disables composite controls. It catches save rejection, calls `setError("root.server", ...)` and retains all entered values. Success is tracked only after the supplied save promise resolves. Reset clears success, root errors, dirty/touched state and restores supplied defaults. Do not reset during a pending request; this example disables that action.

`defaultValues` are read initially by RHF. The example's Reset action uses the latest `defaultValues` prop, so a caller can deliberately restore updated defaults. Asynchronous loading of defaults is a `useForm` capability, but this example uses synchronous defaults and does not claim a loading screen for remote records.

## Field arrays

The example uses `useFieldArray` for `guests`. Render each row with `key={field.id}`, keep names such as `guests.${index}.name`, and append complete values. Add focuses the new input; Remove deletes its registered value; Move preserves the entered values in their reordered positions. An empty list has a visible status. Reset restores the initial list.

Leave `shouldUnregister` at its default for field arrays. Reordering can unmount/remount controls, so unregistering on unmount can remove values unexpectedly. The example offers add, remove and move-up controls; it does not include drag-and-drop, file inputs or nested arrays.

## Primary references

- [React Hook Form useController](https://react-hook-form.com/docs/usecontroller), also available in the [official documentation source](https://github.com/react-hook-form/documentation/blob/master/src/content/docs/usecontroller.mdx).
- [handleSubmit](https://react-hook-form.com/docs/useform/handlesubmit) documents promise handling and disabled inputs.
- [useFieldArray](https://react-hook-form.com/docs/usefieldarray) documents stable IDs and array operations.
- [reset](https://react-hook-form.com/docs/useform/reset) documents restoration of controlled values and form state.
