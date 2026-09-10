# Handoff

State of the work on 10 September 2026, written for whoever picks the project up next.

## Where main is

`df9f595`. CI succeeded on it and on the three commits before it, including the Pages deploy. The untracked `error.log` in the main checkout belongs to the maintainer and must stay untouched.

Quality tracker: 80 items, none release-ready.

| Status | Items |
| --- | --- |
| visually-reviewed | 36 |
| behavior-checked | 2 |
| implemented | 42 |

92 GitHub issues are open and none is closed. A component ticket closes only when every applicable gate in docs/quality-contract.md has evidence.

## Integrated so far

Calendar #28, Scroll Fade #91, React Hook Form #88, TanStack Form #89 and Formisch #90 from the first two worker batches. Alert Dialog #45, Dialog #46, Sheet #50, Drawer #47, Select #39, Input #33, Checkbox #29, Radio Group #38 and Switch #41 reviewed directly. Site-wide fixes on #10: the Aretusa scrollbar everywhere, spacing in search results, no page overflow at 200 percent text zoom.

From the third batch: `agent/batch3-conversation` (#70 to #75) and both foundations branches (#12, #14, #16, #17, #18, #19, #20, #21, #22, #23, #24, #25, #26, #27). Each landed as a merge commit plus a wiring commit that regenerates the registry and moves the coverage rows to visually-reviewed.

## Branches waiting for review

All three are pushed and carry finished commits, but the worker that produced each one was cut off by a rate limit mid-ticket. Their worktrees under `../aretusa-worktrees/` still hold uncommitted work in progress: keep it or discard it, but do not assume it is complete.

| Branch | Delivered | Left to do | Uncommitted in the worktree |
| --- | --- | --- | --- |
| agent/batch3-forms | #42 Textarea, #36 Label, #32 Field, #34 Input Group, #37 Native Select, #43 Toggle, #44 Toggle Group, #40 Slider, #35 Input OTP | #30 Combobox, #31 Date Picker | `forms.tsx`, `tests/combobox.test.tsx`, `tests/zz-debug.test.tsx` (scratch) |
| agent/batch3-navigation | #64 Tabs, #53 Accordion, #55 Collapsible, #54 Breadcrumb, #61 Pagination, #58 Dropdown Menu, #57 Context Menu, #59 Menubar, #60 Navigation Menu | #56 Command, #63 Sidebar, #62 Scroll Area record | `navigation.tsx`, `tests/command.test.tsx` |
| agent/batch3-overlays-data | #49 Popover, #52 Tooltip, #48 Hover Card, #51 Toast, #69 Table, #67 Data Table, #65 Carousel, #66 Chart | #68 Resizable | `data.tsx`, `tests/resizable.test.tsx` |

Blocks #76 to #86 were deliberately left for a later batch, because they compose the components these branches are still changing.

## Requested and not started: the base theme

The maintainer supplied a new base palette on 9 September and it is not applied anywhere yet. It replaces the terracotta accent with a near-black ink accent, moves the neutrals to a cooler green-grey, enlarges the radii and adds a card shadow.

```css
:root {
  --color-paper: #f2f3ee;
  --color-card: #fafbf7;
  --color-surface: #e5e8dc;
  --color-line: #d2d8c7;
  --color-ink: #242720;
  --color-muted: #62685d;
  --color-terracotta: #30342c;
  --color-chart-3: #9eae98;
  --font-sans: Arial, Helvetica, sans-serif;
  --font-editorial: "Lora Variable", Georgia, serif;
  --radius-lg: 24px;
  --radius-xl: 30px;
  --radius-2xl: 36px;
  --color-menu: #fafbf7;
  --space-card: 26px;
  --shadow-card: 0 6px 24px #161e1609;
  --color-card-border: #d2d8c7;
  --card-border-width: 1px;
  --card-top-width: 1px;
}
[data-theme="dark"] {
  --color-paper: #191b18;
  --color-card: #222520;
  --color-surface: #2d312a;
  --color-line: #454b40;
  --color-ink: #eeeee6;
  --color-muted: #aeb4a6;
  --color-terracotta: #e6e4dc;
  --color-chart-3: #9eae98;
  --color-menu: #222520;
  --color-card-border: #454b40;
}
```

Things to settle before applying it:

- The tokens live in the `@theme` block at the top of `packages/ui/src/styles.css` and the `[data-theme="dark"]` block near the end. `--color-control`, `--color-gold`, `--color-danger`, `--color-on-danger`, `--color-success`, `--color-chart-4` and `--color-chart-5` are used by components and are missing from the new palette, so decide their values rather than dropping them.
- `--color-terracotta` is the accent used by focus rings, the calendar today marker and range, the switch on-state and radio dots. Under the new palette it becomes near-black in light mode and near-white in dark, so contrast against ink text and selected fills has to be rechecked on every component already marked visually-reviewed.
- `packages/ui/src/theme.ts` generates the same tokens for the CLI and the Themes page, with presets named sorgente, carta, pietra and so on. It must produce the new defaults or the installed source and the documentation site will disagree, which `scripts/verify-consumer.mjs` and the registry parity checks will catch.
- The font drops DM Sans for Arial. `styles.css` imports `@fontsource-variable/dm-sans` and the registry declares it as a dependency of every item, so removing it touches the dependency graph and the clean-consumer check.
- Larger radii and a card shadow change every rendered review already recorded. Plan a pass over docs/quality to re-check the visual gate, or state in each record that the palette changed after the review.

## How integration works here

One branch at a time. Reproduce the worker's checks in its own worktree first (`npm run typecheck`, `npx vitest run`, `node scripts/check-usage.mjs`), then merge with `--no-ff` into main, then a second commit that does the coordinator-owned wiring: `scripts/build-registry.mjs` relevant-props list, catalog descriptions, `npm run registry:build`, `docs/quality/coverage.json`, `docs/quality/index.md`, the record files and `CHANGELOG.md`. Run `npm run check`, `npm run quality:check`, `node scripts/check-usage.mjs` and `node scripts/verify-consumer.mjs`, push, watch CI, then comment the ticket with the evidence.

Traps found the hard way:

- Worker branches can carry a rebased duplicate of a commit already on main. Cherry-pick only the worker's own commits.
- `apps/docs/src/Demo.tsx` conflicts between batches on the import block and the switch cases. Keeping both sides is the right resolution.
- Never spread a `NodeList` or `HTMLCollection` in library source. The clean consumer compiles without `DOM.Iterable` and it fails there, not locally.
- An adapter that is typed structurally must declare its library in the catalog entry's `dependencies`; the registry builder merges those with the imports it detects.
- Locally installed example `node_modules` bring a second React. `vitest.config.ts` and `apps/docs/vite.config.ts` dedupe React and the form libraries for that reason.
- `git add -A` inside the checkout picks up `.claude/worktrees/*` as gitlinks. `.claude/` is in `.gitignore`; keep it there.

## What no component has yet

Every record lists the same open gates: forced-colors and reduced-motion emulation, native browser text zoom, real touch hardware, assistive-technology output, and an independent second review. The browser pane used for the reviews does not deliver Enter, Space or PageDown to controls, so keyboard activation rests on the jsdom tests and is recorded as such. Until those gates have evidence, nothing is release-ready and no ticket closes.
