import * as React from "react";
import * as U from "../../../../packages/ui/src/index";
import { Bold, Italic, Link2, Heart, Share2, Trash2 } from "lucide-react";

const paragraph =
  "The salt gardens sit below the old harbour wall, where the tide leaves a thin white line on the stones each morning. The printing room keeps its shutters half closed until noon.";

export function PopoverExample() {
  const [width, setWidth] = React.useState("320");
  const [saved, setSaved] = React.useState("");
  const [open, setOpen] = React.useState(false);
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <U.Popover
          trigger={<U.Button tone="outline">Frame settings</U.Button>}
          title="Frame settings"
          description="Changes apply to the selected frame only."
          open={open}
          onOpenChange={setOpen}
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSaved("Frame width set to " + width + " px");
              setOpen(false);
            }}
          >
            <U.Field label="Width" hint="Between 240 and 1440 pixels.">
              <U.Input inputMode="numeric" value={width} onChange={(event) => setWidth(event.target.value)} />
            </U.Field>
            <U.Switch label="Snap to grid" defaultChecked />
            <U.Button type="submit" className="w-full">
              Apply
            </U.Button>
          </form>
        </U.Popover>
        <U.Popover
          trigger={
            <U.Button tone="quiet" aria-label="Choose an accent colour">
              <span aria-hidden="true" className="size-4 rounded-full bg-terracotta" />
              Accent
            </U.Button>
          }
          label="Accent colour"
          width="sm"
          hideClose
        >
          <div className="grid grid-cols-4 gap-2">
            {["bg-terracotta", "bg-gold", "bg-chart-3", "bg-chart-4", "bg-chart-5", "bg-success", "bg-ink", "bg-muted"].map((tone) => (
              <button
                key={tone}
                type="button"
                aria-label={tone.replace("bg-", "") + " accent"}
                className={"flex size-11 items-center justify-center rounded-full " + tone + " hover:opacity-85"}
              />
            ))}
          </div>
        </U.Popover>
        <U.Popover trigger={<U.Button tone="quiet">Reading notes</U.Button>} title="Reading notes" side="top">
          <div className="space-y-3 text-sm leading-relaxed text-muted">
            {[0, 1, 2, 3, 4].map((n) => (
              <p key={n}>{paragraph}</p>
            ))}
          </div>
        </U.Popover>
      </div>
      <p aria-live="polite" className="min-h-6 text-sm text-muted">
        {saved}
      </p>
      <U.Dialog
        trigger={<U.Button tone="outline">Popover inside a dialog</U.Button>}
        title="Invite a member"
        description="The role popover stays inside the dialog and returns focus to its trigger."
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1">
            <U.Field label="Email">
              <U.Input type="email" placeholder="name@studio.example" />
            </U.Field>
          </div>
          <U.Popover trigger={<U.Button tone="outline">Role</U.Button>} title="Role" description="What the member can do." width="sm">
            <U.RadioGroup label="Role" options={[{ value: "viewer", label: "Viewer" }, { value: "editor", label: "Editor" }]} defaultValue="viewer" />
          </U.Popover>
        </div>
      </U.Dialog>
    </div>
  );
}

export function TooltipExample() {
  const [favorite, setFavorite] = React.useState(false);
  return (
    <div className="w-full space-y-6">
      <U.TooltipProvider>
        <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-1 rounded-xl border border-line bg-card p-1">
          <U.Tooltip content="Bold">
            <U.Button tone="quiet" aria-label="Bold"><Bold className="size-4" /></U.Button>
          </U.Tooltip>
          <U.Tooltip content="Italic">
            <U.Button tone="quiet" aria-label="Italic"><Italic className="size-4" /></U.Button>
          </U.Tooltip>
          <U.Tooltip content="Insert link">
            <U.Button tone="quiet" aria-label="Insert link"><Link2 className="size-4" /></U.Button>
          </U.Tooltip>
          <U.Separator className="mx-1 h-6" />
          <U.Tooltip content={favorite ? "Remove from favorites" : "Add to favorites"}>
            <U.Button tone="quiet" aria-pressed={favorite} aria-label="Favorite" onClick={() => setFavorite((value) => !value)}>
              <Heart className="size-4" fill={favorite ? "currentColor" : "none"} />
            </U.Button>
          </U.Tooltip>
          <U.Tooltip content="Select a block first">
            <U.Button tone="quiet" aria-label="Delete block" disabled><Trash2 className="size-4" /></U.Button>
          </U.Tooltip>
        </div>
      </U.TooltipProvider>
      <div className="flex flex-wrap items-center gap-3">
        <U.Tooltip content="Share a read-only link with anyone. Members keep their own permissions and the link can be revoked from the project settings." side="bottom">
          <U.Button tone="outline"><Share2 className="size-4" />Share</U.Button>
        </U.Tooltip>
        <U.Tooltip content="Opens the studio calendar" side="right">
          <a href="#calendar" className="text-sm underline underline-offset-4">Calendar</a>
        </U.Tooltip>
        <U.Tooltip content="Ortigia, Syracuse" side="left">
          <U.Button tone="secondary" size="sm">Location</U.Button>
        </U.Tooltip>
      </div>
      <p className="max-w-prose text-sm leading-relaxed text-muted">
        Tooltips add a hint to a control that already has a name. They open on focus without delay, close on Escape and never carry an action or content the task depends on. Touch users do not see them, so the toolbar buttons above keep their accessible names.
      </p>
    </div>
  );
}

