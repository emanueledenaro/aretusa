import * as React from "react";
import {
  Search,
  ArrowUpRight,
  ArrowRight,
  Copy,
  Check,
  Sun,
  Moon,
  Menu,
  Code2,
  BookOpen,
  Terminal,
  ExternalLink,
} from "lucide-react";
import * as U from "../../../packages/ui/src/index";
import { catalog } from "../../../packages/ui/src/catalog";
import { Demo } from "./Demo";
import { ButtonLab, AvatarLab } from "./ComponentLab";
import {
  Landing,
  ChartsPage,
  DirectoryPage,
  TypesetPage,
  CreatePage,
  PreviewPage,
} from "./ProductPages";
import { usageCode } from "./usage";
const github = "https://github.com/emanueledenaro/aretusa";
function useRoute() {
  const [route, setRoute] = React.useState(location.hash.slice(1) || "/");
  React.useEffect(() => {
    const update = () => {
      setRoute(location.hash.slice(1) || "/");
      window.scrollTo(0, 0);
    };
    addEventListener("hashchange", update);
    return () => removeEventListener("hashchange", update);
  }, []);
  return route;
}
function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = React.useState(false),
    [failed, setFailed] = React.useState(false);
  return (
    <U.Button
      tone="quiet"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          setFailed(true);
        }
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {failed ? "Select text to copy" : copied ? "Copied" : label}
    </U.Button>
  );
}
function Code({ children }: { children: string }) {
  return (
    <div className="relative rounded-xl border border-line bg-card">
      <div className="flex justify-end border-b border-line px-2 py-1">
        <CopyButton text={children} />
      </div>
      <pre className="overflow-x-auto p-5 text-xs leading-6">
        <code>{children}</code>
      </pre>
    </div>
  );
}
function Install({ id }: { id: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-muted">
        From a local checkout, initialize your React + Tailwind v4 project, then
        add the source. Existing differing files are preserved.
      </p>
      <Code>
        {"node packages/cli/src/cli.mjs init --cwd /path/to/your-app\nnode packages/cli/src/cli.mjs add " +
          id +
          " --cwd /path/to/your-app"}
      </Code>
      <p className="text-xs text-muted">
        The installer prints the dependencies to install. npm publication is
        tracked in the release notes; local commands work from the repository.
      </p>
      <a className="text-sm underline underline-offset-4" href="#/docs">
        Read the installation guide
      </a>
    </div>
  );
}
const categories: Record<string, string> = {
  basic: "Foundations",
  forms: "Forms & selection",
  overlays: "Overlays",
  navigation: "Navigation",
  data: "Data & media",
  conversation: "Conversation",
  utilities: "Utilities",
  integrations: "Forms",
};
function Sidebar({ selected }: { selected?: string }) {
  const [expanded, setExpanded] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  React.useEffect(() => setExpanded(false), [selected]);
  const entries = [...catalog]
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((entry) =>
      entry.name.toLowerCase().includes(filter.trim().toLowerCase()),
    );
  return (
    <aside className="docs-sidebar" aria-label="Documentation sidebar">
      <button
        className="docs-tree-toggle"
        aria-expanded={expanded}
        aria-controls="docs-tree"
        onClick={() => setExpanded(!expanded)}
      >
        Browse documentation <Menu className="size-4" />
      </button>
      <nav
        id="docs-tree"
        aria-label="Documentation"
        className={expanded ? "docs-tree is-open" : "docs-tree"}
      >
        <div className="docs-nav-group">
          <h2 className="docs-nav-heading">Sections</h2>
          <a
            href="#/docs"
            className="docs-nav-link"
            aria-current={!selected ? "page" : undefined}
          >
            Getting started
          </a>
          <a href="#/create" className="docs-nav-link">
            Themes
          </a>
          <a href="#/typeset" className="docs-nav-link">
            Typography
          </a>
          <a href="#/directory" className="docs-nav-link">
            Registry
          </a>
          <a href="#/blocks" className="docs-nav-link">
            Blocks
          </a>
        </div>
        <div className="docs-nav-group">
          <h2 className="docs-nav-heading">Components</h2>
          <div className="docs-nav-filter">
            <Search
              className="size-3.5 shrink-0 text-muted"
              aria-hidden="true"
            />
            <input
              aria-label="Filter components"
              placeholder="Filter…"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
          </div>
          <ul className="docs-nav-list">
            {entries.filter(entry => entry.module !== "utilities" && entry.module !== "integrations").map((entry) => (
              <li key={entry.id}>
                <a
                  className="docs-nav-link"
                  href={"#/components/" + entry.id}
                  aria-current={selected === entry.id ? "page" : undefined}
                >
                  {entry.name}
                </a>
              </li>
            ))}
          </ul>
          {!entries.length && (
            <p className="px-3 py-3 text-xs text-muted" role="status">
              No matching components.
            </p>
          )}
        </div>
        <div className="docs-nav-group">
          <h2 className="docs-nav-heading">Forms</h2>
          {entries.filter(entry => entry.module === "integrations").map(entry => <a key={entry.id} className="docs-nav-link" href={"#/forms/" + entry.id} aria-current={selected === entry.id ? "page" : undefined}>{entry.name}</a>)}
        </div>
        <div className="docs-nav-group">
          <h2 className="docs-nav-heading">Utilities</h2>
          {entries.filter(entry => entry.module === "utilities").map(entry => <a key={entry.id} className="docs-nav-link" href={"#/utils/" + entry.id} aria-current={selected === entry.id ? "page" : undefined}>{entry.name}</a>)}
        </div>
      </nav>
    </aside>
  );
}
const itemNotes: Record<string, string> = {
  "react-hook-form":
    "HookFormField calls useController and renders the label, help text and error for one field; your render function receives field, fieldState, formState and controlProps. Spread field and controlProps on Input or NativeSelect; map value, onValueChange, triggerRef and triggerOnBlur on Select; checked and onCheckedChange on Checkbox and Switch; value, onValueChange and focusRef on RadioGroup. Invalid submit focuses the real control through the forwarded ref. Validation, submission, reset and field arrays stay in useForm and useFieldArray. The full reservation example lives in examples/react-hook-form.",
  "scroll-fade":
    "Call useScrollFade({ axis, enabled }) in the component that owns the scroll container and attach its ref to the element that actually scrolls. Render ScrollFade as a sibling inside a positioned parent of the same size; it is aria-hidden and ignores pointer input. The hook returns physical top, bottom, left and right edges plus refresh() for layout changes it cannot observe. Keep the region focusable with an accessible name so keyboard users can scroll it.",
};
function ComponentPage({ id }: { id: string }) {
  const [api, setApi] = React.useState<
    { name: string; required: boolean; type: string }[]
  >([]);
  const entry = catalog.find((c) => c.id === id);
  const [source, setSource] = React.useState<
      { path: string; content: string }[]
    >([]),
    [error, setError] = React.useState(false),
    [tab, setTab] = React.useState("preview"),
    [file, setFile] = React.useState("");
  React.useEffect(() => {
    setSource([]);
    setError(false);
    setFile("");
    setTab("preview");
    const ctl = new AbortController();
    fetch("./r/" + id + ".json", { signal: ctl.signal })
      .then((r) => {
        if (!r.ok) throw Error("Missing registry item");
        return r.json();
      })
      .then((r) => {
        setSource(r.files);
        setApi(r.api || []);
        setFile(r.files[0]?.path || "");
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(true);
      });
    return () => ctl.abort();
  }, [id]);
  if (!entry)
    return (
      <U.Empty
        title="Component not found"
        action={<a href="#/components/button">Browse components</a>}
      />
    );
  const index = catalog.indexOf(entry);
  return (
    <div className="docs-layout shell">
      <Sidebar selected={id} />
      <article className="min-w-0 py-10 lg:py-14">
        <U.Breadcrumb
          items={[
            entry.module === "utilities"
              ? { label: "Utilities", href: "#/utils/scroll-fade" }
              : entry.module === "integrations"
                ? { label: "Forms", href: "#/forms/react-hook-form" }
                : { label: "Components", href: "#/components/button" },
            { label: entry.name },
          ]}
        />
        <div className="mb-9 mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-editorial text-4xl tracking-tight md:text-5xl">
              {entry.name}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              {entry.description}
            </p>
          </div>
          <U.Badge>v0.1</U.Badge>
        </div>
        <div className="mb-10 rounded-2xl border border-line bg-card">
          <div
            className="flex gap-1 border-b border-line p-2"
            role="tablist"
            aria-label="Example view"
          >
            {["preview", "source"].map((t) => (
              <button
                key={t}
                role="tab"
                id={"tab-" + t}
                aria-controls={"panel-" + t}
                tabIndex={tab === t ? 0 : -1}
                aria-selected={tab === t}
                className={
                  "rounded-lg px-4 py-2 text-sm " +
                  (tab === t ? "bg-surface font-medium" : "text-muted")
                }
                onClick={() => setTab(t)}
                onKeyDown={(e) => {
                  if (
                    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                  ) {
                    e.preventDefault();
                    const next =
                      e.key === "Home"
                        ? "preview"
                        : e.key === "End"
                          ? "source"
                          : t === "preview"
                            ? "source"
                            : "preview";
                    setTab(next);
                    document.getElementById("tab-" + next)?.focus();
                  }
                }}
              >
                {t === "preview" ? "Preview" : "Source"}
              </button>
            ))}
          </div>
          {tab === "preview" ? (
            <div
              className="flex min-h-64 items-center p-6 md:p-10"
              role="tabpanel"
              id="panel-preview"
              aria-labelledby="tab-preview"
              aria-label="Preview"
            >
              <Demo id={id} key={id} />
            </div>
          ) : (
            <div
              className="p-4"
              role="tabpanel"
              id="panel-source"
              aria-labelledby="tab-source"
              aria-label="Source"
            >
              {error ? (
                <U.Alert title="Source could not be loaded" tone="error">
                  Build the registry and reload this page.
                </U.Alert>
              ) : !source.length ? (
                <U.Spinner />
              ) : (
                <>
                  <label
                    className="mb-2 block text-xs text-muted"
                    htmlFor="source-file"
                  >
                    Source file
                  </label>
                  <U.NativeSelect
                    id="source-file"
                    value={file}
                    onChange={(e) => setFile(e.target.value)}
                    options={source.map((f) => ({
                      value: f.path,
                      label: f.path,
                    }))}
                  />
                  <div className="mt-4 max-h-[500px] overflow-auto">
                    <Code>
                      {source.find((f) => f.path === file)?.content || ""}
                    </Code>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {id === "button" && <ButtonLab />}
        {id === "avatar" && <AvatarLab />}
        <section id="installation" className="mt-12">
          <h2 className="doc-h2">Installation</h2>
          <Install id={id} />
        </section>
        <section className="mt-12">
          <h2 className="doc-h2">API reference</h2>
          <p className="mb-5 text-sm text-muted">
            Generated from this component's TypeScript source. Native control
            attributes are also forwarded where supported.
          </p>
          <U.Table
            caption={entry.name + " properties"}
            columns={["Property", "Type", "Required"]}
            rows={api.map((p) => [
              <code>{p.name}</code>,
              <code className="block max-w-sm whitespace-normal break-words text-[11px]">
                {p.type}
              </code>,
              p.required ? "Yes" : "No",
            ])}
          />
        </section>
        <section id="anatomy" className="mt-12">
          <h2 className="doc-h2">Usage & anatomy</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted">
            Import {entry.exportName} from the installed {entry.source} module.
            The source tab includes the complete TypeScript contract, supporting
            components and dependencies. Props are forwarded where documented in
            the source.
          </p>
          <Code>{usageCode(id, entry.exportName, entry.source)}</Code>
        </section>
        <section className="mt-12">
          <h2 className="doc-h2">Interaction notes</h2>
          <p className="text-sm leading-relaxed text-muted">
            {itemNotes[entry.id] ?? (entry.module === "overlays"
              ? "Use a meaningful title and description. Modal surfaces contain focus, close with Escape and return focus to their trigger. Hover content must remain supplementary to an accessible control."
              : entry.module === "forms"
                ? "Always provide a visible label or accessible name. Field connects hints and errors to its child control. Keep required, disabled and invalid states explicit. Native controls follow the browser interaction model."
                : entry.module === "navigation"
                  ? "Use keyboard focus to move through controls. Composite Radix controls support arrow-key navigation. Navigation links must point to real destinations."
                  : "Keep content and actions meaningful. Test long content, narrow viewports and the theme you ship. Examples use fictional data.")}
          </p>
        </section>
        <div className="mt-14 flex justify-between border-t border-line pt-6 text-sm">
          {index > 0 ? (
            <a href={"#/components/" + catalog[index - 1].id}>
              Previous: {catalog[index - 1].name}
            </a>
          ) : (
            <span />
          )}
          {index < catalog.length - 1 && (
            <a href={"#/components/" + catalog[index + 1].id}>
              Next: {catalog[index + 1].name}
            </a>
          )}
        </div>
      </article>
      <aside className="hidden pt-16 text-xs text-muted xl:block">
        <p className="mb-4 font-medium text-ink">On this page</p>
        <p>Preview & source</p>
        <p className="mt-3">Installation</p>
        <p className="mt-3">Usage & anatomy</p>
        <p className="mt-3">Interaction notes</p>
      </aside>
    </div>
  );
}
function Docs() {
  return (
    <div className="docs-layout shell">
      <Sidebar />
      <article className="min-w-0 py-12">
        <p className="text-xs uppercase tracking-widest text-muted">
          Getting started
        </p>
        <h1 className="mt-5 font-editorial text-5xl">Your first component.</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Aretusa distributes source code into your project. You own the
          installed files and can adapt them under the MIT license.
        </p>
        <h2 className="doc-h2 mt-12">1. Start from the repository</h2>
        <Code>
          {
            "git clone https://github.com/emanueledenaro/aretusa.git\ncd aretusa\nnpm ci\nnpm run registry:build"
          }
        </Code>
        <h2 className="doc-h2 mt-12">2. Add a component</h2>
        <Install id="button" />
        <h2 className="doc-h2 mt-12">3. Connect Tailwind and fonts</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted">
          Use React 19 and Tailwind v4. Import the installed styles.css from
          your app entry and let Tailwind scan that directory. The default font
          stacks gracefully fall back to Arial and Georgia. For the full theme,
          install the Fontsource dependencies printed by the CLI.
        </p>
        <Code>
          {
            'import "./components/aretusa/styles.css"\nimport { Button } from "./components/aretusa/button"\n\n<Button onClick={() => console.log("Hello")}>Start here</Button>'
          }
        </Code>
        <h2 className="doc-h2 mt-12">4. Make it yours</h2>
        <p className="text-sm leading-relaxed text-muted">
          Edit the copied component or override semantic color tokens.
          Re-running add preserves identical files and refuses to replace local
          modifications. Review source with view or plan an install using
          --dry-run.
        </p>
        <h2 className="doc-h2 mt-12">Support & status</h2>
        <U.Alert title="An early release">
          The current implementation targets React 19, TypeScript and Tailwind
          v4, with Vite as the reference consumer. Individual component
          behaviors and limitations are described in the catalog. Public package
          publication is separate from the source release.
        </U.Alert>
        <div className="mt-8 flex gap-5 text-sm underline">
          <a href={github + "/issues"}>Report an issue</a>
          <a href={github + "/blob/main/CONTRIBUTING.md"}>Contribute</a>
          <a href={github + "/blob/main/LICENSE"}>MIT license</a>
        </div>
      </article>
    </div>
  );
}
function Blocks() {
  const [notice, setNotice] = React.useState("");
  const links = [
    { label: "About", href: "#/docs" },
    { label: "Components", href: "#/components/button" },
  ];
  return (
    <div className="shell py-16">
      <p className="text-xs uppercase tracking-widest text-muted">
        Original compositions
      </p>
      <h1 className="mt-4 font-editorial text-5xl">
        Pieces of a bigger picture.
      </h1>
      <p className="mt-5 max-w-xl text-muted">
        Reusable sections made from the same components. Replace the content and
        keep the rhythm.
      </p>
      <div className="mt-12 rounded-2xl border border-line bg-card p-6 md:p-10">
        <U.HeaderBlock name="Your studio" links={links} />
        <U.HeroBlock
          eyebrow="A new perspective"
          title="Good work starts with a conversation."
          description="A flexible editorial layout for your next project."
          action={
            <U.Button onClick={() => setNotice("Example action selected")}>
              Start a conversation
            </U.Button>
          }
        />
        <U.FeatureGrid
          items={[
            { title: "Discover", description: "Find the idea worth pursuing." },
            { title: "Create", description: "Make something people can use." },
            { title: "Share", description: "Bring others into the process." },
          ]}
        />
        <U.EditorialBlock label="Our approach" title="Space for better work.">
          <p>
            Good interfaces make room for the content and the people using it.
          </p>
        </U.EditorialBlock>
        <U.FAQBlock
          title="A few answers."
          items={[
            {
              title: "Can I adapt these sections?",
              content: "Yes. Edit the source to suit your product.",
            },
          ]}
        />
        <U.CTABlock
          title="Ready for a fresh start?"
          action={
            <U.Button onClick={() => setNotice("CTA selected")}>
              Get started
            </U.Button>
          }
        >
          A simple closing section with one clear next step.
        </U.CTABlock>
        <div className="py-12">
          <h2 className="mb-6 font-editorial text-3xl">
            A form that feels clear.
          </h2>
          <U.FormBlock
            onSubmit={(d) =>
              setNotice(
                "Example received for " + d.name + ". Nothing was sent.",
              )
            }
          />
        </div>
        {notice && <U.Alert title={notice} />}
        <U.FooterBlock name="Your studio" links={links} />
      </div>
      <div className="mt-8">
        <h2 className="doc-h2">Install a section</h2>
        <Install id="hero-block" />
      </div>
    </div>
  );
}
const navigation = [
  ["Home", "/"],
  ["Docs", "/docs"],
  ["Components", "/components/button"],
  ["Blocks", "/blocks"],
  ["Charts", "/charts/area"],
  ["Directory", "/directory"],
  ["Typeset", "/typeset"],
  ["Create", "/create"],
];
export function App() {
  const route = useRoute(),
    [path, query = ""] = route.split("?");
  const [theme, setTheme] = React.useState(() => {
      try {
        return localStorage.getItem("aretusa-theme") || "light";
      } catch {
        return "light";
      }
    }),
    [search, setSearch] = React.useState(false),
    [q, setQ] = React.useState(""),
    [mobile, setMobile] = React.useState(false),
    [active, setActive] = React.useState(0);
  React.useEffect(() => {
    if (path === "/preview") return;
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("aretusa-theme", theme);
    } catch {}
  }, [theme, path]);
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch((v) => !v);
      }
    };
    addEventListener("keydown", handler);
    return () => removeEventListener("keydown", handler);
  }, []);
  React.useEffect(() => {
    setSearch(false);
    setMobile(false);
    document.title =
      ((path.startsWith("/components/") || path.startsWith("/utils/") || path.startsWith("/forms/"))
        ? (catalog.find((c) => c.id === path.split("/")[2])?.name ||
            "Components") + " / "
        : "") + "Aretusa by TrinacriaLabs";
  }, [path]);
  const results = [
    ...navigation.map(([name, href]) => ({ name, href, group: "Pages" })),
    ...catalog.map((c) => ({
      name: c.name,
      href: "/components/" + c.id,
      group: categories[c.module],
    })),
  ].filter((c) =>
    (c.name + " " + c.group).toLowerCase().includes(q.toLowerCase()),
  );
  React.useEffect(() => {
    if (!search) return;
    document.getElementById("site-search-" + active)?.scrollIntoView?.({block: "nearest", inline: "nearest"});
  }, [search, active, q]);
  if (path === "/preview") return <PreviewPage query={query} />;
  return (
    <>
      <a
        className="skip-link"
        href="#content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("content")?.focus();
          document.getElementById("content")?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-header-inner">
          <a href="#/" className="brand" aria-label="Aretusa home">
            aretusa<span>.</span>
          </a>
          <nav className="desktop-nav" aria-label="Main">
            {navigation.map(([name, href]) => (
              <a
                key={href}
                href={"#" + href}
                aria-current={path === href ? "page" : undefined}
              >
                {name}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <U.Button
              tone="secondary"
              size="sm"
              aria-label="Search documentation"
              onClick={() => setSearch(true)}
            >
              <Search className="size-3.5" />
              <span className="search-label">Search documentation…</span>
              <kbd className="search-shortcut">⌘ K</kbd>
            </U.Button>
            <a href={github} className="github-link">
              GitHub
              <ArrowUpRight className="size-3" />
            </a>
            <U.Button
              tone="quiet"
              size="sm"
              aria-label={
                theme === "light"
                  ? "Switch to dark theme"
                  : "Switch to light theme"
              }
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="size-3.5" />
              ) : (
                <Sun className="size-3.5" />
              )}
            </U.Button>
            <U.Button
              size="sm"
              className="new-project"
              onClick={() => (location.hash = "/create")}
            >
              + New
            </U.Button>
            <U.Button
              tone="quiet"
              size="sm"
              className="mobile-menu"
              aria-label="Open navigation"
              aria-expanded={mobile}
              onClick={() => setMobile(!mobile)}
            >
              <Menu className="size-4" />
            </U.Button>
          </div>
        </div>
        {mobile && (
          <nav className="mobile-nav" aria-label="Mobile">
            {navigation.map(([n, p]) => (
              <a key={p} href={"#" + p}>
                {n}
              </a>
            ))}
          </nav>
        )}
      </header>
      <main id="content" tabIndex={-1}>
        {(path.startsWith("/components/") || path.startsWith("/utils/") || path.startsWith("/forms/")) ? (
          <ComponentPage id={path.split("/")[2]} />
        ) : path === "/docs" ? (
          <Docs />
        ) : path === "/create" || path === "/themes" ? (
          <CreatePage />
        ) : path === "/typeset" ? (
          <TypesetPage />
        ) : path === "/directory" ? (
          <DirectoryPage />
        ) : path.startsWith("/charts") ? (
          <ChartsPage kind={path.split("/")[2]} />
        ) : path === "/blocks" ? (
          <Blocks />
        ) : path === "/" ? (
          <Landing />
        ) : (
          <div className="shell py-20">
            <U.Empty
              title="This page could not be found."
              action={<a href="#/docs">Back to documentation</a>}
            />
          </div>
        )}
      </main>
      {path !== "/create" && (
        <footer className="border-t border-line">
          <div className="gallery-shell flex flex-wrap items-center justify-between gap-5 py-7 text-[11px] text-muted">
            <p>
              Built by{" "}
              <a
                href="https://github.com/emanueledenaro"
                className="text-ink underline underline-offset-4"
              >
                TrinacriaLabs
              </a>
              . The source is yours to explore.
            </p>
            <div className="flex gap-4">
              <a href={github + "/blob/main/LICENSE"}>MIT License</a>
              <a href={github + "/releases"}>Releases</a>
              <a href={github + "/issues"}>Feedback</a>
            </div>
          </div>
        </footer>
      )}
      <U.Modal
        open={search}
        onOpenChange={setSearch}
        title="Search Aretusa"
        description="Find a component, a section or your next starting point."
      >
        <U.Input
          role="combobox"
          aria-expanded="true"
          aria-controls="site-search-results"
          aria-activedescendant={
            results[active] ? "site-search-" + active : undefined
          }
          aria-label="Search components"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) =>
                Math.max(0, Math.min(i + 1, results.length - 1)),
              );
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(0, i - 1));
            }
            if (e.key === "Enter" && results[active]) {
              location.hash = results[active].href;
              setSearch(false);
            }
          }}
          placeholder="Dialog, input, card…"
        />
        <div
          id="site-search-results"
          role="listbox"
          tabIndex={-1}
          aria-label="Search results"
          className="mt-4 max-h-72 space-y-1.5 overflow-auto pe-2"
        >
          {results.map((c, i) => (
            <a
              role="option"
              tabIndex={-1}
              aria-selected={i === active}
              id={"site-search-" + i}
              key={c.href + c.group}
              className={
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm " +
                (active === i ? "bg-surface" : "hover:bg-surface")
              }
              href={"#" + c.href}
              onClick={() => setSearch(false)}
            >
              {c.name}
              <span className="text-[10px] text-muted">{c.group}</span>
            </a>
          ))}
          {!results.length && (
            <p role="status" className="py-6 text-center text-sm text-muted">
              No results. Try another name.
            </p>
          )}
        </div>
        <div className="mt-5 border-t border-line pt-4 text-[10px] text-muted">
          Arrow keys to explore · Enter to open · Escape to close
        </div>
      </U.Modal>
    </>
  );
}
