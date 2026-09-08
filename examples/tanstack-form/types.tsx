import { useForm } from "@tanstack/react-form";
import { TanStackFormField } from "../../packages/ui/src/tanstack-form";

// Compile-only public contract: inference retains nested paths and value types.
export function TypedFields() {
  const form = useForm({
    defaultValues: { profile: { name: "" }, enabled: false },
  });
  return (
    <>
      <form.Field
        name="profile.name"
        validators={{
          onChange: ({ value }) => (value.trim() ? undefined : "Required."),
        }}
      >
        {(field) => (
          <TanStackFormField field={field} label="Name">
            {({ field: typed, controlProps }) => {
              const value: string = typed.state.value;
              return (
                <input
                  {...controlProps}
                  name={typed.name}
                  value={value}
                  onChange={(event) => typed.handleChange(event.target.value)}
                  onBlur={typed.handleBlur}
                />
              );
            }}
          </TanStackFormField>
        )}
      </form.Field>
      <form.Field name="enabled">
        {(field) => (
          <TanStackFormField field={field} label="Enabled">
            {({ controlProps }) => {
              const checked: boolean = field.state.value;
              return (
                <input
                  {...controlProps}
                  type="checkbox"
                  name={field.name}
                  checked={checked}
                  onChange={(event) => field.handleChange(event.target.checked)}
                  onBlur={field.handleBlur}
                />
              );
            }}
          </TanStackFormField>
        )}
      </form.Field>
      {/* @ts-expect-error Unknown field names must fail compilation. */}
      <form.Field name="missing">{() => null}</form.Field>
    </>
  );
}
