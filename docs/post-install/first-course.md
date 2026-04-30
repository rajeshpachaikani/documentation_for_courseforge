---
sidebar_position: 4
---

# Publishing the First Course

The smoke-test that proves every integration works end-to-end.

## 1. Create the course

`/admin/courses` → **New course**.

- **Title**, **slug**, **price** (or 0 for free).
- **Description** — TipTap rich-text editor.
- **Cover image** — uploaded to Bunny Storage.

Save as draft.

## 2. Add modules and lessons

Inside the course:

- Add a **module** (chapter heading).
- Inside the module, add a **lesson**.
- For a video lesson, drop a video file onto the upload area. It
  uploads chunked direct-to-Bunny via TUS — progress is shown live.
  When the bar fills, Bunny returns the video ID and the lesson is
  ready.

## 3. Build the sales page

Each course has a **public sales page** built with Puck.

`/admin/courses/{id}/page` opens the page builder. Drag in:

- **Hero** — headline + sub + CTA.
- **Course grid** — pulls live data; useful for cross-sell.
- **Pricing card** — pulls the live price, hooks into Stripe Checkout.
- **Rich text**, **video preview**, **testimonial**, **feature
  list**, **instructor bio**, **spacer**.
- **Raw HTML** (only if the toggle in `/admin/settings` is on).

Save. The page is published at `/courses/{slug}`.

## 4. Publish

Toggle **Published** on the course. It now appears in the public
catalogue at `/courses`.

## 5. Test the purchase

Open the course's public sales page in an **incognito window** so
you're not logged in as the admin. Click **Buy**, complete Stripe
Checkout (use test card `4242 4242 4242 4242` if Stripe is in test
mode), and confirm:

- Stripe webhook event `checkout.session.completed` shows up in
  Stripe → Developers → Events.
- The enrollment appears at `/admin/students` for that user.
- The student lands on `/dashboard` with the course playable.
- The enrollment confirmation email arrives in their inbox.

If any of those four fail, see [Troubleshooting](../operations/troubleshooting.md).
