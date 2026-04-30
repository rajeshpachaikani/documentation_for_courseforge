---
sidebar_position: 2
---

# Configuring Credentials

After logging in as admin, open **`/admin/settings`**. This page
holds every tenant credential. All values are encrypted with
`ENCRYPTION_KEY` before being written to the `app_settings` table —
they never appear in `.env`, server logs, or backup files in plain
text.

## Stripe

Required for paid courses. Free courses work without it.

| Field | Where to find it |
| ----- | ---------------- |
| **Secret key** | Stripe dashboard → Developers → API keys → Secret key (`sk_live_...` or `sk_test_...`). |
| **Webhook signing secret** | Stripe dashboard → Developers → Webhooks → add endpoint `https://learn.client.com/api/webhooks/stripe`, subscribe to `checkout.session.completed`, then copy the signing secret (`whsec_...`). |
| **Publishable key** | Optional. Only needed if you customize the Checkout flow. |

After saving, run a 1-cent test purchase end-to-end to confirm the
webhook fires and the enrollment lands.

## Bunny Stream

Required for video lessons.

| Field | Where to find it |
| ----- | ---------------- |
| **API key**       | Bunny dashboard → Account → API. |
| **Library ID**    | Bunny dashboard → Stream → your library → numeric ID in the URL. |
| **CDN hostname**  | The `*.b-cdn.net` hostname assigned to the library's pull zone. |
| **Embed token key** | Stream library → Security → Token Authentication Key. Required to sign embed URLs. |

Test by uploading a 30-second clip in `/admin/courses/{id}/lessons`.
Upload progress comes from the browser direct to Bunny — if it stalls
at 0%, the API key is wrong; if it uploads but playback fails, the
embed token key is wrong.

## SMTP (transactional email)

Used for enrollment confirmations and password resets. Any provider
that speaks SMTP works.

| Field | Notes |
| ----- | ----- |
| **Host**       | e.g. `smtp.resend.com`, `email-smtp.eu-west-1.amazonaws.com`. |
| **Port**       | 465 (TLS) or 587 (STARTTLS). |
| **Username**   | Provider-specific. For Resend it's the literal string `resend`. |
| **Password**   | API key or SMTP password. |
| **From email** | Must be a domain you verified with the provider. |

Use the **Send test email** button on the settings page before
publishing courses.

## Google OAuth (optional)

Only if the client wants "Sign in with Google".

1. Google Cloud Console → APIs & Services → Credentials → Create
   credentials → OAuth client ID → Web application.
2. Authorised redirect URI: `https://learn.client.com/api/auth/callback/google`.
3. Paste the client ID + secret into `/admin/settings`.
4. Toggle **Enable Google login**.

## Raw HTML in the page builder (optional)

Disabled by default — once on, any admin can paste arbitrary HTML
(including `<script>`) into Puck blocks. Leave off unless the client
explicitly needs it for tracking pixels or third-party embeds.
