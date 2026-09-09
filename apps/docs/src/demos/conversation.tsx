import * as React from "react";
import * as U from "../../../../packages/ui/src/index";

export function BubbleExample() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-[1fr_240px]">
      <div className="flex min-w-0 flex-col gap-3">
        <U.Bubble>What are we working on today?</U.Bubble>
        <U.Bubble side="end">A small idea with a lot of potential. I sketched two directions and I would like your opinion before Friday.</U.Bubble>
        <U.Bubble>
          <p>Send the notes to https://aretusa.example/workspace/prints/spring-collection-2026/proofs-and-margins</p>
          <p>
            Run <code>npm run check</code> and open <a href="#preview">the preview</a> when it finishes.
          </p>
          <pre>
            <code>{"npm run registry:build\nnpm run typecheck && npx vitest run"}</code>
          </pre>
        </U.Bubble>
        <U.Bubble side="end">
          <p>Done. Two follow ups:</p>
          <ul>
            <li>Tighten the margins on the poster proof.</li>
            <li>Ask the printer about the cream paper stock.</li>
          </ul>
        </U.Bubble>
      </div>
      <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-dashed border-line p-3">
        <p className="text-xs text-muted">240px parent</p>
        <U.Bubble>Antidisestablishmentarianism is a long word.</U.Bubble>
        <U.Bubble side="end">Noted, will keep it short.</U.Bubble>
      </div>
    </div>
  );
}
