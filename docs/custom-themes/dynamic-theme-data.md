---
sidebar_position: 3
---

# Dynamic Theme Data

Dynamic theme data lets merchants customize your theme without touching code. You define a **schema** (`schema.json`) that describes the available settings, and merchants fill in the values through the admin panel. Those values are then available in every Liquid template as `theme_data`.

## How It Works

```
schema.json (you write)
    ↓
Home builder theme settings renders a settings form from the schema
    ↓
Merchant fills in values → stored as theme_data
    ↓
Every Liquid template receives {{ theme_data.your_key }}
```

1. You define the schema in `schema.json` — an array of field definitions.
2. The admin panel generates a settings form from your schema.
3. Merchants fill in the form (colors, text, toggles, repeatable items, etc.).
4. The values are stored as `theme_data` — a flat key-value object.
5. Every Liquid section template automatically receives `theme_data` in its render context.

---

## Schema Field Types

Your `schema.json` is an array of field objects. Each field has a `name`, `type`, `description`, and optional `default`.

### Primitive Fields

| Type       | Renders As     | Value                            |
| ---------- | -------------- | -------------------------------- |
| `string`   | Text input     | `string`                         |
| `number`   | Number input   | `number`                         |
| `color`    | Color picker   | `string` (hex, e.g. `"#1A1A2E"`) |
| `boolean`  | Toggle switch  | `true` / `false`                 |
| `checkbox` | Checkbox       | `true` / `false`                 |
| `image`    | Image uploader | `string` (URL of the uploaded image) |

```json
{
  "name": "hero_headline",
  "type": "string",
  "default": "Welcome to Our Store",
  "description": "Hero headline text"
}
```

```json
{
  "name": "font_size_base",
  "type": "number",
  "default": 16,
  "description": "Base font size in px"
}
```

```json
{
  "name": "color_primary",
  "type": "color",
  "default": "#1A1A2E",
  "description": "Primary brand color"
}
```

```json
{
  "name": "hero_show_overlay",
  "type": "boolean",
  "default": true,
  "description": "Show dark overlay on hero image"
}
```

```json
{
  "name": "hero_background_image",
  "type": "image",
  "default": "",
  "description": "Hero background image"
}
```

The merchant sees an image upload area with drag-and-drop support and a live preview. The stored value is a plain URL string — use it in Liquid exactly like any other string field:

```liquid
{% if theme_data.hero_background_image != blank %}
  <img src="{{ theme_data.hero_background_image }}" alt="Hero" />
{% endif %}
```

### Select Field

A dropdown with predefined options. The value is a single string.

```json
{
  "name": "color_scheme",
  "type": "select",
  "default": "light",
  "options": [
    { "label": "Light", "value": "light" },
    { "label": "Dark", "value": "dark" },
    { "label": "System default", "value": "system" }
  ],
  "description": "Base color scheme"
}
```

### Multi-Select Field

A multi-select dropdown. The value is an array of strings.

```json
{
  "name": "product_badge_types",
  "type": "multi_select",
  "default": ["sale", "new"],
  "options": [
    { "label": "Sale", "value": "sale" },
    { "label": "New arrival", "value": "new" },
    { "label": "Bestseller", "value": "bestseller" },
    { "label": "Low stock", "value": "low_stock" },
    { "label": "Sold out", "value": "sold_out" }
  ],
  "description": "Active product badge types"
}
```

### Entity Multi-Select Fields (Products / Categories / Pages)

Three special multi-select types let merchants pick **store entities** — products, categories, or simple pages — from a searchable list. The settings form renders a debounced search input, a reorderable list of chosen items, and a remove button per item. The merchant can:

- Search the catalog as they type (server-side, paginated)
- Add multiple items
- Reorder items with up / down buttons
- Remove items individually

| Field type              | Renders As                   | Value                     | Searches In     |
| ----------------------- | ---------------------------- | ------------------------- | --------------- |
| `product_multi_select`  | Searchable products picker   | `string[]` (product IDs)  | `/products`     |
| `category_multi_select` | Searchable categories picker | `string[]` (category IDs) | `/categories`   |
| `page_multi_select`     | Searchable pages picker      | `string[]` (page IDs)     | `/simple-pages` |

