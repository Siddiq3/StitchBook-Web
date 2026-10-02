# Website deployment verification

Configure `VITE_API_BASE_URL`, the real `VITE_GOOGLE_CLIENT_ID`, and actual HTTPS download/store URLs: `VITE_APP_DOWNLOAD_URL`, `VITE_GOOGLE_PLAY_URL`, `VITE_APP_STORE_URL`. Missing or placeholder download URLs fall back to support; store badges are displayed only for configured store URLs. No new store URL or legal agreement was invented.

Deploy only after clean installation, tests, build and production dependency audit. Audit access to npm is still pending approval. `vercel.json` defines HSTS, CSP, no-sniff, referrer, frame and permissions headers. Verify them on the deployed responses, including SPA routes. Align CSP connect/script/frame origins with the actual API, Google and Cashfree endpoints. HTTPS redirects, custom-domain configuration, CDN caching and cookie behavior must be verified on the real host; a local Vite screenshot does not prove them.

Refresh credentials now use an HttpOnly server cookie rather than localStorage. Short-lived bearer access uses sessionStorage. Legacy persistent bearer values are cleared. Browser and API need credentialed CORS with explicit allowed origins. Third-party cookie blocking must be tested; a same-site custom API domain is preferable. Session restoration coalesces duplicate requests and preserves credentials during transient outages. Deletion resumes with a separate capability and clears that capability when another user signs in.

The public privacy and deletion pages remain discoverable outside paid access. `/terms` provides service/support information; it is not a completed legally approved terms agreement. The owner must supply and review applicable terms/refund policy and privacy disclosures before publication. Do not automatically accept agreements or trigger real checkout during testing.

Chrome visual inspection confirmed the local desktop landing page's layout and warm palette. Other pages, narrow viewport layout, real Google authentication, hosted cookies/headers and live checkout still need complete end-to-end validation. Chrome window focus changed during testing, so those routes were not claimed as visually verified.
