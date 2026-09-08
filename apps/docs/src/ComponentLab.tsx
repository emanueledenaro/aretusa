import * as React from "react";
import { ArrowRight, Plus, Heart } from "lucide-react";
import { Button, type ButtonProps } from "../../../packages/ui/src/basic";
const tones: NonNullable<ButtonProps["tone"]>[] = [
  "primary",
  "secondary",
  "outline",
  "quiet",
  "danger",
  "accent",
];
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
          <div key={tone} className="rounded-xl border border-line p-5">
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
        </div>
      </div>
    </section>
  );
}
