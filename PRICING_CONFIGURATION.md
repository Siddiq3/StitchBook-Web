# Subscription prices

Display prices are fetched from the backend's public `GET /api/subscription/plans` endpoint. No `VITE_` price variables or website rebuilds are needed for subsequent price changes. The landing page, billing page and dashboard share one in-flight request and reuse results for up to 60 seconds. No background polling is introduced.

Configure repository variables `BASIC_PLAN_PRICE`, `TEAM_PLAN_PRICE`, `PRO_PLAN_PRICE` in **Siddiq3/StitchBook-Backend**, then run its **Publish subscription prices** GitHub workflow. That workflow requires the `RENDER_SERVICE_ID` repository variable and `RENDER_API_KEY` secret. Wait for Render to deploy successfully, then reload. See that repository's `PRICING_CONFIGURATION.md` for setup and rollback instructions.

Deploy the companion backend change first. It adds the public catalog and quoted amount/currency to upgrade sessions. Prices unavailable or invalid: show a retry and disable plan selection. Existing checkout sessions display the price quoted by the backend; client code cannot choose a charged amount.

Features and staff limits remain in `src/data/plans.js`. A backend price change does not change those plan inclusions. This change does not update native mobile app price labels.
