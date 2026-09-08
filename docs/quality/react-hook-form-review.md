# Evidence: React Hook Form

- Issue: [#88](https://github.com/emanueledenaro/aretusa/issues/88)
- Base: `6b27b5a46b71ef6ca443d6f518713280b9656774`
- Core prerequisite: coordinator commit `a95eeea`, cherry-picked as `290ac18`
- Worker branch: `agent/react-hook-form-88`
- Reviewed implementation: `4f1c33f653650225f2ed73543c4821731d033af7`
- Status: visually-reviewed after coordinator integration on main; see the coordinator section at the end.
- Reviewer: author browser checks below; independent standards and spec reviewers verified `290ac18...4f1c33f` with no blocking findings. Coordinator acceptance remains a separate gate.

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

| Viewport       | Theme | State                                               | Observed result                                                                                                                  |
| -------------- | ----- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 320px          | light | Invalid submit, linked messages, input focus        | Focus `name`, scroll width 305px, visible messages wrap                                                                          |
| 390px          | dark  | Invalid fields and focus                            | Shared dark theme visibly applied; labels and errors remain readable                                                             |
| 768px          | light | Select Space/ArrowDown/Enter, pending save, success | Chosen `Interface design`; disabled controls and status; then `Reservation saved.`; scroll width 753px                           |
| 1024px         | light | Append guest                                        | Focus `guests.1.name`; scroll width 1009px; actions fit                                                                          |
| 1440px         | dark  | Reorder guests                                      | Sam and Lin retain values in moved positions; scroll width 1425px                                                                |
| 240px parent   | both  | Constrained composition                             | CUA measured form width 240px at viewport 287px, document width 272px. Labels wrap and actions stack.                            |
| 200% text zoom | both  | Long content and actions                            | Root-font scaling from 16px to 32px checked at 390px without overflow. Native browser text-zoom remains pending.                 |
| Reduced motion | both  | Select and switch                                   | CUA media emulation confirms switch transition and Select popup animation/transition are 0s. Selection and dismissal still work. |

Before CUA verification, the worker also ran agent-browser against the same local example at 320px and 390px. Those preliminary checks are not the CUA matrix above. An initial screenshot named `dark` still used the light theme because the example toggled a CSS class instead of Aretusa's `data-theme` attribute. The example now sets `data-theme`; CUA verified the correction. The preliminary incorrectly named screenshot is not dark-theme evidence.

## Interaction and limitations

Pointer selection and keyboard Space/ArrowDown/Enter work with Aretusa Select in the in-app browser. Invalid input, select, radio and checkbox focus use the library's real refs. JSDOM tests cover submission, rejected promises, retry, defaults and array mutations. The JSDOM platform shim supplies ResizeObserver/pointer APIs without geometry; layout claims come from the browser.

Opening Select through JSDOM user-event timed out during development. Select value submission and invalid focus remain in automated tests; selection interaction is verified in CUA. This is an explicit automated-test limitation, not a claim that a skipped interaction passed.

Radio labels, boolean-field labels and action buttons have 44px minimum-height hit regions in the example. Small radio/checkbox graphics retain core Aretusa dimensions. Contrast has visual inspection only, not a measured WCAG audit. Actual touch hardware, assistive-technology output and dialog/sheet composition remain unverified.

The integration intentionally leaves networking, backend persistence, schema resolvers, file inputs, asynchronous default loading, nested arrays and drag-and-drop to the consumer. The demo saves locally with delays and does not create a real reservation. RTL is not claimed from the LTR checks.

## Checks

- `npm ci --prefix examples/react-hook-form`: independent lockfile installs successfully; React Hook Form resolves to 7.87.0. Example Vite deduplicates shared React/control dependencies, and its TypeScript paths use the same installed types.
- `npm test --prefix examples/react-hook-form`: 10 focused public behavior tests pass.
- `npm run build --prefix examples/react-hook-form`: TypeScript and production build pass.
- `npm test`: 117 Vitest tests and 5 CLI tests pass at the worker base plus core prerequisite.
- `npm run typecheck`: pass.
- Full example output with the independent lockfile: 381.79kB JS / 122.88kB gzip. This includes React, RHF and the composed controls, not the adapter alone.
- Root manifest, lockfile, catalog, exports, documentation router, shared styles, coverage and generated registry are coordinator-owned. The worker did not add integration wiring there.

## Integration handoff

1. Add root dependency `react-hook-form` at `^7.87.0`, matching the example lockfile, and export `HookFormField`, `HookFormFieldProps`, `HookFormControlProps` from the UI barrel. Include `npm ci --prefix examples/react-hook-form`, its tests and its build in CI.
2. Add catalog/registry item `react-hook-form` with source entry `packages/ui/src/react-hook-form.tsx`, export `HookFormField`, and runtime dependency `react-hook-form`. The adapter has no imports from other Aretusa source files.
3. Add a Forms sidebar entry and route using this document and `ReactHookFormExample` from `examples/react-hook-form/example.tsx`. Keep demo code out of the distributable adapter. Include its classes in the documentation build's Tailwind scanning.
4. Preserve `Select.triggerRef`, `Select.triggerOnBlur`, `RadioGroup.focusRef` and `NativeSelect` ref support from the core prerequisite. The complete example also imports Input, Checkbox, Switch and Button.
5. Add the item to quality coverage, regenerate the registry, install it with the CLI in a clean consumer, compile public snippets and repeat the remaining browser/quality gates.
6. Replace the temporary manual-install wording with the verified CLI command after successful registry integration.

## Decision

Standards review found no blocking violations. It noted a P3 duplicated layout-class string for boolean rows; this remains local example code and does not affect behavior. Spec review found no blocking functional defect or scope expansion. Both reviewers independently reproduced all 10 example tests and its TypeScript/build checks against `4f1c33f`.

Keep #88 open until coordinator integration, clean-consumer installation and remaining responsive/accessibility checks have evidence. This worker delivery does not establish release readiness or deployment. Browser viewport, font-size and motion overrides were restored after inspection.

## Coordinator review and integration

Only the two worker commits were integrated (`4f1c33f` as `8544d06`, `5aefa03` as `faa769d`); the branch's `290ac18` duplicated the main commit `a95eeea` and was not merged. The worker's typecheck, the 10 example tests and the example build were reproduced in its worktree before integration.

Wiring on main: root dependency `react-hook-form ^7.87.0` (the example lockfile already resolved 7.87.0), barrel export, catalog entry `react-hook-form` in the new `integrations` module with a Forms group in the sidebar and the `#/forms/` route, registry item typed `integration` with `react-hook-form.tsx`, the shared stylesheets and the `react-hook-form` runtime dependency, the reservation example rendered on the documentation page, a typed usage example importing `useForm` and `Input` beside `HookFormField`, interaction notes, quality coverage, ticket record, tracker index, changelog and CI steps that install, test and build the standalone example. The clean-consumer check now installs `react-hook-form` and compiles a `HookFormField` form. The documentation's temporary manual-install wording was replaced by the CLI command. The usage checker replaced only the first import path; it now replaces all of them.

Checks at integration: 148 Vitest tests, 5 CLI tests, typecheck, build, 67 usage examples typecheck, 78 registry items with gate records, clean consumer built with dialog, field, shimmer, scroll-fade and react-hook-form.

Rendered checks of the documentation route in the authorized browser pane: at 390 px light the Forms group, breadcrumb and page title are present, the form fills the preview without page overflow; an empty submit shows four linked errors and focuses the name input with `aria-invalid="true"` and `aria-describedby` pointing at its error; at 1440 px dark the page has no overflow and the invalid states use the danger token. The worker's own matrix above covers 320 to 1440, the 240 px parent, the zoom proxy and reduced motion on the standalone example.

Open: native browser text zoom, forced colors, real touch, assistive technology, and a second review of the documentation route at 320, 768 and 1024. Gates: design, responsive, interaction, code and distribution passed for the checked states. Not release-ready.
