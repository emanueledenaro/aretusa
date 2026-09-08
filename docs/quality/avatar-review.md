# Avatar review

Issue: #13. Behavior checks complete; visual and release-consumer gates remain pending.

## Defects reproduced

- After one failed image, changing the source URL left the component permanently in fallback.
- Leading or repeated whitespace produced empty initials.
- The public TypeScript contract did not accept a ref to the root element.

## Changes

Image status is associated with its source. New sources may load after a failure, and an earlier URL can be retried after another source succeeds. Loading keeps the fallback and dimensions stable until the image is ready.

Names are normalized for initials and accessible labels. An empty name gets a neutral profile fallback. Four sizes and two shapes are explicit props. A decorative mode avoids repeating a neighboring visible name. Root refs and native attributes are accepted for the React 19 target.

## Verification

Six focused tests pass: new source after failure, whitespace, decorative naming, empty name, retry of an earlier URL and root ref. The Button regression tests remain green. Public usage examples typecheck.

The Avatar page includes size, shape, missing-name, paired-label and image-source examples. These are fixtures for the remaining rendered checks, not a claim that those checks are complete.

## Pending

Full visual matrix, persistent screenshots, narrow/zoom image cropping, light/dark contrast and final installed-consumer verification against the release commit. Keep the issue open until those gates have evidence.
