import * as React from "react";
import {
  AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, RadialBarChart, RadialBar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown, X } from "lucide-react";
import { Button } from "./button";
import { Empty } from "./empty";
import { Input, Checkbox } from "./forms";
import { Alert } from "./alert";
import { Pagination } from "./navigation";
import { Skeleton } from "./skeleton";
import { cx } from "./utils";
export type TableColumn =
  | string
  | {
      header: React.ReactNode;
      /** Numbers and amounts read best aligned to the end. */
      align?: "start" | "end";
      /** Sort state exposed on the header cell when the caller sorts the rows. */
      sort?: "ascending" | "descending" | "none";
      /** Column width, any CSS length. */
      width?: string;
      /** Hide the header text visually; the name stays for assistive technology. */
      srOnly?: boolean;
    };
export type TableRow =
  | React.ReactNode[]
  | {
      key?: React.Key;
      cells: React.ReactNode[];
      /** Marks the row as selected for assistive technology and the selected surface. */
      selected?: boolean;
    };
export type TableProps = {
  columns: TableColumn[];
  rows: TableRow[];
  /** Names the table and its scroll region. */
  caption: string;
  /** Keep the caption for assistive technology only. */
  hideCaption?: boolean;
  /** Shown as one row across every column when there are no rows. */
  emptyMessage?: React.ReactNode;
  /** Replaces the rows with placeholder lines and marks the region busy. */
  loading?: boolean;
  /** Placeholder rows shown while loading. */
  loadingRows?: number;
  /** Compact rows for dense data. */
  dense?: boolean;
  className?: string;
};
function columnOf(column: TableColumn) {
  return typeof column === "string" ? { header: column } : column;
}
export function Table({
  columns,
  rows,
  caption,
  hideCaption = false,
  emptyMessage = "Nothing to show.",
  loading = false,
  loadingRows = 3,
  dense = false,
  className,
}: TableProps) {
  const cols = columns.map(columnOf);
  const pad = dense ? "px-3 py-2" : "px-3 py-3";
  const body: TableRow[] = loading
    ? Array.from({ length: loadingRows }, (_, i) => ({
        key: "loading-" + i,
        cells: cols.map((_, n) => <Skeleton key={n} className={n === 0 ? "h-4 w-2/3" : "h-4 w-1/2"} />),
      }))
    : rows;
  return (
    <div
      role="region"
      aria-label={caption}
      aria-busy={loading || undefined}
      tabIndex={0}
      className={cx("a-scrollbar overflow-x-auto rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink", className)}
    >
      <table className="w-full text-start text-sm">
        <caption className={hideCaption ? "sr-only" : "pb-3 text-start text-sm text-muted"}>{caption}</caption>
        <thead>
          <tr>
            {cols.map((c, n) => (
              <th
                scope="col"
                key={n}
                aria-sort={c.sort}
                style={c.width ? { width: c.width } : undefined}
                className={cx(
                  "border-b border-line text-xs font-medium uppercase tracking-[0.08em] text-muted",
                  pad,
                  c.align === "end" ? "text-end" : "text-start",
                )}
              >
                {c.srOnly ? <span className="sr-only">{c.header}</span> : c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.length === 0 ? (
            <tr>
              <td colSpan={cols.length} className={cx("border-b border-line text-center text-muted", dense ? "px-3 py-6" : "px-3 py-8")}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            body.map((row, i) => {
              const r = Array.isArray(row) ? { cells: row } : row;
              return (
                <tr
                  key={r.key ?? i}
                  aria-selected={r.selected || undefined}
                  data-selected={r.selected || undefined}
                  className="transition-colors hover:bg-surface/60 data-[selected]:bg-surface"
                >
                  {r.cells.map((cell, n) => (
                    <td
                      key={n}
                      className={cx("border-b border-line align-top leading-relaxed", pad, cols[n]?.align === "end" ? "text-end tabular-nums" : "text-start")}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {loading && <p className="sr-only">Loading {caption}</p>}
    </div>
  );
}
export type DataRow = {
  id: string;
  name: string;
  status: string;
  amount: number;
};
export type DataTableColumn<T> = {
  /** Property read from the row for text, filtering and sorting. */
  key: string;
  header: string;
  align?: "start" | "end";
  sortable?: boolean;
  /** Custom cell content; the raw value is used otherwise. */
  cell?: (row: T) => React.ReactNode;
  /** Value compared when sorting; the raw value is used otherwise. */
  sortValue?: (row: T) => string | number;
  width?: string;
};
export type DataTableSort = { key: string; direction: "ascending" | "descending" };
export type DataTableProps<T extends { id: string }> = {
  rows: T[];
  /** Columns in order. Defaults to name, status and amount for the DataRow shape. */
  columns?: DataTableColumn<T>[];
  /** Names the table; the record count is appended. */
  caption?: string;
  pageSize?: number;
  /** Row properties searched by the filter. Defaults to the string columns. */
  filterKeys?: string[];
  filterPlaceholder?: string;
  /** Adds a checkbox column and a select-all control for the current page. */
  selectable?: boolean;
  selected?: string[];
  defaultSelected?: string[];
  onSelectionChange?: (ids: string[]) => void;
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  loading?: boolean;
  /** Replaces the table with an alert; onRetry adds a Try again control. */
  error?: React.ReactNode;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: React.ReactNode;
  /** Extra toolbar content beside the filter. */
  toolbar?: React.ReactNode;
  /** Controls shown while rows are selected. */
  bulkActions?: (ids: string[]) => React.ReactNode;
  /** Accessible name for each row checkbox. Defaults to the name property or the id. */
  rowLabel?: (row: T) => string;
  className?: string;
};
const euro = new Intl.NumberFormat("en", { style: "currency", currency: "EUR" });
const defaultColumns: DataTableColumn<DataRow>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "status", header: "Status", sortable: true },
  { key: "amount", header: "Amount", align: "end", sortable: true, cell: (row) => euro.format(row.amount) },
];
function useControllable<V>(value: V | undefined, fallback: V, onChange?: (value: V) => void) {
  const [inner, setInner] = React.useState(fallback);
  const current = value === undefined ? inner : value;
  const set = React.useCallback(
    (next: V) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    },
    [value, onChange],
  );
  return [current, set] as const;
}
function rawValue<T>(row: T, key: string) {
  return (row as Record<string, unknown>)[key];
}
export function DataTable<T extends { id: string } = DataRow>({
  rows,
  columns = defaultColumns as unknown as DataTableColumn<T>[],
  caption = "records",
  pageSize = 5,
  filterKeys,
  filterPlaceholder = "Filter\u2026",
  selectable = false,
  selected,
  defaultSelected = [],
  onSelectionChange,
  sort,
  defaultSort = null,
  onSortChange,
  loading = false,
  error,
  onRetry,
  emptyTitle = "No matching records",
  emptyDescription = "Try a different filter.",
  toolbar,
  bulkActions,
  rowLabel,
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [sorting, setSorting] = useControllable(sort, defaultSort, onSortChange);
  const [selection, setSelection] = useControllable(selected, defaultSelected, onSelectionChange);
  const keys =
    filterKeys ?? columns.filter((column) => rows.length === 0 || typeof rawValue(rows[0], column.key) === "string").map((column) => column.key);
  const needle = query.trim().toLowerCase();
  const filtered = needle
    ? rows.filter((row) => keys.some((key) => String(rawValue(row, key) ?? "").toLowerCase().includes(needle)))
    : rows;
  const sorted = React.useMemo(() => {
    if (!sorting) return filtered;
    const column = columns.find((c) => c.key === sorting.key);
    const read = column?.sortValue ?? ((row: T) => rawValue(row, sorting.key) as string | number);
    const sign = sorting.direction === "ascending" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const x = read(a), y = read(b);
      if (typeof x === "number" && typeof y === "number") return (x - y) * sign;
      return String(x ?? "").localeCompare(String(y ?? ""), undefined, { numeric: true, sensitivity: "base" }) * sign;
    });
  }, [filtered, sorting, columns]);
  const total = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, total);
  const pageRows = sorted.slice((current - 1) * pageSize, current * pageSize);
  const pageIds = pageRows.map((row) => row.id);
  const selectedOnPage = pageIds.filter((id) => selection.includes(id));
  const allOnPage = pageIds.length > 0 && selectedOnPage.length === pageIds.length;
  const label = rowLabel ?? ((row: T) => String(rawValue(row, "name") ?? row.id));
  const filterId = React.useId();
  function cycle(key: string) {
    if (!sorting || sorting.key !== key) setSorting({ key, direction: "ascending" });
    else if (sorting.direction === "ascending") setSorting({ key, direction: "descending" });
    else setSorting(null);
  }
  function toggleRow(id: string, checked: boolean) {
    setSelection(checked ? [...selection, id] : selection.filter((item) => item !== id));
  }
  function togglePage(checked: boolean) {
    const rest = selection.filter((id) => !pageIds.includes(id));
    setSelection(checked ? [...rest, ...pageIds] : rest);
  }
  const tableColumns: TableColumn[] = [
    ...(selectable
      ? [
          {
            header: (
              <Checkbox
                className="gap-0 py-0"
                label={<span className="sr-only">Select all rows on this page</span>}
                checked={allOnPage ? true : selectedOnPage.length ? "indeterminate" : false}
                disabled={pageIds.length === 0}
                onCheckedChange={(value) => togglePage(value === true)}
              />
            ),
            width: "1%",
          } satisfies TableColumn,
        ]
      : []),
    ...columns.map(
      (column): TableColumn => ({
        align: column.align,
        width: column.width,
        sort: column.sortable ? (sorting?.key === column.key ? sorting.direction : "none") : undefined,
        header: column.sortable ? (
          <button
            type="button"
            onClick={() => cycle(column.key)}
            className={cx(
              "-mx-1 inline-flex min-h-8 items-center gap-1 rounded px-1 uppercase tracking-[0.08em] transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
              sorting?.key === column.key && "text-ink",
            )}
          >
            {column.header}
            {sorting?.key === column.key ? (
              sorting.direction === "ascending" ? (
                <ChevronUp aria-hidden="true" className="size-3.5" />
              ) : (
                <ChevronDown aria-hidden="true" className="size-3.5" />
              )
            ) : (
              <ChevronsUpDown aria-hidden="true" className="size-3.5 opacity-50" />
            )}
          </button>
        ) : (
          column.header
        ),
      }),
    ),
  ];
  const tableRows: TableRow[] = pageRows.map((row) => ({
    key: row.id,
    selected: selectable && selection.includes(row.id),
    cells: [
      ...(selectable
        ? [
            <Checkbox
              key="select"
              className="gap-0 py-0"
              label={<span className="sr-only">Select {label(row)}</span>}
              checked={selection.includes(row.id)}
              onCheckedChange={(value) => toggleRow(row.id, value === true)}
            />,
          ]
        : []),
      ...columns.map((column) => (column.cell ? column.cell(row) : String(rawValue(row, column.key) ?? ""))),
    ],
  }));
  const from = sorted.length ? (current - 1) * pageSize + 1 : 0;
  const to = Math.min(current * pageSize, sorted.length);
  return (
    <div className={cx("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 basis-56">
          <Input
            id={filterId}
            type="search"
            aria-label={"Filter " + caption}
            placeholder={filterPlaceholder}
            value={query}
            disabled={loading}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pe-11"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear filter"
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
              className="absolute end-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-ink"
            >
              <X className="size-4" strokeWidth={1.75} />
            </button>
          )}
        </div>
        {toolbar}
      </div>
      {selectable && selection.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-surface px-4 py-2 text-sm">
          <span className="font-medium">{selection.length} selected</span>
          {bulkActions?.(selection)}
          <Button size="sm" tone="quiet" className="ms-auto" onClick={() => setSelection([])}>
            Clear selection
          </Button>
        </div>
      )}
      {error ? (
        <Alert tone="error" title="Something went wrong">
          <div className="space-y-3">
            <div>{error}</div>
            {onRetry && (
              <Button size="sm" tone="outline" onClick={onRetry}>
                Try again
              </Button>
            )}
          </div>
        </Alert>
      ) : loading ? (
        <Table caption={"Loading " + caption} hideCaption columns={tableColumns} rows={[]} loading loadingRows={pageSize} />
      ) : sorted.length === 0 ? (
        <Empty title={emptyTitle}>{emptyDescription}</Empty>
      ) : (
        <Table caption={sorted.length + " " + caption} hideCaption columns={tableColumns} rows={tableRows} />
      )}
      {!error && !loading && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm text-muted">
            {sorted.length ? "Showing " + from + " to " + to + " of " + sorted.length : "No records"}
          </p>
          {total > 1 && <Pagination page={current} total={total} onChange={setPage} />}
        </div>
      )}
    </div>
  );
}
export type ChartKind = 'area'|'bar'|'line'|'pie'|'radar'|'radial';
export function Chart({data,label,kind='line',compact=false}:{data:{name:string;value:number}[];label:string;kind?:ChartKind;compact?:boolean}){
const tooltip=<ChartTooltip cursor={false} contentStyle={{background:'var(--color-card)',border:'1px solid var(--color-line)',color:'var(--color-ink)',borderRadius:10,fontSize:12,boxShadow:'0 8px 24px #0000000d'}}/>;
const colors=['var(--color-terracotta)','var(--color-gold)','var(--color-chart-3)','var(--color-chart-4)','var(--color-chart-5)'];
const axes=<><CartesianGrid stroke="var(--color-line)" vertical={false} strokeDasharray="3 4"/><XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill:'var(--color-muted)',fontSize:10}} dy={8}/>{!compact&&<YAxis width={30} tickLine={false} axisLine={false} tick={{fill:'var(--color-muted)',fontSize:10}}/>}</>;
let drawing:React.ReactElement;
if(kind==='pie')drawing=<PieChart accessibilityLayer>{tooltip}<Pie data={data} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="80%" paddingAngle={4} cornerRadius={5} isAnimationActive={false}>{data.map((d,i)=><Cell key={d.name} fill={colors[i%colors.length]} stroke="none"/>)}</Pie></PieChart>;
else if(kind==='radar')drawing=<RadarChart data={data} accessibilityLayer><PolarGrid stroke="var(--color-line)"/><PolarAngleAxis dataKey="name" tick={{fill:'var(--color-muted)',fontSize:11}}/>{tooltip}<Radar dataKey="value" stroke={colors[0]} fill={colors[0]} fillOpacity={.15} isAnimationActive={false}/></RadarChart>;
else if(kind==='radial')drawing=<RadialBarChart data={data.map((d,i)=>({...d,fill:colors[i%colors.length]}))} innerRadius="25%" outerRadius="95%" startAngle={90} endAngle={-270} accessibilityLayer>{tooltip}<RadialBar dataKey="value" background={{fill:'var(--color-surface)'}} cornerRadius={8} isAnimationActive={false}/></RadialBarChart>;
else if(kind==='bar')drawing=<BarChart data={data} accessibilityLayer margin={{top:12,right:4,bottom:5,left:0}}>{axes}{tooltip}<Bar dataKey="value" fill={colors[0]} radius={[5,5,2,2]} maxBarSize={38} isAnimationActive={false}>{data.map((d,i)=><Cell key={d.name} fill={i===data.length-1?colors[0]:'var(--color-chart-3)'}/>)}</Bar></BarChart>;
else if(kind==='area')drawing=<AreaChart data={data} accessibilityLayer margin={{top:12,right:4,bottom:5,left:0}}>{axes}{tooltip}<Area dataKey="value" type="monotone" fill={colors[0]} fillOpacity={.13} stroke={colors[0]} strokeWidth={2} isAnimationActive={false}/></AreaChart>;
else drawing=<LineChart data={data} accessibilityLayer margin={{top:12,right:4,bottom:5,left:0}}>{axes}{tooltip}<Line dataKey="value" type="monotone" stroke={colors[0]} strokeWidth={2} dot={false} activeDot={{r:4,strokeWidth:3,stroke:'var(--color-card)'}} isAnimationActive={false}/></LineChart>;
return <figure><figcaption className={compact?'sr-only':'mb-4 text-sm font-medium'}>{label}</figcaption>{data.length?<><div className={compact?'h-40 min-w-0':'h-60 min-w-0'}><ResponsiveContainer width="100%" height="100%" minWidth={0}>{drawing}</ResponsiveContainer></div><details className={compact?'mt-3 text-[10px] text-muted':'mt-4 text-xs text-muted'}><summary>View data</summary><Table caption={label} columns={['Period','Value']} rows={data.map(d=>[d.name,d.value])}/></details></>:<Empty title="No chart data"/>}</figure>
}
export function Carousel({
  slides,
}: {
  slides: { title: string; description: string }[];
}) {
  const [index, setIndex] = React.useState(0);
  if (!slides.length) return <Empty title="No slides" />;
  const current = Math.min(index, slides.length - 1);
  return (
    <section aria-roledescription="carousel" aria-label="Highlights">
      <div
        role="group"
        aria-roledescription="slide"
        aria-label={current + 1 + " of " + slides.length}
        className="rounded-xl bg-surface p-8"
      >
        <h3 className="font-editorial text-2xl">{slides[current].title}</h3>
        <p className="mt-3 text-sm text-muted">{slides[current].description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button
          tone="outline"
          aria-label="Previous slide"
          disabled={current === 0}
          onClick={() => setIndex(current - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span aria-live="polite" className="text-xs">
          {current + 1} / {slides.length}
        </span>
        <Button
          tone="outline"
          aria-label="Next slide"
          disabled={current === slides.length - 1}
          onClick={() => setIndex(current + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
export function Resizable({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  const [width, setWidth] = React.useState(40);
  return (
    <div>
      <label className="mb-3 block text-xs">
        Left panel width
        <input
          aria-label="Left panel width"
          className="ms-3 accent-terracotta"
          type="range"
          min="20"
          max="70"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>
      <div className="flex min-h-36 overflow-hidden rounded-xl border border-line">
        <div
          style={{ width: width + "%" }}
          className="overflow-auto border-e border-line p-4"
        >
          {left}
        </div>
        <div className="min-w-0 flex-1 overflow-auto p-4">{right}</div>
      </div>
    </div>
  );
}
