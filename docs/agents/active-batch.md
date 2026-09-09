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

## Second batch

Two Claude worker agents ran in isolated worktrees from `62cf454` for the remaining form integrations and returned review requests the same day:

| Ticket | Branch | Worker head | Integration | Evidence |
| --- | --- | --- | --- | --- |
| #89 | agent/tanstack-form-89 | `480e588` | cherry-picks `dd68fc6`, `df083d9`, `6115401`; wiring `73e8a82` | docs/quality/tanstack-form-review.md |
| #90 | agent/formisch-90 | `1d0a742` | cherry-picks `d1885ac`, `736a06e`; wiring `1f85df8` | docs/quality/formisch-review.md |

Lessons recorded for the next batch: adapters typed structurally must declare their library in the catalog entry so the registry lists it; clean-consumer compilation catches `DOM.Iterable` assumptions; standalone examples installed locally bring their own React copy, so the root Vitest and docs Vite configs dedupe React and the form libraries.

## Third batch (component tickets in parallel)

Dispatched on 9 September 2026 from `eb71728`, six Claude workers in local worktrees under `../aretusa-worktrees/batch3-*`, one per source module so their edits do not overlap. Each worker delivers per component: refined source, `tests/<id>.test.tsx`, a demo in `apps/docs/src/demos/<group>.tsx` wired through its own `case` in `Demo.tsx`, and `docs/quality/<id>-review.md` at behavior-checked. Coverage, tracker, changelog, registry and browser evidence stay with the coordinator.

| Branch | Tickets |
| --- | --- |
| agent/batch3-foundations-a | #14 Badge, #17 Card, #16 Button Group, #21 Kbd, #23 Separator, #12 Aspect Ratio, #18 Direction |
| agent/batch3-foundations-b | #24 Skeleton, #25 Spinner, #22 Progress, #19 Empty, #20 Item, #27 Alert, #26 Typography |
| agent/batch3-forms | #42 Textarea, #32 Field, #36 Label, #34 Input Group, #37 Native Select, #43 Toggle, #44 Toggle Group, #40 Slider, #35 Input OTP, #30 Combobox, #31 Date Picker |
| agent/batch3-navigation | #64 Tabs, #53 Accordion, #55 Collapsible, #54 Breadcrumb, #61 Pagination, #58 Dropdown Menu, #57 Context Menu, #59 Menubar, #60 Navigation Menu, #56 Command, #63 Sidebar, #62 Scroll Area record |
| agent/batch3-overlays-data | #49 Popover, #52 Tooltip, #48 Hover Card, #51 Toast, #69 Table, #67 Data Table, #65 Carousel, #66 Chart, #68 Resizable |
| agent/batch3-conversation | #73 Message, #71 Bubble, #74 Message Scroller, #70 Attachment, #72 Marker, #75 Questionnaire |

Blocks #76 to #86 wait for a later batch. This records dispatch, not completion.
