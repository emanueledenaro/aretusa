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
};
function Sidebar({ selected }: { selected?: string }) {
  const [filter, setFilter] = React.useState("");
  return (
    <aside className="docs-sidebar">
      <a href="#/docs" className="mb-6 block text-sm font-medium">
        Getting started
      </a>
      <U.Input
        aria-label="Filter components"
        placeholder="Find a component…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6"
      />
      {Object.entries(categories).map(([key, label]) => {
        const entries = catalog.filter(
          (c) =>
            c.module === key &&
            c.name.toLowerCase().includes(filter.toLowerCase()),
        );
        return entries.length ? (
          <div key={key} className="mb-7">
            <h2 className="mb-2 px-2 text-[10px] uppercase tracking-widest text-muted">
              {label}
            </h2>
            {entries.map((c) => (
              <a
                className={
                  "block rounded-md px-2 py-1.5 text-sm " +
                  (selected === c.id
                    ? "bg-surface font-medium"
                    : "text-muted hover:text-ink")
                }
                key={c.id}
                href={"#/components/" + c.id}
              >
                {c.name}
              </a>
            ))}
          </div>
        ) : null;
      })}
      {!catalog.some((c) =>
        c.name.toLowerCase().includes(filter.toLowerCase()),
      ) && <p className="text-sm text-muted">No components found.</p>}
    </aside>
  );
}
function ComponentPage({ id }: { id: string }) {
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
            { label: "Components", href: "#/components/button" },
            { label: entry.name },
          ]}
        />
        <div className="mb-9 mt-6 flex items-start justify-between gap-4">
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
                aria-selected={tab === t}
                className={
                  "rounded-lg px-4 py-2 text-sm " +
                  (tab === t ? "bg-surface font-medium" : "text-muted")
                }
                onClick={() => setTab(t)}
              >
                {t === "preview" ? "Preview" : "Source"}
              </button>
            ))}
          </div>
          {tab === "preview" ? (
            <div
              className="flex min-h-64 items-center p-6 md:p-10"
              role="tabpanel"
              aria-label="Preview"
            >
              <Demo id={id} key={id} />
            </div>
          ) : (
            <div className="p-4" role="tabpanel" aria-label="Source">
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
        <section id="installation">
          <h2 className="doc-h2">Installation</h2>
          <Install id={id} />
        </section>
        <section id="anatomy" className="mt-12">
          <h2 className="doc-h2">Usage & anatomy</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted">
            Import {entry.exportName} from the installed {entry.module} module.
            The source tab includes the complete TypeScript contract, supporting
            components and dependencies. Props are forwarded where documented in
            the source.
          </p>
          <Code>
            {"import { " +
              entry.exportName +
              ' } from "./components/aretusa/' +
              entry.module +
              '"'}
          </Code>
        </section>
        <section className="mt-12">
          <h2 className="doc-h2">Interaction notes</h2>
          <p className="text-sm leading-relaxed text-muted">
            {entry.module === "overlays"
              ? "Use a meaningful title and description. Modal surfaces contain focus, close with Escape and return focus to their trigger. Hover content must remain supplementary to an accessible control."
              : entry.module === "forms"
                ? "Always provide a visible label or accessible name. Field connects hints and errors to its child control. Keep required, disabled and invalid states explicit. Native controls follow the browser interaction model."
                : entry.module === "navigation"
                  ? "Use keyboard focus to move through controls. Composite Radix controls support arrow-key navigation. Navigation links must point to real destinations."
                  : "Keep content and actions meaningful. Test long content, narrow viewports and the theme you ship. Examples use fictional data."}
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
function Home() {
  return (
    <>
      <section className="shell py-14 text-center md:py-16">
        <a
          href="#/docs"
          className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted"
        >
          An open beginning. Aretusa v0.1 <ArrowRight className="size-3" />
        </a>
        <h1 className="mx-auto mt-8 max-w-4xl font-editorial text-5xl leading-[1.08] tracking-[-.045em] md:text-7xl">
          Thoughtful interfaces.
          <br />
          <span className="text-terracotta">Yours to build.</span>
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          Original React components, considered defaults, and source code you
          can shape into something of your own.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <U.Button onClick={() => (location.hash = "/docs")}>
            Start building <ArrowUpRight className="size-4" />
          </U.Button>
          <U.Button
            tone="outline"
            onClick={() => (location.hash = "/components/button")}
          >
            Explore components
          </U.Button>
        </div>
        <p className="mt-7 text-xs text-muted">
          Open source. Built with Tailwind. By TrinacriaLabs.
        </p>
      </section>
      <section className="shell pb-24">
        <div className="home-grid">
          <U.Card className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted">
                A place to begin
              </p>
              <U.Badge tone="success">Available</U.Badge>
            </div>
            <h2 className="font-editorial text-3xl">
              Make room
              <br />
              for your next idea.
            </h2>
            <Demo id="input" />
            <Demo id="button-group" />
            <U.Separator />
            <Demo id="switch" />
          </U.Card>
          <div className="space-y-5">
            <U.Card>
              <Demo id="chart" />
            </U.Card>
            <U.Card>
              <Demo id="bubble" />
            </U.Card>
          </div>
          <div className="space-y-5">
            <U.Card>
              <p className="mb-5 text-sm font-medium">Your preferences</p>
              <Demo id="radio-group" />
              <U.Separator />
              <Demo id="progress" />
            </U.Card>
            <U.Card className="bg-surface">
              <p className="mb-4 font-editorial text-2xl">A moment of focus.</p>
              <p className="mb-5 text-sm text-muted">
                Small details make a coherent experience.
              </p>
              <Demo id="dialog" />
            </U.Card>
          </div>
        </div>
      </section>
      <section className="border-y border-line bg-surface/40">
        <div className="shell grid gap-12 py-20 md:grid-cols-2">
          <h2 className="font-editorial text-4xl leading-tight">
            A system to work with.
            <br />
            And make your own.
          </h2>
          <div className="space-y-6">
            <p className="leading-relaxed text-muted">
              Start with a component. Read the source. Change the details.
              Aretusa gives you a coherent foundation while leaving the final
              decisions in your hands.
            </p>
            <a
              href="#/docs"
              className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
            >
              How Aretusa works <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>
      <section className="shell py-20">
        <U.FeatureGrid
          items={[
            {
              title: "Clear by default",
              description:
                "Warm neutrals, soft typography and a consistent visual rhythm.",
            },
            {
              title: "Composed with care",
              description:
                "Inputs, overlays and complete sections designed to work together.",
            },
            {
              title: "Source you own",
              description:
                "Install editable TypeScript and keep control of your interface.",
            },
          ]}
        />
      </section>
    </>
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
          self-host DM Sans and Lora.
        </p>
        <Code>
          {
            'import "./components/aretusa/styles.css"\nimport { Button } from "./components/aretusa/basic"\n\n<Button onClick={() => console.log("Hello")}>Start here</Button>'
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
function Themes() {
  const [accent, setAccent] = React.useState("#ac4333"),
    [radius, setRadius] = React.useState("8"),
    [font, setFont] = React.useState("editorial");
  const css =
    ":root {\n  --color-terracotta: " +
    accent +
    ";\n  --radius-lg: " +
    radius +
    "px;\n}";
  return (
    <div className="shell py-16">
      <p className="text-xs uppercase tracking-widest text-muted">
        Make it your own
      </p>
      <h1 className="mt-4 font-editorial text-5xl">
        A little change.
        <br />A different feeling.
      </h1>
      <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
        <U.Card className="space-y-6">
          <U.Field label="Accent">
            <U.Input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
            />
          </U.Field>
          <U.Field label="Control radius">
            <U.Input
              type="range"
              min="0"
              max="24"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            />
          </U.Field>
          <U.Field label="Heading style">
            <U.NativeSelect
              value={font}
              onChange={(e) => setFont(e.target.value)}
              options={[
                { value: "editorial", label: "Editorial serif" },
                { value: "sans", label: "Soft sans serif" },
              ]}
            />
          </U.Field>
          <U.Button
            tone="outline"
            onClick={() => {
              setAccent("#ac4333");
              setRadius("8");
              setFont("editorial");
            }}
          >
            Reset theme
          </U.Button>
        </U.Card>
        <div
          className="rounded-2xl border border-line p-8"
          style={
            {
              "--color-terracotta": accent,
              "--radius-lg": radius + "px",
            } as React.CSSProperties
          }
        >
          <h2
            className={
              "mb-5 text-4xl " +
              (font === "editorial" ? "font-editorial" : "font-sans")
            }
          >
            A considered beginning.
          </h2>
          <p className="mb-8 max-w-lg text-muted">
            Preview your choices before bringing them into a project.
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            <Demo id="switch" />
            <Demo id="slider" />
            <Demo id="button" />
            <Demo id="progress" />
          </div>
        </div>
      </div>
      <div className="mt-8 max-w-xl">
        <Code>{css}</Code>
        <p className="mt-3 text-xs text-muted">
          Custom colors require a contrast check before production use. Heading
          font preview is an editorial choice; use font-editorial or font-sans
          in your composition.
        </p>
      </div>
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
export function App() {
  const route = useRoute();
  const [theme, setTheme] = React.useState("light"),
    [search, setSearch] = React.useState(false),
    [q, setQ] = React.useState(""),
    [mobile, setMobile] = React.useState(false);
  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearch((v) => !v);
      }
    };
    addEventListener("keydown", handler);
    return () => removeEventListener("keydown", handler);
  }, []);
  React.useEffect(() => {
    setMobile(false);
    setSearch(false);
    document.title =
      (route.startsWith("/components/")
        ? (catalog.find((c) => c.id === route.split("/")[2])?.name ||
            "Components") + " | "
        : "") + "Aretusa by TrinacriaLabs";
  }, [route]);
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
        <div className="shell flex h-20 items-center gap-7">
          <a href="#/" className="brand">
            aretusa<span>.</span>
          </a>
          <nav
            className="hidden items-center gap-6 text-sm md:flex"
            aria-label="Main"
          >
            <a href="#/docs">Docs</a>
            <a href="#/components/button">Components</a>
            <a href="#/blocks">Blocks</a>
            <a href="#/themes">Themes</a>
          </nav>
          <div className="ms-auto flex items-center gap-2">
            <U.Button
              tone="outline"
              size="sm"
              onClick={() => setSearch(true)}
              aria-label="Search documentation"
            >
              <Search className="size-4" />
              <span className="hidden lg:inline">Search documentation</span>
              <span className="hidden text-muted lg:inline">⌘ K</span>
            </U.Button>
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
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
            </U.Button>
            <a href={github} className="hidden text-sm sm:block">
              GitHub
            </a>
            <U.Button
              tone="quiet"
              size="sm"
              className="md:hidden"
              aria-label="Open navigation"
              aria-expanded={mobile}
              onClick={() => setMobile(!mobile)}
            >
              <Menu className="size-4" />
            </U.Button>
          </div>
        </div>
        {mobile && (
          <nav className="shell grid gap-4 pb-6 text-sm" aria-label="Mobile">
            {["Docs", "Components", "Blocks", "Themes"].map((l) => (
              <a
                key={l}
                href={
                  "#/" +
                  (l === "Components" ? "components/button" : l.toLowerCase())
                }
              >
                {l}
              </a>
            ))}
            <a href={github}>GitHub</a>
          </nav>
        )}
      </header>
      <main id="content" tabIndex={-1}>
        {route.startsWith("/components/") ? (
          <ComponentPage id={route.split("/")[2]} />
        ) : route === "/docs" ? (
          <Docs />
        ) : route === "/themes" ? (
          <Themes />
        ) : route === "/blocks" ? (
          <Blocks />
        ) : (
          <Home />
        )}
      </main>
      <footer className="border-t border-line">
        <div className="shell flex flex-wrap items-center justify-between gap-6 py-9 text-xs text-muted">
          <p>
            Aretusa, by{" "}
            <a
              href="https://github.com/emanueledenaro"
              className="text-ink underline underline-offset-4"
            >
              TrinacriaLabs
            </a>
            .
          </p>
          <div className="flex gap-5">
            <a href={github + "/blob/main/LICENSE"}>MIT License</a>
            <a href={github + "/releases"}>Releases</a>
            <a href={github + "/issues"}>Feedback</a>
          </div>
        </div>
      </footer>
      <U.Modal
        open={search}
        onOpenChange={setSearch}
        title="Find your next building block."
        description="Search the Aretusa catalog."
      >
        <U.Input
          aria-label="Search components"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Dialog, input, card…"
        />
        <div className="mt-4 max-h-72 overflow-auto">
          {catalog
            .filter((c) =>
              (c.name + " " + c.description)
                .toLowerCase()
                .includes(q.toLowerCase()),
            )
            .map((c) => (
              <a
                key={c.id}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-sm hover:bg-surface focus:bg-surface"
                href={"#/components/" + c.id}
                onClick={() => setSearch(false)}
              >
                {c.name}
                <span className="text-xs text-muted">
                  {categories[c.module]}
                </span>
              </a>
            ))}
          {!catalog.some((c) =>
            (c.name + " " + c.description)
              .toLowerCase()
              .includes(q.toLowerCase()),
          ) && (
            <p role="status" className="py-6 text-center text-sm text-muted">
              No results. Try another name.
            </p>
          )}
        </div>
      </U.Modal>
    </>
  );
}
