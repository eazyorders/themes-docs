---
sidebar_position: 2
sidebar_label: Palette
---

# Palette

The storefront injects **12 merchant-configurable colors** as **CSS custom properties** on `:root`. Use these variables in your `style.css` so merchants can change colors from the admin panel without editing your theme files.

## CSS variables

Names use hyphens and a `--` prefix. Each variable maps to a specific UI area:

| CSS variable       | Purpose                             |
| ------------------ | ----------------------------------- |
| `--hd-bg`          | Header background                   |
| `--hd-text`        | Header text color                   |
| `--ann-bg`         | Announcement bar background         |
| `--ann-text`       | Announcement bar text               |
| `--ft-bg`          | Footer background                   |
| `--ft-text`        | Footer text color                   |
| `--buy-btn-bg`     | Buy / add-to-cart button background |
| `--buy-btn-text`   | Buy button text                     |
| `--buy-btn-border` | Buy button border                   |
| `--crt-btn-bg`     | Cart button background              |
| `--crt-btn-text`   | Cart button text                    |
| `--crt-btn-border` | Cart button border                  |

## Using palette variables in CSS

```css
.my-header {
  background-color: var(--hd-bg);
  color: var(--hd-text);
}

.my-announcement {
  background-color: var(--ann-bg);
  color: var(--ann-text);
}

.my-footer {
  background-color: var(--ft-bg);
  color: var(--ft-text);
}

.buy-button {
  background-color: var(--buy-btn-bg);
  color: var(--buy-btn-text);
  border: 1px solid var(--buy-btn-border);
}

.cart-button {
  background-color: var(--crt-btn-bg);
  color: var(--crt-btn-text);
  border: 1px solid var(--crt-btn-border);
}
```

:::tip
Prefer these variables over hard-coded colors for header, footer, announcement, and primary buttons so merchants can tune the look from the dashboard.
:::

## Runtime behavior

On load, the storefront applies values on `:root`, for example:

```html
<style>
  :root {
    --hd-bg: #1a1a2e;
    --hd-text: #ffffff;
    --ann-bg: #e94560;
    --ann-text: #ffffff;
    --ft-bg: #16213e;
    --ft-text: #e2e2e2;
    --buy-btn-bg: #e94560;
    --buy-btn-text: #ffffff;
    --buy-btn-border: #e94560;
    --crt-btn-bg: #0f3460;
    --crt-btn-text: #ffffff;
    --crt-btn-border: #0f3460;
  }
</style>
```

Your `style.css` and `script.js` are still loaded globally on every page.
