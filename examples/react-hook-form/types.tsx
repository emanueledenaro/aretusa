import { useForm } from "react-hook-form";
import { HookFormField } from "../../packages/ui/src/react-hook-form";

// Compile-only public contract: inference retains nested paths and value types.
export function TypedFields() {
  const { control } = useForm({
    defaultValues: { profile: { name: "" }, enabled: false },
  });
  return (
    <>
      <HookFormField control={control} name="profile.name" label="Name">
        {({ field, controlProps }) => {
          const value: string = field.value;
          return <input {...field} {...controlProps} value={value} />;
        }}
      </HookFormField>
      <HookFormField control={control} name="enabled" label="Enabled">
        {({ field, controlProps }) => {
          const checked: boolean = field.value;
          return (
            <input
              {...controlProps}
              type="checkbox"
              name={field.name}
              checked={checked}
              onChange={field.onChange}
              ref={field.ref}
            />
          );
        }}
      </HookFormField>
      {/* @ts-expect-error Unknown field names must fail compilation. */}
      <HookFormField control={control} name="missing" label="Missing">
        {() => null}
      </HookFormField>
    </>
  );
}
