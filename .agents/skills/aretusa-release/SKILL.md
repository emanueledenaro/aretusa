---
name: aretusa-release
description: Audit Aretusa release readiness across per-component quality evidence, source registry, consumer installs, CI and public publication state.
---

# Aretusa release

Read docs/quality-contract.md, docs/verification.md and the release issue. Distinguish a development preview from a ready release.

Check every item in docs/quality/coverage.json against its ticket and evidence. Any applicable pending gate or unresolved P0/P1/P2 finding prevents a ready release claim.

Run the repository checks, public usage validation and clean-consumer installation. Verify that source archives, registry JSON, docs and advertised commands describe the same version. Preserve licenses and contributor notices.

Publish only within the authority already granted in the current task. Verify repository/tag, website and package registry independently. A successful build or tag does not prove deployment or npm publication.

Report exact verified URLs and remaining external blockers. Never close the project goal or release ticket solely because the deadline arrived.

