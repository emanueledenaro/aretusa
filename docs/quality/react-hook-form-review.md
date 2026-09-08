# Evidence: React Hook Form

- Issue: [#88](https://github.com/emanueledenaro/aretusa/issues/88)
- Base: `6b27b5a46b71ef6ca443d6f518713280b9656774`
- Core prerequisite: coordinator commit `a95eeea`, cherry-picked as `290ac18`
- Worker branch: `agent/react-hook-form-88`
- Status: behavior-checked; integration and remaining quality gates are pending.
- Reviewer: author checks below; independent standards/spec review and coordinator acceptance remain separate gates.

## Requirements matrix

| Requirement                           | Implementation                                                            | Evidence / remaining gate                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Typed library integration             | `HookFormField` calls `useController` and preserves typed paths/values    | `types.tsx` compiles nested string and boolean paths and rejects an unknown path                        |
| Text, select, checkbox, radio, switch | Actual Aretusa controls in the reservation example                        | Submit test verifies submitted values; CUA selects a Radix Select option with pointer and keyboard      |
| Synchronous validation                | Required name, workshop, terms and guest name                             | Error associations and invalid-submit focus tested                                                      |
| Async validation                      | Reserved-name check and request-rejection message                         | Tests cover rejected validation and correction; CUA observes checking status                            |
| Linked errors                         | Stable control, description and error IDs                                 | Public input test checks caller ID and combined help/error descriptions                                 |
| Invalid focus                         | Native input ref; Select triggerRef; RadioGroup focusRef; Checkbox ref    | Focus tests target actual controls, not containers                                                      |
| Pending/success/failure               | Disabled fieldset/custom controls, status announcement, root server error | Tests cover pending save, failed promise, preserved input and successful retry; CUA observes each state |
| Reset/defaults                        | `useForm` defaults and explicit reset handler                             | Test restores controlled values and removes success/errors                                              |
| Field arrays                          | Add, remove, move up, stable field IDs and empty state                    | Tests verify focus, preserved row values and reset; CUA verifies add focus and reorder                  |
| Aretusa styling                       | Shared UI stylesheet/tokens and original field anatomy                    | CUA screenshots inspected at the widths below                                                           |
| Complete example and API              | Runnable independent example; Forms documentation                         | Example test/build pass; documentation router integration pending                                       |
| Sidebar, registry and CLI             | Coordinator-owned integration                                             | Pending: catalog entry, Forms route, dependency graph and generated registry                            |
| Clean consumer                        | Not performed by this worker                                              | Coordinator must install the finished registry item into a fresh app and compile                        |

## Browser matrix

CUA in-app browser loaded the independent Vite example at `http://127.0.0.1:4188/`. Measurements use read-only DOM geometry and screenshots were emitted and inspected in the worker conversation. Viewport widths below include the browser scrollbar; document width was 15px smaller with no page-level horizontal overflow.

| Viewport       | Theme | State                                               | Observed result                                                                                        |
| -------------- | ----- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 320px          | light | Invalid submit, linked messages, input focus        | Focus `name`, scroll width 305px, visible messages wrap                                                |
| 390px          | dark  | Invalid fields and focus                            | Shared dark theme visibly applied; labels and errors remain readable                                   |
| 768px          | light | Select Space/ArrowDown/Enter, pending save, success | Chosen `Interface design`; disabled controls and status; then `Reservation saved.`; scroll width 753px |
| 1024px         | light | Append guest                                        | Focus `guests.1.name`; scroll width 1009px; actions fit                                                |
| 1440px         | dark  | Reorder guests                                      | Sam and Lin retain values in moved positions; scroll width 1425px                                      |
| 240px parent   | both  | Constrained composition                             | Pending                                                                                                |
| 200% text zoom | both  | Long content and actions                            | Pending                                                                                                |
| Reduced motion | both  | Select, switch and pending transitions              | Pending                                                                                                |

Before CUA verification, the worker also ran agent-browser against the same local example at 320px and 390px. Those preliminary checks are not the CUA matrix above. An initial screenshot named `dark` still used the light theme because the example toggled a CSS class instead of Aretusa's `data-theme` attribute. The example now sets `data-theme`; CUA verified the correction. The preliminary incorrectly named screenshot is not dark-theme evidence.

## Interaction and limitations

Pointer selection and keyboard Space/ArrowDown/Enter work with Aretusa Select in the in-app browser. Invalid input, select, radio and checkbox focus use the library's real refs. JSDOM tests cover submission, rejected promises, retry, defaults and array mutations. The JSDOM platform shim supplies ResizeObserver/pointer APIs without geometry; layout claims come from the browser.

Opening Select through JSDOM user-event timed out during development. Select value submission and invalid focus remain in automated tests; selection interaction is verified in CUA. This is an explicit automated-test limitation, not a claim that a skipped interaction passed.

Radio labels, boolean-field labels and action buttons have 44px minimum-height hit regions in the example. Small radio/checkbox graphics retain core Aretusa dimensions. Contrast has visual inspection only, not a measured WCAG audit. Actual touch hardware, assistive-technology output and dialog/sheet composition remain unverified.

The integration intentionally leaves networking, backend persistence, schema resolvers, file inputs, asynchronous default loading, nested arrays and drag-and-drop to the consumer. The demo saves locally with delays and does not create a real reservation. RTL is not claimed from the LTR checks.

## Checks

- `npm test --prefix examples/react-hook-form`: focused public behavior tests pass.
- `npm run build --prefix examples/react-hook-form`: TypeScript and production build pass.
- `npm test`: 117 Vitest tests and 5 CLI tests pass at the worker base plus core prerequisite.
- `npm run typecheck`: pass.
- Full example output before final formatting: about 372kB JS / 120kB gzip. This includes React, RHF and the composed controls, not the adapter alone.
- Root manifest, lockfile, catalog, exports, documentation router, shared styles, coverage and generated registry are coordinator-owned. The worker did not add integration wiring there.

## Integration handoff

1. Add root dependency `react-hook-form` compatible with the example lockfile and export `HookFormField`, `HookFormFieldProps`, `HookFormControlProps` from the UI barrel.
2. Add catalog/registry item `react-hook-form` with source entry `packages/ui/src/react-hook-form.tsx`, export `HookFormField`, and runtime dependency `react-hook-form`. The adapter has no imports from other Aretusa source files.
3. Add a Forms sidebar entry and route using this document and `ReactHookFormExample` from `examples/react-hook-form/example.tsx`. Keep demo code out of the distributable adapter. Include its classes in the documentation build's Tailwind scanning.
4. Preserve `Select.triggerRef`, `Select.triggerOnBlur`, `RadioGroup.focusRef` and `NativeSelect` ref support from the core prerequisite. The complete example also imports Input, Checkbox, Switch and Button.
5. Add the item to quality coverage, regenerate the registry, install it with the CLI in a clean consumer, compile public snippets and repeat the remaining browser/quality gates.
6. Replace the temporary manual-install wording with the verified CLI command after successful registry integration.

## Decision

Keep #88 open until coordinator integration, clean-consumer installation, remaining responsive/accessibility checks and independent review have evidence. This worker delivery does not establish release readiness or deployment.
