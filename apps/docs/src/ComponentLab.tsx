import * as React from "react";
import { ArrowRight, Plus, Heart } from "lucide-react";
import { Button, type ButtonProps } from "../../../packages/ui/src/basic";
import { Avatar } from "../../../packages/ui/src/basic";
import { Input, Field } from "../../../packages/ui/src/forms";
const tones: NonNullable<ButtonProps["tone"]>[] = [
  "primary",
  "secondary",
  "outline",
  "quiet",
  "danger",
  "accent",
];
export function AvatarLab() {
  const [source, setSource] = React.useState(""),
    [draft, setDraft] = React.useState("");
  return (
    <section className="mt-12 space-y-7" aria-label="Avatar state examples">
      <div>
        <h2 className="doc-h2">Scale, shape & fallback</h2>
        <p className="text-sm leading-relaxed text-muted">
          A quiet identity element that keeps its footprint while an image loads
          or fails.
        </p>
      </div>
      <div className="rounded-xl border border-line p-5">
        <h3 className="mb-5 text-sm font-medium">A consistent scale</h3>
        <div className="flex flex-wrap items-end gap-6">
          {(["sm", "md", "lg", "xl"] as const).map((size) => (
            <div key={size} className="space-y-3 text-center">
              <Avatar name="Alex Rivers" size={size} />
              <p className="text-[10px] text-muted">{size}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-line p-5">
        <h3 className="mb-5 text-sm font-medium">Shape and missing names</h3>
        <div className="flex flex-wrap items-center gap-5">
          <Avatar name="Sam Chen" shape="rounded" size="lg" />
          <Avatar name="  " />
          <Avatar name="  Alex   Rivers " />
        </div>
      </div>
      <div className="rounded-xl border border-line p-5">
        <h3 className="mb-5 text-sm font-medium">Alongside a visible name</h3>
        <div className="flex items-center gap-3">
          <Avatar name="Alex Rivers" decorative />
          <div>
            <p className="text-sm font-medium">Alex Rivers</p>
            <p className="text-xs text-muted">
              The avatar is decorative in this composition.
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-line p-5">
        <h3 className="mb-5 text-sm font-medium">Try an image source</h3>
        <div className="mb-5">
          <Avatar name="Your profile" src={source || undefined} size="lg" />
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSource(draft);
          }}
        >
          <Field label="Image URL" hint="The URL is used only by this preview.">
            <Input
              type="url"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="https://…"
            />
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button type="submit">Load image</Button>
            <Button
              tone="outline"
              onClick={() => {
                setDraft("");
                setSource("");
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
export function ButtonLab() {
  const [pending, setPending] = React.useState(false),
    [zoom, setZoom] = React.useState(false),
    [selected, setSelected] = React.useState(false);
  return (
    <section className="mt-12 space-y-8" aria-label="Button state examples">
      <div>
        <h2 className="doc-h2">States & proportions</h2>
        <p className="text-sm leading-relaxed text-muted">
          The same anatomy across tones and states. Loading keeps the control's
          dimensions and accessible name.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {tones.map((tone) => (
          <div
            key={tone}
            data-tone={tone}
            className="rounded-xl border border-line p-5"
          >
            <h3 className="mb-4 text-xs font-medium capitalize">{tone}</h3>
            <div className="flex flex-wrap gap-3">
              <Button tone={tone}>
                Continue <ArrowRight className="size-4" />
              </Button>
              <Button tone={tone} disabled>
                Unavailable
              </Button>
              <Button tone={tone} loading>
                Continue
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-line p-5">
        <h3 className="mb-4 text-sm font-medium">
          Loading without layout movement
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button data-testid="stable-loading-button" loading={pending}>
            Save changes
          </Button>
          <Button
            tone="outline"
            aria-pressed={pending}
            onClick={() => setPending((v) => !v)}
          >
            Toggle pending state
          </Button>
        </div>
      </div>
      <div className="rounded-xl border border-line p-5">
        <h3 className="mb-4 text-sm font-medium">Size and icon rhythm</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button aria-label="Add item" tone="outline">
            <Plus className="size-4" />
          </Button>
          <Button
            aria-label="Favorite"
            aria-pressed={selected}
            tone={selected ? "primary" : "outline"}
            onClick={() => setSelected((v) => !v)}
          >
            <Heart className="size-4" />
          </Button>
        </div>
      </div>
      <div className="rounded-xl border border-line p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-medium">
            Narrow container & enlarged text
          </h3>
          <Button
            size="sm"
            tone="outline"
            aria-pressed={zoom}
            onClick={() => setZoom((v) => !v)}
          >
            {zoom ? "Use regular text" : "Use 200% text"}
          </Button>
        </div>
        <div
          data-testid="narrow-button-parent"
          className="max-w-full space-y-4 rounded-lg border border-dashed border-line p-3"
          style={{ width: 240 }}
        >
          <Button
            data-testid="long-label-button"
            className="w-full"
            style={{ fontSize: zoom ? "28px" : "14px", lineHeight: 1.4 }}
          >
            Save changes and return to the project overview
          </Button>
          <Button
            tone="outline"
            className="w-full"
            style={{ fontSize: zoom ? "28px" : "14px", lineHeight: 1.4 }}
          >
            ContinueWithAnUnbrokenVeryLongLabel
          </Button>
          <Button
            data-testid="long-icon-button"
            tone="secondary"
            className="w-full"
            style={{ fontSize: zoom ? "28px" : "14px", lineHeight: 1.4 }}
          >
            Continue to the next stage of the project{" "}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
