---
sidebar_position: 2
sidebar_label: Palette
---

# Palette

The storefront injects **22 merchant-configurable colors** as **CSS custom properties** on `:root`. Use these variables in your `style.css` so merchants can change colors from the admin panel without editing your theme files.

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
| `--product-name-text` | Product name text color          |
| `--product-price-text` | Product price text color        |
| `--product-sale-price-text` | Product sale price text color |
| `--body-bg`        | Site/app background                 |
| `--body-text`      | Base body text                      |
| `--input-border`   | Input border (normal + focus)       |
| `--input-bg`       | Input background                    |
| `--input-text`     | Input text                          |
| `--checkout-form-bg` | Checkout form/card background     |
| `--checkout-heading-text` | Checkout heading text         |

## Using palette variables in CSS

:::warning
Always provide fallback values in `var(...)` so your theme keeps a usable color palette if a variable is missing or empty.
:::

```css
.my-header {
  background-color: var(--hd-bg, #1a1a2e);
  color: var(--hd-text, #ffffff);
}

.my-announcement {
  background-color: var(--ann-bg, #e94560);
  color: var(--ann-text, #ffffff);
}

.my-footer {
  background-color: var(--ft-bg, #16213e);
  color: var(--ft-text, #e2e2e2);
}

.buy-button {
  background-color: var(--buy-btn-bg, #e94560);
  color: var(--buy-btn-text, #ffffff);
  border: 1px solid var(--buy-btn-border, #e94560);
}

.cart-button {
  background-color: var(--crt-btn-bg, #0f3460);
  color: var(--crt-btn-text, #ffffff);
  border: 1px solid var(--crt-btn-border, #0f3460);
}

.product-name {
  color: var(--product-name-text, #212a2f);
}

.product-price {
  color: var(--product-price-text, #212a2f);
}

.product-price-sale {
  color: var(--product-sale-price-text, #c94a4a);
}

body {
  background-color: var(--body-bg, #ffffff);
  color: var(--body-text, #131316);
}

.checkout-form .global_input {
  border: 1px solid var(--input-border, rgba(0, 0, 0, 0.08));
  background: var(--input-bg, #ffffff);
  color: var(--input-text, #212a2f);
}

.checkout-form .global_input:focus {
  border-color: var(--input-border, rgba(0, 0, 0, 0.08));
}

.checkout-form {
  background: var(--checkout-form-bg, #f5f4f2);
}

.checkout-form h2 {
  color: var(--checkout-heading-text, #212a2f);
}
```

:::tip
Prefer these variables over hard-coded colors so merchants can tune product text, site background, inputs, and checkout UI from the dashboard.
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
    --product-name-text: #212a2f;
    --product-price-text: #212a2f;
    --product-sale-price-text: #c94a4a;
    --body-bg: #ffffff;
    --body-text: #131316;
    --input-border: #d9d9d9;
    --input-bg: #ffffff;
    --input-text: #212a2f;
    --checkout-form-bg: #f5f4f2;
    --checkout-heading-text: #212a2f;
  }
</style>
```

Your `style.css` and `script.js` are still loaded globally on every page.
