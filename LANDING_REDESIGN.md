# StitchBook landing redesign

Implemented a logo-led blue, violet, and soft neutral visual direction across the site theme, navigation, footer, landing page, and About page. The landing uses editorial sections, an interactive illustrative product preview, a craftsmanship photograph, public pricing, expandable FAQ answers, and app download actions.

The preview contains fictional sample data, explicitly labeled on the page; it does not expose customer records. Orders use the backend's cutting, stitching, and ready states. Prices and staff limits match the backend monthly plans: Basic ₹299 / owner only; Team ₹399 / 2 staff; Pro ₹599 / 5 staff. Landing and billing import the same display plan definitions from `src/data/plans.js`. Server checkout remains authoritative.

The download button uses `VITE_APP_DOWNLOAD_URL`, with the existing support email fallback when a download URL is unavailable. Store links appear only when valid `VITE_GOOGLE_PLAY_URL` or `VITE_APP_STORE_URL` values exist. Product work remains in the mobile app; website account and billing flows are preserved.

## Image asset

Built-in imagegen generated the new image, saved in the project as `public/images/tailoring-craft.webp` (1536 × 1024; approximately 153 KB). The original image is retained at `/Users/siddiqkolimi/.codex/generated_images/01a0f94e-d496-7bd3-a669-ead57220a5cf/exec-38a70b4b-e69a-4570-bbaa-d31b07cd9c90.png`.

Final prompt:

> Use case: photorealistic-natural. Asset type: editorial photography for StitchBook tailoring shop software landing page. Create a refined realistic close-up photograph of an Indian tailor's hands guiding warm ivory linen under the needle of a dark vintage industrial sewing machine, beautiful fabric folds across the lower right, a muted rust thread spool in background, artisan tailoring workshop, warm natural window light from left, rich shadows, tactile fabric weave, premium magazine photography, restrained palette of cream, espresso brown and rust. Landscape 3:2 composition, focused on authentic sewing craftsmanship, cropped hands only, no face. No suit, no coat, no mannequins, no text, no logo, no UI, no collage, no watermark. Real photographic texture, not illustration. Save the output image and return its local file path.

## Verification

- Production Vite build passes.
- Existing session tests: 3 passed.
- Checked shared plan prices and staff limits against the backend source.
- Verified all photograph references exist.
- `git diff --check` passes.
- Image visually inspected.
- Browser verification completed in Chrome: desktop blue theme, mouse and keyboard preview tabs, FAQ expansion, pricing anchors, mobile menu dismissal, and mobile pricing layout.
- Mobile landing and login inspected at 390px and 320px. Fixed overlapping header controls at 320px and moved the mobile sign-in section above the introductory content.
- Cleared stale development Tailwind colors by restarting Vite and refreshing; blue buttons visually confirmed.
- Authentication and billing could not complete: Google client ID is not configured and `http://localhost:5002/api` is unreachable (connection failure, HTTP 000). Choosing a plan correctly navigates to `/billing`, where the existing account-restoration error state appears.
- App download URLs are not configured, so download actions currently use the documented support-email fallback.
- Final production build, all 3 existing session tests, and whitespace checks pass.

Responsive styles are implemented for desktop, tablet, and mobile. Preview tabs support mouse and keyboard navigation, FAQ uses native disclosure controls, and existing reduced-motion and focus-visible styles are retained.

## Logo color update

Primary blue `#085CE8` was sampled from the displayed `public/stitchbook-app-icon.png`. Buttons, links, focus rings, headline emphasis, and shared theme accents now use this blue with darker blue hover states. Blue-only accents follow the logo background, pale blue surfaces complement the primary, and the craftsmanship section uses deep navy. All UI accents now use blue, including order-status badges; the status labels distinguish each state.

The sign-in navigation button uses the solid blue primary style, Google sign-in uses its supported `filled_blue` theme, and shared secondary/ghost buttons use blue text. Status and alert theme tokens and checkout accents also use the same blue palette.
