# Table review

- Issue: [#69](https://github.com/emanueledenaro/aretusa/issues/69)
- Reviewer: worker branch agent/batch3-overlays-data, coordinator review pending
- Status: behavior-checked

## What changed

`columns` still accepts strings and now also objects with `header`, `align` (end for numbers, applied to the header and every cell with tabular figures), `sort` (rendered as `aria-sort` for callers that sort their rows), `width` and `srOnly` for an actions column that keeps its name. `rows` still accepts arrays of cells and now also objects with `key`, `cells` and `selected`, which sets `aria-selected` and the selected surface. New props: `hideCaption` (caption kept for assistive technology), `emptyMessage` (one row across every column when there are no rows), `loading` with `loadingRows` (skeleton lines, `aria-busy` on the region and a hidden "Loading" note), `dense` and `className`.

The header uses small uppercase muted text with a hairline, cells align to the top with relaxed leading so long text wraps without breaking the row rhythm, and the scroll region keeps the Aretusa scrollbar, a focus ring and its caption as name.

Demo: a project overview with owner, status badge, end-aligned budget, a per-row Select action and a loading switch; a dense four-column table inside a 240px parent that scrolls inside its region; an empty archived table.

## Tests

`tests/table.test.tsx`, 5 tests: the string contract keeps the named region and table; end alignment reaches header and cells; the empty message spans every column; loading marks the region busy and keeps the header; row objects carry keys and `aria-selected`, and `hideCaption` keeps the caption for assistive technology.

## Rendered evidence

Pending. No browser was used in this batch. The coordinator should check: the 240px parent scrolling inside its region without page overflow, the header hairline and uppercase tracking in both themes, the selected row surface, wrapping of the long project name at 320 px, 200% zoom and the skeleton pulse under reduced motion.

## Findings

- P2 resolved: numbers were start-aligned and there was no empty or loading state.
- P2 resolved: rows had no key or selected state, so Data Table could not express selection through the table.
- P3 resolved: the region had no focus ring.
- Open: browser captures, sticky header for long lists (not in scope), independent second review.

## Integration notes

Props for the site API table: `columns` (string or `{ header, align, sort, width, srOnly }`), `rows` (cells or `{ key, cells, selected }`), `caption`, `hideCaption`, `emptyMessage`, `loading`, `loadingRows`, `dense`, `className`. Exported types `TableColumn`, `TableRow`, `TableProps`. Catalog description could read "Semantic rows and columns with aligned numbers, empty and loading states inside a bounded scroll region." Changelog: Table columns and rows accept objects; new empty, loading and dense options.

## Decision

Interaction and code gates passed in jsdom for the documented behavior; design and responsive gates await rendered evidence. Not release-ready.
