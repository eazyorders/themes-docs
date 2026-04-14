---
sidebar_position: 3
---

# Home Sections

Home sections render on the store's homepage. They display the hero slider, category navigation, and product collections in different layouts.

---

## Slider

**File:** `sections/slider.liquid`

A hero image slider / carousel. Each slide uses `image` as the main source and can optionally use `mobile_image` on small screens.

### Variables

| Variable     | Type   | Description                          |
| ------------ | ------ | ------------------------------------ |
| `slides`     | array  | Slide objects (see properties below) |
| `theme_data` | object | Merchant-configured dynamic settings |

**Slide properties:**

| Property             | Type           | Description                                                   |
| -------------------- | -------------- | ------------------------------------------------------------- |
| `slide.image`        | string         | Main image URL (desktop + tablet, and fallback for all sizes) |
| `slide.mobile_image` | string \| null | Optional mobile image URL used on screens `<= 425px`          |
| `slide.url`          | string \| null | Optional link destination                                     |
| `slide.alt`          | string         | Alt text for the image                                        |

:::info
Render an `<a>` element only when `slide.url` is not empty; otherwise render a non-clickable `<div>`.
Use a `<picture>` element to serve `slide.mobile_image` on small screens and `slide.image` for the rest.
See example for more details.
:::

### Example

```liquid
<section class="slider">
  <div class="slider-track">
    {% for slide in slides %}
      {% if slide.url != blank %}
        <a href="{{ slide.url }}" class="slide{% if forloop.first %} active{% endif %}">
          <picture>
            {% if slide.mobile_image != blank %}
              <source media="(max-width: 425px)" srcset="{{ slide.mobile_image }}" />
              <source media="(min-width: 426px)" srcset="{{ slide.image }}" />
            {% endif %}
            <img
              src="{{ slide.image }}"
              alt="{{ slide.alt | default: "Slide image" }}"
              loading="{% if forloop.first %}eager{% else %}lazy{% endif %}"
            />
          </picture>
        </a>
      {% else %}
        <div class="slide{% if forloop.first %} active{% endif %}">
          <picture>
            {% if slide.mobile_image != blank %}
              <source media="(max-width: 425px)" srcset="{{ slide.mobile_image }}" />
              <source media="(min-width: 426px)" srcset="{{ slide.image }}" />
            {% endif %}
            <img
              src="{{ slide.image }}"
              alt="{{ slide.alt | default: "Slide image" }}"
              loading="{% if forloop.first %}eager{% else %}lazy{% endif %}"
            />
          </picture>
        </div>
      {% endif %}
    {% endfor %}
  </div>
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

| Variable     | Type   | Description                             |
| ------------ | ------ | --------------------------------------- |
| `categories` | array  | Category objects (see properties below) |
| `theme_data` | object | Merchant-configured dynamic settings    |

**Category properties:**

| Property         | Type   | Description                  |
| ---------------- | ------ | ---------------------------- |
| `category.name`  | string | Category display name        |
| `category.slug`  | string | URL slug                     |
| `category.thumb` | string | Category thumbnail image URL |

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

## Products (Featured / List / Home Grid)

Three section files share the same variable contract but render products in different layouts on the **homepage**:

| File                                 | Layout                      | Typical Use                  |
| ------------------------------------ | --------------------------- | ---------------------------- |
| `sections/featured-products.liquid`  | Featured hero + card grid   | Homepage featured collection |
| `sections/list-products.liquid`      | Horizontal scrollable list  | Homepage product carousel    |
| `sections/home-products-grid.liquid` | Multi-column grid with hero | Homepage product grid        |

### Variables (shared)

| Variable        | Type           | Description                                  |
| --------------- | -------------- | -------------------------------------------- |
| `products`      | array          | Product objects (see properties below)       |
| `category`      | object \| null | Parent category with `name`, `slug`, `thumb` |
| `section_title` | string         | Section heading text                         |
| `currency`      | string         | Currency symbol/code                         |
| `add`           | string         | Translated "Add" button text                 |
| `shop_now`      | string         | Translated "Shop now" text                   |
| `sale`          | string         | Translated "Sale" label                      |
| `hide_view_all` | boolean        | Whether to hide the "View all" link          |
| `theme_data`    | object         | Merchant-configured dynamic settings         |

**Product properties:**

| Property             | Type           | Description                                |
| -------------------- | -------------- | ------------------------------------------ |
| `product.id`         | string         | Product ID (used in events)                |
| `product.name`       | string         | Product name                               |
| `product.slug`       | string         | URL slug                                   |
| `product.price`      | number         | Regular price                              |
| `product.sale_price` | number \| null | Sale price                                 |
| `product.thumb`      | string         | Main thumbnail URL                         |
| `product.images`     | string[]       | Additional image URLs                      |
| `product.variations` | array          | Variation groups with `type` and `props[]` |

**Variation properties (for color swatches):**

| Property          | Type   | Description                          |
| ----------------- | ------ | ------------------------------------ |
| `variation.type`  | string | `"color"` or `"image"`               |
| `variation.props` | array  | Swatch items with `name` and `value` |

### Events

| Event             | Detail                  | Purpose                                                                           |
| ----------------- | ----------------------- | --------------------------------------------------------------------------------- |
| `quick-add`       | `{ productId: string }` | Adds the product to cart directly                                                 |
| `quick-view`      | `{ productId: string }` | Opens a quick-view modal for the product                                          |
| `toggle-wishlist` | `{ productId: string }` | Toggles the product in the wishlist (adds if absent, removes if already saved)    |
| `toggle-compare`  | `{ productId: string }` | Adds the product to the compare list (if not present) and opens the compare modal |

Dispatch from your add-to-cart button:

```html
onclick="event.preventDefault();event.stopPropagation();this.dispatchEvent(new
CustomEvent('quick-add',{bubbles:true,detail:{productId:'{{ product.id }}'}}))"
```

Dispatch from your wishlist / compare buttons:

```html
<button type="button"
  onclick="event.preventDefault();event.stopPropagation();
    this.dispatchEvent(new CustomEvent('toggle-wishlist',{bubbles:true,detail:{productId:'{{ product.id }}'}}))">
  ♡
