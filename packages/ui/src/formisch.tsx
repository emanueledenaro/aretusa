import * as React from "react";
import {
  useField,
  type FieldStore,
  type FormSchema,
  type FormStore,
  type RequiredPath,
  type ValidPath,
} from "@formisch/react";
import type * as v from "valibot";

export type FormischControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
  "aria-invalid": boolean;
  /**
   * Registers the focusable element with Formisch so invalid submissions and
   * `focus(form, { path })` reach it. Native inputs receive it through
   * `field.props.ref`; custom controls attach it to their focusable element.
   */
  ref: (element: HTMLElement | null) => void;
};

export type FormischFieldState<
  TSchema extends FormSchema,
  TPath extends RequiredPath,
> = {
  field: FieldStore<TSchema, TPath>;
  controlProps: FormischControlProps;
  /** Validation messages for this field, or `null` when valid. */
  errors: [string, ...string[]] | null;
  invalid: boolean;
};

export type FormischFieldProps<
  TSchema extends FormSchema,
  TPath extends RequiredPath,
> = {
  /** The form store returned by `useForm`. */
  of: FormStore<TSchema>;
  /** Field path as a tuple, checked against the schema input type. */
  path: ValidPath<v.InferInput<TSchema>, TPath>;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Existing description IDs, retained before the field's help and error IDs. */
  describedBy?: string;
  id?: string;
  className?: string;
  /** Groups use a fieldset and legend, for example a set of radio buttons. */
  group?: boolean;
  children: (state: FormischFieldState<TSchema, TPath>) => React.ReactNode;
};

/** Typed Formisch field state and accessible field anatomy; the caller owns the control. */
export function FormischField<
  TSchema extends FormSchema,
  TPath extends RequiredPath,
>({
  of,
  path,
  label,
  description,
  describedBy,
  id: suppliedId,
  className,
  group = false,
  children,
}: FormischFieldProps<TSchema, TPath>) {
  const generatedId = React.useId();
  const id = suppliedId ?? generatedId;
  const field = useField(of, { path });
  const errors = field.errors;
  const invalid = errors !== null;
  const hasDescription = description !== undefined && description !== null;
  const descriptionIds =
    [
      describedBy,
      hasDescription ? `${id}-description` : undefined,
      invalid ? `${id}-error` : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  const register = field.props.ref;
  const controlProps: FormischControlProps = {
    id,
    "aria-describedby": descriptionIds,
    "aria-labelledby": group ? `${id}-label` : undefined,
    "aria-invalid": invalid,
    // Formisch types the ref for native inputs but only calls focus() on it.
    ref: (element) =>
      register(element as Parameters<typeof register>[0]),
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
      {children({ field, controlProps, errors, invalid })}
      {hasDescription && (
        <p id={`${id}-description`} className="text-xs text-muted">
          {description}
        </p>
      )}
      {invalid && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger">
          {errors.join(" ")}
        </p>
      )}
    </Root>
  );
}
