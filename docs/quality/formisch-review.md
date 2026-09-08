# Evidence: Formisch

- Issue: [#90](https://github.com/emanueledenaro/aretusa/issues/90)
- Base: `62cf4549335b25eed70ab555ee875c1c177dc0b8` (main at dispatch)
- Worker branch: `agent/formisch-90`
- Implementation commit: `3257956` (adapter, example, tests); documentation and this record follow on the same branch
- Status: behavior-checked in JSDOM. Not visually reviewed: the browser pane was reserved by the coordinator during this work, so every rendered check below is pending.
- Reviewer: worker self-review of automated checks. Coordinator acceptance remains a separate gate.

## Library verification

- npm package: `@formisch/react` 1.1.0 (`dist-tags`: latest 1.1.0, rc 1.0.0-rc.0), MIT, repository `open-circle/formisch`, homepage formisch.dev. Peer dependencies: `react >=16.8.0 <20`, `react-dom >=16.8.0 <20`, `typescript >=5 <8`, `valibot >=1.4.1 <2`. The names `formisch` and `@formisch/core` return 404 on npm.
- `valibot` 1.4.2, MIT.
- Primary sources read: the installed `dist/index.d.ts` and `dist/internals.d.ts`, the package README, and the runtime in `dist/index.js` and `dist/internals.js`. The public guides at formisch.dev (validation, handle submission, controlled fields, field arrays, FormConfig, FieldElementProps) were confirmed reachable and consistent with the installed types.
- Findings that shaped the design: `handleSubmit` sets `isSubmitting` before validation and validates with `shouldFocus: true`; `focusFieldElement` calls `focus()` on elements registered through `field.props.ref` until one becomes the active element; a thrown handler error becomes `form.errors`; `reset` clears errors, touched, edited and submitted state and accepts a new `initialInput`; `insert` does not focus; `FieldStore` has no disabled state and no per-field rules.

## Requirements matrix

| Requirement                           | Implementation                                                                                   | Evidence / remaining gate                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Typed schema-based fields             | `FormischField` calls `useField`; `path` is checked against `v.InferInput<TSchema>`              | `types.tsx` compiles nested, array-item and boolean paths, rejects an unknown path and a wrong value type                                  |
| Text, select, checkbox, radio, switch | Actual Aretusa controls in the reservation example                                               | Submit test verifies schema output for every control; Select opening interaction is a browser gate                                         |
| Synchronous validation                | Valibot `nonEmpty`, `picklist`, `check` in the schema                                            | Error associations and invalid-submit focus tested                                                                                         |
| Async validation                      | `objectAsync` with `rawCheckAsync` for the name check; rejection turned into a field message     | Tests cover reserved name, correction, and a rejected request shown as a field error rather than a root failure                            |
| Linked errors                         | Stable control, description and error IDs; all messages in one `role="alert"` paragraph          | Public input test checks caller ID and combined help/error descriptions; group test checks legend, `aria-labelledby` and group description |
| Invalid focus                         | `controlProps.ref` registers native inputs, Select trigger, first radio, checkbox and switch     | Focus tests target the actual controls; guest-row test focuses the second row                                                              |
| Pending/success/failure               | Local `saving` flag disables fieldset and actions; `aria-busy`; root error from `form.errors`    | Tests cover pending, failed promise, preserved input, enabled retry and success                                                            |
| Reset/defaults                        | `initialInput` and `reset(form, { initialInput })`                                               | Test restores every control including the radio, removes success and added rows                                                            |
| Field arrays                          | `useFieldArray`, `insert`, `remove`, `move`; focus after insert through `focus` in an effect     | Tests verify add focus, preserved row values after move and remove, reset and empty state                                                  |
| Unsupported or not applicable         | Documented in `docs/forms/formisch.md`: no per-field rules, no per-field disabled, no insert focus | Sourced from the installed types; the example implements insert focus itself                                                               |
| Aretusa styling                       | Shared UI stylesheet/tokens and the same field anatomy as `HookFormField`                        | Pending browser inspection                                                                                                                 |
| Complete example and API              | Runnable independent example; Forms documentation                                                | Example test/build pass; documentation router integration pending                                                                          |
| Sidebar, registry and CLI             | Coordinator-owned integration                                                                    | Pending: catalog entry, Forms route, root dependencies and generated registry                                                              |
| Clean consumer                        | Not performed by this worker                                                                     | Coordinator must install the finished registry item into a fresh app and compile                                                           |

## Browser matrix

No browser evidence exists for this delivery. The browser pane was in use by the coordinator and the worker did not run an alternative browser. Every row is pending.

| Viewport or container | Theme | State                                        | Evidence | Result  |
| --------------------- | ----- | -------------------------------------------- | -------- | ------- |
| 320 CSS px            | light | invalid submit, linked messages, input focus |          | pending |
| 390 CSS px            | dark  | invalid fields and focus                     |          | pending |
| 768 CSS px            | light | Select keyboard path, pending save, success  |          | pending |
| 1024 CSS px           | light | append guest and focus                       |          | pending |
| 1440 CSS px           | dark  | reorder guests                               |          | pending |
| 240 px parent         | both  | constrained composition                      |          | pending |
| 200% text zoom        | both  | reflow, long content and actions             |          | pending |
| Reduced motion        | both  | Select popup and Switch transition           |          | pending |

The standalone example serves with `npm run dev --prefix examples/formisch`; the layout classes are identical to the reviewed React Hook Form example, but that similarity is not evidence for this item.

## Interaction and limitations

JSDOM tests cover schema errors, async validation, rejected requests, submission, failed promises, retry, reset, array mutations and focus through the library's registered elements. The JSDOM platform shim supplies ResizeObserver and pointer APIs without geometry; layout claims need the browser. Opening the Radix Select through JSDOM user-event was not attempted, following the React Hook Form record; Select value submission and invalid focus are in the automated tests.

Two behaviors are intentionally worked around and documented: Formisch's `isSubmitting` is true while validation runs, so the example locks the form with a local flag set inside the submit handler instead, otherwise the disabled fieldset would prevent the library's focus on the first invalid control; and `insert` does not focus the new row, so the example calls `focus` after mount.

Radio labels, boolean-field labels and action buttons use the same 44px minimum-height regions as the React Hook Form example. Contrast, real touch hardware, assistive-technology output, native text zoom, forced colors and dialog/sheet composition remain unverified. RTL is not claimed.

The integration leaves networking, backend persistence, file inputs, asynchronous default loading, nested arrays and drag-and-drop to the consumer. The demo saves locally with delays and does not create a real reservation.

## Checks

- `npm ci --no-audit --no-fund` at the root: pass.
- `npm install --no-save @formisch/react@1.1.0 valibot@1.4.2` at the root: needed only so the root `tsc` can resolve the adapter's imports; it wrote nothing to the root manifest or lockfile.
- `npm install --prefix examples/formisch`: independent lockfile created; resolves `@formisch/react` 1.1.0, `valibot` 1.4.2, `react` 19.2.8.
- `npm test --prefix examples/formisch`: 12 tests pass (10 in `example.test.tsx`, 2 in `field.test.tsx`).
- `npm run build --prefix examples/formisch`: `tsc --noEmit` and Vite build pass; output 362.43 kB JS / 114.60 kB gzip, including React, Formisch, Valibot and the composed controls.
- `npm run typecheck` at the root: pass with the unsaved root installation above.
- `npm test` at the root: 148 Vitest tests and 5 CLI tests pass; the registry build output was unchanged.
- Root manifest, lockfile, catalog, exports, documentation router, shared styles, coverage and generated registry are coordinator-owned. The worker did not add integration wiring there.

## Integration handoff

1. Add root dependencies `@formisch/react` at `^1.1.0` and `valibot` at `^1.4.2`, matching the example lockfile, and export `FormischField`, `FormischFieldProps`, `FormischFieldState`, `FormischControlProps` from the UI barrel (`export * from "./formisch";` in `packages/ui/src/index.ts`). Include `npm ci --prefix examples/formisch`, `npm test --prefix examples/formisch` and `npm run build --prefix examples/formisch` in `.github/workflows/check.yml` beside the React Hook Form steps.
2. Add the catalog entry in `packages/ui/src/catalog.ts`: `{ "id": "formisch", "name": "Formisch", "module": "integrations", "exportName": "FormischField", "description": "Typed Formisch fields from a Valibot schema with Aretusa labels, help text, errors and focus on invalid submit.", "source": "formisch" }`. The registry builder will detect `@formisch/react` and `valibot` from the adapter's imports; the adapter has no imports from other Aretusa source files.
3. Add a Forms sidebar entry and route `#/forms/formisch` using `docs/forms/formisch.md` and `FormischExample` from `examples/formisch/example.tsx` in `apps/docs/src/Demo.tsx`. Keep demo code out of the distributable adapter. Include the example's classes in the documentation build's Tailwind scanning.
4. Add the interaction note in `apps/docs/src/App.tsx`: "FormischField calls useField and renders the label, help text and error for one field of a Valibot schema; your render function receives field, controlProps, errors and invalid. Spread field.props and controlProps on Input or NativeSelect with value={field.input ?? ''}; map value, onValueChange, triggerRef and triggerOnBlur on Select; checked and onCheckedChange on Checkbox and Switch; value, onValueChange and focusRef on RadioGroup. controlProps.ref registers the control so invalid submit focuses it. Validation lives in the schema; submission, reset and field arrays use Form, reset, useFieldArray, insert, remove and move. The full reservation example lives in examples/formisch."
5. Add the usage snippet in `apps/docs/src/usage.ts`: markup `<Form of={form} onSubmit={(output) => console.log(output)}><FormischField of={form} path={["name"]} label="Name" description="Shown to your team.">{({ field, controlProps }) => <Input {...field.props} {...controlProps} value={field.input ?? ""} />}</FormischField><button type="submit">Save</button></Form>`, imports `import { Form, useForm } from "@formisch/react";`, `import * as v from "valibot";`, `import { Input } from "./components/aretusa/forms";`, and setup `const form = useForm({ schema: v.object({ name: v.pipe(v.string(), v.nonEmpty("Enter your name.")) }), initialInput: { name: "" } });`.
6. Extend `scripts/verify-consumer.mjs` to add `formisch`, install `@formisch/react` and `valibot` in the consumer and compile a `FormischField` form. Add the item to `docs/quality/coverage.json` with type `integration`, issue 90, dependencies `input`, `select`, `checkbox`, `radio-group`, `switch` and evidence `docs/quality/formisch-review.md`; update `docs/forms-utilities-scope.md`, the tracker index and the changelog.
7. Regenerate the registry, install the item with the CLI in a clean consumer, compile the public snippet and run the browser matrix above before any status beyond behavior-checked.

## Decision

Automated behavior, type inference and builds pass. No rendered state has been inspected, so this delivery is behavior-checked at most and not visually reviewed. Keep #90 open until coordinator integration, clean-consumer installation and the browser, zoom and reduced-motion checks have evidence.