The stored value is **always a flat array of string IDs in the merchant's chosen order** — no names, slugs, thumbnails, or any other entity data. The theme author is responsible for fetching the entity records and mapping the IDs to whatever data their template needs (see [Resolving IDs in templates](#resolving-ids-in-templates) below).

:::tip
When you resolve those IDs in the **browser** (e.g. Pattern B with `fetch`), handle **loading** (placeholders, skeletons, or reserved space so the layout does not jump) and **errors** (network failures, non-OK responses, empty or unexpected payloads) not only the happy path.
:::

```json
{
  "name": "featured_product_ids",
  "type": "product_multi_select",
  "description": "Featured products (homepage)"
}
```

```json
{
  "name": "footer_category_ids",
  "type": "category_multi_select",
  "description": "Categories shown in footer"
}
```

```json
{
  "name": "footer_page_ids",
  "type": "page_multi_select",
  "description": "Pages linked from footer"
}
```

:::info
These three field types do **not** accept `default`, `options`, `min`, or `max`. They always start as an empty array and have no upper limit on how many items can be selected — slice or paginate inside your Liquid template if you need to cap how many items render.
:::

#### Resolving IDs in Templates

`theme_data` only contains the array of IDs the merchant picked. To render names, prices, thumbnails, etc., resolve the IDs against the data your section already receives, or fetch them client-side from your `script.js`.

##### Pattern A — Filter from data already in scope

Sections like `featured-products`, `list-products`, and `home-products-grid` already receive a `products` array. You can pick out the merchant's selection in pure Liquid:

```liquid
{% comment %} Render only the products the merchant featured, in their chosen order {% endcomment %}
{% for fid in theme_data.featured_product_ids %}
  {% assign featured = products | where: "id", fid | first %}
  {% if featured %}
    <a href="/products/{{ featured.slug }}" class="product-card">
      <img src="{{ featured.thumb }}" alt="{{ featured.name }}" />
      <p>{{ featured.name }}</p>
      <span>{{ featured.price }} {{ currency }}</span>
    </a>
  {% endif %}
{% endfor %}
```

##### Pattern B — Print IDs and hydrate via `script.js`

When the section doesn't receive the entity in its template variables (or you want to be lazy about it), print the IDs as a JSON list and hydrate from your `script.js` using the storefront API:

```liquid
<div
  class="featured-products"
  data-product-ids='[{% for id in theme_data.featured_product_ids %}"{{ id }}"{% unless forloop.last %},{% endunless %}{% endfor %}]'
></div>
```

```js
document.querySelectorAll(".featured-products").forEach(async (el) => {
  const ids = JSON.parse(el.dataset.productIds);
  if (ids.length === 0) return;
  const res = await fetch(
    `/api/products?filter=id||$in||${ids.join(",")}&limit=${ids.length}`
  );
  const { data } = await res.json();
  // render `data` into `el`, preserving the merchant's order
});
```

:::tip
Always preserve the merchant's order when rendering — the array order is the display order they configured in the builder.
:::

### Object Array Field

