---
sidebar_position: 4
---

# Utility Sections

Utility sections provide social proof widgets (fake visitor counts, stock indicators, countdown timers) and special-purpose pages (thank-you and order invoice).

---

## Fake Visitor

**File:** `sections/fake-visitor.liquid`

Displays a simulated "X people are viewing this product" counter. The storefront animates the count between `min` and `max` on the client side.

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| `min` | number | Minimum visitor count |
| `max` | number | Maximum visitor count |
| `watching_text` | string | Translated text (e.g. "people are viewing this right now") |
| `theme_data` | object | Merchant-configured dynamic settings |

### Data Attributes

None required. The storefront reads `data-min` and `data-max` to drive the animation.

### Events

None required.

### Example

```liquid
<div class="fake-visitor" data-min="{{ min }}" data-max="{{ max }}">
  <span class="eye-icon" aria-hidden="true"></span>
  <p>
    <span class="visitor-count">{{ min }}</span> {{ watching_text }}
  </p>
</div>
```

---

## Fake Stock

**File:** `sections/fake-stock.liquid`

Displays a simulated low-stock indicator with a text message and optional progress bar.

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| `text` | string | Stock message (e.g. "Only 3 left in stock!") |
| `theme_data` | object | Merchant-configured dynamic settings |

### Data Attributes

None required.

### Events

None required.

### Example

```liquid
<div class="fake-stock">
  <p>{{ text }}</p>
  <div class="stock-bar">
    <div class="stock-fill"></div>
  </div>
</div>
```

---

## Fake Counter

**File:** `sections/fake-counter.liquid`

Displays a countdown timer. The storefront reads `data-hours` and `data-product-id` to calculate and animate the remaining time on the client side.

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| `hours` | number | Countdown duration in hours |
| `product_id` | string | Product ID (used to persist the timer) |
| `title` | string | Counter heading (e.g. "Hurry! Offer ends in") |
| `label_days` | string | Translated "Days" label |
| `label_hours` | string | Translated "Hours" label |
| `label_minutes` | string | Translated "Minutes" label |
| `label_seconds` | string | Translated "Seconds" label |
| `theme_data` | object | Merchant-configured dynamic settings |

### Data Attributes

The storefront reads these to drive the countdown:

| Attribute | Element | Purpose |
|-----------|---------|---------|
| `data-hours` | root element | Countdown duration in hours |
| `data-product-id` | root element | Product ID for persistence |
| `data-unit="days"` | span | Receives the days digit |
| `data-unit="hours"` | span | Receives the hours digit |
| `data-unit="minutes"` | span | Receives the minutes digit |
| `data-unit="seconds"` | span | Receives the seconds digit |

### Events

None required.

### Example

```liquid
<div class="countdown" data-product-id="{{ product_id }}" data-hours="{{ hours }}">
  <div class="countdown-header">
    <span>{{ title }}</span>
  </div>
  <div class="countdown-digits" dir="ltr">
    <div class="unit">
      <span data-unit="days">00</span>
      <span class="label">{{ label_days }}</span>
    </div>
    <span class="sep">:</span>
    <div class="unit">
      <span data-unit="hours">00</span>
      <span class="label">{{ label_hours }}</span>
    </div>
    <span class="sep">:</span>
    <div class="unit">
      <span data-unit="minutes">00</span>
      <span class="label">{{ label_minutes }}</span>
    </div>
    <span class="sep">:</span>
    <div class="unit">
      <span data-unit="seconds">00</span>
      <span class="label">{{ label_seconds }}</span>
    </div>
  </div>
</div>
```

---

## Thanks

**File:** `sections/thanks.liquid`

The thank-you page shown after a successful order. Can display custom HTML content or a default success message.

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| `content` | string \| null | Custom HTML content (overrides default) |
| `show_home_button` | boolean | Whether to show the "Go home" button |
| `thanks_title` | string | Translated title (e.g. "Thank you!") |
| `thanks_message` | string | Translated success message |
| `phone_message` | string \| null | Optional phone confirmation message |
| `go_home_text` | string | Translated "Go home" button text |
| `offers_text` | string \| null | Optional promotional text |
| `theme_data` | object | Merchant-configured dynamic settings |

### Events

| Event | Detail | Purpose |
|-------|--------|---------|
| `go-home` | — | Navigates to the store homepage |

### Example

```liquid
<div class="thanks">
  {% if content and content != "" %}
    <div class="thanks-custom">{{ content }}</div>
  {% else %}
    <div class="thanks-default">
      <h1>{{ thanks_title }}</h1>
      <p>{{ thanks_message }}</p>
      {% if phone_message and phone_message != "" %}
        <p>{{ phone_message }}</p>
      {% endif %}
    </div>
  {% endif %}

  {% if show_home_button %}
    <button type="button"
      onclick="this.dispatchEvent(new CustomEvent('go-home',{bubbles:true}));">
      {{ go_home_text }}
    </button>
  {% endif %}

  {% if offers_text and offers_text != "" %}
    <p class="offers">{{ offers_text }}</p>
  {% endif %}
</div>
```

