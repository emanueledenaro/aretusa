# Data Table review

- Issue: [#67](https://github.com/emanueledenaro/aretusa/issues/67)
- Reviewer: worker branch agent/batch3-overlays-data, coordinator review pending
- Status: behavior-checked

## What changed

Data Table is now a generic recipe over the Table component. `rows` of the DataRow shape keep working with the default name, status and amount columns; `columns` accepts `{ key, header, align, sortable, cell, sortValue, width }` for any row type with an id. Sorting cycles ascending, descending and none from a button inside each sortable header, exposes `aria-sort` on the header cell and can be controlled with `sort`, `defaultSort` and `onSortChange`. Selection adds a checkbox column with named row controls ("Select Field notes"), a page-level select all with a mixed state, `aria-selected` rows, a summary bar with the count, `bulkActions` and a clear control; `selected`, `defaultSelected` and `onSelectionChange` support both modes. The filter is a search field with a clear control that searches the string columns or `filterKeys` and returns to the first page. Pagination through the Pagination component appears when there is more than one page, with a live "Showing 1 to 5 of 6" line. States: `loading` (skeleton rows, busy region), `error` with `onRetry`, empty with `emptyTitle` and `emptyDescription`. `toolbar` adds content beside the filter; `caption` names the table with the record count.

The default order is now the caller's order rather than ascending amount, and the sort toggle button was replaced by the sortable headers.

Demo: eight notes with a long title, owner, status badge, budget and date, sorted by update date, selectable with an Archive bulk action that removes rows and a Restore control, plus a state select that switches between ready, loading and error.

## Tests

`tests/data-table.test.tsx`, 7 tests: default columns, currency and paging; filter narrows, resets the page, shows the empty state and clears; sortable headers cycle and expose `aria-sort` with `onSortChange`; selection with named checkboxes, mixed select all and bulk actions; controlled selection follows the caller; loading and error with retry; custom columns with cell renderers and declared filter keys.

## Rendered evidence

Pending. No browser was used in this batch. The coordinator should check: 320 and 390 px with the toolbar wrapping and the table scrolling inside its region, the checkbox column at a usable target size, the selection bar, the sort icons and header focus ring in both themes, the long title wrapping, 200% zoom and the skeleton under reduced motion.

## Findings

- P1 resolved: no selection and no sorting from the header; sorting was a single toggle on amount.
- P2 resolved: no loading or error state; the filter had no clear control.
- P2 resolved: pagination was always shown, even for a single page, and the count was not announced.
- Open: browser captures, keyboard walk through many rows, independent second review.

## Integration notes

Props for the site API table: `rows`, `columns`, `caption`, `pageSize`, `filterKeys`, `filterPlaceholder`, `selectable`, `selected`, `defaultSelected`, `onSelectionChange`, `sort`, `defaultSort`, `onSortChange`, `loading`, `error`, `onRetry`, `emptyTitle`, `emptyDescription`, `toolbar`, `bulkActions`, `rowLabel`, `className`. Exported types `DataTableColumn`, `DataTableSort`, `DataTableProps`. The data module now imports Checkbox from forms and Alert; the registry graph picks that up at build time. Catalog description could read "Sortable, selectable and paginated records with filter, empty, loading and error states." Changelog: DataTable becomes generic with header sorting and selection; the amount toggle button is gone and rows keep the caller's order by default.

## Decision

Interaction and code gates passed in jsdom for the documented behavior; design and responsive gates await rendered evidence. Not release-ready.
