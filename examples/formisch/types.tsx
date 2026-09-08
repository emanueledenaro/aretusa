import { useForm } from "@formisch/react";
import * as v from "valibot";
import { FormischField } from "../../packages/ui/src/formisch";

const ProfileSchema = v.object({
  profile: v.object({ name: v.string() }),
  enabled: v.boolean(),
  tags: v.array(v.object({ label: v.string() })),
});

// Compile-only public contract: inference comes from the Valibot schema and
// retains nested paths, array item paths and value types.
export function TypedFields() {
  const form = useForm({
    schema: ProfileSchema,
    initialInput: { profile: { name: "" }, enabled: false, tags: [] },
  });
  return (
    <>
      <FormischField of={form} path={["profile", "name"]} label="Name">
        {({ field, controlProps }) => {
          const value: string | undefined = field.input;
          return (
            <input
              {...field.props}
              {...controlProps}
              value={value ?? ""}
            />
          );
        }}
      </FormischField>
      <FormischField of={form} path={["enabled"]} label="Enabled">
        {({ field, controlProps }) => {
          const checked: boolean | undefined = field.input;
          return (
            <input
              {...controlProps}
              type="checkbox"
              name={field.props.name}
              checked={checked === true}
              onChange={(event) => field.onChange(event.target.checked)}
              onBlur={field.props.onBlur}
            />
          );
        }}
      </FormischField>
      <FormischField of={form} path={["tags", 0, "label"]} label="First tag">
        {({ field, controlProps }) => (
          <input {...field.props} {...controlProps} value={field.input ?? ""} />
        )}
      </FormischField>
      {/* @ts-expect-error Unknown field paths must fail compilation. */}
      <FormischField of={form} path={["missing"]} label="Missing">
        {() => null}
      </FormischField>
      <FormischField of={form} path={["enabled"]} label="Wrong value type">
        {({ field }) => {
          // @ts-expect-error A boolean field rejects a string value.
          field.onChange("yes");
          return null;
        }}
      </FormischField>
    </>
  );
}
