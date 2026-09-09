# Chart review

- Issue: [#66](https://github.com/emanueledenaro/aretusa/issues/66)
- Reviewer: worker branch agent/batch3-overlays-data, coordinator review pending
- Status: behavior-checked

## What changed

The figure is now named through its caption and described by a hidden sentence that gives the lowest and highest value of the first series with their periods ("Weekly contributions ranges from 12 (Mon) to 45 (Thu) across 5 periods."). Line, bar and area accept several `series` (`{ key, label, color }`) drawn with the palette tokens, with a legend list named Series when there is more than one. `valueFormatter` formats the Y axis, the tooltip, the summary and the table. The table alternative sits behind a "View data as a table" disclosure with a real focus ring, uses the Table component with end-aligned numeric columns and one column per series, and can start open with `tableOpen`. New: `description` under the caption, `height`, `loading` (skeleton frame, busy figure, hidden "Loading" note), `error` with `onRetry`, `emptyTitle` and `className`. The X axis keeps its first and last tick and drops crowded ones; the bar chart has a category gap and a surface cursor; the tooltip uses card, line and ink tokens. Pie, radar and radial keep working from the first series. All animations stay off, so reduced motion changes nothing. The data type is `ChartDatum`, which still accepts `{ name, value }` rows.

Demo: a two-series studio output chart with a kind toggle and a state select (ready, loading, error, empty), a compact currency bar chart in a card and a compact area chart inside a 240px parent.

## Tests

`tests/chart.test.tsx`, 6 tests: the figure is named by its label, summarises the range and offers the table; several series get a legend, one table column each and formatted values; empty data shows the empty state; loading and error with retry; line, bar and area share the same frame and the table can start open; compact keeps the caption for assistive technology and a single value summarises.

jsdom gives the ResponsiveContainer no size, so the SVG itself is not asserted; recharts renders it in a browser.

## Rendered evidence

Pending. No browser was used in this batch. The coordinator should check: the 240px parent with the tick thinning, legend wrapping at 320 px, the palette and grid hairline in both themes, the tooltip surface, the disclosure focus ring, keyboard focus through the recharts accessibility layer, 200% zoom and the skeleton under reduced motion.

## Findings

- P1 resolved: the figure had no accessible name link and no text summary; the table alternative was a bare details element.
- P2 resolved: one series only; no value formatting; no loading or error state.
- P3 resolved: axis ticks at 10px and overlapping labels on narrow widths.
- Open: browser captures, screen reader pass over the recharts accessibility layer, independent second review.

## Integration notes

Props for the site API table: `data`, `label`, `kind`, `series`, `valueFormatter`, `description`, `compact`, `height`, `tableOpen`, `loading`, `error`, `onRetry`, `emptyTitle`, `className`. Exported types `ChartDatum`, `ChartSeries`, `ChartProps` (`ChartKind` unchanged). Catalog description could read "Line, bar and area series with a text summary and a table alternative." Changelog: Chart gains series, value formatting, states and a described figure.

## Decision

Interaction and code gates passed in jsdom for the documented behavior; design and responsive gates await rendered evidence. Not release-ready.
