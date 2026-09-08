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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { Empty } from "./empty";
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