</button>

<button type="button"
  onclick="event.preventDefault();event.stopPropagation();
    this.dispatchEvent(new CustomEvent('toggle-compare',{bubbles:true,detail:{productId:'{{ product.id }}'}}))">
  Compare
</button>
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

---

## Products Grid (Search & Collections pages)

**File:** `sections/products-grid.liquid`  
**Section key:** `products_grid`

A product grid rendered on the **search page** and **collection pages** (browsing a category). Unlike the homepage grid (`home-products-grid.liquid`), this template has no hero block and renders all products received from the current page of results. The "load more" button is rendered outside the Liquid template by the storefront.

### Variables (shared)

The same product variable contract as the homepage product sections applies here:

| Variable        | Type           | Description                                                                             |
| --------------- | -------------- | --------------------------------------------------------------------------------------- |
| `products`      | array          | Current page of product objects                                                         |
| `category`      | object \| null | Current category with `name`, `slug`, `thumb` (collections page only; `null` on search) |
| `section_title` | string         | Section heading — category name on collections, search query on search page             |
| `currency`      | string         | Currency symbol/code                                                                    |
| `add`           | string         | Translated "Add" button text                                                            |
| `shop_now`      | string         | Translated "Shop now" text                                                              |
| `sale`          | string         | Translated "Sale" label                                                                 |
| `hide_view_all` | boolean        | Always `true` on this section (storefront hides the view-all link)                      |
| `theme_data`    | object         | Merchant-configured dynamic settings                                                    |

**Product properties** and **variation properties** are identical to the other product sections — see above.

### Events

| Event             | Detail                  | Purpose                                                                           |
| ----------------- | ----------------------- | --------------------------------------------------------------------------------- |
| `quick-add`       | `{ productId: string }` | Adds the product to cart directly                                                 |
| `quick-view`      | `{ productId: string }` | Opens a quick-view modal for the product                                          |
| `toggle-wishlist` | `{ productId: string }` | Toggles the product in the wishlist (adds if absent, removes if already saved)    |
| `toggle-compare`  | `{ productId: string }` | Adds the product to the compare list (if not present) and opens the compare modal |

### Example

```liquid
<section class="products-grid">
  {% if section_title %}
    <h2 class="products-grid-title">{{ section_title }}</h2>
  {% endif %}

  <div class="products-grid-wrap">
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

:::info
On collections pages the storefront renders a "Load more" button **outside** this template using React. Each click fetches the next page and re-renders this template with the full accumulated product list.
:::
