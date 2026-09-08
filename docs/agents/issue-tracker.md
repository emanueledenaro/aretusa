# Issue tracker: GitHub

Issues and the specification live in https://github.com/emanueledenaro/aretusa/issues. Use gh with an explicit repository when outside this checkout.

Read: gh issue view NUMBER --repo emanueledenaro/aretusa --comments.
Create and comment using a body file for multiline content.
Use ready-for-agent for specified tickets. Assign before starting; close only after acceptance checks and a corresponding commit.

## Pull requests as a triage surface

PRs as a request surface: no.

## Dependencies

Use native issue blocked_by relationships with database issue IDs. If unavailable, record Blocked by: #NUMBER in the issue body. Work only tickets whose blockers are closed.

