# Calendar review

- Issue: [#28](https://github.com/emanueledenaro/aretusa/issues/28)
- Base: `6b27b5a`
- Branch: `agent/calendar-28`
- Author: Calendar Astra worker
- Reviewed source commit: `f473ded1d4d67eb442f7d428762694d2ac646b6f`
- Independent reviewers: `/root/calendar_28/standards_review` and `/root/calendar_28/spec_review`
- Status: visually-reviewed after coordinator integration on main; see the coordinator section at the end.

## Public contract

`Calendar` accepts the complete discriminated `React.ComponentProps<typeof DayPicker>` union. The installed dependency is `react-day-picker@9.14.0`; the manifest permits `^9.7.0`. No dependency was added. Calendar defaults to visible outside days and `navLayout="after"`. Callers can override both. The root combines `a-calendar` with caller `className` and preserves `id`, supported ARIA properties, styles, locale, custom components, modifiers and event callbacks.

Selection uses DayPicker's own state model. With `onSelect`, the caller owns `selected`. Without `onSelect`, selection changes internally; `selected` supplies the initial value. `required` single selection requires a `selected` property in TypeScript, which can initially be `undefined`. Month navigation independently supports `month`/`onMonthChange` and `defaultMonth`. There is no added `defaultSelected` or generic root `ref` prop. A caller needing a root reference uses the upstream `components.Root` contract and preserves its `rootRef`.

| Feature                                                                                   | Evidence                                                                                                                 |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Single selection, deselection, required                                                   | Public interaction tests                                                                                                 |
| Controlled selection and callback details                                                 | Public interaction tests                                                                                                 |
| Multiple selection with minimum and maximum                                               | Public interaction tests. At `max`, choosing another date restarts the selection at that date, matching DayPicker 9.14.0 |
| Range across two months                                                                   | Public interaction tests for selected dates and start/middle/end states                                                  |
| Disabled and hidden dates, excluded dates inside ranges                                   | Public interaction tests                                                                                                 |
| Keyboard arrows, disabled-date skipping, month boundary, Home/End, PageUp/PageDown, Enter | Public interaction tests                                                                                                 |
| Month bounds, controlled month, no accidental form submit                                 | Public interaction tests                                                                                                 |
| Month/year dropdowns, default and explicit navigation layouts                             | Public interaction tests                                                                                                 |
| Locale, Monday week start, today announcement, RTL                                        | Public interaction tests                                                                                                 |
| Fixed six weeks and week numbers                                                          | Public rendering test                                                                                                    |
| Custom labels, components, modifiers, styles and day events                               | Public interaction test                                                                                                  |
| Display-only and fully disabled calendars                                                 | Public rendering test                                                                                                    |
| Time zones, broadcast calendar, alternate calendar entrypoints and animation              | Upstream API retained, no new compatibility claim or focused verification                                                |

Weekday headers are visually present but `aria-hidden` in DayPicker. Each interactive date has a full localized date name, including today/selection state. Hidden outside cells can retain `aria-selected` even though they contain no date button; selected interactive dates are the meaningful count across multiple months.

The three regression tests failed before their corresponding fixes: `showOutsideDays={false}` was ignored, caller `className` was lost, and dropdown captions followed navigation controls in the default tab order. Each fix passed its regression before the next slice. The remaining tests characterize the retained upstream behavior.

## Coordinator integration: styles

Replace the existing contiguous `.a-calendar` rules in `packages/ui/src/styles.css` with the following rules. This proposal uses existing tokens and the default DayPicker class names. Callers replacing `classNames` must retain the relevant `rdp-*` class or provide equivalent layout styles. No global token change is needed.

```css
.a-calendar {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-ink);
  width: 100%;
  max-width: 100%;
  --rdp-accent-color: var(--color-terracotta);
}
.a-calendar .rdp-months {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: start;
}
.a-calendar .rdp-month {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  width: min(100%, 330px);
  min-width: 0;
  gap: 8px 4px;
}
.a-calendar .rdp-month_caption {
  min-width: 0;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.a-calendar .rdp-caption_label {
  line-height: 1.5;
}
.a-calendar .rdp-nav {
  display: flex;
  gap: 4px;
  margin: 0;
}
.a-calendar .rdp-month_grid {
  grid-column: 1 / -1;
  border-collapse: separate;
  border-spacing: 0 2px;
  width: 100%;
  table-layout: fixed;
}
.a-calendar th {
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 400;
  height: 32px;
  text-align: center;
  overflow-wrap: anywhere;
}
.a-calendar td {
  padding: 0;
  text-align: center;
  height: 44px;
}
.a-calendar button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 24px;
  min-height: 44px;
  border: 1px solid transparent;
  border-radius: 7px;
  color: inherit;
  background: transparent;
  font: inherit;
  touch-action: manipulation;
}
.a-calendar button:hover:not(:disabled):not([aria-disabled="true"]) {
  background: var(--color-surface);
}
.a-calendar button:focus-visible {
  outline-offset: -3px;
  position: relative;
  z-index: 1;
}
.a-calendar [data-today="true"] button {
  border-color: var(--color-terracotta);
  font-weight: 600;
}
.a-calendar [data-outside="true"] {
  color: var(--color-muted);
}
.a-calendar [aria-selected="true"] button {
  background: var(--color-ink);
  color: var(--color-paper);
}
.a-calendar [aria-selected="true"] button:hover {
  background: var(--color-ink);
}
.a-calendar .rdp-range_middle {
  background: var(--color-surface);
}
.a-calendar .rdp-range_middle button {
  background: transparent;
  color: var(--color-ink);
  border-radius: 0;
}
.a-calendar .rdp-range_middle button:hover {
  background: var(--color-surface);
}
.a-calendar .rdp-range_start:not(.rdp-range_end) {
  background: linear-gradient(
    to right,
    transparent 50%,
    var(--color-surface) 50%
  );
}
.a-calendar .rdp-range_end:not(.rdp-range_start) {
  background: linear-gradient(
    to left,
    transparent 50%,
    var(--color-surface) 50%
  );
}
.a-calendar[dir="rtl"] .rdp-range_start:not(.rdp-range_end) {
  background: linear-gradient(
    to left,
    transparent 50%,
    var(--color-surface) 50%
  );
}
.a-calendar[dir="rtl"] .rdp-range_end:not(.rdp-range_start) {
  background: linear-gradient(
    to right,
    transparent 50%,
    var(--color-surface) 50%
  );
}
.a-calendar button:disabled,
.a-calendar button[aria-disabled="true"] {
  opacity: 0.4;
  cursor: default;
}
.a-calendar .rdp-button_previous,
.a-calendar .rdp-button_next {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}
.a-calendar svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}
.a-calendar .rdp-dropdowns {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}
.a-calendar .rdp-dropdown_root {
  display: inline-flex;
  max-width: 100%;
  min-width: 0;
}
.a-calendar .rdp-dropdown_root > .rdp-caption_label {
  display: none;
}
.a-calendar .rdp-dropdown {
  min-height: 44px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border: 1px solid var(--color-line);
  border-radius: 7px;
  padding: 4px;
  color: var(--color-ink);
  background: var(--color-card);
  font: inherit;
}
.a-calendar .rdp-month:has(> .rdp-button_previous),
.a-calendar .rdp-month:has(> .rdp-button_next) {
  grid-template-columns: 44px minmax(0, 1fr) 44px;
}
.a-calendar .rdp-month:has(> .rdp-button_previous) > .rdp-month_caption,
.a-calendar .rdp-month:has(> .rdp-button_next) > .rdp-month_caption {
  grid-column: 2;
}
.a-calendar .rdp-month > .rdp-button_previous {
  grid-column: 1;
  grid-row: 1;
}
.a-calendar .rdp-month > .rdp-button_next {
  grid-column: 3;
  grid-row: 1;
}
.a-calendar .rdp-footer {
  margin-top: 12px;
  color: var(--color-muted);
  line-height: 1.5;
  overflow-wrap: anywhere;
}
```

Day targets have a minimum height of 44px. A 240px parent cannot fit seven 44px-wide targets; the deliberate dense-grid exception keeps approximately 34px-wide dates, distinct columns and full-height controls. Week numbers reduce date width further. Navigation and dropdowns retain 44px height. The existing shared motion stylesheet already covers `.a-calendar button` and reduced motion.

## Coordinator integration: demo and usage

Replace the single Calendar preview with self-contained examples for single selection, two-month range, multiple dates, bounded dropdown navigation, disabled/unavailable dates and a French locale. Use fixed September 2026 dates in evidence fixtures; production examples may choose their own initial month. Include a narrow parent and light/dark states. Demonstrate `footer` for selection feedback and explain that application validation/loading/error belongs to the surrounding field. The calendar itself performs no asynchronous work.

The following public range example must compile in the docs and clean consumer:

```tsx
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "./components/ui/forms";

export function BookingCalendar() {
  const [range, setRange] = React.useState<DateRange>();
  return (
    <Calendar
      mode="range"
      defaultMonth={new Date(2026, 8, 1)}
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      showOutsideDays={false}
      disabled={{ dayOfWeek: [0, 6] }}
      excludeDisabled
      footer={range?.to ? "Dates selected" : "Choose a start and end date"}
    />
  );
}
```

Rebuild the registry after integrating source and styles, verify the `calendar` item includes the updated `forms.tsx`, `styles.css`, motion stylesheet and declared dependencies, then install and compile the public examples in a clean consumer. Update `docs/quality/coverage.json` only to the status supported by the combined evidence. No issue closure or release readiness is claimed by this worker.

## Validation and findings

Focused tests: `npx vitest run tests/calendar.test.tsx`, 18 passed. TypeScript: `npm run typecheck`, passed. Full UI suite: `npx vitest run`, 132 passed across 13 files. CLI suite: `node --test tests/cli.test.mjs`, 5 passed. Existing Recharts zero-dimension warnings and a Node localStorage warning appeared in unrelated tests. The registry was not rebuilt because generated integration files are coordinator-owned.

Documentation build: `npx vite build --config apps/docs/vite.config.ts`, passed (3410 modules). Vite reported an existing-style bundle-size warning for the 1083.07kB JavaScript chunk. This build used the checked-in registry artifact and is not regenerated-source parity evidence.

### Standards review

The independent reviewer found no documented-standard violations or actionable smell findings. The review confirmed the preserved discriminated API, caller overrides, public behavior tests and honest separation of proposed CSS from implemented source. Its focused rerun passed all 18 tests. It requested the reviewed SHA and reviewer identity, now recorded above.

### Spec review

The independent reviewer found no source behavior defect or scope creep. It identified four incomplete issue requirements: integrated visual refinement; the full responsive, touch, locale and zoom matrix; clean-consumer/source parity; and final rendered evidence. These remain coordinator integration work. Both reviewers assessed commit `f473ded1d4d67eb442f7d428762694d2ac646b6f`.

### Rendered observations

The worker ran Chromium through `npm exec --yes --package=agent-browser -- agent-browser --session aretusa-calendar`, using the repository-local Vite server at `http://127.0.0.1:4288`. This was an isolated browser session, not CUA or a Playwright CLI invocation. The coordinator subsequently communicated that external-browser verification was awaiting authorization in the main conversation. The worker stopped further external-browser checks and closed its session. These observations are exploratory evidence only; the coordinator must repeat accepted verification through the authorized browser.

Fixtures imported the actual worktree Calendar module through Vite and mounted it in a temporary browser DOM node. The proposed CSS above was injected into that browser document, without changing the repository stylesheet. The original documentation app remained hidden during these fixture captures. These images do not prove that the current documentation preview or an installed consumer contains the proposal.

| Viewport or container                       | Theme and state                                                              | Observed evidence                                        | Result                                                                                                                                                    |
| ------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 320px                                       | Light, existing CSS, single calendar                                         | `/tmp/aretusa-calendar-before-320.png`                   | Existing dates have 36px height; today lacks a distinct visible style                                                                                     |
| 320px                                       | Light, existing CSS, selected range                                          | `/tmp/aretusa-calendar-before-range-320.png`             | Individual selected buttons lack a connecting range band                                                                                                  |
| 320px                                       | Light, injected CSS, two-month range                                         | `/tmp/aretusa-calendar-proposal-range-320.png`           | Months stack, range endpoints and middle differ, today has a border; measured page width 320px with scrollWidth 320px; sampled date targets 41.14 by 44px |
| 390px                                       | Dark, injected CSS, selected today, disabled weekends and long dropdown text | `/tmp/aretusa-calendar-proposal-dark-dropdown-390.png`   | Theme and state differences visible; native select truncates the deliberately long option in its closed face                                              |
| 768/1024/1440px                             | Both                                                                         | Not captured                                             | Pending                                                                                                                                                   |
| 240px parent                                | Both                                                                         | Dense-grid rationale only                                | Pending measurement and visual inspection                                                                                                                 |
| 200% text zoom                              | Both                                                                         | Not captured                                             | Pending                                                                                                                                                   |
| Keyboard, focus, reduced motion, real touch | Browser                                                                      | DOM interaction tests exist; browser paths not completed | Pending accepted browser verification                                                                                                                     |

The long native-select option is an open visual finding. The coordinator should use realistic localized month names and verify their fit, or provide a wrapping custom caption control if arbitrary long option text is promised. The exact complete responsive matrix must run after integrating the stylesheet and examples. The `/tmp` screenshots are local handoff artifacts, not committed public evidence.

Shared styling and documentation are coordinator-owned. Their proposed changes above remain integration requirements, not changes present on this worker branch. The rendered review must distinguish the existing branch CSS from any browser-injected proposal. Clean-consumer installation, regenerated registry parity, deployment, physical touch testing and assistive-technology speech output remain unperformed.

## Sources

- Installed DayPicker 9.14.0 declarations and implementation: `dist/esm/types/props.d.ts`, `dist/esm/DayPicker.js`, `dist/esm/selection/useSingle.js`, `useMulti.js`, `useRange.js`, `dist/esm/components/Weekdays.js`.
- [DayPicker selection modes](https://daypicker.dev/docs/selection-modes/) and [customization](https://daypicker.dev/docs/customization/).

## Coordinator review and integration

Diff reviewed from the real checkout against base `6b27b5a`; the worker's 18 tests and typecheck were reproduced in its worktree. The source change was accepted as delivered: caller `className` preserved through `cx`, `showOutsideDays` and `navLayout` overridable, no dependency added.

The proposed stylesheet was integrated and then redesigned after the maintainer rejected the first rendering as generic. The shipped `.a-calendar` rules in `packages/ui/src/styles.css` now define: month title in the editorial serif, pill navigation buttons with a hairline border, uppercase letter-spaced weekday labels, tabular numerals, 44px rows with 10px radius targets, today marked by a terracotta dot under the numeral, selected dates as filled ink pills, a continuous surface band for ranges with rounded row ends and hidden cells excluded, outside and disabled dates in muted tones, a hairline above the footer, native month and year selects styled like the Aretusa input with a drawn chevron, and 140ms color transitions removed under reduced motion. Months are flex items that share the container width; the caption, dropdowns and navigation wrap onto a second line in narrow parents instead of clipping. The table uses automatic layout with a minimum cell width so zoomed text scrolls inside the bounded month region instead of overlapping.

Two coordinator-owned defects were found and fixed during integration: the docs app carried its own `.a-calendar` overrides in `apps/docs/src/site.css` (32px targets and a second selected rule) that defeated the shared stylesheet, removed; and the first demo range crossed disabled weekends while `excludeDisabled` was set, replaced with three unavailable nights. The `min-width: 2.25em` cells clipped the week-number calendar in a 240px parent; the dense-grid exception now uses `1.75em` cells and a `1.5em` week-number column.

Demo: five examples on the Calendar page (two-month range with unavailable nights and footer feedback, single date with today, multiple dates with min and max, month and year menus within 2025 to 2027, French locale with Monday start and week numbers in a 240px parent, and past dates unavailable). Typed usage is the range example with `showOutsideDays={false}`, `excludeDisabled` and a footer.

### Rendered evidence (local dev server, Chromium in the Claude browser pane)

| Check | Result |
| --- | --- |
| 320 px | scrollWidth 320, no page overflow; months stack; days 28 by 44 px (dense-grid exception below 44 px width); captions do not overflow |
| 390 px light and dark | scrollWidth 390; today border and dot use the terracotta token; selected fill uses ink on paper in light and paper on ink in dark; range middle uses the surface token; disabled opacity 0.45 |
| 768 px | scrollWidth 753 beside the sidebar; the two range months stack; single calendars 341 px |
| 1024 px | no overflow; grid columns 313 px |
| 1440 px light | scrollWidth 1425; the two range months share the 797 px card at 365 px each with 52 by 44 px days; single calendars 352 px |
| 200% text zoom proxy at 390 px | the calendar itself does not widen the page; each month scrolls horizontally inside its bounded region (about 255 px of overflow) with 63 by 44 px days and nowrap weekday labels; the page-level overflow at this zoom comes from the version badge and the API table, recorded on the site ticket |
| 240 px parent | week-number calendar fits with 27 by 44 px days and no clipped navigation after the month row wraps |
| Keyboard | ArrowRight and ArrowDown moved focus from 8 to 16 September with full date names announced; Enter and Space activation could not be exercised by the pane's key injection (it also failed on a plain button), so selection by keyboard relies on the worker's jsdom tests |
| Dropdowns | month and year selects 158 by 40 and 96 by 40 px at 390 px, side by side, navigation wraps under them; bounded to 3 years |
| Range | hidden outside cells no longer carry the band; no disabled cell inside the initial range |

Open items: forced-colors and reduced-motion emulation, real touch, assistive-technology speech, and the long-locale native select option text, which the native control truncates in its closed face.

Gates: design passed for the reviewed states, responsive passed, interaction passed with the keyboard activation caveat, code passed, distribution passed after the registry rebuild and clean-consumer build. Status: visually-reviewed. Not release-ready until an independent second review confirms the redesign.
