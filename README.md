# StitchBook website

Run `npm install` and `npm run dev`. Configure `VITE_API_BASE_URL` in `.env` to point to the backend API. No payment secrets belong in the website environment.

## Cashfree payments

`/upgrade/session/:sessionId` purchases a prepaid plan. `/checkout?checkoutToken=...` pays a tailoring order. Both pages fetch server-owned pricing and Cashfree payment session IDs, open Cashfree JS v3 modal checkout, and confirm payment through the backend. Return URLs resume server verification; browser results never activate a plan themselves.

The backend supplies the Cashfree sandbox/production mode. Configure its `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_ENV`, `CASHFREE_API_VERSION` and `WEB_APP_URL`, apply `npm run migrate:cashfree`, whitelist this website's domain in Cashfree, and register the backend `/api/webhooks/cashfree` success webhook. See the backend `SETUP_STEP_7_CASHFREE.md` for details.

Customer order checkout is created with `POST /api/payment/cashfree/create-order` using authenticated order ownership, amount and customer phone. Its response includes a relative website checkout URL. Verification sends `checkoutToken` and `cashfree_order_id` to `/api/payment/cashfree/verify-payment`. Upgrade checkout sends `cashfree_order_id` to `/api/subscription/upgrade-session/:sessionId/verify`. Prices use rupees.

Run `npm test` and `npm run build`. Validate sandbox success, declined payments, closed checkout, return URLs and duplicate webhooks before production.
