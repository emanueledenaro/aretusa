# Changelog

## Unreleased

- Shimmer utility: an original text highlight with enabled, speed and highlight options.
- Scroll Fade utility: `useScrollFade` and `ScrollFade` bring edge fades to any scroll container on both axes, with RTL, resize and mutation tracking, enable/disable and cleanup. ScrollArea now uses the same hook.
- Form controls expose `triggerRef`, `triggerOnBlur` and `focusRef` for form-library integrations.
- Formisch integration: `FormischField` adapter over a Valibot schema with registered focus, Forms documentation route with the reservation example, registry item declaring `@formisch/react` and `valibot`.
- TanStack Form integration: `TanStackFormField` adapter with `focusFirstInvalidField`, Forms documentation route with the visit request example, registry item declaring `@tanstack/react-form`.
- React Hook Form integration: `HookFormField` adapter, Forms documentation route with the reservation example, registry item with the `react-hook-form` dependency.
- Input: read-only appearance; documentation demo covers types, autocomplete, errors, long values, disabled and narrow parents.
- Select: list viewport uses the Aretusa scrollbar; documentation demo covers descriptions, disabled options, swatches, long lists, errors and nesting in a dialog.
- Dialog, Sheet and Drawer: refined header and close control, scrollable body with the Aretusa scrollbar, persistent footer with stacked mobile actions, and `ModalClose` for footer actions.
- Alert Dialog: editorial layout with a tone eyebrow, stacked mobile actions, `tone`, `label`, `cancelLabel`, `children`, controlled `open`, and asynchronous `onConfirm` with pending, error and retry handling.
- Calendar: caller `className`, `showOutsideDays` and `navLayout` are respected; redesigned editorial styling with 44px targets, today marker, continuous range band, styled month and year menus and narrow-container wrapping; five documented examples.

## 0.1.0

Initial Aretusa implementation by TrinacriaLabs.

- Original React/Tailwind components across foundations, forms, overlays, navigation, data and conversation.
- Eight reusable page blocks.
- Light/dark editorial themes with DM Sans and Lora.
- Live catalog, source viewer, typed usage examples, search and theme export.
- Source-first CLI with dry runs and conflict protection.

See docs/verification.md for the verified scope and current limitations.
