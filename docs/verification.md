# Verification record

## Automated boundaries

- Component interactions: loading actions, label association, Field errors, Select errors, attachment removal and modal Escape/focus restoration.
- Catalog smoke: every documented preview renders.
- Usage examples: all 64 public TypeScript examples compile.
- CLI process: init, add, dry-run, local-change conflict and unresolved dependency rejection.
- Consumer: installation into a fresh temporary React/Vite/Tailwind project followed by TypeScript and production build.

The consumer was independently installed with npm, without reusing the repository node_modules. First successful fixture: a fresh project created on 8 September 2026.

## Browser checks

Local desktop homepage, Dialog opening and Escape with focus returned to its trigger, Source tab and file selector verified. Mobile homepage at 390 × 844 shows the full header, actions and responsive cards without horizontal page overflow; mobile navigation opens with real links.

Additional browser checks and final CI results are recorded in the release issue. Automated smoke tests do not certify all assistive-technology combinations.

## Known scope of v0.1

The catalog contains 64 named capabilities and eight blocks. Some capabilities deliberately use native browser behavior (DatePicker, Combobox and OTP) or a focused recipe (DataTable, Chart, Resizable). Chart currently provides a line chart with a data-table alternative. Resizable uses a labeled range control. Toast is a controlled styled notification; consumers coordinate queues.

Registry items install source at module-family granularity. For example, Input includes the forms module and its dependencies. Installation is selective by declared file/dependency graph, not per individual exported function.

Vite/React 19/TypeScript/Tailwind v4 is the verified consumer stack. Other frameworks, multi-base implementations, drag drawers, a custom calendar popover and all advanced chart families are not advertised as supported.
