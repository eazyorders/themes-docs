---
sidebar_position: 2
---

# Product Sections

Product sections render on the product detail page. They include breadcrumbs, the image gallery, product information, description, reviews, and the sticky buy button.

---

## Breadcrumbs

**File:** `sections/breadcrumbs.liquid`

Breadcrumbs show the navigation path to the current product. They appear on the product page. Internal `<a href="/collections/...">` links are intercepted for client-side navigation.

### Variables

| Variable       | Type   | Description                                    |
| -------------- | ------ | ---------------------------------------------- |
| `categories`   | array  | Parent categories — each has `name` and `slug` |
| `product_name` | string | Current product name                           |
| `home_text`    | string | Translated "Home" label                        |

### Example

```liquid
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li>
      <a href="/">{{ home_text }}</a>
      <span class="sep">/</span>
    </li>
    {% for crumb in categories %}
      <li>
        <a href="/collections/{{ crumb.slug }}">{{ crumb.name }}</a>
        <span class="sep">/</span>
      </li>
    {% endfor %}
    <li aria-current="page">{{ product_name }}</li>
  </ol>
</nav>
```

:::info
Breadcrumbs can optionally appear inside the product details area instead of above it, controlled by the `is_breadcrumbs_in_details` flag set in the admin panel.
:::

---

## Gallery

**File:** `sections/gallery.liquid`

The product image gallery shows the main image/video and and the rest of the product images.

### Variables

| Variable       | Type     | Description                                                     |
| -------------- | -------- | --------------------------------------------------------------- |
| `images`       | string[] | All gallery asset URLs (images and/or videos), in display order |
| `mainImage`    | string   | The URL currently shown in the main area (selected image/video) |
| `product_name` | string   | Product name — use for `alt` (and similar) text                 |
| `theme_data`   | object   | Merchant-configured dynamic settings from the theme editor      |

### Video assets

Treat `.mp4` (or any URL you intend as video) as video in Liquid: use a `<video>` element for the main area and thumbnails when the URL indicates a video. A typical Liquid check is `contains '.mp4'`.

:::info
The gallery does **not** use custom events to talk back to the app. Thumbnail or swipe behavior is entirely up to your Liquid and `script.js` (purely client-side DOM updates), unless the shopper changes variant or navigates in a way that causes the parent to pass new `mainImage` / `images`.
:::

### Example (tabs gallery)

This layout is a **tabs gallery**: one **panel** shows the current `mainImage`; the thumbnail row behaves like **tabs**—each button targets another asset. On click, your `script.js` should update the main `<img>` / `<video>` `src`, refresh `aria-selected` on the buttons, and swap video vs image in the main area if needed.

```liquid
<div role="region" aria-label="{{ product_name }} — gallery">
  <div>
    {% if mainImage contains '.mp4' %}
      <video
        src="{{ mainImage }}"
        controls
        playsinline
        autoplay
        muted
        preload="metadata"
      ></video>
    {% else %}
      <img
        id="gallery-main-image"
        src="{{ mainImage }}"
        alt="{{ product_name }}"
      />
    {% endif %}
  </div>

  {% if images.size > 1 %}
    <div role="tablist" aria-label="Product images">
      {% for image in images %}
        <button
          type="button"
          role="tab"
          aria-selected="{% if image == mainImage %}true{% else %}false{% endif %}"
          aria-label="View image {{ forloop.index }}"
          data-src="{{ image }}"
        >
          {% if image contains '.mp4' %}
            <video src="{{ image }}" muted playsinline preload="metadata"></video>
          {% else %}
            <img src="{{ image }}" alt="{{ product_name }}" loading="lazy" />
          {% endif %}
        </button>
      {% endfor %}
    </div>
  {% endif %}
</div>
```

---

## Product Details

**File:** `sections/product-details.liquid`

Displays the product name, price, rating, and optional short description.

### Variables

| Variable        | Type           | Description                                                  |
| --------------- | -------------- | ------------------------------------------------------------ |
| `product_name`  | string         | Product name                                                 |
| `price`         | number         | Regular price                                                |
| `sale_price`    | number \| null | Sale price (if on sale)                                      |
| `currency`      | string         | Currency symbol/code                                         |
| `rating`        | number         | Average rating (0–5)                                         |
| `reviews_count` | number         | Total number of reviews                                      |
| `description`   | string \| null | Short description (when `is_description_in_details` is true) |
| `theme_data`    | object         | Merchant-configured dynamic settings                         |

### Events

