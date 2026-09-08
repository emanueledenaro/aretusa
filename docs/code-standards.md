# Code standards

## Public API

Use explicit TypeScript contracts and meaningful prop names. Support controlled/uncontrolled behavior when the component's role requires it; document which mode is supported. Preserve native semantics and caller IDs, descriptions, refs and event behavior. Avoid swallowing caller props or adding accidental form submissions.

Keep reusable components separate from demos and business content. A public component must accept the data and callbacks required to reuse it. Demo-specific copy or state belongs in the example.

## Styling

Tailwind consumes shared semantic tokens. Responsive layout starts narrow. Typography, radii, spacing and state colors are configurable without editing every component. Include a foreground pair for each colored surface. Component styles required by the consumer must ship with the component rather than live only in the docs app.

## Interaction

Prefer established headless primitives for complex keyboard and focus behavior. They do not replace integration tests. Preserve licenses. Visual components and documentation remain independently authored for Aretusa.

Interactive controls require accessible names. Async actions have explicit pending/error behavior. Overlay dismissal, focus restoration and document scroll are part of the public contract. Resize or drag features need keyboard or non-drag alternatives.

## Tests and performance

Test behavior through public APIs and browser interaction, not class-name snapshots alone. Add a regression test before fixing a reproducible defect. Exercise long input, missing data, repeated actions and constrained containers.

Keep updates localized. Avoid unstable IDs, unnecessary global listeners, network effects hidden inside presentation components and uncontrolled rerender loops. Clean up observers and listeners. Check consumer bundle impact when adding a dependency.

## Distribution

The installed source, documented API and live preview must agree. Declare dependency and file graphs explicitly. Typecheck public usage snippets. Install in a fresh consumer and compile. Never overwrite modified files silently; validate paths and explain conflicts.

## Completion

Use docs/quality-contract.md and the component issue. A reviewer records evidence against a commit. The author cannot substitute implementation intent for observed results. Version changes according to consumer impact and keep release claims within verified support.

