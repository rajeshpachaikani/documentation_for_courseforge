---
sidebar_position: 3
---

# Theming the Storefront

Branding lives in **`/admin/appearance`**. Every storefront component
reads from `--cf-*` CSS custom properties, so changes here apply
instantly across the site without a rebuild.

## What can be changed

- **Brand colours** — primary, accent, background, foreground, muted.
- **Fonts** — body and heading, picked from a curated Google Fonts
  list.
- **Border radius** — global radius for cards, buttons, inputs.
- **Logo** — uploaded to Bunny Storage; rendered in the navbar.
- **Custom CSS** — a CodeMirror panel that injects raw CSS into
  `<head>`. Useful for one-off tweaks the UI doesn't expose.

## Suggested workflow

1. Pick the primary colour from the client's brand kit.
2. Pick body + heading fonts.
3. Upload the logo (PNG or SVG, transparent background, ≤500 KB).
4. Open the public homepage in another tab and confirm it looks
   right. The page hot-reloads as you save.
5. Use **Custom CSS** only after exhausting the named controls.
   Anything you can do via CSS variables is more upgrade-safe than
   custom CSS.

## CSS variable reference

Every storefront element carries a `cf-*` class, so custom CSS can
target them precisely:

```css
.cf-hero {
  background-image: linear-gradient(
    135deg,
    var(--cf-primary) 0%,
    var(--cf-accent) 100%
  );
}

.cf-course-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
```

A list of CSS custom properties and class names is shown inline in
the appearance panel.
