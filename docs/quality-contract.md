# Component quality contract

Aretusa's release is judged per component, not by catalog count.

## Required evidence

1. Default, hover, focus, active, disabled, loading, selected, invalid and empty states where applicable.
2. Predictable visual hierarchy, shared spacing tokens, aligned controls and consistent typography.
3. Mobile-first behavior at 320 and 390 CSS pixels, then tablet and desktop. Constrained containers must work independently of viewport width.
4. No page-level horizontal overflow. Data tables and source code may scroll inside labeled, bounded containers.
5. Touch actions at least 44 CSS pixels where feasible; dense calendar grids must retain clear target separation and usable day controls.
6. Text zoom at 200%, long words, wrapping labels, translated-length copy and multiline actions.
7. Keyboard navigation, named controls, announced state and errors. Overlays handle focus, Escape, scroll, safe areas and return focus.
8. Light/dark contrast and reduced motion.
9. Public usage example compiles. Installed source matches the preview and its documented dependency graph.
10. Responsive and interaction checks recorded per item. A smoke render alone is not completion.

## Status vocabulary

- implemented: code and preview exist.
- behavior-checked: interaction checks have passed for the documented behavior.
- visually-reviewed: the actual rendered state has been inspected.
- release-ready: all applicable checks have evidence and no unresolved blocking defect.

The quality target applies to every exported component and composed block. An implementation status is not a certification of full accessibility or universal browser compatibility.