export function HoverCardExample() {
  const [following, setFollowing] = React.useState(false);
  return (
    <div className="w-full space-y-6">
      <p className="max-w-prose text-[0.9375rem] leading-relaxed">
        The workshop notes were written by{" "}
        <U.HoverCard
          trigger={<a href="#alex-rivers" className="font-medium underline underline-offset-4 decoration-line hover:decoration-ink">Alex Rivers</a>}
        >
          <div className="flex items-start gap-3">
            <U.Avatar name="Alex Rivers" />
            <div className="min-w-0">
              <p className="font-editorial text-lg leading-snug">Alex Rivers</p>
              <p className="text-sm text-muted">Designer, Ortigia studio</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">Works on editorial systems and the salt garden archive. 42 notes this season.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <U.Button size="sm" tone={following ? "outline" : "primary"} onClick={() => setFollowing((value) => !value)}>
              {following ? "Following" : "Follow"}
            </U.Button>
            <U.Button size="sm" tone="quiet">Message</U.Button>
          </div>
        </U.HoverCard>{" "}
        during the spring residency, and the plates were proofed in{" "}
        <U.HoverCard trigger={<a href="#printing-room" className="font-medium underline underline-offset-4 decoration-line hover:decoration-ink">the printing room</a>} side="top" width="sm">
          <p className="font-editorial text-lg leading-snug">The printing room</p>
          <p className="mt-2 text-sm text-muted">A two-press studio on the ground floor. Open to members from Tuesday to Saturday.</p>
        </U.HoverCard>
        .
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <U.HoverCard
          trigger={<U.Button tone="secondary" size="sm">aretusa/main</U.Button>}
          align="start"
          width="lg"
        >
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Repository</p>
          <p className="mt-1 font-editorial text-lg leading-snug">emanueledenaro/aretusa</p>
          <p className="mt-2 text-sm text-muted">Original React components with an editorial identity. 64 capabilities, 8 blocks, MIT license.</p>
          <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div><dt className="text-muted">Stars</dt><dd className="font-medium tabular-nums">1,204</dd></div>
            <div><dt className="text-muted">Issues</dt><dd className="font-medium tabular-nums">37</dd></div>
            <div><dt className="text-muted">Updated</dt><dd className="font-medium">Today</dd></div>
          </dl>
        </U.HoverCard>
        <div className="w-60 max-w-full rounded-xl border border-dashed border-line p-3 text-sm text-muted">
          Narrow parent:{" "}
          <U.HoverCard trigger={<a href="#harbour" className="font-medium text-ink underline underline-offset-4">arrival at the harbour and the salt gardens</a>} side="bottom" align="start">
            <p className="text-sm">The card is placed by the viewport, so a narrow parent never clips it.</p>
          </U.HoverCard>
        </div>
      </div>
      <p className="max-w-prose text-sm leading-relaxed text-muted">
        Hover cards enrich a link that already works on its own. They open on focus as well as hover, close on blur or when the pointer leaves, and never hold the only route to an action.
      </p>
    </div>
  );
}

function ToastControls() {
  const { toast, dismiss } = useToastApi();
  const [count, setCount] = React.useState(0);
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <U.Button
          onClick={() =>
            toast({ title: "Draft saved", description: "Your notes are stored on this device.", tone: "success" })
          }
        >
          Save draft
        </U.Button>
        <U.Button
          tone="outline"
          onClick={() => {
            const n = count + 1;
            setCount(n);
            toast({
              title: "Note " + n + " moved to the archive",
              tone: "danger",
              duration: 8000,
              action: { label: "Undo", onClick: () => setCount((value) => value - 1) },
            });
          }}
        >
          Archive a note
        </U.Button>
        <U.Button tone="quiet" onClick={() => toast({ title: "Link copied", duration: 2500 })}>
          Copy link
        </U.Button>
        <U.Button
          tone="quiet"
          onClick={() =>
            toast({
              title: "The printing room closes early on Saturday",
              description: paragraph,
              duration: Infinity,
            })
          }
        >
          Long message
        </U.Button>
        <U.Button tone="quiet" onClick={() => dismiss()}>
          Dismiss all
        </U.Button>
      </div>
      <p className="max-w-prose text-sm leading-relaxed text-muted">
        Notifications stack in the corner, pause while hovered or focused and can be reached with F8. Danger and action toasts are announced as foreground messages; the others wait for a quiet moment. Three stay visible at once; the oldest leaves first. Archived in this example: {count}.
      </p>
    </div>
  );
}
function useToastApi() {
  return U.useToast();
}
export function ToastExample() {
  return (
    <U.ToastProvider>
      <ToastControls />
    </U.ToastProvider>
  );
}