The `product-details` section supports wishlist and compare actions. Dispatch these events from any element inside the section — they bubble up to the React wrapper.

| Event             | Detail                  | Behavior                                                                         |
| ----------------- | ----------------------- | -------------------------------------------------------------------------------- |
| `toggle-wishlist` | `{ productId: string }` | Toggles the product in the wishlist (adds if absent, removes if already saved)   |
| `toggle-compare`  | `{ productId: string }` | Adds the product to the compare list (if not present) and opens the compare modal |

:::note
The `productId` in the event detail must match the product's `id` field as provided to the section by the storefront. Use `{{ product_id }}` if you pass it as a variable, or hardcode it from the product data.
:::

### Example

```liquid
<div class="product-details">
  <h1>{{ product_name }}</h1>

  <div class="price-row">
    {% if sale_price and sale_price < price %}
      <span class="price-old">{{ price }} {{ currency }}</span>
      <span class="price-sale">{{ sale_price }} {{ currency }}</span>
    {% else %}
      <span class="price">{{ price }} {{ currency }}</span>
    {% endif %}
  </div>

  {% if rating > 0 %}
    <div class="rating">
      {% assign full_stars = rating | floor %}
      {% for i in (1..5) %}
        {% if i <= full_stars %}
          <span class="star filled"></span>
        {% else %}
          <span class="star empty"></span>
        {% endif %}
      {% endfor %}
      <span>({{ reviews_count }})</span>
    </div>
  {% endif %}

  {% if description and description != "" %}
    <p class="short-desc">{{ description }}</p>
  {% endif %}

  <div class="product-actions">
    <button
      type="button"
      onclick="event.preventDefault();event.stopPropagation();
        this.dispatchEvent(new CustomEvent('toggle-wishlist',{
          bubbles:true,
          detail:{productId:'{{ product_id }}'}
        }))"
    >
      ♡ Wishlist
    </button>

    <button
      type="button"
      onclick="event.preventDefault();event.stopPropagation();
        this.dispatchEvent(new CustomEvent('toggle-compare',{
          bubbles:true,
          detail:{productId:'{{ product_id }}'}
        }))"
    >
      Compare
    </button>
  </div>
</div>
```

---

## Product Description

**File:** `sections/product-description.liquid`

Displays the full product description in an accordion item, then renders additional merchant policy items (shipping, refund, COD, etc.) from the `policies` list.

### Variables

| Variable            | Type                                                 | Description                            |
| ------------------- | ---------------------------------------------------- | -------------------------------------- |
| `description`       | string                                               | Full product description (HTML)        |
| `description_label` | string                                               | Translated label (e.g. "Description")  |
| `policies`          | `{ icon: string; title: string; content: string }[]` | Policy rows rendered after description |
| `theme_data`        | object                                               | Merchant-configured dynamic settings   |

:::info
The product description can optionally render **inside the product details area** instead of **below the main product column**, controlled by the `is_description_in_details` flag set in the admin panel. Policy/content rendering can be **accordion** or **tabs** based on your preference.
:::

### Full Example (Accordion)

This is a full example of the **accordion mode** using `product-description.liquid`, `style.css`, and `script.js`.

#### `sections/product-description.liquid`

```liquid
<div class="lq-desc-accordion">
  {% if description != "" %}
    <div class="lq-desc-item" data-open="true">
      <button class="lq-desc-toggle" type="button" aria-expanded="true">
        <span>{{ description_label }}</span>
        <span class="lq-desc-chevron"></span>
      </button>
      <div class="lq-desc-panel" style="display:block">
        <div class="lq-desc-content product_description">
          <div class="ql-editor leading-10" style="text-align:start" dir="auto">{{ description }}</div>
        </div>
      </div>
    </div>
  {% endif %}

  {% for policy in policies %}
    <div class="lq-desc-item">
      <button class="lq-desc-toggle" type="button" aria-expanded="false">
        <span class="lq-desc-toggle-label">
          <img src="{{ policy.icon }}" alt="" class="lq-desc-icon" />
          <span>{{ policy.title }}</span>
        </span>
        <span class="lq-desc-chevron"></span>
      </button>
      <div class="lq-desc-panel" style="display:none">
        <div class="lq-desc-content">{{ policy.content }}</div>
      </div>
    </div>
  {% endfor %}
</div>
```

#### `style.css`

