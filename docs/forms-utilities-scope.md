# Components, forms and utilities

The product scope includes complete behavior, public APIs, composition, installation and documentation. A matching catalog name is not evidence that a capability is complete.

## Existing components

The 64 component tickets tracked in `quality/coverage.json` remain authoritative. For each component, inventory subcomponents, props, controlled/uncontrolled state, variants, keyboard commands, focus behavior, pointer/touch interaction, disabled/loading/error states, responsive behavior, RTL and accessibility semantics. Compare this inventory against actual implementation and tests. Record missing features in its existing ticket before marking it ready.

Known examples that need deeper work include searchable Combobox behavior, segmented OTP input, date-picker calendar composition, resizable panels, advanced table interactions and notification management. Current simplified examples do not establish complete functional coverage.

## Planned extensions

| Capability | Ticket | Current evidence |
| --- | --- | --- |
| React Hook Form integration | [#88](https://github.com/emanueledenaro/aretusa/issues/88) | Planned; dedicated integration and documentation absent |
| TanStack Form integration | [#89](https://github.com/emanueledenaro/aretusa/issues/89) | Planned; dedicated integration and documentation absent |
| Formisch integration | [#90](https://github.com/emanueledenaro/aretusa/issues/90) | Planned; dedicated integration and documentation absent |
| Standalone scroll fade | [#91](https://github.com/emanueledenaro/aretusa/issues/91) | Partial: vertical ScrollArea flag exists; arbitrary-container utility absent |
| Text shimmer | [#92](https://github.com/emanueledenaro/aretusa/issues/92) | Planned; implementation absent |

These five items are planned scope, not installed registry entries. Add each to catalog metadata and release-quality tracking when implemented; existing coverage counts must not be used to claim this extension complete.

## Delivery contract

Work one ticket at a time. Produce original Aretusa source, realistic interactive examples, separate Forms/Utilities navigation, installation instructions, API details, failure/empty states and an explicit feature matrix. Compile a fresh consumer and verify browser interaction across the existing responsive matrix. Preserve licenses of underlying dependencies. Commit and push each verified unit; close only after all applicable acceptance evidence exists.

Research references remain outside the public repository. Public documentation describes Aretusa and its supported behavior without claiming unverified equivalence.
