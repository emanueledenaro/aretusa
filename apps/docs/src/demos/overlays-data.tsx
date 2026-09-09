import * as React from "react";
import * as U from "../../../../packages/ui/src/index";

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
