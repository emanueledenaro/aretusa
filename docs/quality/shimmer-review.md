# Shimmer implementation evidence

Issue #92 remains open. Implemented API: `enabled` (true by default), `speed` (seconds, default 2.8; invalid values fall back), `highlight` (CSS color), native span attributes and ref. Children render once. No live-region semantics are added automatically.

Five tests verify text/semantics/ref preservation, disabling and invalid speeds. All 65 public usage examples compile. A fresh consumer installed Shimmer alongside Dialog/Field with registry-declared dependencies and passed TypeScript plus production build. The Shimmer source imports its own CSS; the registry includes that file.

Browser evidence: default animation is a-text-shimmer at 2.8s; the Pause shimmer switch removes animation. At 320px viewport, page scrollWidth is 305px with no initial horizontal overflow. Forced-colors produced animation:none, background:none and readable computed text fill rgb(32,32,29). Reduced-motion produced animation:none. Multiline text and Marker composition were present in the demo.

Remaining: full visual review at all required widths, text zoom, dark-theme contrast during the entire sweep, independent review and retained visual evidence. No release-ready claim.
