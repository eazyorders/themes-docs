---
sidebar_position: 6
---

# Events & Data Attributes

Custom themes communicate with the storefront through two mechanisms: **`data-eo` attributes** for element identification, and **CustomEvents** for user interactions. This page is a complete reference for both.

---

## Data Attributes (`data-eo`)

The storefront looks for specific `data-eo` attribute values to attach behavior to your HTML elements. If an attribute is missing, the corresponding feature will not work.

| Attribute | Section | Element | Behavior |
|-----------|---------|---------|----------|
| `data-eo="cart-btn"` | Header | button | Opens the side cart drawer on click |
| `data-eo="cart-badge"` | Header | span | Displays cart item count; auto-updated when cart changes |
| `data-eo="lang-btn"` | Header | button | Language switcher dropdown anchor |
| `data-eo="search-btn"` | Header | button | Opens the search overlay |
| `data-eo="footer-subscribe-form"` | Footer | form | Newsletter subscription — submit is handled by the app |
| `data-eo="footer-subscribe-msg"` | Footer | any | Shows success/error message after newsletter submit |
| `data-review-open` | Reviews | button | Opens the review submission modal |

### Other Data Attributes

These are not `data-eo` but are read by the storefront:

| Attribute | Section | Purpose |
|-----------|---------|---------|
| `data-policies` | Product Description | Container for auto-injected merchant policy accordions |
| `data-policies-nav` | Product Description | Container for policy tab navigation |
| `data-policies-panels` | Product Description | Container for policy tab panels |
| `data-min`, `data-max` | Fake Visitor | Min/max range for the animated visitor count |
| `data-hours` | Fake Counter | Countdown duration in hours |
| `data-product-id` | Fake Counter | Product ID for countdown persistence |
| `data-unit="days"` | Fake Counter | Receives the days countdown digit |
| `data-unit="hours"` | Fake Counter | Receives the hours countdown digit |
| `data-unit="minutes"` | Fake Counter | Receives the minutes countdown digit |
| `data-unit="seconds"` | Fake Counter | Receives the seconds countdown digit |

---

## Custom Events

Your Liquid templates dispatch `CustomEvent` instances to communicate user actions back to the storefront. The app listens for these events on the section container and handles the logic (cart operations, navigation, clipboard, etc.).

### Complete Event Table

| Event Name | Section | Detail | Description |
|------------|---------|--------|-------------|
| `lang-click` | Header | — | Opens the language switcher dropdown |
| `buy-now` | Fixed Buy Button | — | Adds the product to cart / triggers buy flow |
| `increment-quantity` | Fixed Buy Button | — | Increases the quantity by 1 |
| `decrement-quantity` | Fixed Buy Button | — | Decreases the quantity by 1 |
| `quick-add` | Products (featured/list/grid) | `{ productId: string }` | Adds a product to cart from the listing |
| `quick-view` | Products (featured/list/grid) | `{ productId: string }` | Opens a quick-view modal for a product |
| `go-home` | Thanks | — | Navigates to the store homepage |
| `copy-tracking-link` | Order Invoice | `{ link: string }` | Copies the tracking URL to clipboard and shows a toast |

---

## How to Dispatch Events

Events must be dispatched as `CustomEvent` with `bubbles: true` so they propagate up to the section container where the app listens.

### Inline Pattern (Recommended for Simple Actions)

The most common approach is an inline `onclick` handler:

```html
<button type="button"
  onclick="this.dispatchEvent(new CustomEvent('buy-now', { bubbles: true }))">
  Buy Now
</button>
```

### With Event Detail

When the event needs to carry data, pass it in the `detail` property:

```html
<button type="button"
  onclick="event.preventDefault(); event.stopPropagation();
    this.dispatchEvent(new CustomEvent('quick-add', {
      bubbles: true,
      detail: { productId: '{{ product.id }}' }
    }))">
  Add to Cart
</button>
```

### From script.js

You can also dispatch events from your `script.js`. Target any element inside the section container:

```javascript
document.querySelectorAll('[data-buy-trigger]').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.dispatchEvent(new CustomEvent('buy-now', { bubbles: true }));
  });
});
```

:::warning
Always set `bubbles: true`. The storefront listens on a parent container, not on the element itself. Without bubbling, the event will not reach the handler.
:::

---

## Event Flow Diagram

```
Your Liquid Template (HTML)
    │
    │  onclick → new CustomEvent('buy-now', { bubbles: true })
    │
    ▼
Section Container (React component)
    │
    │  useLiquidEvents listens for 'buy-now'
    │
    ▼
App Logic (add to cart, navigate, copy, etc.)
```

1. Your template renders HTML with inline event dispatchers or `script.js` listeners.
2. When the user interacts, a `CustomEvent` is dispatched from the clicked element.
3. The event bubbles up to the React section container.
4. The `useLiquidEvents` hook catches it and runs the corresponding app logic.

---

## Link Interception

In addition to custom events, the storefront automatically intercepts clicks on internal `<a>` links for SPA navigation. This applies to most sections (header, footer, categories, products, slider, breadcrumbs).

**What gets intercepted:**
- Same-origin links (e.g. `/products/my-product`, `/collections/shoes`)
- Links within the current storefront domain

**What does NOT get intercepted:**
- External links (different domain)
- Links with `target="_blank"`
- Links with `download` attribute

You don't need to do anything special — use standard `<a href="...">` tags and the storefront handles the rest:

```liquid
<a href="/collections/{{ category.slug }}">{{ category.name }}</a>
```

---

## Quick Reference Card

### Header Must-Haves

```html
<button data-eo="cart-btn">Cart</button>
<span data-eo="cart-badge">0</span>
<button data-eo="lang-btn"
  onclick="this.dispatchEvent(new CustomEvent('lang-click',{bubbles:true}))">
  Language
</button>
```

### Fixed Buy Button Must-Haves

```html
<button onclick="this.dispatchEvent(new CustomEvent('buy-now',{bubbles:true}))">Buy</button>
<button onclick="this.dispatchEvent(new CustomEvent('increment-quantity',{bubbles:true}))">+</button>
<button onclick="this.dispatchEvent(new CustomEvent('decrement-quantity',{bubbles:true}))">-</button>
```

### Product Card Must-Haves

```html
<button onclick="event.preventDefault();event.stopPropagation();
  this.dispatchEvent(new CustomEvent('quick-add',{bubbles:true,detail:{productId:'{{ product.id }}'}}))">
  Add
</button>
```

### Footer Must-Haves

```html
<form data-eo="footer-subscribe-form">
  <input type="email" name="email" required />
  <button type="submit">Subscribe</button>
</form>
<p data-eo="footer-subscribe-msg" hidden></p>
```
