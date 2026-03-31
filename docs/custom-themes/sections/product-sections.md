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
</div>
```

---

## Product Description

**File:** `sections/product-description.liquid`

Displays the full product description, typically in an accordion or tab layout. The storefront can optionally inject merchant policy content (shipping, refund, COD policies) into this section.

### Variables

| Variable            | Type   | Description                           |
| ------------------- | ------ | ------------------------------------- |
| `description`       | string | Full product description (HTML)       |
| `description_label` | string | Translated label (e.g. "Description") |
| `theme_data`        | object | Merchant-configured dynamic settings  |

### Data Attributes

These attributes are **optional** — if present, the storefront will inject Google Merchant policy accordions/tabs into them:

| Attribute              | Element   | Purpose                                   |
| ---------------------- | --------- | ----------------------------------------- |
| `data-policies`        | container | Receives full policy accordion/tab markup |
| `data-policies-nav`    | container | Receives policy tab navigation buttons    |
| `data-policies-panels` | container | Receives policy tab panel content         |

Use **either** `data-policies` (for a self-contained accordion) **or** both `data-policies-nav` + `data-policies-panels` (for a tabbed layout).

### Example

```liquid
<div class="description-accordion">
  {% if description != "" %}
    <div class="desc-item" data-open="true">
      <button class="desc-toggle" type="button" aria-expanded="true">
        <span>{{ description_label }}</span>
      </button>
      <div class="desc-panel" style="display:block">
        <div class="desc-content">{{ description }}</div>
      </div>
    </div>
  {% endif %}
  <div data-policies></div>
</div>
```

:::info
The product description can optionally render **inside the product details area** instead of **below the main product column**, controlled by the `is_description_in_details` flag set in the admin panel.
:::

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

| Event                | Detail | Purpose                               |
| -------------------- | ------ | ------------------------------------- |
| `buy-now`            | —      | Triggers the add-to-cart / buy action |
| `increment-quantity` | —      | Increases quantity by 1               |
| `decrement-quantity` | —      | Decreases quantity by 1               |

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
