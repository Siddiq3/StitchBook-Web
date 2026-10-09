---
name: StitchBook website
description: Marketing, billing and policy pages for the StitchBook tailoring app
colors:
  brand: "#007FFF"
  brand-dark: "#0066CC"
  brand-soft: "#EAF4FF"
  canvas: "#F4F7FB"
  surface: "#FFFFFF"
  surface-soft: "#EEF2F6"
  ink: "#101828"
  muted: "#475467"
  border: "#E4E9F0"
  success: "#147A48"
  danger: "#B4233B"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.6vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 800
    lineHeight: 1.12
  body:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.65
rounded:
  control: "12px"
  card: "16px"
  phone: "28px"
  pill: "999px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  plan-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "24px"
---

# Design System: StitchBook website

Tokens: `src/styles/index.css` (`--sb-*` on `:root`) and `tailwind.config.js`. Landing and About styles: `src/styles/landing.css`.

## Overview

The website shows the real product and gets out of the way: one azure accent shared with the app, cool slate neutrals, one sans family, and real app screens (from a demo shop) instead of mock-ups. Persuade mode for the landing page, plain and dependable for billing, sign-in and policy pages.

## Colors

`brand` is the only accent, for primary buttons, links and the featured plan. The legacy Tailwind name `brass` now maps to the same azure so older pages stay consistent. No gradients, glows or warm beige surfaces.

## Typography

Plus Jakarta Sans for everything, including headings; no serif or italic emphasis. Headings are 800 weight with -0.02em tracking and balanced wrapping.

## Layout

Content width 1160px with a 16px gutter. Sections are separated by a hairline and spacing, not by background changes, except one tinted band (staff and customers). Image-and-text rows alternate at most twice. Every multi-column section collapses to one column below 900px.

## Elevation & Depth

Flat surfaces; the only real depth is the phone frames (soft blue-slate shadow) and plan cards (border only).

## Shapes

Controls 12px, cards 16px, phone frames 28px, chips pill.

## Do's and Don'ts

- Do use real app screenshots from `public/images/app/` (720px WebP).
- Do show the product moving with real screen recordings (`public/media/*.mp4`, 540x1200, recorded on the emulator from the demo shop) in the DemoStory tour: lazy-loaded, muted, pausable, poster frame for reduced motion. Never record the keyboard (its suggestion bar can show clipboard text).
- Don't add eyebrow labels, section numbers, em-dashes, watermarks, or invented metrics.
- Don't duplicate CTA intents: one app CTA label, one sign-in link.
- Known: Plus Jakarta Sans is flagged by the Impeccable detector as an overused face; it is the incumbent brand face, kept until a brand decision.
