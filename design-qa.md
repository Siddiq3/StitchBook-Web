# Media presentation QA

Source visual truth: https://xpress.site/, captured in the cloud browser at its desktop viewport (1348 × 926 screenshot pixels). The hero uses overlapping, tilted cards with colored labels; the tutorial uses a rounded white panel with inline video playback.

Scope: adapt that media presentation to StitchBook's own recordings and existing visual tokens. This is not a copy of Xpress content or a full-site clone.

Implementation screenshot: unavailable. The cloud browser reports `net::ERR_BLOCKED_BY_CLIENT` for http://terminal.local:4173/. The preview service reports running, but that is not rendered verification. An HTTP check of that hostname also returned 502.

Viewport: intended desktop, tablet and mobile. No implementation screenshot dimensions, density normalization or matched mobile source capture are available.

State: landing-page hero previews and feature tour. Primary playback interactions and browser console errors could not be checked in the rendered implementation.

Full-view and focused comparison: blocked by unavailable implementation capture. No visual pass is claimed.

Required fidelity surfaces: typography and copy retain StitchBook's existing content; spacing adds a centered hero, overlapping cards and rounded tutorial panels; colors use the existing brand tokens with preview-label accents; assets are the existing local app recordings and posters. These are code observations, not verified visual findings.

Validation: production build passed; all 10 existing Node tests passed; git diff --check passed.

Implementation checklist:
- Capture desktop, tablet and phone layouts in a browser that can reach the preview.
- Check overflow, swipe navigation, preview pause/play, reduced motion, clip switching and off-screen pausing.
- Check console errors and media fallback, then compare reference and implementation captures.

Comparison history: no rendered iteration could be completed.

final result: blocked
