# Aretusa product specification

## Problem statement

Developers need a coherent set of original interface elements they can inspect, install, modify and compose across projects. A disconnected collection of styled controls does not provide a reliable adoption path.

## Solution

Aretusa is an open-source product by TrinacriaLabs: React/TypeScript components and blocks, Tailwind themes, a browsable documentation website, live previews, complete source, a versioned registry and an original source installer. Public identity and documentation are entirely Aretusa.

## User stories

1. As a developer, I can understand the product and see real examples before installing.
2. As a developer, I can search components and navigate directly to their documentation.
3. As a developer, I can switch preview and source without losing the selected component.
4. As a developer, I can install one item with only its declared dependencies.
5. As a developer, I can install manually using the same source.
6. As a developer, I can inspect an installation before files are written.
7. As a developer, my modified files survive an attempted update.
8. As a developer, I receive actionable errors for missing configuration or incompatible input.
9. As a designer, I can use a coherent light/dark token system.
10. As a designer, I can adjust typography, color and radius through theme tokens.
11. As a keyboard user, I can operate dialogs, menus, select controls and tabs.
12. As a screen-reader user, controls expose labels, state and helpful descriptions.
13. As a developer, I can compose forms with validation, error, disabled and loading states.
14. As a developer, I can build editorial and application sections from documented blocks.
15. As a developer, I can see empty, loading and error examples.
16. As a maintainer, I can validate registry integrity and reproducibility in CI.
17. As a contributor, I can run examples and tests locally.
18. As a consumer, I can understand what changed in a release.
19. As a consumer, I can use Aretusa independently of TrinacriaLabs community membership.
20. As a developer, I can verify compatibility in a clean example app.
21. As an agent, I can read structured metadata and concise usage documentation.
22. As a mobile user, I can browse docs and try examples without clipped controls.
23. As a developer, I can copy source and install commands with visible feedback.
24. As a maintainer, I can distinguish implemented, verified and planned capabilities.
25. As a visitor, I can reach GitHub and contributor documentation from the site.

## Implementation decisions

- React, TypeScript and Tailwind. One original editorial theme with light and dark modes.
- Headless primitives for complex interaction; original visual components and composition wrappers.
- Source-first registry and CLI owned by Aretusa; no dependency on a third-party component generator.
- Documentation and examples generated from a shared catalog.
- Public website is separate from TrinacriaLabs community site.
- English public documentation and API; internal project coordination in Italian.
- MIT license. Preserve third-party dependency notices.
- CLI init, list, view, add, dry-run and registry validation/build; safe paths, dependency resolution and conflicts are explicit.
- React/Vite consumer first; additional frameworks only claimed after verification.
- Component catalog covers foundational controls, forms, navigation, overlays, feedback, data/media and conversation patterns. Track all 64 requested catalog capabilities separately.
- GitHub release is separate from npm publication and website deployment.

## Testing decisions

Test at public component interaction, CLI process/file output and browser navigation boundaries. Focus on observable behavior rather than implementation snapshots. Use clean temporary consumer projects, keyboard/focus tests, registry validation, build/type checks and browser checks at desktop/mobile sizes. No prior tests exist in this new repository.

## Out of scope

Community admission backend and private candidate data are outside Aretusa. Paid infrastructure, domain purchases and third-party commercial integrations are not needed for the initial release. Advanced integrations cannot be advertised until implemented and checked.

## Further notes

The maintainer authorized autonomous ordinary implementation, ticket management and public open-source repository setup. The delivery target is today; progress is measured by verified capabilities rather than a claim of complete equivalence with an evolving external product.

