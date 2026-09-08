# Aretusa

Build original React/TypeScript components styled with Tailwind. Public identity is Aretusa by TrinacriaLabs. Read docs/spec.md before implementation and docs/adr/ before changing distribution or component contracts.

Keep internal competitive research outside this public repository. Preserve dependency licenses and notices. Components may use headless accessibility primitives; visual components and documentation are authored here.

Test public behavior: keyboard/focus interactions, registry installation in a clean project, conflict handling, rendered documentation. A component is ready only when source, preview, documentation and installation agree. Do not close a ticket on code existence alone.

For component or block changes, apply docs/quality-contract.md. Build from narrow mobile layouts upward; inspect real rendered examples before claiming visual quality.

## Agent skills

### Issue tracker

GitHub Issues in emanueledenaro/aretusa. See docs/agents/issue-tracker.md.

### Triage labels

Use the five canonical labels. See docs/agents/triage-labels.md.

### Domain docs

Single-context glossary and root ADRs. See docs/agents/domain.md.

## Design and engineering quality

For visual decisions, read docs/design-principles.md. For component API, implementation, dependencies or tests, read docs/code-standards.md. Apply both to every component and composed section.

Use the repository-local skills:

- .agents/skills/aretusa-component/SKILL.md for implementing a component ticket.
- .agents/skills/aretusa-review/SKILL.md for rendered design and behavior review.
- .agents/skills/aretusa-release/SKILL.md before a ready release or completion claim.

Track every catalog item in docs/quality/coverage.json. Keep a separate issue and evidence record per component/block. All applicable gates must pass before release-ready. Claims of high design quality require inspection of actual states, not catalog count or generic praise.

Work one vertical slice at a time. Read its issue and blockers, verify changed behavior, review the diff and commit a small coherent change. Record evidence in the issue. Public documentation is English; coordination may be Italian. Do not use em or en dash punctuation.
