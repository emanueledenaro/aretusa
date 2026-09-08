---
name: aretusa-component
description: Build or refine an Aretusa component or block from its quality ticket, covering design, responsive behavior, public API and source distribution.
---

# Aretusa component

Read the repository's AGENTS.md, docs/design-principles.md, docs/code-standards.md and the item's issue before editing. Use docs/quality-contract.md as the completion contract.

1. Inspect the current source, rendered example, usage snippet and registry item. Identify the specific gaps; do not replace a component based on a generic aesthetic preference.
2. Define the required variants, states and smallest-container composition. Preserve the Aretusa identity and existing consumer contracts unless the ticket explicitly changes them.
3. Work one observable behavior at a time. For defects, reproduce the failure at the public interface before fixing it. Use shared tokens and Tailwind.
4. Inspect the rendered result on mobile before widening to desktop. Verify relevant touch, keyboard, focus, zoom, long-content and theme states.
5. Update source, demo, usage/API documentation and registry together. Typecheck the example and compile an installed consumer.
6. Fill docs/quality/evidence-template.md for the item. Leave unfinished gates explicit. Request review before release-ready; close the issue only when all applicable criteria have evidence.

Do not treat scope pressure or a same-day target as permission to lower the quality bar.

