import * as React from "react";
import * as U from "../../../packages/ui/src/index";
import { Heart, Plus, ArrowUpRight } from "lucide-react";
const choices = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
];
const rows = [
  { id: "1", name: "Field notes", status: "Published", amount: 120 },
  { id: "2", name: "Quiet interfaces", status: "Draft", amount: 85 },
  { id: "3", name: "The workshop", status: "Published", amount: 240 },
  { id: "4", name: "Open studio", status: "Review", amount: 160 },
  { id: "5", name: "Small details", status: "Draft", amount: 40 },
  { id: "6", name: "A new beginning", status: "Published", amount: 300 },
];
export function Demo({ id }: { id: string }) {
  const [value, setValue] = React.useState(""),
    [flag, setFlag] = React.useState(false),
    [page, setPage] = React.useState(1),
    [notice, setNotice] = React.useState(""),
    [date, setDate] = React.useState<Date | undefined>();
  const options = [
    { label: "Rename", onSelect: () => setNotice("Rename selected") },
    { label: "Duplicate", onSelect: () => setNotice("Duplicate selected") },
    { label: "Unavailable", onSelect: () => {}, disabled: true },
  ];
  let content: React.ReactNode;
  switch (id) {
    case "button":
      content = (
        <div className="flex flex-wrap gap-3">
          <U.Button onClick={() => setNotice("Primary action selected")}>
            Create something <Plus className="size-4" />
          </U.Button>
          <U.Button
            tone="outline"
            onClick={() => setNotice("Secondary action selected")}
          >
            Explore
          </U.Button>
          <U.Button tone="accent" onClick={() => setFlag(!flag)}>
            {flag ? "Following" : "Follow"}
          </U.Button>
          <U.Button disabled>Disabled</U.Button>
          <U.Button loading>Saving</U.Button>
        </div>
      );
      break;
    case "button-group":
      content = (
        <U.ButtonGroup label="Formatting">
          <U.Button tone="outline" onClick={() => setNotice("Draft saved")}>
            Save draft
          </U.Button>
          <U.Button onClick={() => setNotice("Published locally")}>
            Publish
          </U.Button>
        </U.ButtonGroup>
      );
      break;
    case "card":
      content = (
        <U.Card>
          <U.CardHeader>
            <U.Badge>In progress</U.Badge>
            <U.CardTitle>A little room for ideas.</U.CardTitle>
            <U.CardDescription>
              Keep notes, share work and make your next step a thoughtful one.
            </U.CardDescription>
          </U.CardHeader>
          <U.CardFooter>
            <U.Button onClick={() => setNotice("Workspace opened")}>
              Open workspace
            </U.Button>
          </U.CardFooter>
        </U.Card>
      );
      break;
    case "badge":
      content = (
        <div className="flex gap-3">
          <U.Badge>Draft</U.Badge>
          <U.Badge tone="success">Published</U.Badge>
          <U.Badge tone="warning">Review</U.Badge>
          <U.Badge tone="danger">Failed</U.Badge>
        </div>
      );
      break;
    case "avatar":
      content = (
        <div className="flex gap-3">
          <U.Avatar name="Alex Rivers" />
          <U.Avatar name="Sam Chen" />
          <U.Avatar name="Image fallback" />
        </div>
      );
      break;
    case "aspect-ratio":
      content = (
        <U.AspectRatio className="grid place-items-center bg-surface">
          <span className="font-editorial text-3xl">Space to create.</span>
        </U.AspectRatio>
      );
      break;
    case "direction":
      content = (
        <U.Direction dir="rtl">
          <U.Card>A right-to-left content container.</U.Card>
        </U.Direction>
      );
      break;
    case "item":
      content = (
        <U.Item
          title="Project notes"
          description="Updated just now"
          action={
            <U.Button tone="outline" onClick={() => setNotice("Notes opened")}>
              Open
            </U.Button>
          }
        />
      );
      break;
    case "kbd":
      content = (
        <p className="text-sm">
          Press <U.Kbd>⌘</U.Kbd> <U.Kbd>K</U.Kbd> to search.
        </p>
      );
      break;
    case "separator":
      content = (
        <>
          <p className="text-sm">Your workspace</p>
          <U.Separator />
          <p className="text-sm text-muted">A new section starts here.</p>
        </>
      );
      break;
    case "skeleton":
      content = (
        <div className="space-y-3" aria-label="Loading example">
          <U.Skeleton className="h-9 w-1/2" />
          <U.Skeleton />
          <U.Skeleton className="w-3/4" />
        </div>
      );
      break;
    case "spinner":
      content = <U.Spinner label="Preparing your workspace" />;
      break;
    case "progress":
      content = (
        <div className="space-y-4">
          <U.Progress value={page * 20} label="Import progress" />
          <U.Button
            tone="outline"
            onClick={() => setPage((p) => (p === 5 ? 1 : p + 1))}
          >
            Advance
          </U.Button>
        </div>
      );
      break;
    case "empty":
      content = (
        <U.Empty title="A fresh page.">
          Your first project belongs here.
          <div className="mt-4">
            <U.Button onClick={() => setNotice("Project created")}>
              Create project
            </U.Button>
          </div>
        </U.Empty>
      );
      break;
    case "alert":
      content = (
        <div className="space-y-3">
          <U.Alert title="Your work is saved" tone="success">
            You can safely close this page.
          </U.Alert>
          <U.Alert title="Something needs attention" tone="error">
            Review the highlighted field and try again.
          </U.Alert>
        </div>
      );
      break;
    case "typography":
      content = (
        <div className="space-y-5">
          <U.Typography as="h2" editorial>
            Thoughtful by nature.
          </U.Typography>
          <U.Typography>
            Clear typography gives ideas room to breathe. DM Sans for utility,
            Lora for editorial moments.
          </U.Typography>
        </div>
      );
      break;
    case "input":
      content = (
        <div className="space-y-4">
          <U.Field label="Project name">
            <U.Input placeholder="A new beginning" />
          </U.Field>
          <U.Input
            aria-label="Disabled input"
            disabled
            placeholder="Unavailable"
          />
        </div>
      );
      break;
    case "textarea":
      content = (
        <U.Field
          label="Your notes"
          hint="Write as much or as little as you need."
        >
          <U.Textarea placeholder="Start with an idea…" />
        </U.Field>
      );
      break;
    case "field":
      content = (
        <U.Field
          label="Email"
          hint="Use your work address."
          error="Enter a valid email address."
        >
          <U.Input type="email" defaultValue="not-an-email" />
        </U.Field>
      );
      break;
    case "label":
      content = (
        <div className="space-y-2">
          <U.Label htmlFor="demo-label">Display name</U.Label>
          <U.Input id="demo-label" placeholder="Your name" />
        </div>
      );
      break;
    case "input-group":
      content = (
        <U.InputGroup prefix="https://" suffix=".design">
          <U.Input aria-label="Website name" placeholder="your-studio" />
        </U.InputGroup>
      );
      break;
    case "checkbox":
      content = (
        <div className="space-y-4">
          <U.Checkbox
            label="I agree to the terms"
            checked={flag}
            onCheckedChange={(v) => setFlag(v === true)}
          />
          <U.Checkbox label="Unavailable option" disabled />
        </div>
      );
      break;
    case "switch":
      content = (
        <U.Switch
          label="Email notifications"
          checked={flag}
          onCheckedChange={setFlag}
        />
      );
      break;
    case "radio-group":
      content = (
        <U.RadioGroup
          label="Your discipline"
          options={choices}
          defaultValue="design"
        />
      );
      break;
    case "select":
      content = (
        <U.Select
          label="Your discipline"
          options={choices}
          value={value}
          onValueChange={setValue}
        />
      );
      break;
    case "native-select":
      content = (
        <U.Field label="Discipline">
          <U.NativeSelect options={choices} />
        </U.Field>
      );
      break;
    case "combobox":
      content = (
        <U.Combobox
          label="Search a discipline"
          placeholder="Type or choose…"
          options={["Design", "Engineering", "Product", "Research"]}
        />
      );
      break;
    case "slider":
      content = (
        <div className="space-y-3">
          <p className="text-sm">Contrast preference</p>
          <U.Slider label="Contrast preference" defaultValue={[40]} />
        </div>
      );
      break;
    case "calendar":
      content = <U.Calendar mode="single" selected={date} onSelect={setDate} />;
      break;
    case "date-picker":
      content = (
        <U.Field label="Start date">
          <U.DatePicker />
        </U.Field>
      );
      break;
    case "input-otp":
      content = (
        <div className="space-y-3">
          <U.InputOTP value={value} onChange={setValue} />
          <p className="text-xs text-muted">
            Six digits. Paste and device autofill are supported.
          </p>
        </div>
      );
      break;
    case "toggle":
      content = (
        <U.Toggle
          aria-label="Favorite"
          pressed={flag}
          onPressedChange={setFlag}
        >
          <Heart className="size-4" />
          Favorite
        </U.Toggle>
      );
      break;
    case "toggle-group":
      content = (
        <U.ToggleGroup
          label="View density"
          options={["Comfortable", "Compact", "Spacious"]}
          value={value}
          onValueChange={setValue}
        />
      );
      break;
    case "dialog":
    case "sheet":
    case "drawer": {
      const Component =
        id === "dialog" ? U.Modal : id === "sheet" ? U.Sheet : U.Drawer;
      content = (
        <Component
          title="Make it yours."
          description="A focused space for a small change."
          trigger={<U.Button>Open {id}</U.Button>}
        >
          <div className="space-y-5">
            <U.Field label="Display name">
              <U.Input placeholder="Alex Rivers" />
            </U.Field>
            <U.Field label="About you">
              <U.Textarea placeholder="A few words…" />
            </U.Field>
            <U.Button onClick={() => setNotice("Changes saved in the example")}>
              Save changes
            </U.Button>
          </div>
        </Component>
      );
      break;
    }
    case "alert-dialog":
      content = (
        <U.AlertDialog
          trigger={<U.Button tone="danger">Archive project</U.Button>}
          title="Archive this project?"
          description="This example only displays a confirmation. No data will be deleted."
          confirmLabel="Archive"
          onConfirm={() => setNotice("Project archived in the example")}
        />
      );
      break;
    case "popover":
      content = (
        <U.Popover
          label="Quick settings"
          trigger={<U.Button tone="outline">Quick settings</U.Button>}
        >
          <U.Field label="Width">
            <U.Input defaultValue="320" />
          </U.Field>
        </U.Popover>
      );
      break;
    case "tooltip":
      content = (
        <U.Tooltip content="Add this project to your favorites">
          <U.Button tone="outline" aria-label="Favorite">
            <Heart className="size-4" />
          </U.Button>
        </U.Tooltip>
      );
      break;
    case "hover-card":
      content = (
        <U.HoverCard
          trigger={
            <a
              href="https://github.com/emanueledenaro/aretusa"
              className="underline"
            >
              Aretusa
            </a>
          }
        >
          <p className="font-editorial text-xl">Aretusa</p>
          <p className="mt-2 text-sm text-muted">
            Original interfaces, by TrinacriaLabs.
          </p>
        </U.HoverCard>
      );
      break;
    case "toast":
      content = <U.ToastDemo />;
      break;
    case "accordion":
      content = (
        <U.Accordion
          items={[
            {
              title: "Can I customize the source?",
              content:
                "Yes. The source is yours to adapt under the MIT license.",
            },
            {
              title: "Does it support keyboard navigation?",
              content:
                "Each interactive component documents its keyboard behavior.",
            },
          ]}
        />
      );
      break;
    case "collapsible":
      content = (
        <U.Collapsible title="Show project details">
          A few additional details, revealed when you need them.
        </U.Collapsible>
      );
      break;
    case "tabs":
      content = (
        <U.Tabs
          items={[
            {
              value: "overview",
              label: "Overview",
              content: <p className="text-sm">Everything you need to begin.</p>,
            },
            {
              value: "activity",
              label: "Activity",
              content: (
                <p className="text-sm">Your recent changes appear here.</p>
              ),
            },
            {
              value: "settings",
              label: "Settings",
              content: <U.Switch label="Notifications" />,
            },
          ]}
        />
      );
      break;
    case "dropdown-menu":
      content = (
        <U.DropdownMenu
          trigger={<U.Button tone="outline">Project actions</U.Button>}
          items={options}
        />
      );
      break;
    case "context-menu":
      content = (
        <U.ContextMenu items={options}>
          <div
            className="rounded-xl border border-dashed border-line p-10 text-center text-sm"
            tabIndex={0}
          >
            Right-click or use your context-menu key here.
          </div>
        </U.ContextMenu>
      );
      break;
    case "menubar":
      content = (
        <U.Menubar
          menus={[
            { label: "File", items: options },
            { label: "Edit", items: options },
          ]}
        />
      );
      break;
    case "navigation-menu":
      content = (
        <U.NavigationMenu
          items={[
            { label: "Components", href: "#/components/button" },
            { label: "Blocks", href: "#/blocks" },
            { label: "Documentation", href: "#/docs" },
          ]}
        />
      );
      break;
    case "breadcrumb":
      content = (
        <U.Breadcrumb
          items={[
            { label: "Home", href: "#/" },
            { label: "Components", href: "#/components/button" },
            { label: "Breadcrumb" },
          ]}
        />
      );
      break;
    case "pagination":
      content = <U.Pagination page={page} total={5} onChange={setPage} />;
      break;
    case "shimmer":
      content = <div className="w-full space-y-6"><U.Switch label="Pause shimmer" checked={flag} onCheckedChange={setFlag} /><p className="text-lg"><U.Shimmer enabled={!flag}>Preparing your next idea.</U.Shimmer></p><p className="max-w-64 font-editorial text-2xl"><U.Shimmer enabled={!flag} speed={4}>A little light across words that have room to breathe.</U.Shimmer></p><U.Marker><U.Shimmer enabled={!flag}>Reading project notes</U.Shimmer></U.Marker></div>;
      break;
    case "scroll-area":
      content = (
        <div className="w-full space-y-4">
        <U.Checkbox label="Smart edge fade" checked={flag} onCheckedChange={value => setFlag(value === true)} />
        <U.ScrollArea fade={flag} label="Example chapters" className="h-60 rounded-xl border border-line bg-paper">
          <div className="space-y-3 pe-4">
            {Array.from({ length: 12 }, (_, i) => (
              <U.Item
                key={i}
                title={"Chapter " + (i + 1)}
                description="A small detail worth exploring."
              />
            ))}
          </div>
        </U.ScrollArea>
        </div>
      );
      break;
    case "sidebar":
      content = (
        <U.Sidebar
          items={[
            { label: "Overview", href: "#/components/sidebar" },
            { label: "Projects", href: "#/blocks" },
          ]}
        >
          <U.CardTitle>Your workspace</U.CardTitle>
          <p className="mt-3 text-sm text-muted">
            A responsive shell with room for your work.
          </p>
        </U.Sidebar>
      );
      break;
    case "command":
      content = <U.Command items={options} />;
      break;
    case "table":
      content = (
        <U.Table
          caption="Project overview"
          columns={["Project", "Status", "Budget"]}
          rows={rows.slice(0, 3).map((r) => [r.name, r.status, "€" + r.amount])}
        />
      );
      break;
    case "data-table":
      content = <U.DataTable rows={rows} />;
      break;
    case "chart":
      content = (
        <U.Chart
          label="Weekly contributions"
          data={[
            { name: "Mon", value: 12 },
            { name: "Tue", value: 28 },
            { name: "Wed", value: 21 },
            { name: "Thu", value: 45 },
            { name: "Fri", value: 38 },
          ]}
        />
      );
      break;
    case "carousel":
      content = (
        <U.Carousel
          slides={[
            {
              title: "A space for ideas.",
              description: "Start with what matters.",
            },
            {
              title: "Make a little progress.",
              description: "One thoughtful step at a time.",
            },
            {
              title: "Build it together.",
              description: "Share the work and what you learn.",
            },
          ]}
        />
      );
      break;
    case "resizable":
      content = (
        <U.Resizable
          left={<p className="text-sm">Navigation</p>}
          right={<p className="text-sm">Your main workspace</p>}
        />
      );
      break;
    case "attachment":
      content = flag ? (
        <U.Empty title="Attachment removed" />
      ) : (
        <U.Attachment name="project-notes.pdf" onRemove={() => setFlag(true)} />
      );
      break;
    case "bubble":
      content = (
        <div className="space-y-3">
          <U.Bubble>What are we working on today?</U.Bubble>
          <U.Bubble side="end">A small idea with a lot of potential.</U.Bubble>
        </div>
      );
      break;
    case "marker":
      content = <U.Marker>Today</U.Marker>;
      break;
    case "message":
      content = (
        <U.Message author="Alex" time="09:41">
          I have a first draft to share.
        </U.Message>
      );
      break;
    case "message-scroller":
      content = (
        <U.MessageScroller>
          {Array.from({ length: 6 }, (_, i) => (
            <U.Message key={i} author={i % 2 ? "Sam" : "Alex"}>
              A thought for our next iteration, number {i + 1}.
            </U.Message>
          ))}
        </U.MessageScroller>
      );
      break;
    case "questionnaire":
      content = notice ? (
        <U.Alert title="Answers saved">{notice}</U.Alert>
      ) : (
        <U.Questionnaire
          questions={[
            {
              id: "focus",
              title: "What are you building?",
              options: ["A website", "An application", "A design system"],
            },
            {
              id: "priority",
              title: "What matters most?",
              options: ["Clarity", "Speed", "Flexibility"],
            },
          ]}
          onComplete={(a) => setNotice(Object.values(a).join(" · "))}
        />
      );
      break;
    default:
      content = <U.Empty title="Choose a component" />;
  }
  return (
    <div className="w-full">
      {content}
      {notice && id !== "questionnaire" && (
        <p className="mt-4 text-sm text-success" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
