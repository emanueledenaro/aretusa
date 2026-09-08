---
name: aretusa-review
description: Review an Aretusa component against its design and code contracts using rendered mobile/desktop states and public behavior evidence.
---

# Aretusa review

Read docs/quality-contract.md, docs/design-principles.md, docs/code-standards.md and the item's issue. Review the exact commit under consideration.

Capture and inspect the actual rendered example. Start at 320 and 390 CSS pixels, then tablet and desktop. Test container constraints, 200% text zoom, long content, light/dark and reduced motion. Use the matching WAI-ARIA pattern for relevant keyboard/focus behavior.

Assess visual hierarchy, optical spacing, alignment, typography, state contrast and action clarity. Test the task through both keyboard and touch-relevant interactions. Inspect the source API and consumer installation to catch behavior that a screenshot cannot reveal.

Record each finding with severity, state, concrete evidence, user impact and correction. Separate verified results from unperformed checks. P0/P1/P2 findings prevent release-ready; P3 deferrals require a reason.

Use docs/quality/evidence-template.md. A passing review must identify its commit and evidence. Do not infer a pass from the author's claim or from a smoke test.

