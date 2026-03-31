---
sidebar_position: 3
---

# Home Sections

Home sections render on the store's homepage. They display the hero slider, category navigation, and product collections in different layouts.

---

## Slider

**File:** `sections/slider.liquid`

A hero image slider / carousel at the top of the homepage. Each slide is a link with an image, optional mobile image, and alt text.

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| `slides` | array | Slide objects (see properties below) |
| `theme_data` | object | Merchant-configured dynamic settings |

**Slide properties:**

| Property | Type | Description |
|----------|------|-------------|
| `slide.image` | string | Desktop image URL |
| `slide.mobile_image` | string \| null | Mobile-specific image URL |
| `slide.url` | string | Link destination |
| `slide.alt` | string | Alt text for the image |

### Data Attributes

None required.

### Events

None required. Links are automatically intercepted for SPA navigation.

### Example

```liquid
<section class="slider" data-autoplay="5000">
  <div class="slider-track">
    {% for slide in slides %}
      <a href="{{ slide.url }}"
         class="slide{% if forloop.first %} active{% endif %}">
        <picture>
          {% if slide.mobile_image %}
            <source media="(max-width: 768px)" srcset="{{ slide.mobile_image }}" />
          {% endif %}
          <img
            src="{{ slide.image }}"
            alt="{{ slide.alt }}"
            loading="{% if forloop.first %}eager{% else %}lazy{% endif %}"
          />
        </picture>
      </a>
    {% endfor %}
  </div>

  {% if slides.size > 1 %}
    <div class="slider-controls">
      <button class="slider-prev" aria-label="Previous"></button>
      <button class="slider-next" aria-label="Next"></button>
    </div>
  {% endif %}
</section>
```

:::tip
Use `loading="eager"` on the first slide and `loading="lazy"` on the rest for optimal performance. The `<picture>` element with `<source>` lets you serve different images for mobile and desktop.
:::

---

## Categories

**File:** `sections/categories.liquid`

A category grid or carousel that links to collection pages.

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| `categories` | array | Category objects (see properties below) |
| `theme_data` | object | Merchant-configured dynamic settings |

**Category properties:**

| Property | Type | Description |
|----------|------|-------------|
| `category.name` | string | Category display name |
| `category.slug` | string | URL slug |
| `category.thumb` | string | Category thumbnail image URL |

### Data Attributes

None required.

### Events

None required. Links are automatically intercepted for SPA navigation.

### Example

```liquid
<div class="categories">
  {% for category in categories %}
    <a href="/collections/{{ category.slug }}" class="category-card">
      <img src="{{ category.thumb }}" alt="{{ category.name }}" loading="lazy" />
      <span>{{ category.name }}</span>
    </a>
  {% endfor %}
</div>
```

---

## Products (Featured / List / Grid)

Three section files share the same variable contract but render products in different layouts:

| File | Layout | Typical Use |
|------|--------|-------------|
| `sections/featured-products.liquid` | Featured hero + card grid | Homepage featured collection |
| `sections/list-products.liquid` | Horizontal scrollable list | Homepage product carousel |
| `sections/grid-products.liquid` | Multi-column grid with hero | Homepage product grid |

### Variables (shared)

| Variable | Type | Description |
|----------|------|-------------|
| `products` | array | Product objects (see properties below) |
| `category` | object \| null | Parent category with `name`, `slug`, `thumb` |
| `section_title` | string | Section heading text |
| `currency` | string | Currency symbol/code |
| `add` | string | Translated "Add" button text |
| `shop_now` | string | Translated "Shop now" text |
| `sale` | string | Translated "Sale" label |
| `hide_view_all` | boolean | Whether to hide the "View all" link |
| `theme_data` | object | Merchant-configured dynamic settings |

**Product properties:**

| Property | Type | Description |
|----------|------|-------------|
| `product.id` | string | Product ID (used in events) |
| `product.name` | string | Product name |
| `product.slug` | string | URL slug |
| `product.price` | number | Regular price |
| `product.sale_price` | number \| null | Sale price |
| `product.thumb` | string | Main thumbnail URL |
| `product.images` | string[] | Additional image URLs |
| `product.variations` | array | Variation groups with `type` and `props[]` |

**Variation properties (for color swatches):**

| Property | Type | Description |
|----------|------|-------------|
| `variation.type` | string | `"color"` or `"image"` |
| `variation.props` | array | Swatch items with `name` and `value` |

### Events

| Event | Detail | Purpose |
|-------|--------|---------|
| `quick-add` | `{ productId: string }` | Adds the product to cart directly |
| `quick-view` | `{ productId: string }` | Opens a quick-view modal for the product |

Dispatch from your add-to-cart button:

```html
onclick="event.preventDefault();event.stopPropagation();this.dispatchEvent(new CustomEvent('quick-add',{bubbles:true,detail:{productId:'{{ product.id }}'}}))"
```

### Featured Products Example

```liquid
<section class="featured">
  {% if section_title %}
    <h2>{{ section_title }}</h2>
  {% endif %}

  <div class="featured-grid">
    {% for product in products limit: 4 %}
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

        <button type="button"
          onclick="event.preventDefault();event.stopPropagation();this.dispatchEvent(new CustomEvent('quick-add',{bubbles:true,detail:{productId:'{{ product.id }}'}}));">
          {{ add }}
        </button>
      </a>
    {% endfor %}
  </div>
</section>
```

### Color Swatches Pattern

All three product layouts can display color/image swatches from the product variations:

```liquid
{% assign color_variation = product.variations | where: "type", "color" | first %}
{% assign image_variation = product.variations | where: "type", "image" | first %}

{% if color_variation and color_variation.props %}
  {% for prop in color_variation.props limit: 4 %}
    <span class="swatch" style="background: {{ prop.value }}" title="{{ prop.name }}"></span>
  {% endfor %}
{% elsif image_variation and image_variation.props %}
  {% for prop in image_variation.props limit: 4 %}
    <span class="swatch swatch-image" title="{{ prop.name }}">
      <img src="{{ prop.value }}" alt="{{ prop.name }}" loading="lazy" />
    </span>
  {% endfor %}
{% endif %}
```

### Discount Badge Pattern

Calculate and display a percentage discount:

```liquid
{% if product.sale_price and product.sale_price < product.price %}
  {% assign discount = product.price | minus: product.sale_price | times: 100 | divided_by: product.price | floor %}
  <span class="badge">{{ sale }} -{{ discount }}%</span>
{% endif %}
```