A repeatable group of fields. Merchants can add, remove, and reorder items. Each item is an object with its own fields — primitive, select, multi-select, and the [entity multi-select](#entity-multi-select-fields-products--categories--pages) types are all allowed inside. Nested `object_array` fields are not supported.

```json
{
  "name": "hero_slides",
  "type": "object_array",
  "description": "Hero slides",
  "fields": [
    {
      "name": "image",
      "type": "image",
      "default": "",
      "description": "Slide background image"
    },
    {
      "name": "title",
      "type": "string",
      "default": "",
      "description": "Slide headline"
    },
    {
      "name": "overlay_opacity",
      "type": "number",
      "default": 40,
      "description": "Overlay darkness (0–100)"
    },
    {
      "name": "text_color",
      "type": "color",
      "default": "#FFFFFF",
      "description": "Slide text color"
    },
    {
      "name": "enabled",
      "type": "boolean",
      "default": true,
      "description": "Enable this slide"
    },
    {
      "name": "cta_style",
      "type": "select",
      "default": "filled",
      "options": [
        { "label": "Filled", "value": "filled" },
        { "label": "Outline", "value": "outline" },
        { "label": "Text only", "value": "text" }
      ],
      "description": "CTA button style"
    },
    {
      "name": "show_on_devices",
      "type": "multi_select",
      "default": ["desktop", "mobile"],
      "options": [
        { "label": "Desktop", "value": "desktop" },
        { "label": "Tablet", "value": "tablet" },
        { "label": "Mobile", "value": "mobile" }
      ],
      "description": "Show this slide on"
    }
  ]
}
```

---

## Complete Example: schema.json

Here is a full `schema.json` demonstrating every field type:

```json
[
  {
    "name": "hero_headline",
    "type": "string",
    "default": "Welcome to Our Store",
    "description": "Hero headline text"
  },
  {
    "name": "hero_background_image",
    "type": "image",
    "default": "",
    "description": "Hero background image"
  },
  {
    "name": "font_size_base",
    "type": "number",
    "default": 16,
    "description": "Base font size in px"
  },
  {
    "name": "color_primary",
    "type": "color",
    "default": "#1A1A2E",
    "description": "Primary brand color"
  },
  {
    "name": "hero_show_overlay",
    "type": "boolean",
    "default": true,
    "description": "Show dark overlay on hero image"
  },
  {
    "name": "color_scheme",
    "type": "select",
    "default": "light",
    "options": [
      { "label": "Light", "value": "light" },
      { "label": "Dark", "value": "dark" },
      { "label": "System default", "value": "system" }
    ],
    "description": "Base color scheme"
  },
  {
    "name": "product_badge_types",
    "type": "multi_select",
    "default": ["sale", "new"],
    "options": [
      { "label": "Sale", "value": "sale" },
      { "label": "New arrival", "value": "new" },
      { "label": "Bestseller", "value": "bestseller" }
    ],
    "description": "Active product badge types"
  },
  {
    "name": "featured_product_ids",
    "type": "product_multi_select",
    "description": "Featured products (homepage hero)"
  },
  {
    "name": "footer_category_ids",
    "type": "category_multi_select",
    "description": "Categories shown in footer"
  },
  {
    "name": "footer_page_ids",
    "type": "page_multi_select",
    "description": "Pages linked from footer"
  },
  {
    "name": "hero_slides",
    "type": "object_array",
    "description": "Hero slides",
    "fields": [
      {
        "name": "image",
        "type": "image",
        "default": "",
        "description": "Slide background image"
      },
      {
        "name": "title",
        "type": "string",
        "default": "",
        "description": "Slide headline"
      },
      {
        "name": "text_color",
        "type": "color",
        "default": "#FFFFFF",
        "description": "Slide text color"
      },
      {
        "name": "enabled",
        "type": "boolean",
        "default": true,
        "description": "Enable this slide"
      },
      {
        "name": "linked_product_ids",
        "type": "product_multi_select",
        "description": "Products linked from this slide"
      }
    ]
  }
]
```

---

## Accessing Theme Data in Liquid

The `theme_data` object is automatically injected into **every** section template. Access values using dot notation:

### Simple Values

```liquid
<h1>{{ theme_data.hero_headline }}</h1>

<p style="font-size: {{ theme_data.font_size_base }}px;">
  Welcome to our store
</p>

{% if theme_data.hero_show_overlay %}
  <div class="hero-overlay"></div>
{% endif %}
```

### Select Values

```liquid
<body class="scheme-{{ theme_data.color_scheme }}">
  ...
</body>
```

### Multi-Select Values

```liquid
{% for badge_type in theme_data.product_badge_types %}
  {% if badge_type == "sale" and product.sale_price %}
    <span class="badge badge-sale">Sale</span>
  {% endif %}
{% endfor %}
```

### Object Array Values

```liquid
{% for slide in theme_data.hero_slides %}
  {% if slide.enabled %}
    <div class="slide" style="color: {{ slide.text_color }}">
      {% if slide.image != blank %}
        <img src="{{ slide.image }}" alt="{{ slide.title }}" />
      {% endif %}
      <h2>{{ slide.title }}</h2>
    </div>
  {% endif %}
{% endfor %}
```

### Entity Multi-Select Values (IDs)

`product_multi_select`, `category_multi_select`, and `page_multi_select` are stored as a flat array of **string IDs**. Resolve them inside your template against entities already in scope, or print them and hydrate from `script.js`. See [Resolving IDs in Templates](#resolving-ids-in-templates) for the full pattern.

```liquid
{% comment %} Render the merchant's featured products in their chosen order {% endcomment %}
<div class="featured">
  {% for fid in theme_data.featured_product_ids %}
    {% assign featured = products | where: "id", fid | first %}
    {% if featured %}
      <a href="/products/{{ featured.slug }}">{{ featured.name }}</a>
    {% endif %}
  {% endfor %}
</div>
```

---

## Using Theme Data in CSS

You can also use `theme_data` values as inline styles to make CSS dynamic:

```liquid
<section
  class="hero"
  style="
    --primary: {{ theme_data.color_primary }};
    --font-base: {{ theme_data.font_size_base }}px;
  "
>
  <h1>{{ theme_data.hero_headline }}</h1>
</section>
```

Then reference those variables in `style.css`:

```css
.hero {
  color: var(--primary);
  font-size: var(--font-base);
}
```

:::tip
For global color values, prefer using the [Palette](./palette) system instead of `theme_data`. The palette automatically injects CSS variables on `:root`. Use `theme_data` for settings that go beyond the built-in palette colors — fonts, toggle flags, content strings, repeatable items, etc.
:::

---

## Schema Field Reference

| Property      | Required                                                                                    | Type     | Description                                                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | Yes                                                                                         | `string` | Unique key — becomes `theme_data.{name}` in Liquid                                                                                                                         |
| `type`        | Yes                                                                                         | `string` | One of: `string`, `number`, `color`, `boolean`, `checkbox`, `image`, `select`, `multi_select`, `product_multi_select`, `category_multi_select`, `page_multi_select`, `object_array` |
| `description` | Yes                                                                                         | `string` | Label shown to merchants in the settings form                                                                                                                              |
| `default`     | No (not allowed for `product_multi_select` / `category_multi_select` / `page_multi_select`) | varies   | Default value when merchant hasn't set one                                                                                                                                 |
| `options`     | For `select` / `multi_select`                                                               | `array`  | Array of `{ label, value }` objects                                                                                                                                        |
| `fields`      | For `object_array`                                                                          | `array`  | Array of nested field definitions (primitive, select, multi-select, or entity multi-select — no nested object arrays)                                                      |

### Stored Value by Type

| Type                    | Stored Value                                     | Example                    |
| ----------------------- | ------------------------------------------------ | -------------------------- |
| `string`                | `string`                                         | `"Welcome"`                |
| `number`                | `number`                                         | `16`                       |
| `color`                 | `string` (hex)                                   | `"#1A1A2E"`                |
| `boolean` / `checkbox`  | `boolean`                                        | `true`                     |
| `image`                 | `string` (URL)                                   | `"https://files.easy-orders.net/img.jpg"` |
| `select`                | `string` (one of `options[].value`)              | `"dark"`                   |
| `multi_select`          | `string[]` (subset of `options`)                 | `["sale", "new"]`          |
| `product_multi_select`  | `string[]` of product IDs (in merchant's order)  | `["prod_abc", "prod_xyz"]` |
| `category_multi_select` | `string[]` of category IDs (in merchant's order) | `["cat_a", "cat_b"]`       |
| `page_multi_select`     | `string[]` of page IDs (in merchant's order)     | `["page_1", "page_2"]`     |
| `object_array`          | `Array<Record<string, value>>`                   | `[{ "title": "…", … }, …]` |