---

## Order Invoice

**File:** `sections/order-invoice.liquid`

Displays the full order details — shipping info, line items, totals, and a copy-tracking-link button. This section has the most variables of any section.

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| `order` | object | Full order object (see properties below) |
| `order_notes` | array | Order timeline notes — each has `note` and `created_at` |
| `currency` | string | Currency symbol/code |
| `logo` | string | Store logo URL |
| `store_name` | string | Store name |
| `tracking_link` | string | Order tracking URL |
| `has_contact` | boolean | Whether store has contact info |
| `contact_phone` | string | Store phone |
| `contact_email` | string | Store email |
| `contact_address` | string | Store address |

**Translation variables** (all strings):

`t_copy_tracking_link`, `t_phone`, `t_email`, `t_address`, `t_shipping_details`, `t_name`, `t_country`, `t_government`, `t_payment_details`, `t_order_created`, `t_order_status`, `t_items_count`, `t_piece_price`, `t_total`, `t_product_total`, `t_shipping_cost`, `t_free_shipping`, `t_coupon_code`

**Order properties:**

| Property | Type | Description |
|----------|------|-------------|
| `order.full_name` | string | Customer full name |
| `order.phone` | string | Customer phone |
| `order.email` | string | Customer email |
| `order.country` | string | Shipping country |
| `order.government` | string | Shipping state/governorate |
| `order.address` | string | Shipping address |
| `order.payment_method` | string | Payment method label |
| `order.transfer_receipt` | string | Bank transfer receipt image URL |
| `order.status_label` | string | Translated order status |
| `order.created_at` | string | Formatted creation date |
| `order.cart_items` | array | Line items (see below) |
| `order.cost` | number | Subtotal |
| `order.shipping_cost` | number | Shipping cost |
| `order.total_cost` | number | Grand total |
| `order.is_digital` | boolean | Whether it's a digital-only order |
| `order.coupon_code` | string | Applied coupon code |
| `order.coupon_discount` | number | Coupon discount amount |

**Cart item properties:**

| Property | Type | Description |
|----------|------|-------------|
| `item.name` | string | Product name |
| `item.thumb` | string | Product thumbnail |
| `item.quantity` | number | Quantity ordered |
| `item.price` | number | Unit price |
| `item.total` | number | Line total |
| `item.variants` | string | Selected variant text |
| `item.metadata_html` | string | Additional metadata HTML |

### Events

| Event | Detail | Purpose |
|-------|--------|---------|
| `copy-tracking-link` | `{ link: string }` | Copies the tracking link to clipboard and shows a toast |

### Example (Abbreviated)

```liquid
<div class="invoice">
  <div class="invoice-header">
    {% if logo and logo != "" %}
      <img src="{{ logo }}" alt="{{ store_name }}" />
    {% endif %}
    <button type="button"
      onclick="this.dispatchEvent(new CustomEvent('copy-tracking-link',{bubbles:true,detail:{link:'{{ tracking_link }}'}}));">
      {{ t_copy_tracking_link }}
    </button>
  </div>

  <div class="invoice-status">
    <span>{{ t_order_status }}:</span>
    <span>{{ order.status_label }}</span>
  </div>

  <div class="invoice-items">
    {% for item in order.cart_items %}
      <div class="invoice-item">
        {% if item.thumb and item.thumb != "" %}
          <img src="{{ item.thumb }}" alt="{{ item.name }}" />
        {% endif %}
        <div>
          <h4>{{ item.name }}</h4>
          {% if item.variants and item.variants != "" %}
            <p>{{ item.variants }}</p>
          {% endif %}
          <p>{{ t_items_count }}: {{ item.quantity }}</p>
          <p>{{ t_piece_price }}: {{ item.price }} {{ currency }}</p>
        </div>
        <span>{{ t_total }} {{ item.total }} {{ currency }}</span>
      </div>
    {% endfor %}
  </div>

  <div class="invoice-totals">
    <div><dt>{{ t_product_total }}:</dt><dd>{{ order.cost }} {{ currency }}</dd></div>
    {% unless order.is_digital %}
      <div>
        <dt>{{ t_shipping_cost }}:</dt>
        <dd>{% if order.shipping_cost %}{{ order.shipping_cost }} {{ currency }}{% else %}{{ t_free_shipping }}{% endif %}</dd>
      </div>
    {% endunless %}
    {% if order.coupon_code and order.coupon_code != "" %}
      <div><dt>{{ t_coupon_code }}: {{ order.coupon_code }}</dt><dd>{{ order.coupon_discount }} {{ currency }}</dd></div>
    {% endif %}
    <div class="total-row"><dt>{{ t_total }}:</dt><dd>{{ order.total_cost }} {{ currency }}</dd></div>
  </div>
</div>
```