```css
.lq-desc-accordion {
  margin-top: 1.5rem;
  border-top: 1px solid #e5e1dc;
}

.lq-desc-item {
  border-bottom: 1px solid #e5e1dc;
}

.lq-desc-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 0;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--hd-text, #212a2f);
  text-align: start;
}

.lq-desc-toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lq-desc-icon {
  width: 20px;
  height: 20px;
  min-width: 20px;
  opacity: 0.7;
}

.lq-desc-chevron {
  position: relative;
  display: inline-block;
  width: 14px;
  height: 14px;
  min-width: 14px;
}

.lq-desc-chevron::before,
.lq-desc-chevron::after {
  content: "";
  position: absolute;
  background: currentColor;
  transition: transform 0.25s ease;
}

.lq-desc-chevron::before {
  width: 14px;
  height: 1.5px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.lq-desc-chevron::after {
  width: 1.5px;
  height: 14px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.lq-desc-item[data-open="true"] .lq-desc-chevron::after {
  transform: translateX(-50%) scaleY(0);
}

.lq-desc-panel {
  overflow: hidden;
}

.lq-desc-content {
  padding: 0 0 1.25rem;
  font-size: 0.875rem;
  line-height: 1.75;
  color: #555;
}
```

#### `script.js`

```js
function initDescriptionAccordion() {
  var accordions = document.querySelectorAll(".lq-desc-accordion");

  for (var i = 0; i < accordions.length; i++) {
    var accordion = accordions[i];
    if (accordion.dataset.descInit) continue;

    accordion.dataset.descInit = "1";

    accordion.addEventListener("click", function (event) {
      var toggle = event.target.closest(".lq-desc-toggle");
      if (!toggle) return;

      var item = toggle.parentElement;
      var panel = item && item.querySelector(".lq-desc-panel");
      if (!panel) return;

      var isOpen = item.getAttribute("data-open") === "true";

      if (isOpen) {
        item.removeAttribute("data-open");
        toggle.setAttribute("aria-expanded", "false");
        panel.style.display = "none";
      } else {
        item.setAttribute("data-open", "true");
        toggle.setAttribute("aria-expanded", "true");
        panel.style.display = "block";
      }
    });
  }
}

initDescriptionAccordion();
```

### Full Example (Tabs)

This is a full example of the **tabs mode** using `product-description.liquid`, `style.css`, and `script.js`.

#### `sections/product-description.liquid`

```liquid
<div class="lq-desc-tabs">
  <div class="lq-desc-tab-nav" role="tablist">
    {% if description != "" %}
      <button
        class="lq-desc-tab active"
        role="tab"
        aria-selected="true"
        data-tab="description"
      >
        <span>{{ description_label }}</span>
      </button>
    {% endif %}

    {% for policy in policies %}
      <button
        class="lq-desc-tab"
        role="tab"
        aria-selected="false"
        data-tab="policy-{{ forloop.index0 }}"
      >
        <img src="{{ policy.icon }}" alt="" class="lq-desc-icon" />
        <span>{{ policy.title }}</span>
      </button>
    {% endfor %}
  </div>

  <div class="lq-desc-tab-panels">
    {% if description != "" %}
      <div class="lq-desc-tab-panel active" data-panel="description">
        <div class="lq-desc-content product_description">
          <div class="ql-editor leading-10" style="text-align:start" dir="auto">{{ description }}</div>
        </div>
      </div>
    {% endif %}

    {% for policy in policies %}
      <div class="lq-desc-tab-panel" data-panel="policy-{{ forloop.index0 }}">
        <div class="lq-desc-content">{{ policy.content }}</div>
      </div>
    {% endfor %}
  </div>
</div>
```

#### `style.css`

```css
.lq-desc-tabs {
  margin-top: 2.5rem;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04);
}

.lq-desc-tab-nav {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e5e1dc;
  overflow-x: auto;
  scrollbar-width: none;
}

.lq-desc-tab-nav::-webkit-scrollbar {
  display: none;
}

.lq-desc-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.875rem 1.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #999;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition:
    color 0.2s,
    border-color 0.2s;
}

.lq-desc-tab .lq-desc-icon {
  width: 16px;
  height: 16px;
  min-width: 16px;
  opacity: 0.6;
}

.lq-desc-tab.active,
.lq-desc-tab:hover {
  color: var(--hd-text, #212a2f);
}

.lq-desc-tab.active {
  border-bottom-color: var(--hd-text, #212a2f);
}

.lq-desc-tab-panels {
  padding: 1.5rem;
}

.lq-desc-tab-panel {
  display: none;
}

.lq-desc-tab-panel.active {
  display: block;
}

.lq-desc-tab-panel .lq-desc-content {
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.75;
  color: #555;
}
```

