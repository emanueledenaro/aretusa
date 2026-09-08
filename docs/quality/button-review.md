# Button review

Issue: #15. Review in progress; not release-ready.

## Verified changes

- Loading previously increased width from 119.539 px to 143.539 px. The control now remains 119.539 px in both states with unchanged children.
- Multiline labels previously had no block padding. They now retain 8 px above and below the label.
- Icons beside long labels retain a 16 px width.
- Pending controls keep their accessible name, suppress activation and own their busy state even if a caller passes a conflicting aria-busy value.
- Button defaults to type=button, preserves an explicit submit type and forwards refs and descriptions.

## Browser observations

The actual rendered Button lab was checked in the local browser. The final target-scoped viewport pass reported:

| CSS viewport | Narrow parent | Page overflow | Parent overflow | Enlarged label | Icon |
| --- | --- | --- | --- | --- | --- |
| 320 | 223 px | none | none | 28 px | 16 px |
| 390 | 240 px | none | none | 28 px | 16 px |
| 768 | 240 px | none | none | 28 px | 16 px |
| 1024 | 240 px | none | none | 28 px | 16 px |
| 1440 | 240 px | none | none | 28 px | 16 px |

No Button lab touch target was below 44 by 44 CSS pixels at the two mobile widths. Compact desktop variants are allowed by the contract. The doubled-label test exercises component text enlargement, not every browser's global zoom implementation.

Focus was visible with a 2 px solid outline. Primary hover and active states were observed; active movement was 1 px. Reduced-motion emulation yielded animation-name none for all pending-button spinners.

Measured idle text contrast, using rendered colors:

| Tone | Light | Dark |
| --- | --- | --- |
| Primary | 14.47:1 | 14.52:1 |
| Secondary | 12.76:1 | 10.90:1 |
| Outline / quiet | 14.47:1 | 14.52:1 |
| Danger | 7.24:1 | 7.88:1 |
| Accent | 10.15:1 | 10.15:1 |

Disabled contrast is treated separately. No universal screen-reader or cross-browser certification is claimed.

## Code and consumer evidence

Six focused tests cover non-submit default, explicit submit, Enter/Space activation, ref forwarding, unavailable-action keyboard skipping, loading suppression and owned busy semantics.

A fresh independently installed React/Vite/Tailwind consumer compiled the installed component sources successfully during this review. The final attribute correction is covered by focused tests; final release verification must rerun the consumer against the release commit.

The independent standards review found no blocking source defect in the initial loading fix and requested moving the state lab outside the Installation section; this was corrected. The specification review requested block padding, keyboard suppression and richer long-label cases; these were addressed.

## Remaining evidence

Persistent screenshot artifacts and a final cross-state visual review are still pending. Interactive screenshots were inspected in the task, but browser export was unavailable. A separate Playwright test-browser authorization was requested before changing automation methods. Do not mark this item release-ready from the observations above alone.
