# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Small tailoring shops in India (1–10 people)** and **larger boutiques/ateliers**, with equal weight. Owners arrive mostly on mobile browsers (often from the Play Store listing or a link from the app) to learn what StitchBook does, buy or renew a plan, read the legal pages, or delete their account.
- Many prefer Telugu or Hindi and are not tech-savvy.

## Product Purpose

The website is StitchBook's marketing site and billing counter: explain the product, convert shop owners to the Android app, sell and renew plans (the app cannot, under Google Play rules), and host the privacy policy, terms and account-deletion pages required for the Play listing. Success: an owner understands the product in seconds and can buy a plan or delete an account without help.

## Positioning

Built specifically for Indian tailoring: outfit-specific measurement sheets, the cutting → stitching → ready → delivered workflow with per-item staff assignment, staff pay tracking, WhatsApp customer updates, and Telugu/Hindi/English. Not a generic invoicing or POS tool.

## Operating Context

- Vite + React 18 + React Router 7, Tailwind 3, framer-motion, lucide-react; deployed on Vercel (stitch-book-web.vercel.app).
- Talks to the StitchBook backend (Render) for login, dashboard, billing; payments via Cashfree.
- Pages: landing, about, terms, privacy, delete-account, login, register, forgot-password, dashboard, billing, checkout, upgrade session, payment success/failure, 404.

## Capabilities and Constraints

- Plans: Basic ₹299, Team ₹399, Pro ₹599 per 30 days, paid in advance, no auto-renew; 10-day free trial; payments by Cashfree.
- Privacy, terms and account deletion pages must stay accurate and reachable (Play listing requirement).
- The mobile app links here only for privacy/terms; it never links to pricing.

## Brand Commitments

- Name: StitchBook; azure blue #007FFF brand colour; sewing-machine and book logo.
- Contact: stitchbook3@gmail.com, +91 97051 16606, Hyderabad, Telangana.

## Evidence on Hand

- No testimonials, customer counts, ratings, logos of customers or press exist. Do not invent them.
- Real product screens can be captured from the app for imagery.

## Product Principles

1. Show the real product, not abstract promises.
2. Plain language a shop owner understands at a glance.
3. Buying, renewing and deleting are never hard to find.
4. Honest claims only.

## Accessibility & Inclusion

- Mobile-first; readable by non-technical users; keyboard and screen-reader accessible; respect reduced motion.