#### `script.js`

```js
function initDescriptionTabs() {
  var tabsWrappers = document.querySelectorAll(".lq-desc-tabs");

  for (var i = 0; i < tabsWrappers.length; i++) {
    var tabsWrapper = tabsWrappers[i];
    if (tabsWrapper.dataset.tabsInit) continue;

    tabsWrapper.dataset.tabsInit = "1";

    tabsWrapper.addEventListener("click", function (event) {
      var tab = event.target.closest(".lq-desc-tab");
      if (!tab) return;

      var tabKey = tab.getAttribute("data-tab");
      if (!tabKey) return;

      var tabs = tabsWrapper.querySelectorAll(".lq-desc-tab");
      var panels = tabsWrapper.querySelectorAll(".lq-desc-tab-panel");

      for (var j = 0; j < tabs.length; j++) {
        tabs[j].classList.remove("active");
        tabs[j].setAttribute("aria-selected", "false");
      }

      for (var k = 0; k < panels.length; k++) {
        panels[k].classList.remove("active");
      }

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      var activePanel = tabsWrapper.querySelector('[data-panel="' + tabKey + '"]');
      if (activePanel) activePanel.classList.add("active");
    });
  }
}

initDescriptionTabs();
```

---

## Fixed Buy Button

**File:** `sections/fixed-buy-button.liquid`

A sticky bar at the bottom of the product page with the product thumbnail, price, quantity controls, and a buy button.

### Variables

| Variable            | Type           | Description                                        |
| ------------------- | -------------- | -------------------------------------------------- |
| `product_name`      | string         | Product name                                       |
| `price`             | number         | Regular price                                      |
| `sale_price`        | number \| null | Sale price                                         |
| `currency`          | string         | Currency symbol/code                               |
| `thumb`             | string         | Product thumbnail URL                              |
| `buy_now_text`      | string         | Translated buy button label                        |
| `quantity`          | number         | Current quantity                                   |
| `disabled`          | boolean        | Whether the buy button is disabled                 |
| `hide_quantity`     | boolean        | Whether to hide quantity controls                  |
| `increase_disabled` | boolean        | Whether the + button is disabled (max qty reached) |
| `theme_data`        | object         | Merchant-configured dynamic settings               |

### Events

| Event                | Detail                                |
| -------------------- | ------------------------------------- |
| `buy-now`            | Triggers the add-to-cart / buy action |
| `increment-quantity` | Increases quantity by 1               |
| `decrement-quantity` | Decreases quantity by 1               |

### Example

```liquid
<div class="fixed-buy-bar">
  {% if thumb and thumb != "" %}
    <img src="{{ thumb }}" alt="{{ product_name }}" />
    <div class="fixed-buy-info">
      <span>{{ product_name }}</span>
      {% if sale_price and sale_price < price %}
        <span class="price-old">{{ price }} {{ currency }}</span>
        <span class="price-sale">{{ sale_price }} {{ currency }}</span>
      {% else %}
        <span>{{ price }} {{ currency }}</span>
      {% endif %}
    </div>
  {% endif %}

  {% unless hide_quantity %}
    <div class="qty-controls">
      <button type="button"
        onclick="this.dispatchEvent(new CustomEvent('increment-quantity',{bubbles:true}));"
        {% if increase_disabled %}disabled{% endif %}>+</button>
      <span>{{ quantity }}</span>
      <button type="button"
        onclick="this.dispatchEvent(new CustomEvent('decrement-quantity',{bubbles:true}));">-</button>
    </div>
  {% endunless %}

  <button type="button" {% if disabled %}disabled{% endif %}
    onclick="event.preventDefault();this.dispatchEvent(new CustomEvent('buy-now',{bubbles:true}));">
    {{ buy_now_text }}
  </button>
</div>
```

:::warning
All three events (`buy-now`, `increment-quantity`, `decrement-quantity`) **must** be dispatched as `CustomEvent` with `bubbles: true`. Without them, the buy button and quantity controls will not work.
:::

---

## Reviews

**File:** `sections/reviews.liquid`

Displays product reviews with ratings, comments, and images. Includes a button to open the review submission modal (handled by the app via React).

### Variables

