import * as React from "react";
import {
  Copy,
  Check,
  ArrowRight,
  ArrowUpRight,
  Lock,
  Unlock,
  Shuffle,
  RotateCcw,
  Code2,
  Expand,
  Monitor,
  Smartphone,
  Plus,
  Search,
  Type,
  LayoutGrid,
  Palette,
  ChevronRight,
} from "lucide-react";
import * as U from "../../../packages/ui/src/index";
import {
  defaultTheme,
  themeTokens,
  themeCSS,
  validateTheme,
  styleNames,
  type ThemeConfig,
} from "../../../packages/ui/src/theme";
import { Showcase } from "./Showcase";
export function CodePanel({
  code,
  title = "Code",
}: {
  code: string;
  title?: string;
}) {
  const [copied, setCopied] = React.useState(false),
    [error, setError] = React.useState(false);
  return (
    <div className="code-panel">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="text-[11px] text-muted">{title}</span>
        <U.Button
          tone="quiet"
          size="sm"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              setError(true);
            }
          }}
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          <span className="text-[11px]">
            {error ? "Select code to copy" : copied ? "Copied" : "Copy"}
          </span>
        </U.Button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
export function PageHeading({
  label,
  title,
  description,
  action,
}: {
  label?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      {label && (
        <span className="release-pill">
          {label}
          <ArrowRight className="size-3" />
        </span>
      )}
      <h1>{title}</h1>
      <p>{description}</p>
      {action && <div className="mt-6 flex justify-center gap-3">{action}</div>}
    </div>
  );
}
export function Landing() {
  const [view, setView] = React.useState<"gallery" | "workspace">("gallery");
  return (
    <>
      <PageHeading
        label="Aretusa / Early access"
        title="The starting point for your design system."
        description="Thoughtfully composed components. Source code you can shape. Build an interface that feels like your own."
        action={
          <>
            <U.Button onClick={() => (location.hash = "/docs")}>
              Get started
              <ArrowRight className="size-3.5" />
            </U.Button>
            <U.Button
              tone="outline"
              onClick={() => (location.hash = "/components/button")}
            >
              View components
            </U.Button>
          </>
        }
      />
      <section className="gallery-shell">
        <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
          <div className="flex gap-5">
            {["gallery", "workspace"].map((v) => (
              <button
                onClick={() => setView(v as typeof view)}
                key={v}
                className={
                  "text-xs capitalize " +
                  (v === view ? "font-medium text-ink" : "text-muted")
                }
                aria-pressed={view === v}
              >
                {v === "gallery" ? "Components" : "Dashboard"}
              </button>
            ))}
          </div>
          <a
            href="#/create"
            className="inline-flex items-center gap-2 text-xs text-muted"
          >
            Make it yours <SettingsIcon />
          </a>
        </div>
        <div className="a-edge-fade" id="home-examples">
          <Showcase view={view} />
        </div>
        <p className="py-6 text-center text-[10px] text-muted">
          Interactive examples use fictional data. No external services are
          connected.
        </p>
      </section>
    </>
  );
}
function SettingsIcon() {
  return <Palette className="size-3.5" />;
}
export function ChartsPage({ kind = "area" }: { kind?: string }) {
  const types = ["area", "bar", "line", "pie", "radar", "radial"] as const;
  const selected = types.includes(kind as (typeof types)[number])
    ? (kind as (typeof types)[number])
    : "area";
  const [code, setCode] = React.useState<string | null>(null);
  return (
    <div className="gallery-shell">
      <PageHeading
        title="Data, clearly expressed."
        description="Considered charts for the stories in your data. Explore, inspect, and build on them."
      />
      <nav aria-label="Chart categories" className="category-bar">
        {types.map((t) => (
          <a
            key={t}
            href={"#/charts/" + t}
            aria-current={selected === t ? "page" : undefined}
          >
            {t === "radial" ? "Radial bar" : t[0].toUpperCase() + t.slice(1)}
          </a>
        ))}
      </nav>
      <div className="grid gap-5 py-8 md:grid-cols-2 xl:grid-cols-3">
        {[
          "Monthly activity",
          "Team contributions",
          "A different perspective",
          "A quieter signal",
          "Weekly overview",
          "A new beginning",
        ].map((title, i) => {
          const data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
            (name, n) => ({ name, value: [28, 52, 39, 70, 56, 84][n] + i * 7 }),
          );
          return (
            <U.Card key={title} className="chart-example">
              <div className="mb-5">
                <h2 className="text-sm font-medium">{title}</h2>
                <p className="mt-1 text-[11px] text-muted">
                  {i % 2 ? "A six-month view" : "January through June"} /
                  example data
                </p>
              </div>
              <U.Chart data={data} label={title} kind={selected} compact />
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="text-[10px] text-muted">
                  {selected} / {String(i + 1).padStart(2, "0")}
                </span>
                <U.Button
                  tone="quiet"
                  size="sm"
                  onClick={() =>
                    setCode(
                      'import { Chart } from "./components/aretusa/data";\n\n<Chart kind="' +
                        selected +
                        '" label="' +
                        title +
                        '" data={' +
                        JSON.stringify(data, null, 2) +
                        "} />",
                    )
                  }
                >
                  <Code2 className="size-3.5" />
                  View code
                </U.Button>
              </div>
            </U.Card>
          );
        })}
      </div>
      <U.Modal
        open={!!code}
        onOpenChange={(v) => !v && setCode(null)}
        title="Use this chart."
        description="Copy the example and install the Chart item."
      >
        <CodePanel code={code || ""} />
      </U.Modal>
    </div>
  );
}
type Item = {
  name: string;
  description: string;
  type: string;
  files: { path: string; content: string }[];
  dependencies: string[];
};
export function DirectoryPage() {
  const [items, setItems] = React.useState<Item[]>([]),
    [q, setQ] = React.useState(""),
    [error, setError] = React.useState(false),
    [selected, setSelected] = React.useState<Item | null>(null);
  React.useEffect(() => {
    fetch("./r/index.json")
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((r) => setItems(r.items))
      .catch(() => setError(true));
  }, []);
  const shown = items.filter((i) =>
    (i.name + " " + i.description).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="gallery-shell">
      <PageHeading
        title="A directory of building blocks."
        description="Explore the Aretusa registry. Every item includes its source files and declared dependencies."
      />
      <div className="mx-auto mb-10 max-w-lg">
        <U.InputGroup prefix={<Search className="size-4" />}>
          <U.Input
            aria-label="Search registry"
            placeholder="Search components, blocks, patterns…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </U.InputGroup>
      </div>
      {error ? (
        <U.Alert title="Registry unavailable" tone="error">
          Reload after building the registry.
        </U.Alert>
      ) : (
        <>
          <div className="mb-5 flex justify-between text-xs text-muted">
            <span>Aretusa / Official registry</span>
            <span>{shown.length} items</span>
          </div>
          <div className="grid gap-4 pb-12 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((i) => (
              <button
                key={i.name}
                className="registry-card a-surface-lift"
                onClick={() => setSelected(i)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium">
                    {i.name}
                  </span>
                  <U.Badge>{i.type}</U.Badge>
                </div>
                <p className="my-4 text-start text-xs leading-relaxed text-muted">
                  {i.description}
                </p>
                <div className="flex items-center justify-between border-t border-line pt-3 text-[10px] text-muted">
                  <span>{i.files.length} source files</span>
                  <ArrowUpRight className="size-3.5" />
                </div>
              </button>
            ))}
          </div>
          {!shown.length && (
            <U.Empty title="No items found">Try another search.</U.Empty>
          )}
        </>
      )}
      <U.Modal
        open={!!selected}
        onOpenChange={(v) => !v && setSelected(null)}
        title={selected?.name || "Registry item"}
        description="Source manifest, dependencies and installation."
      >
        {selected && (
          <div className="space-y-5">
            <p className="text-sm text-muted">{selected.description}</p>
            <CodePanel
              title="Install from a local checkout"
              code={
                "node packages/cli/src/cli.mjs add " +
                selected.name +
                " --cwd /path/to/app"
              }
            />
            <h3 className="text-sm font-medium">Files</h3>
            <ul className="space-y-2 text-xs">
              {selected.files.map((f) => (
                <li key={f.path} className="font-mono">
                  {f.path}
                </li>
              ))}
            </ul>
            <h3 className="text-sm font-medium">Dependencies</h3>
            <p className="font-mono text-xs leading-relaxed text-muted">
              {selected.dependencies.join(", ")}
            </p>
            <a
              href={"./r/" + selected.name + ".json"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs underline"
            >
              Open manifest <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        )}
      </U.Modal>
    </div>
  );
}
export function TypesetPage() {
  const [font, setFont] = React.useState("editorial"),
    [size, setSize] = React.useState(64),
    [weight, setWeight] = React.useState(400),
    [text, setText] = React.useState("A little room for better ideas."),
    [tracking, setTracking] = React.useState(-2);
  const css =
    ".heading {\n  font-family: " +
    (font === "editorial"
      ? '"Lora Variable", Georgia, serif'
      : '"DM Sans Variable", Arial, sans-serif') +
    ";\n  font-size: clamp(32px, 5vw, " +
    size +
    "px);\n  font-weight: " +
    weight +
    ";\n  letter-spacing: " +
    tracking +
    "px;\n  line-height: 1.12;\n}";
  return (
    <div className="gallery-shell">
      <PageHeading
        title="Give your words a little room."
        description="Explore the typography of Aretusa. Two complementary voices, with every detail in your hands."
      />
      <div className="builder-layout mb-10">
        <aside className="builder-controls">
          <U.Field label="Typeface">
            <U.NativeSelect
              value={font}
              onChange={(e) => setFont(e.target.value)}
              options={[
                { value: "editorial", label: "Lora / Editorial" },
                { value: "sans", label: "DM Sans / Interface" },
              ]}
            />
          </U.Field>
          <U.Field label={"Size / " + size + "px"}>
            <U.Input
              type="range"
              min={24}
              max={96}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </U.Field>
          <U.Field label={"Weight / " + weight}>
            <U.Input
              type="range"
              min={400}
              max={font === "editorial" ? 700 : 900}
              step={100}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </U.Field>
          <U.Field label={"Tracking / " + tracking + "px"}>
            <U.Input
              type="range"
              min={-4}
              max={4}
              step={0.25}
              value={tracking}
              onChange={(e) => setTracking(Number(e.target.value))}
            />
          </U.Field>
          <U.Button
            tone="outline"
            onClick={() => {
              setFont("editorial");
              setSize(64);
              setWeight(400);
              setTracking(-2);
              setText("A little room for better ideas.");
            }}
          >
            Reset
          </U.Button>
        </aside>
        <div className="type-specimen">
          <textarea
            aria-label="Typography preview text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              fontFamily:
                font === "editorial"
                  ? "var(--font-editorial)"
                  : "var(--font-sans)",
              fontSize: "clamp(24px, 5vw, " + size + "px)",
              fontWeight: weight,
              letterSpacing: tracking + "px",
            }}
          />
          <div className="mt-8 border-t border-line pt-8">
            <p className="text-[10px] uppercase tracking-[.18em] text-muted">
              The details
            </p>
            <p
              className="mt-5 break-words text-2xl"
              style={{
                fontFamily:
                  font === "editorial"
                    ? "var(--font-editorial)"
                    : "var(--font-sans)",
              }}
            >
              Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv
              Ww Xx Yy Zz
              <br />
              0123456789 &amp; @ # ! ?
            </p>
          </div>
          <div className="mt-10">
            <CodePanel code={css} title="Typography CSS" />
          </div>
        </div>
      </div>
    </div>
  );
}
const values: Record<keyof ThemeConfig, readonly (string | number)[]> = {
  style: styleNames,
  base: ["sand", "slate", "olive"],
  accent: ["terracotta", "amber", "olive", "ink"],
  chart: ["clay", "sage", "gold"],
  heading: ["editorial", "sans"],
  font: ["dm", "system"],
  radius: [0, 4, 8, 10, 16, 20, 24],
  menu: ["soft", "solid"],
};
const labels: Record<keyof ThemeConfig, string> = {
  style: "Style",
  base: "Base color",
  accent: "Accent",
  chart: "Chart palette",
  heading: "Heading",
  font: "Body font",
  radius: "Radius",
  menu: "Menu surface",
};
export function CreatePage() {
  const [config, setConfig] = React.useState<ThemeConfig>(defaultTheme),
    [locks, setLocks] = React.useState<string[]>([]),
    [view, setView] = React.useState<"gallery" | "workspace">("gallery"),
    [showCode, setShowCode] = React.useState(false),
    [dark, setDark] = React.useState(false),
    [mobile, setMobile] = React.useState(false);
  const encoded = btoa(JSON.stringify(config))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  const src =
    "./#/preview?theme=" +
    encodeURIComponent(JSON.stringify(config)) +
    "&view=" +
    view +
    "&dark=" +
    Number(dark);
  function shuffle() {
    setConfig(
      (c) =>
        Object.fromEntries(
          Object.keys(c).map((key) => [
            key,
            locks.includes(key)
              ? c[key as keyof ThemeConfig]
              : values[key as keyof ThemeConfig][
                  Math.floor(
                    Math.random() * values[key as keyof ThemeConfig].length,
                  )
                ],
          ]),
        ) as ThemeConfig,
    );
  }
  return (
    <div className="create-page">
      <div className="create-toolbar">
        <span className="text-xs font-medium">Your next starting point</span>
        <div className="flex gap-2">
          <U.Button
            tone="quiet"
            size="sm"
            aria-label="Desktop preview"
            onClick={() => setMobile(false)}
          >
            <Monitor className="size-4" />
          </U.Button>
          <U.Button
            tone="quiet"
            size="sm"
            aria-label="Mobile preview"
            onClick={() => setMobile(true)}
          >
            <Smartphone className="size-4" />
          </U.Button>
          <U.Button tone="outline" size="sm" onClick={() => setDark(!dark)}>
            {dark ? "Light preview" : "Dark preview"}
          </U.Button>
          <U.Button size="sm" onClick={() => setShowCode(true)}>
            Get code
          </U.Button>
        </div>
      </div>
      <div className="create-grid">
        <aside className="builder-controls">
          {Object.keys(values).map((key) => {
            const k = key as keyof ThemeConfig;
            return (
              <div className="flex items-end gap-1" key={k}>
                <div className="min-w-0 flex-1">
                  <U.Field label={labels[k]}>
                    <U.Select
                      label={labels[k]}
                      value={String(config[k])}
                      onValueChange={(value) =>
                        setConfig((c) => ({
                          ...c,
                          [k]: k === "radius" ? Number(value) : value,
                        }))
                      }
                      options={values[k].map((v) => ({
                        value: String(v),
                        label:
                          k === "radius"
                            ? String(v) + " px"
                            : String(v).charAt(0).toUpperCase() +
                              String(v).slice(1),
                        swatch: (
                          {
                            sand: "#eee9df",
                            slate: "#dfe4e8",
                            olive: "#738065",
                            terracotta: "#b85f46",
                            amber: "#d9a83c",
                            ink: "#252820",
                            clay: "#bf745d",
                            sage: "#87957d",
                            gold: "#d3b356",
                          } as Record<string, string>
                        )[String(v)],
                      }))}
                    />
                  </U.Field>
                </div>
                <U.Button
                  tone="quiet"
                  size="sm"
                  aria-label={
                    (locks.includes(k) ? "Unlock " : "Lock ") + labels[k]
                  }
                  aria-pressed={locks.includes(k)}
                  onClick={() =>
                    setLocks((l) =>
                      l.includes(k) ? l.filter((v) => v !== k) : [...l, k],
                    )
                  }
                >
                  {locks.includes(k) ? (
                    <Lock className="size-3.5" />
                  ) : (
                    <Unlock className="size-3.5 text-muted" />
                  )}
                </U.Button>
              </div>
            );
          })}
          <div className="grid gap-2 pt-3">
            <U.Button tone="outline" onClick={shuffle}>
              <Shuffle className="size-3.5" />
              Shuffle
            </U.Button>
            <U.Button
              tone="quiet"
              onClick={() => {
                setConfig(defaultTheme);
                setLocks([]);
              }}
            >
              <RotateCcw className="size-3.5" />
              Reset
            </U.Button>
            <U.Button onClick={() => setShowCode(true)}>Get code</U.Button>
          </div>
        </aside>
        <div className="create-canvas">
          <iframe
            title="Live Aretusa preview"
            src={src}
            className={
              mobile ? "preview-frame preview-frame-mobile" : "preview-frame"
            }
          />
          <div className="preview-switch">
            {["gallery", "workspace"].map((v, i) => (
              <button
                key={v}
                onClick={() => setView(v as typeof view)}
                aria-label={"Preview " + v}
                aria-pressed={view === v}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </div>
      <U.Modal
        open={showCode}
        onOpenChange={setShowCode}
        title="Take this starting point with you."
        description="Export the actual theme or initialize an Aretusa consumer with this preset."
      >
        <U.Tabs
          items={[
            {
              value: "theme",
              label: "Theme CSS",
              content: <CodePanel code={themeCSS(config)} />,
            },
            {
              value: "install",
              label: "Install",
              content: (
                <div className="space-y-4">
                  <CodePanel
                    title="From the Aretusa repository"
                    code={
                      "node packages/cli/src/cli.mjs init --cwd /path/to/app --preset " +
                      encoded +
                      "\nnode packages/cli/src/cli.mjs add button --cwd /path/to/app"
                    }
                  />
                  <p className="text-xs text-muted">
                    The preset is stored in aretusa.json and applied to the
                    installed styles.
                  </p>
                </div>
              ),
            },
            {
              value: "preset",
              label: "Preset",
              content: <CodePanel code={JSON.stringify(config, null, 2)} />,
            },
          ]}
        />
      </U.Modal>
    </div>
  );
}
export function PreviewPage({ query }: { query: string }) {
  const parsed = React.useMemo(() => {
    const p = new URLSearchParams(query);
    try {
      return {
        config: validateTheme(JSON.parse(p.get("theme") || "{}")),
        dark: p.get("dark") === "1",
        view:
          p.get("view") === "workspace"
            ? ("workspace" as const)
            : ("gallery" as const),
      };
    } catch {
      return { config: null, dark: false, view: "gallery" as const };
    }
  }, [query]);
  React.useEffect(() => {
    if (!parsed.config) return;
    const root = document.documentElement,
      tokens = themeTokens(parsed.config, parsed.dark),
      previousTheme = root.getAttribute("data-theme");
    const previous = new Map(
      Object.keys(tokens).map((key) => [
        key,
        {
          value: root.style.getPropertyValue(key),
          priority: root.style.getPropertyPriority(key),
        },
      ]),
    );
    root.dataset.theme = parsed.dark ? "dark" : "light";
    for (const [key, value] of Object.entries(tokens))
      root.style.setProperty(key, value);
    return () => {
      if (previousTheme === null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previousTheme);
      for (const [key, { value, priority }] of previous) {
        if (value) root.style.setProperty(key, value, priority);
        else root.style.removeProperty(key);
      }
    };
  }, [parsed]);
  if (!parsed.config)
    return (
      <U.Alert title="Invalid preview configuration" tone="error">
        Reset the builder to a valid preset.
      </U.Alert>
    );
  return (
    <div className="preview-root">
      <Showcase view={parsed.view} />
    </div>
  );
}
