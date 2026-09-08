# Shimmer implementation evidence

Issue #92 remains open. Implemented API: `enabled` (true by default), `speed` (seconds, default 2.8; invalid values fall back), `highlight` (CSS color), native span attributes and ref. Children render once. No live-region semantics are added automatically.

Five tests verify text/semantics/ref preservation, disabling and invalid speeds. All 65 public usage examples compile. A fresh consumer installed Shimmer alongside Dialog/Field with registry-declared dependencies and passed TypeScript plus production build. The Shimmer source imports its own CSS; the registry includes that file.

Browser evidence: default animation is a-text-shimmer at 2.8s; the Pause shimmer switch removes animation. At 320px viewport, page scrollWidth is 305px with no initial horizontal overflow. Forced-colors produced animation:none, background:none and readable computed text fill rgb(32,32,29). Reduced-motion produced animation:none. Multiline text and Marker composition were present in the demo.

Remaining: full visual review at all required widths, text zoom, dark-theme contrast during the entire sweep, independent review and retained visual evidence. No release-ready claim.

Default contrast correction: the initial light-theme highlight used the page background, making the moving stripe disappear into the surface. The default now darkens the inherited text color in light mode and brightens it in dark mode. Caller-supplied highlight colors still need contrast review against their actual surface. This preserves the original text color outside the stripe and avoids the default light-on-light disappearance.

Follow-up browser geometry: viewport widths 320, 390, 768, 1024 and 1440 produced document widths 305, 375, 753, 1009 and 1425 respectively. Initial Shimmer examples did not cause horizontal page overflow. The dark rendered example was inspected; computed gradient endpoints were rgb(238,234,222) and rgb(255,255,255). In light mode the default endpoint was color(srgb .0752941 .0752941 .0682353), darker than the inherited rgb(32,32,29), instead of matching the background. These observations cover the default theme, not arbitrary consumer colors.