| Variable                 | Type   | Description                                                         |
| ------------------------ | ------ | ------------------------------------------------------------------- |
| `reviews`                | array  | Review objects — each has `rating`, `user_name`, `comment`, `image` |
| `reviews_count`          | number | Total review count                                                  |
| `average_rating`         | number | Average rating (0–5)                                                |
| `average_rating_display` | string | Formatted average (e.g. "4.5")                                      |
| `t_users_reviews`        | string | Translated "Customer Reviews" heading                               |
| `t_reviews`              | string | Translated "reviews" label                                          |
| `t_share_your_review`    | string | Translated "Write a review" button text                             |
| `t_no_reviews`           | string | Translated "No reviews yet" text                                    |
| `theme_data`             | object | Merchant-configured dynamic settings                                |

### Data Attributes

| Attribute          | Element | Purpose                           |
| ------------------ | ------- | --------------------------------- |
| `data-review-open` | button  | Opens the review submission modal |

### Example

```liquid
<div class="reviews">
  <div class="reviews-header">
    <h2>{{ t_users_reviews }}</h2>
    <span>{{ average_rating_display }} ({{ reviews_count }} {{ t_reviews }})</span>
    <button data-review-open type="button">{{ t_share_your_review }}</button>
  </div>

  {% for review in reviews %}
    <div class="review-card">
      <div class="review-stars">
        {% for i in (1..5) %}
          {% if i <= review.rating %}
            <span class="star filled"></span>
          {% else %}
            <span class="star empty"></span>
          {% endif %}
        {% endfor %}
      </div>
      {% if review.user_name and review.user_name != "" %}
        <h3>{{ review.user_name }}</h3>
      {% endif %}
      <p>{{ review.comment }}</p>
      {% if review.image and review.image != "" %}
        <img src="{{ review.image }}" alt="{{ review.user_name }}" loading="lazy" />
      {% endif %}
    </div>
  {% endfor %}

  {% if reviews.size == 0 %}
    <p>{{ t_no_reviews }}</p>
  {% endif %}
</div>
```

---

## Related Products

**File:** `sections/related-products.liquid`  
**Section key:** `related_products`

A section rendered **below the product details** on the product page. It shows other products from the same category as the current product. The storefront renders this section only when `hide_related_products` is not set on the product and the product has at least one category.

### Variables

The same product variable contract as the homepage product sections applies here:

| Variable | Type | Description |
|----------|------|-------------|
| `products` | array | Related product objects from the same category |
| `category` | object \| null | The product's first category with `name`, `slug`, `thumb` |
| `section_title` | string | Translated "Similar products" heading |
| `currency` | string | Currency symbol/code |
| `add` | string | Translated "Add" button text |
| `shop_now` | string | Translated "Shop now" text |
| `sale` | string | Translated "Sale" label |
| `theme_data` | object | Merchant-configured dynamic settings |

**Product properties** and **variation properties** are identical to the other product sections.

### Events

| Event | Detail | Purpose |
|-------|--------|---------|
| `quick-add` | `{ productId: string }` | Adds the product to cart directly |
| `quick-view` | `{ productId: string }` | Opens a quick-view modal for the product |

### Example

```liquid
<section class="related-products">
  {% if section_title %}
    <h2 class="related-products-title">{{ section_title }}</h2>
  {% endif %}

  <div class="related-products-track">
    {% for product in products %}
      <a href="/products/{{ product.slug }}" class="product-card">
        {% if product.sale_price and product.sale_price < product.price %}
          {% assign discount = product.price | minus: product.sale_price | times: 100 | divided_by: product.price | floor %}
          <span class="badge">{{ sale }} -{{ discount }}%</span>
        {% endif %}

        <div class="product-media">
          <img src="{{ product.thumb }}" alt="{{ product.name }}" loading="lazy" />
          {% if product.images[0] %}
            <img class="hover-img" src="{{ product.images[0] }}" alt="{{ product.name }}" loading="lazy" />
          {% endif %}
          <button type="button"
            onclick="event.preventDefault();event.stopPropagation();this.dispatchEvent(new CustomEvent('quick-add',{bubbles:true,detail:{productId:'{{ product.id }}'}}));">
            {{ add }}
          </button>
        </div>

        <div class="product-info">
          <p>{{ product.name }}</p>
          {% if product.sale_price and product.sale_price < product.price %}
            <span class="price-old">{{ product.price }} {{ currency }}</span>
            <span class="price-sale">{{ product.sale_price }} {{ currency }}</span>
          {% else %}
            <span>{{ product.price }} {{ currency }}</span>
          {% endif %}
        </div>
      </a>
    {% endfor %}
  </div>
</section>
```

:::tip
Use a horizontal scrollable track (like `list-products.liquid`) for related products since the product page already has a lot of vertical content. Limit the products displayed to keep the page light — the storefront passes up to 5 products by default.
:::
