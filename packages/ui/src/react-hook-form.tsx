import * as React from "react";
import {
  useController,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  type UseControllerReturn,
} from "react-hook-form";

export type HookFormControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
  "aria-invalid": boolean;
};

export type HookFormFieldProps<
  TValues extends FieldValues,
  TName extends FieldPath<TValues> = FieldPath<TValues>,
> = UseControllerProps<TValues, TName> & {
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Existing description IDs, retained before the field's help and error IDs. */
  describedBy?: string;
  id?: string;
  className?: string;
  /** Groups use a fieldset and legend, for example a set of radio buttons. */
  group?: boolean;
  /** Used when a validation rule reports an error without a message. */
  invalidMessage?: string;
  children: (
    state: UseControllerReturn<TValues, TName> & {
      controlProps: HookFormControlProps;
    },
  ) => React.ReactNode;
};

/** Typed RHF state and accessible field anatomy; the caller owns the control. */
export function HookFormField<
  TValues extends FieldValues,
  TName extends FieldPath<TValues> = FieldPath<TValues>,
>({
  label,
  description,
  describedBy,
  id: suppliedId,
  className,
  group = false,
  invalidMessage = "Check this field.",
  children,
  ...controllerProps
}: HookFormFieldProps<TValues, TName>) {
  const generatedId = React.useId();
  const id = suppliedId ?? generatedId;
  const state = useController(controllerProps);
  const hasDescription = description !== undefined && description !== null;
  const descriptionIds =
    [
      describedBy,
      hasDescription ? `${id}-description` : undefined,
      state.fieldState.invalid ? `${id}-error` : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  const controlProps: HookFormControlProps = {
    id,
    "aria-describedby": descriptionIds,
    "aria-labelledby": group ? `${id}-label` : undefined,
    "aria-invalid": state.fieldState.invalid,
  };
  const Root = group ? "fieldset" : "div";

  return (
    <Root
      className={["grid min-w-0 gap-2", className].filter(Boolean).join(" ")}
    >
      {group ? (
        <legend id={`${id}-label`} className="mb-2 text-sm font-medium">
          {label}
        </legend>
      ) : (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      {children({ ...state, controlProps })}
      {hasDescription && (
        <p id={`${id}-description`} className="text-xs text-muted">
          {description}
        </p>
      )}
      {state.fieldState.invalid && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger">
          {state.fieldState.error?.message || invalidMessage}
        </p>
      )}
    </Root>
  );
}
