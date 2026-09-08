import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Empty } from "./basic";
import { Input } from "./forms";
import { Pagination } from "./navigation";
export function Table({
  columns,
  rows,
  caption,
}: {
  columns: string[];
  rows: React.ReactNode[][];
  caption: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-start text-sm">
        <caption className="pb-3 text-start text-muted">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                scope="col"
                key={c}
                className="border-b border-line px-3 py-3 text-start font-medium"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-surface/60">
              {r.map((c, n) => (
                <td key={n} className="border-b border-line px-3 py-3">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export type DataRow = {
  id: string;
  name: string;
  status: string;
  amount: number;
};
export function DataTable({ rows }: { rows: DataRow[] }) {
  const [query, setQuery] = React.useState(""),
    [sort, setSort] = React.useState(false),
    [page, setPage] = React.useState(1);
  const filtered = rows
    .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (sort ? b.amount - a.amount : a.amount - b.amount));
  const total = Math.max(1, Math.ceil(filtered.length / 5));
  const current = Math.min(page, total);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          aria-label="Filter records"
          placeholder="Filter by name…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
        <Button
          tone="outline"
          onClick={() => setSort(!sort)}
          aria-pressed={sort}
        >
          Amount {sort ? "descending" : "ascending"}
        </Button>
      </div>
      {filtered.length ? (
        <Table
          caption={filtered.length + " records"}
          columns={["Name", "Status", "Amount"]}
          rows={filtered
            .slice((current - 1) * 5, current * 5)
            .map((r) => [
              r.name,
              r.status,
              new Intl.NumberFormat("en", {
                style: "currency",
                currency: "EUR",
              }).format(r.amount),
            ])}
        />
      ) : (
        <Empty title="No matching records">Try a different name.</Empty>
      )}
      <Pagination page={current} total={total} onChange={setPage} />
    </div>
  );
}
export function Chart({
  data,
  label,
}: {
  data: { name: string; value: number }[];
  label: string;
}) {
  return (
    <figure>
      <figcaption className="mb-4 text-sm font-medium">{label}</figcaption>
      {data.length ? (
        <>
          <div className="h-52 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart
                data={data}
                accessibilityLayer
                margin={{ top: 10, right: 15, bottom: 0, left: 0 }}
              >
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                />
                <YAxis
                  width={30}
                  tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                />
                <ChartTooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    borderColor: "var(--color-line)",
                    color: "var(--color-ink)",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-terracotta)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <details className="mt-4 text-xs">
            <summary>View data table</summary>
            <Table
              caption={label}
              columns={["Period", "Value"]}
              rows={data.map((d) => [d.name, d.value])}
            />
          </details>
        </>
      ) : (
        <Empty title="No chart data" />
      )}
    </figure>
  );
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
