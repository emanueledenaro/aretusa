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

## Route smoke checks at 5780ec8

The local in-app browser loaded Home, Docs, Button, Blocks, Charts/area, Directory, Typeset and Create at viewport widths 1280 and 320 CSS pixels. Each route rendered its expected heading or Create toolbar. Document scrollWidth was 1265 and 305 respectively, with the remaining 15px occupied by the scrollbar. No page-level horizontal overflow was observed in these initial states.

At 320px, switching Button to Source set the Source tab to selected and rendered the authored TypeScript with the five installed source/style files. Directory was checked again after its asynchronous load: 75 registry cards were present. The initial route-load sample alone did not prove registry completion.

These are load and geometry checks. They do not certify every action, narrow embedded demo, chart state or full visual matrix. Clipboard, actual theme export/installation, route recovery and complete navigation interaction still need end-to-end evidence.

## Spacing follow-up

The compact period Select exposed a real layout defect: its menu inherited a 112px trigger width, leaving option labels on three lines and making rows 80px high. A viewport-bounded 192px minimum menu width now gives single-line 44px rows with 4px separation. Browser measurements confirmed both rows after the fix. The documentation list has aligned 207px-wide entries, 32px desktop rows and 2px separation; existing touch rules retain 44px targets. Section and filter spacing were adjusted without changing navigation destinations.
