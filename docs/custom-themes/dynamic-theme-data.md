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

| Type       | Renders As    | Value                            |
| ---------- | ------------- | -------------------------------- |
| `string`   | Text input    | `string`                         |
| `number`   | Number input  | `number`                         |
| `color`    | Color picker  | `string` (hex, e.g. `"#1A1A2E"`) |
| `boolean`  | Toggle switch | `true` / `false`                 |
| `checkbox` | Checkbox      | `true` / `false`                 |

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

### Object Array Field

A repeatable group of fields. Merchants can add, remove, and reorder items. Each item is an object with its own fields (only primitive, select, and multi-select — no nested object arrays).

```json
{
  "name": "hero_slides",
  "type": "object_array",
  "description": "Hero slides",
  "fields": [
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
    "name": "hero_slides",
    "type": "object_array",
    "description": "Hero slides",
    "fields": [
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
      <h2>{{ slide.title }}</h2>
    </div>
  {% endif %}
{% endfor %}
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

| Property      | Required                      | Type     | Description                                                                                          |
| ------------- | ----------------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `name`        | Yes                           | `string` | Unique key — becomes `theme_data.{name}` in Liquid                                                   |
| `type`        | Yes                           | `string` | One of: `string`, `number`, `color`, `boolean`, `checkbox`, `select`, `multi_select`, `object_array` |
| `description` | Yes                           | `string` | Label shown to merchants in the settings form                                                        |
| `default`     | No                            | varies   | Default value when merchant hasn't set one                                                           |
| `options`     | For `select` / `multi_select` | `array`  | Array of `{ label, value }` objects                                                                  |
| `fields`      | For `object_array`            | `array`  | Array of nested field definitions (primitive, select, or multi-select only)                          |
