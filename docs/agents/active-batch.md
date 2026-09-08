# Active Astra batch

Approved execution: local worktrees, model gpt-6-astra. Shared base: `6b27b5a`.

| Ticket | Agent | Branch | Worktree |
| --- | --- | --- | --- |
| #28 | /root/calendar_28 | agent/calendar-28 | ../aretusa-worktrees/calendar |
| #91 | /root/scroll_fade_91 | agent/scroll-fade-91 | ../aretusa-worktrees/scroll-fade |
| #88 | /root/react_hook_form_88 | agent/react-hook-form-88 | ../aretusa-worktrees/react-hook-form |

All three workers acknowledged their assignments. This records dispatch, not completion. They push only their own branches. The main chat reviews each returned diff and its evidence before integrating shared catalog, routing, dependencies and registry changes.

The existing untracked error.log in the main checkout is outside this batch and must remain untouched.

## Integration record

All three deliveries were reviewed from the real checkout, reproduced and integrated on main by the coordinator on 8 September 2026:

| Ticket | Worker head | Integration | Evidence |
| --- | --- | --- | --- |
| #91 | `827a290` | merge `580cae2`, wiring `b140aac` | docs/quality/scroll-fade-review.md |
| #28 | `a619512` | merge `54b9619`, wiring and redesign `da783d3` | docs/quality/calendar-review.md |
| #88 | `5aefa03` | cherry-picks `8544d06` and `faa769d` (the branch's `290ac18` duplicated main's `a95eeea`), wiring `0468def` | docs/quality/react-hook-form-review.md |

The worker branches and worktrees remain for reference until the tickets close. Tickets stay open until the remaining gates listed in each record have evidence.
