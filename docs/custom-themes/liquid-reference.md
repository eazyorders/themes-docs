---
sidebar_position: 4
---

# Liquid Reference

EasyOrders custom themes use [LiquidJS](https://liquidjs.com/) — a JavaScript implementation of the Liquid template language. Each section file (`.liquid`) is a Liquid template that gets rendered with store data injected as variables.

## Template Syntax

### Output: `{{ }}`

Print a variable's value:

```liquid
<h1>{{ product_name }}</h1>
<span>{{ price }} {{ currency }}</span>
```

### Tags: `{% %}`

Control flow and logic (not printed):

```liquid
{% if sale_price and sale_price < price %}
  <span class="on-sale">{{ sale_price }} {{ currency }}</span>
{% else %}
  <span>{{ price }} {{ currency }}</span>
{% endif %}
```

### Comments: `{% comment %}`

```liquid
{% comment %} This will not appear in the output {% endcomment %}
```

---

## Variables and Scope

### Auto-Injected: `theme_data`

Every section template automatically receives `theme_data` — the merchant-configured values from your `schema.json`. You never need to pass it explicitly:

```liquid
<h1 style="color: {{ theme_data.color_primary }}">
  {{ theme_data.hero_headline }}
</h1>
```

### Section-Specific Variables

Each section also receives its own set of variables (documented in [Layout sections](./sections/layout-sections), [Product sections](./sections/product-sections), [Home sections](./sections/home-sections), and [Utility sections](./sections/utility-sections)). For example, `product-details.liquid` receives `product_name`, `price`, `sale_price`, `currency`, `rating`, and `reviews_count`.

### Assigning Variables

Create local variables with `assign`:

```liquid
{% assign full_stars = rating | floor %}
{% assign discount = price | minus: sale_price | times: 100 | divided_by: price | floor %}

<span>-{{ discount }}%</span>
```

---

## Control Flow

### if / elsif / else

```liquid
{% if sale_price and sale_price < price %}
  <span class="sale">{{ sale_price }} {{ currency }}</span>
{% elsif price > 0 %}
  <span>{{ price }} {{ currency }}</span>
{% else %}
  <span>Free</span>
{% endif %}
```

### unless

The inverse of `if`:

```liquid
{% unless hide_quantity %}
  <div class="quantity-picker">...</div>
{% endunless %}
```

### case / when

```liquid
{% case announcement_config.type %}
  {% when "marquee" %}
    <div class="marquee">...</div>
  {% when "slider" %}
    <div class="slider">...</div>
  {% else %}
    <div class="simple">...</div>
{% endcase %}
```

---

## Loops

### for

```liquid
{% for product in products %}
  <div class="product-card">
    <h3>{{ product.name }}</h3>
    <span>{{ product.price }} {{ currency }}</span>
  </div>
{% endfor %}
```

### for with limit

```liquid
{% for product in products limit: 4 %}
  ...
{% endfor %}
```

### forloop Object

Inside a `for` loop you have access to the `forloop` object:

| Property | Type | Description |
|----------|------|-------------|
| `forloop.index` | number | Current iteration (1-based) |
| `forloop.index0` | number | Current iteration (0-based) |
| `forloop.first` | boolean | Is this the first iteration? |
| `forloop.last` | boolean | Is this the last iteration? |
| `forloop.length` | number | Total number of items |

```liquid
{% for item in announcement_config.text %}
  <span>{{ item }}</span>
  {% unless forloop.last %}
    <span class="separator">&mdash;</span>
  {% endunless %}
{% endfor %}
```

---

## Filters

Filters transform a value. Chain them with `|`:

```liquid
{{ "hello world" | upcase }}           → HELLO WORLD
{{ price | floor }}                     → 29
{{ price | minus: sale_price }}         → 10
```

### Common Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `floor` | Round down | `{{ 4.7 \| floor }}` → `4` |
| `ceil` | Round up | `{{ 4.1 \| ceil }}` → `5` |
| `round` | Round to nearest | `{{ 4.5 \| round }}` → `5` |
| `plus` | Add | `{{ 5 \| plus: 3 }}` → `8` |
| `minus` | Subtract | `{{ 10 \| minus: 3 }}` → `7` |
| `times` | Multiply | `{{ 5 \| times: 2 }}` → `10` |
| `divided_by` | Divide | `{{ 10 \| divided_by: 3 }}` → `3` |
| `modulo` | Remainder | `{{ 10 \| modulo: 3 }}` → `1` |
| `size` | Array/string length | `{{ images.size }}` → `5` |
| `first` | First element | `{{ images \| first }}` |
| `last` | Last element | `{{ images \| last }}` |
| `where` | Filter array by key | `{{ variations \| where: "type", "color" \| first }}` |
| `join` | Join array | `{{ tags \| join: ", " }}` |
| `split` | Split string | `{{ "a,b,c" \| split: "," }}` |
| `upcase` | Uppercase | `{{ name \| upcase }}` |
| `downcase` | Lowercase | `{{ name \| downcase }}` |
| `strip` | Trim whitespace | `{{ text \| strip }}` |
| `replace` | Replace substring | `{{ name \| replace: " ", "-" }}` |
| `contains` | Check substring (in if) | `{% if url contains ".mp4" %}` |
| `default` | Fallback value | `{{ title \| default: "Untitled" }}` |

### Chaining Filters

```liquid
{% assign discount = price | minus: sale_price | times: 100 | divided_by: price | floor %}
<span class="badge">-{{ discount }}%</span>
```

---

## Common Patterns

### Conditional CSS Classes

```liquid
<div class="slide{% if forloop.first %} active{% endif %}">
  {{ slide.title }}
</div>
```

### Image vs Video Detection

```liquid
{% if mainImage contains '.mp4' %}
  <video src="{{ mainImage }}" controls autoplay muted></video>
{% else %}
  <img src="{{ mainImage }}" alt="{{ product_name }}" />
{% endif %}
```

### Inline Style from theme_data

```liquid
<section style="--primary: {{ theme_data.color_primary }};">
  ...
</section>
```

### Product Variations (Color Swatches)

```liquid
{% assign color_variation = product.variations | where: "type", "color" | first %}
{% if color_variation and color_variation.props %}
  {% for prop in color_variation.props limit: 4 %}
    <span class="swatch" style="background: {{ prop.value }}" title="{{ prop.name }}"></span>
  {% endfor %}
{% endif %}
```

### Star Rating

```liquid
{% assign full_stars = rating | floor %}
{% assign decimal = rating | minus: full_stars %}
{% assign has_half = false %}
{% if decimal >= 0.25 and decimal < 0.75 %}
  {% assign has_half = true %}
{% elsif decimal >= 0.75 %}
  {% assign full_stars = full_stars | plus: 1 %}
{% endif %}

{% for i in (1..5) %}
  {% if i <= full_stars %}
    <span class="star filled"></span>
  {% elsif has_half and i == full_stars | plus: 1 %}
    <span class="star half"></span>
  {% else %}
    <span class="star empty"></span>
  {% endif %}
{% endfor %}
```

### Wishlist Toggle Button (Product Cards and Product Details)

Use the `toggle-wishlist` event on any button. The storefront adds or removes the product from the persisted wishlist:

```liquid
<button
  type="button"
  onclick="event.preventDefault();event.stopPropagation();
    this.dispatchEvent(new CustomEvent('toggle-wishlist',{
      bubbles:true,
      detail:{productId:'{{ product.id }}'}
    }))"
  aria-label="Add to wishlist"
>
  ♡
</button>
```

### Compare Toggle Button (Product Cards and Product Details)

Use the `toggle-compare` event to add a product to the compare list and open the compare modal:

```liquid
<button
  type="button"
  onclick="event.preventDefault();event.stopPropagation();
    this.dispatchEvent(new CustomEvent('toggle-compare',{
      bubbles:true,
      detail:{productId:'{{ product.id }}'}
    }))"
  aria-label="Compare"
>
  Compare
</button>
```

### Header Compare Badge and Wishlist Link

The header receives `compare_count` and `wishlist_count` as initial values at SSR time. The storefront keeps `#header-compare-count` and `#header-wishlist-count` in sync on every client-side update, just like `#header-cart-count`.

For compare, dispatch a `compare-click` event from the button to open the compare modal:

```liquid
<button
  type="button"
  onclick="this.dispatchEvent(new CustomEvent('compare-click',{bubbles:true}))"
  aria-label="Compare"
>
  ⇄
  <span id="header-compare-count" hidden>{{ compare_count }}</span>
</button>
```

For wishlist, use a plain `<a>` tag — no custom event is needed (link interception handles navigation):

```liquid
<a href="/wishlist" aria-label="Wishlist">
  ♡
  <span id="header-wishlist-count" hidden>{{ wishlist_count }}</span>
</a>
```

---

## Link Interception

Internal links in your Liquid templates are automatically intercepted for SPA (single-page app) navigation. When a user clicks a link like `/products/my-product` or `/collections/shoes`, the storefront uses client-side routing instead of a full page reload.

This happens automatically for same-origin `<a>` tags in sections that have link interception enabled (most sections). You don't need to do anything special — just use standard `<a href="...">` tags:

```liquid
<a href="/collections/{{ category.slug }}">{{ category.name }}</a>
<a href="/products/{{ product.slug }}">{{ product.name }}</a>
```

:::warning
External links (different domain) are **not** intercepted and work normally. If you need a link to open in a new tab, add `target="_blank" rel="noreferrer"` as usual.
:::
