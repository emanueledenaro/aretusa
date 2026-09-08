import * as React from "react";

/**
 * Structural subset of a TanStack Form `FieldApi` read by the adapter.
 * `form.Field` render props and `useField` results satisfy it without a
 * type import, so this file depends only on React.
 */
export type TanStackFieldLike = {
  name: string;
  state: {
    value: unknown;
    meta: {
      errors: ReadonlyArray<unknown>;
      isTouched: boolean;
      isValidating: boolean;
    };
  };
  handleBlur: () => void;
};

/** Structural subset of a TanStack Form `FormApi` used for invalid-submit focus. */
export type TanStackFormLike = {
  state: {
    fieldMeta: Partial<
      Record<string, { errors: ReadonlyArray<unknown> } | undefined>
    >;
  };
};

export type TanStackFormControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
  "aria-invalid": boolean;
};

export type TanStackFormFieldState<TField extends TanStackFieldLike> = {
  field: TField;
  controlProps: TanStackFormControlProps;
  invalid: boolean;
  /** Readable messages derived from `field.state.meta.errors`. */
  errors: string[];
  isValidating: boolean;
};

export type TanStackFormFieldProps<TField extends TanStackFieldLike> = {
  /** The typed field from `form.Field` or `useField`. */
  field: TField;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Existing description IDs, retained before the field's help and error IDs. */
  describedBy?: string;
  id?: string;
  className?: string;
  /** Groups use a fieldset and legend, for example a set of radio buttons. */
  group?: boolean;
  /** Used when a validator reports an error without a readable message. */
  invalidMessage?: string;
  children: (state: TanStackFormFieldState<TField>) => React.ReactNode;
};

/** Wrapper attribute that links the rendered field to its TanStack field name. */
export const TANSTACK_FIELD_ATTRIBUTE = "data-tanstack-field";

const FOCUSABLE_SELECTOR = [
  'input:not([type="hidden"]):not([aria-hidden="true"])',
  'select:not([aria-hidden="true"])',
  "textarea",
  'button:not([aria-hidden="true"])',
  '[role="radio"]',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/** Converts a validator result into text; validators may return strings or issue objects. */
export function formatTanStackError(
  error: unknown,
  fallback = "Check this field.",
): string {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
}

function isDisabled(element: Element) {
  return (
    (element as HTMLButtonElement).disabled === true ||
    element.getAttribute("aria-disabled") === "true"
  );
}

/**
 * Focuses the first invalid field in document order. TanStack Form does not
 * focus on invalid submit; call this from `onSubmitInvalid`. Fields must be
 * rendered through `TanStackFormField`, which marks each wrapper with the
 * field name. Returns whether an element received focus.
 */
export function focusFirstInvalidField(
  form: TanStackFormLike,
  root: ParentNode | null = typeof document === "undefined" ? null : document,
): boolean {
  if (!root) return false;
  const invalid = new Set(
    Object.entries(form.state.fieldMeta)
      .filter(([, meta]) => (meta?.errors.length ?? 0) > 0)
      .map(([name]) => name),
  );
  if (invalid.size === 0) return false;
  const wrappers = root.querySelectorAll<HTMLElement>(
    `[${TANSTACK_FIELD_ATTRIBUTE}]`,
  );
  for (const wrapper of wrappers) {
    const name = wrapper.getAttribute(TANSTACK_FIELD_ATTRIBUTE);
    if (!name || !invalid.has(name)) continue;
    const candidates =
      wrapper.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    for (const candidate of candidates) {
      if (isDisabled(candidate)) continue;
      candidate.focus();
      return true;
    }
  }
  return false;
}

/** Typed TanStack Form field state and accessible field anatomy; the caller owns the control. */
export function TanStackFormField<TField extends TanStackFieldLike>({
  field,
  label,
  description,
  describedBy,
  id: suppliedId,
  className,
  group = false,
  invalidMessage = "Check this field.",
  children,
}: TanStackFormFieldProps<TField>) {
  const generatedId = React.useId();
  const id = suppliedId ?? generatedId;
  const errors = Array.from(
    new Set(
      field.state.meta.errors
        .filter((error) => error !== undefined && error !== null)
        .map((error) => formatTanStackError(error, invalidMessage)),
    ),
  );
  const invalid = errors.length > 0;
  const hasDescription = description !== undefined && description !== null;
  const descriptionIds =
    [
      describedBy,
      hasDescription ? `${id}-description` : undefined,
      invalid ? `${id}-error` : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  const controlProps: TanStackFormControlProps = {
    id,
    "aria-describedby": descriptionIds,
    "aria-labelledby": group ? `${id}-label` : undefined,
    "aria-invalid": invalid,
  };
  const Root = group ? "fieldset" : "div";
  const marker = { [TANSTACK_FIELD_ATTRIBUTE]: field.name };

  return (
    <Root
      {...marker}
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
      {children({
        field,
        controlProps,
        invalid,
        errors,
        isValidating: field.state.meta.isValidating,
      })}
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
