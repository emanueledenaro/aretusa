# Parallel ticket execution

Status: the maintainer approved Astra workers in isolated local worktrees, with review by the main chat before integration. Use gpt-6-astra for this batch. Record dispatch identities and branches separately; approval alone does not prove a worker started.

## First batch

| Ticket | Worker-owned paths | Deliverable |
| --- | --- | --- |
| #28 Calendar | Calendar implementation in `packages/ui/src/forms.tsx`, `tests/calendar*.test.tsx`, `docs/quality/calendar-review.md` | Calendar feature matrix, corrected public behavior, focused tests and rendered review |
| #91 Scroll fade | `packages/ui/src/scroll-fade.*`, ScrollArea integration in `packages/ui/src/navigation.tsx`, `tests/scroll-fade*.test.tsx`, `docs/quality/scroll-fade-review.md` | Standalone utility with both axes, resize/content changes, RTL, enable/disable and cleanup |
| #88 React Hook Form | `packages/ui/src/react-hook-form.*`, `examples/react-hook-form/`, `docs/forms/react-hook-form.md`, `docs/quality/react-hook-form-review.md` | Working integration with validation, focus, submit lifecycle, reset/defaults and field arrays |

The independent example may have its own package manifest and lockfile. Shared workspace dependency changes belong to the coordinator.

## Worker contract

1. Start from the coordinator's recorded commit in a separate branch/worktree. Read AGENTS.md, the assigned ticket and the Aretusa component skill. Follow the implement flow with test-driven slices and standards/spec review.
2. Work only the assigned ticket and paths. Preserve unrelated behavior in shared source modules. Report any necessary ownership expansion before modifying another worker's area.
3. Run focused tests and TypeScript during implementation, then the applicable full checks. Inspect rendered behavior when tools permit; report missing browser evidence explicitly.
4. Commit and push the ticket branch. Never push main, close the ticket, merge another branch or claim release readiness from a build alone.
5. Return base/head SHAs, changed files, commands and results, browser evidence, limitations and exact integration needs. Keep source work distinct from unperformed packaging and release steps.

## Coordinator-owned integration

The main chat owns `catalog.ts`, `index.ts`, the documentation router/sidebar, shared styles/tokens, root package manifest/lockfile, generated registry and quality coverage/index. Workers submit precise additions for those files rather than racing to edit them.

After each worker finishes, the main chat reads the diff against its recorded base, reviews standards and ticket acceptance, reproduces tests, inspects visual states and handles any defects with the worker. Only then integrate the branch and its shared-file wiring. Rebuild the registry, compile public examples and a clean consumer, run CI, commit/push integration and verify deployment separately.

Close a ticket only when its complete acceptance evidence exists. A returned worker result is a review request, not automatic approval. Review deliveries as they arrive while other workers continue; do not wait for the entire batch to finish before reviewing the first result.
