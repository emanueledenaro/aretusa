# Toast review

- Issue: [#51](https://github.com/emanueledenaro/aretusa/issues/51)
- Reviewer: worker branch agent/batch3-overlays-data, coordinator review pending
- Status: behavior-checked

## What changed

Toast now has two entry points that share one item. `ToastProvider` wraps the application once and `useToast()` returns `toast(options)` and `dismiss(id?)`; notifications queue in one viewport, the newest at the end, with a `limit` (3 by default) that drops the oldest, a default `duration` and a `position` corner. The controlled `Toast` keeps its `open`, `onOpenChange`, `title`, `description` and `duration` contract; inside a provider it joins the shared stack, on its own it still renders its own viewport, so the Showcase page and the documented usage keep working.

Each notification has a `tone` (neutral, success, danger) with an icon and the success or danger token, one optional `action` that runs its handler and closes the notification, and a round 40px Dismiss control. Danger and action notifications use the foreground announcement type; the others wait for a pause. The viewport sits inside the safe-area insets, is at most 360px wide or the viewport minus 32px, stacks with 12px gaps, shows a focus ring when reached with F8 and keeps the shared `a-toast` entrance and exit motion. Swipe moves the surface and cancel returns it. Radix pauses timers while the viewport is hovered or focused and closes on Escape.

The demo-only `ToastDemo` export was removed; the demo is `ToastExample`: save draft (success), archive with Undo (danger, 8 s), copy link (2.5 s), a long message that stays until dismissed and a dismiss-all control.

## Tests

`tests/toast.test.tsx`, 5 tests: `useToast` enqueues a notification with title, description, tone and a Dismiss control inside the Notifications region; repeated notifications stack and `dismiss(id)` removes only the targeted one; the action runs its handler and closes; a notification closes on its own after its duration; the controlled Toast works without a provider and reports `onOpenChange(false)`.

The test setup gained a second jsdom shim: Radix Toast reads `hasPointerCapture` on pointer up, which jsdom does not implement.

## Rendered evidence

Pending. No browser was used in this batch. The coordinator should check: 320 and 390 px with the safe-area inset on a phone, three stacked notifications with a long description, the Dismiss control at 40 by 40 px, success and danger icons in both themes, F8 focus and Escape, hover pause, swipe to dismiss on touch, 200% zoom and reduced motion.

## Findings

- P1 resolved: there was no queue; every notification needed its own controlled state and viewport, so two messages overlapped.
- P2 resolved: no tone or action; the dismiss control was a text link with no touch target.
- P2 resolved: the viewport ignored safe-area insets.
- Open: browser captures, screen reader announcement timing, independent second review.

## Integration notes

Props for the site API table. Toast: `open`, `onOpenChange`, `title`, `description`, `tone`, `duration`, `action`, `className`. ToastProvider: `duration`, `limit`, `position`. Hook: `useToast()` returning `toast` and `dismiss`. `ToastProvider` and `useToast` are new exports from the overlays module; `ToastDemo` was removed. Catalog description could read "A queued notification with a tone, one action and a dismiss control." Changelog: Toast gains ToastProvider and useToast; ToastDemo is no longer exported.

## Decision

Interaction and code gates passed in jsdom for the documented behavior; design and responsive gates await rendered evidence. Not release-ready.
