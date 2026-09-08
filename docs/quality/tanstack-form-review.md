# Evidence: TanStack Form

- Issue: [#89](https://github.com/emanueledenaro/aretusa/issues/89)
- Base: `62cf4549335b25eed70ab555ee875c1c177dc0b8`
- Worker branch: `agent/tanstack-form-89`
- Library: `@tanstack/react-form` 1.33.5 (`latest` on npm at delivery; `@tanstack/form-core` 1.33.5)
- Status: implemented and behavior-checked in JSDOM. Not visually reviewed: the browser pane was reserved by the coordinator, so every rendered check below is pending.
- Reviewer: worker self-review against the code standards and the ticket; coordinator acceptance remains a separate gate.

## Requirements matrix

| Requirement                           | Implementation                                                                                       | Evidence / remaining gate                                                                                 |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Typed library integration             | `form.Field`/`useField` create the field; `TanStackFormField<TField>` keeps the concrete field type  | `types.tsx` compiles nested string and boolean paths and rejects an unknown path (`@ts-expect-error`)     |
| Text, select, checkbox, radio, switch | Actual Aretusa controls in the visit request example                                                 | Submit test verifies all submitted values; Select option interaction pending in browser (see limitations) |
| Synchronous validation                | `onChange` validators for name, studio, slot, terms and companion names                              | Error associations and invalid-submit focus tested                                                        |
| Async validation with timing          | `onChangeAsync` with 300ms debounce, abort of superseded runs, 0ms on submit; rejection caught       | Tests cover reserved name on submit, debounced check while typing with status text, rejected request      |
| Linked errors                         | Stable control, description and error IDs; `role="alert"`                                            | Public input test checks caller ID and combined help/error descriptions                                   |
| Invalid focus                         | `focusFirstInvalidField` from `onSubmitInvalid`, deferred one tick                                   | Focus tests target the input, Select trigger, first radio and Checkbox button                             |
| Pending/success/failure               | `isSubmitting` via `useStore`; disabled fieldset and controls; rethrown `onSubmit` caught with retry | Tests cover pending save, failed promise, preserved input and successful retry                            |
| Reset/defaults                        | `form.reset(defaultValues)` from the reset action                                                    | Test restores controlled values, removes success text and added rows                                      |
| Field arrays                          | `mode="array"`, `pushValue`, `removeValue`, `moveValue`, empty state, focus on add                   | Test verifies focus, preserved row values after move and remove, reset                                    |
| Aretusa styling                       | Shared UI stylesheet/tokens and the same field anatomy as `HookFormField`                            | Pending: rendered inspection                                                                              |
| Complete example and API              | Runnable independent example; Forms documentation with control mapping and timing                    | Example test/build pass; documentation router integration pending                                         |
| Sidebar, registry and CLI             | Coordinator-owned integration                                                                        | Pending: catalog entry, Forms route, dependency graph and generated registry                              |
| Clean consumer                        | Not performed by this worker                                                                         | Coordinator must install the finished registry item into a fresh app and compile                          |

## Library behavior verified on the installed source

Sources: `examples/tanstack-form/node_modules/@tanstack/form-core/dist/esm/FormApi.js` (`_handleSubmit`, `reset`), `FieldApi.js` (`validateAsync`), `utils.js` (`getAsyncValidatorArray`), `ValidationLogic.js` (`defaultValidationLogic`), the `.d.ts` files beside them, and the official guides linked from `docs/forms/tanstack-form.md` (validation, basic concepts, arrays, submission handling; fetched 2026-09-08). The generated reference pages fetched for `FormOptions` and `FieldApi` returned only an index or not found, so those members are cited from the installed declarations.

1. `handleSubmit` marks all fields touched, and on the first attempt returns through `onSubmitInvalid` without validating when `canSubmit` is false. `canSubmit` is false while any field is validating, so a first submit during a debounced async check would do nothing visible. The example sets `canSubmitWhenInvalid: true`; `handleSubmit` still runs `validateAllFields("submit")` and calls `onSubmitInvalid` when fields are invalid. Test "all control values reach the submit callback" failed before this option and passes with it.
2. `onSubmitInvalid` runs before React commits the new state. With the pending fieldset still disabled in the DOM, `focus()` is a no-op; the example defers the helper with `setTimeout(0)`. Focus tests failed before the deferral and pass with it.
3. For a submit event the async validators run with debounce 0 (`getAsyncValidatorArray`), and the change-cause async validator is included (`defaultValidationLogic`), so the reserved-name check runs on submit without waiting 300ms.
4. A rejected async validator is captured by the library as the field error value, which would render as an Error object. The example catches inside the validator and returns text; `formatTanStackError` falls back to `invalidMessage` for non-string results.
5. `handleSubmit` rethrows an `onSubmit` rejection after clearing `isSubmitting`; the example catches the returned promise.
6. `reset(values)` replaces `defaultValues`, resets field meta and the submission counter.

## Design decisions

- The adapter reads the field through structural types (`TanStackFieldLike`, `TanStackFormLike`) and imports only React. Reasons: the root workspace does not carry `@tanstack/react-form` until the coordinator adds it, so `npm run typecheck` at the root passes now; the render function still receives the library's concrete field type through the `TField` generic; the file has no runtime import that a consumer without the library would trip on. The registry item must still declare `@tanstack/react-form` because every consumer creates fields with it.
- Invalid-submit focus uses a wrapper attribute plus `formApi.state.fieldMeta` rather than refs, because TanStack Form has no field ref registry and `form.Field` does not expose one. It focuses the first enabled focusable descendant, which is the native input, the Select trigger, the first radio button or the Checkbox/Switch button. Radix bubble inputs are `aria-hidden` and come after the button, so they are skipped.
- Errors follow the library's timing: `onChange` validators show messages before blur. The example accepts this and keeps messages short. Consumers who want blur-first timing use `onBlur` validators; no adapter option hides library errors.
- Array rows are keyed by index as in the official arrays guide. Controlled inputs update in place after `moveValue`.

## Browser matrix

Pending. The coordinator's browser pane was in use, and the worker did not run any rendered check. Required before visually-reviewed:

| Viewport       | Theme | State                                            | Result  |
| -------------- | ----- | ------------------------------------------------ | ------- |
| 320px          | light | Invalid submit, linked messages, input focus     | pending |
| 390px          | dark  | Invalid fields and focus                         | pending |
| 768px          | light | Select keyboard selection, pending save, success | pending |
| 1024px         | light | Add companion focus and action wrapping          | pending |
| 1440px         | dark  | Reorder companions                               | pending |
| 240px parent   | both  | Constrained composition                          | pending |
| 200% text zoom | both  | Long content and actions                         | pending |
| Reduced motion | both  | Select and switch                                | pending |

Run `npm run dev --prefix examples/tanstack-form` and load the printed URL; the header button toggles `data-theme`.

## Interaction and limitations

JSDOM tests cover submission, rejected promises, retry, defaults, debounced async validation and array mutations. The JSDOM platform shim supplies ResizeObserver/pointer APIs without geometry; layout claims need the browser. Opening Aretusa Select through JSDOM user-event was not attempted, following the React Hook Form record; Select value submission and invalid focus are in automated tests, selection interaction is a browser gate.

The focus helper depends on the wrapper attribute; a field rendered without `TanStackFormField` is not focused. Array-level errors on the `companions` field itself have no wrapper and are not focused. Contrast has no measured audit. Actual touch hardware, assistive-technology output, RTL and dialog/sheet composition remain unverified.

The integration leaves networking, backend persistence, Standard Schema resolvers, file inputs, asynchronous default loading, nested arrays and drag-and-drop to the consumer. The demo saves locally with delays and does not create a real request.

## Checks

- `npm ci --no-audit --no-fund` at the root: pass.
- `npm install` in `examples/tanstack-form`: independent lockfile created; `@tanstack/react-form` and `@tanstack/form-core` resolve to 1.33.5.
- `npm test --prefix examples/tanstack-form`: 12 tests pass (10 in `example.test.tsx`, 2 in `field.test.tsx`).
- `npm run build --prefix examples/tanstack-form`: TypeScript and production build pass; 414.05kB JS / 127.81kB gzip for the whole example including React and the composed controls.
- `npm run typecheck` at the root: pass, with the adapter included through `packages/ui/src`.
- `npm test` at the root: 148 Vitest tests and 5 CLI tests pass.
- `npx prettier --check` on the new files: pass.
- Root manifest, lockfile, catalog, exports, documentation router, shared styles, coverage and generated registry are coordinator-owned. The worker did not add integration wiring there.

## Integration handoff

1. Add root dependency `@tanstack/react-form` at `^1.33.5`, matching the example lockfile, and export `TanStackFormField`, `TanStackFormFieldProps`, `TanStackFormFieldState`, `TanStackFormControlProps`, `TanStackFieldLike`, `TanStackFormLike`, `TANSTACK_FIELD_ATTRIBUTE`, `focusFirstInvalidField` and `formatTanStackError` from the UI barrel (`export * from "./tanstack-form";`). Include `npm ci --prefix examples/tanstack-form`, its tests and its build in CI.
2. Catalog entry in `packages/ui/src/catalog.ts`, module `integrations`:
   `{ "id": "tanstack-form", "name": "TanStack Form", "module": "integrations", "exportName": "TanStackFormField", "description": "Typed TanStack Form fields with Aretusa labels, help text, errors and focus on invalid submit.", "source": "tanstack-form" }`
3. Registry item `tanstack-form` typed `integration` with source `packages/ui/src/tanstack-form.tsx`, the shared stylesheets and runtime dependency `@tanstack/react-form`. The adapter has no imports from other Aretusa source files.
4. `apps/docs/src/App.tsx` interaction note for `tanstack-form`: "TanStackFormField renders the label, help text and error for one field created with form.Field or useField; your render function receives field, controlProps, invalid, errors and isValidating. Map value and handleChange on Input, Select (onValueChange, triggerOnBlur), Checkbox and Switch (checked, onCheckedChange) and RadioGroup (value, onValueChange); call focusFirstInvalidField from onSubmitInvalid, deferred one tick. Validation timing, submission, reset and arrays stay in useForm and form.Field. The full visit request example lives in examples/tanstack-form."
5. `apps/docs/src/Demo.tsx`: `import { TanStackFormExample } from "../../../examples/tanstack-form/example";` and `case "tanstack-form": content = <TanStackFormExample />;`. Add a Forms sidebar entry and route `#/forms/tanstack-form` using `docs/forms/tanstack-form.md`. Include the example classes in the documentation build's Tailwind scanning.
6. `apps/docs/src/usage.ts` snippet: `<form noValidate onSubmit={(event) => { event.preventDefault(); void form.handleSubmit(); }}><form.Field name="name" validators={{ onChange: ({ value }) => (value ? undefined : "Enter your name.") }}>{(field) => <TanStackFormField field={field} label="Name" description="Shown to your team.">{({ controlProps }) => <Input {...controlProps} name={field.name} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} onBlur={field.handleBlur} />}</TanStackFormField>}</form.Field><button type="submit">Save</button></form>`
   Extra imports: `import { useForm } from "@tanstack/react-form";` and `import { Input } from "./components/aretusa/forms";`. Setup line: `const form = useForm({ defaultValues: { name: "" }, onSubmitInvalid: ({ formApi }) => setTimeout(() => focusFirstInvalidField(formApi), 0) });` with `focusFirstInvalidField` imported beside `TanStackFormField`.
7. Add the item to quality coverage and the tracker index, regenerate the registry, install it with the CLI in a clean consumer that also installs `@tanstack/react-form`, compile public snippets, then run the browser matrix above.
8. Update `docs/forms-utilities-scope.md` row for #89 from planned to implemented with review evidence in progress.

## Decision

Keep #89 open. Source, example, tests and documentation exist and pass their checks; catalog wiring, clean-consumer installation and all rendered checks are pending. This delivery is a review request, not a release claim.
