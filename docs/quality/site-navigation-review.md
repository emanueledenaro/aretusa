# Site navigation refinement

Tracking issue: #10. Status: partial verification; issue remains open.

## Scope

Documentation sidebar now separates product sections from an alphabetic component list. It uses active-page semantics, a compact filter, a stable desktop width and a mobile disclosure. Styling is authored for Aretusa.

The homepage has a permanent bottom fade, with no reveal control and no hover/focus disappearance, as requested. The overlay does not receive pointer events. High-contrast forced-colors mode removes the decoration. Clickable directory cards use a restrained shadow and hover lift; reduced motion removes displacement.

## Browser evidence

- Desktop documentation sidebar inspected with the active Getting started entry, compact group headings and an untruncated filter.
- Filtering for `switch` leaves the Switch component link.
- At a 320px viewport, the mobile disclosure opens, its sidebar width is 265px within page padding, and document scrollWidth is 305px, with no horizontal overflow.
- Homepage fade pseudo-element uses the theme's paper color and pointer-events:none. After removing the reveal control, computed opacity remains 1 and no reveal button exists.

## Remaining acceptance

Verify all site routes at mobile and desktop, search keyboard behavior, preview/source switching, source copying, theme export and route recovery. Complete visual checks in light/dark, keyboard focus, long content and reduced motion before closing #10. These layout checks do not prove complete parity of the documentation product.
