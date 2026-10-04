# Website quality checklist

Applied to main commit 69e2075. Existing design and plan inclusions are preserved.

| Requested check | Result |
| --- | --- |
| 1. Remove horizontal scrolling | Allow grid/flex children to shrink; clip landing-page decorative motion locally. |
| 2. Find broken links | Route inventory reviewed; unknown links now show a recovery page. Download fallback explicitly says it requests access by email. |
| 3. Mobile menu | Existing menu retained; Escape closes it and returns focus; route changes and desktop resizing close it. Short screens can scroll the menu. |
| 4. Favicon | Existing ICO, PNG and Apple touch icon retained. |
| 5. Page titles | Route-specific browser titles, including checkout and 404. |
| 6. Meta descriptions | Route-specific descriptions; account/payment/unknown routes are noindex. |
| 7. Footer links | Existing valid routes, mailto, telephone and section anchors retained. |
| 8. Custom 404 | New page with home and support links replaces the silent homepage fallback. |
| 9. Copyright year | Existing current-year calculation retained. |
| 10. Compress images | Hero PNG delivery replaced by 44,664-byte WebP; displayed icon replaced by 2,362-byte WebP. Source artwork retained. |
| 11. Broken buttons | Offline logout now reaches sign-in with feedback; refresh is disabled while loading; reset steps cannot change during pending requests. |
| 12. Success messages | Account creation and reset-code request feedback; completed deletion message remains visible after auth is cleared. |
| 13. Error messages | Existing form/payment errors retained; unsuccessful remote logout explains the local result. |
| 14. Placeholder text | Removed future-implementation copy from registration and backend wording from login. Input examples and explicitly labeled sample app data remain. |
| 15. Unused navigation | Removed account dropdown chevron that had no dropdown. |
| 16. Mobile overflow | Shared layout shrink rules, footer text wrapping and bounded menu height. |
| 17. Clickable logo | Sign-in, registration, billing and upgrade screens now use the home-linked brand component. |
| 18. Clickable phone | Existing tel:+919705116606 retained. |
| 19. Clickable email | Existing mailto:stitchbook3@gmail.com retained. |
| 20. Mobile pages | Forms precede promotional panels on phones; inputs use 16px type. Browser checks cover routes at 320, 375, 768, 1024 and 1440px, with mocked account APIs. |

## Verification

- `npm test`: existing session, checkout and recovery tests.
- `npm run build`: production build.
- `npm audit --omit=dev`: production dependency check.
- `npm run test:browser`: responsive, metadata, image, mobile menu, preview tab, footer, 404 and form-feedback checks. Requires `npx playwright install chromium`; CI installs it automatically.

Browser tests mock APIs and do not create accounts, delete real data or charge payments. Store destinations depend on the deployment's VITE_APP_DOWNLOAD_URL, VITE_GOOGLE_PLAY_URL and VITE_APP_STORE_URL. Without a configured destination, buttons request access by email. Metadata is client-rendered; the custom 404 is an SPA screen under the existing Vercel rewrite, not an HTTP 404 response. Terms remain the owner's existing service/support copy.
