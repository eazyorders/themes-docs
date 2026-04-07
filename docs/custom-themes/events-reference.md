---
sidebar_position: 6
---

# Events & Data Attributes

Custom themes communicate with the storefront through **bubbling `CustomEvents`**.

---

## Custom Events

Your Liquid templates dispatch `CustomEvent` instances to communicate user actions back to the storefront. The app listens for these events on the section container and handles the logic (cart operations, navigation, clipboard, etc.).

### Complete Event Table

| Event Name           | Section                       | Detail                                  | Description                                                                                               |
| -------------------- | ----------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `cart-click`         | Header                        | —                                       | Opens the side cart drawer                                                                                |
| `lang-click`         | Header                        | `{ anchor: HTMLElement }` (recommended) | Opens the language switcher dropdown; pass `detail.anchor` as the control that opened it                  |
| `register-click`     | Header                        | —                                       | Navigates to `/register` (client-side). Dispatch from a `register-btn` when `is_register_active` is true. |
| `footer-subscribe`   | Footer                        | `{ email: string }`                     | Submits newsletter subscription; pass the trimmed address in `detail.email`                               |
| `review-open`        | Reviews                       | —                                       | Opens the review submission modal                                                                         |
| `buy-now`            | Fixed Buy Button              | —                                       | Adds the product to cart / triggers buy flow                                                              |
| `increment-quantity` | Fixed Buy Button              | —                                       | Increases the quantity by 1                                                                               |
| `decrement-quantity` | Fixed Buy Button              | —                                       | Decreases the quantity by 1                                                                               |
| `quick-add`          | Products (featured/list/grid) | `{ productId: string }`                 | Adds a product to cart from the listing                                                                   |
| `quick-view`         | Products (featured/list/grid) | `{ productId: string }`                 | Opens a quick-view modal for a product                                                                    |
| `go-home`            | Thanks                        | —                                       | Navigates to the store homepage                                                                           |
| `copy-tracking-link` | Order Invoice                 | `{ link: string }`                      | Copies the tracking URL to clipboard and shows a toast                                                    |

---

## How to Dispatch Events

Events must be dispatched as `CustomEvent` with `bubbles: true` so they propagate up to the section container where the app listens.

### Inline Pattern (Recommended for Simple Actions)

The most common approach is an inline `onclick` handler:

```html
<button
  type="button"
  onclick="this.dispatchEvent(new CustomEvent('buy-now', { bubbles: true }))"
>
  Buy Now
</button>
```

### With Event Detail

When the event needs to carry data, pass it in the `detail` property:

```html
<button
  type="button"
  onclick="event.preventDefault(); event.stopPropagation();
    this.dispatchEvent(new CustomEvent('quick-add', {
      bubbles: true,
      detail: { productId: '{{ product.id }}' }
    }))"
>
  Add to Cart
</button>
```

### From script.js

You can also dispatch events from your `script.js`. Target any element inside the section container:

```javascript
document.querySelectorAll("[data-buy-trigger]").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.dispatchEvent(new CustomEvent("buy-now", { bubbles: true }));
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
<button
  onclick="this.dispatchEvent(new CustomEvent('cart-click',{bubbles:true}))"
>
  Cart
</button>
<span class="ab-cart-count">0</span>
<button
  onclick="this.dispatchEvent(new CustomEvent('lang-click',{bubbles:true,detail:{anchor:this}}))"
>
  Language
</button>
```

### Header — `register-click`

When the header receives `is_register_active`, add a control with class `register-btn` and dispatch `register-click`.

```html
<button
  type="button"
  id="header-register"
  class="register-btn"
  onclick="this.dispatchEvent(new CustomEvent('register-click',{bubbles:true}))"
>
  Register
</button>
```

### Fixed Buy Button Must-Haves

```html
<button onclick="this.dispatchEvent(new CustomEvent('buy-now',{bubbles:true}))">
  Buy
</button>
<button
  onclick="this.dispatchEvent(new CustomEvent('increment-quantity',{bubbles:true}))"
>
  +
</button>
<button
  onclick="this.dispatchEvent(new CustomEvent('decrement-quantity',{bubbles:true}))"
>
  -
</button>
```

### Product Card Must-Haves

```html
<button
  onclick="event.preventDefault();event.stopPropagation();
  this.dispatchEvent(new CustomEvent('quick-add',{bubbles:true,detail:{productId:'{{ product.id }}'}}))"
>
  Add
</button>
```

### Footer Newsletter form

```html
<form
  class="footer-subscribe-form"
  novalidate
  onsubmit="
    event.preventDefault();
    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }
    var input = this.elements.email;
    var email = input && input.value ? String(input.value).trim() : '';
    this.dispatchEvent(
      new CustomEvent('footer-subscribe', {
        bubbles: true,
        detail: { email: email }
      })
    );
    this.reset();
  "
>
  <input
    type="email"
    name="email"
    autocomplete="email"
    inputmode="email"
    maxlength="254"
    pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
    title="Valid email required"
    required
    aria-required="true"
  />
  <button type="submit">Subscribe</button>
</form>
```
