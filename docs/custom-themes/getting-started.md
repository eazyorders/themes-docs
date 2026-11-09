---
sidebar_position: 1
---

# Getting Started

Custom themes give you full control over the storefront by writing **Liquid templates**, **CSS**, and **JavaScript** from scratch. Unlike CSS-only themes that override an existing skeleton, a custom theme defines every visual section independently.

## How It Works

1. You write `.liquid` section files, optional `home-sections/` blocks, a `style.css`, a `script.js`, `schema.json`, and optionally `product-data-schema.json`.
2. You develop locally with the [**Easy Orders CLI**](./cli-development) (`easyorders create` / `easyorders start`) or upload through the **admin panel** (folder or individual files).
3. The storefront renders each section using **LiquidJS**, injecting store data (products, categories, merchant settings) as template variables.
4. Your CSS and JS are loaded globally on every page.

## Theme Folder Structure

Every custom theme follows this exact folder layout:

```
my-theme/
├── sections/                    ← 24 built-in section templates
│   ├── header.liquid
│   ├── footer.liquid
│   ├── gallery.liquid
│   ├── product-details.liquid
│   ├── product-description.liquid
│   ├── featured-products.liquid
│   ├── list-products.liquid
│   ├── home-products-grid.liquid
│   ├── products-grid.liquid
│   ├── related-products.liquid
│   ├── slider.liquid
│   ├── categories.liquid
│   ├── reviews.liquid
│   ├── fake-visitor.liquid
│   ├── fake-stock.liquid
│   ├── fake-counter.liquid
│   ├── breadcrumbs.liquid
│   ├── fixed-buy-button.liquid
│   ├── thanks.liquid
│   ├── order-invoice.liquid
│   ├── blog-header.liquid
│   ├── blog-latest.liquid
│   ├── blog-grid.liquid
│   └── blog-post.liquid
├── home-sections/               ← optional custom homepage blocks (see Home sections)
│   └── category-mosaic/
│       ├── config.json
│       └── template.liquid
├── style.css
├── script.js
├── schema.json                  ← global theme_data schema
└── product-data-schema.json     ← per-product theme_data schema (optional)
```

When using the [CLI](./cli-development), the `theme/` folder also includes **`config.json`** (preview defaults for header, footer, announcement, palette) and **`theme-data.json`** (preview defaults for `theme_data`). Those two files are not part of the production upload map below.

## File Map Reference

When you upload a theme folder, each file maps to a specific field:

| File Path                             | Field                 | Type    | Description                           |
| ------------------------------------- | --------------------- | ------- | ------------------------------------- |
| `sections/header.liquid`              | `header`              | Section | Store header with nav, cart, language |
| `sections/footer.liquid`              | `footer`              | Section | Store footer with links, newsletter   |
| `sections/gallery.liquid`             | `gallery`             | Section | Product image gallery                 |
| `sections/product-details.liquid`     | `product_details`     | Section | Product name, price, rating           |
| `sections/product-description.liquid` | `product_description` | Section | Product description block             |
| `sections/featured-products.liquid`   | `featured_products`   | Section | Featured products grid                |
| `sections/list-products.liquid`       | `list_products`       | Section | Products in list layout               |
| `sections/home-products-grid.liquid`  | `home_products_grid`  | Section | Homepage product grid with hero       |
| `sections/products-grid.liquid`       | `products_grid`       | Section | Product grid for search & collections |
| `sections/related-products.liquid`    | `related_products`    | Section | Related products on product page      |
| `sections/slider.liquid`              | `slider`              | Section | Hero/image slider                     |
| `sections/categories.liquid`          | `categories`          | Section | Category listing                      |
| `sections/reviews.liquid`             | `reviews`             | Section | Product reviews                       |
| `sections/fake-visitor.liquid`        | `fake_visitor`        | Section | Fake visitor counter                  |
| `sections/fake-stock.liquid`          | `fake_stock`          | Section | Fake stock indicator                  |
| `sections/fake-counter.liquid`        | `fake_counter`        | Section | Countdown timer                       |
| `sections/breadcrumbs.liquid`         | `breadcrumbs`         | Section | Breadcrumb navigation                 |
| `sections/fixed-buy-button.liquid`    | `fixed_buy_button`    | Section | Sticky buy bar                        |
| `sections/thanks.liquid`              | `thanks`              | Section | Thank-you page                        |
| `sections/order-invoice.liquid`       | `order_invoice`       | Section | Order invoice view                    |
| `sections/blog-header.liquid`         | `blog_header`         | Section | Blog listing title and subtitle header |
| `sections/blog-latest.liquid`         | `blog_latest`         | Section | Featured / latest article on listing page |
| `sections/blog-grid.liquid`           | `blog_grid`           | Section | Articles card grid on listing page     |
| `sections/blog-post.liquid`           | `blog_post`           | Section | Full article page with related posts  |
| `style.css`                           | `theme_style`         | Asset   | Global CSS (minified on upload)       |
| `script.js`                           | `theme_script`        | Asset   | Global JS (minified on upload)        |
| `schema.json`                         | `theme_data_schema`   | Schema  | Global dynamic settings schema        |
| `product-data-schema.json`            | `product_theme_schema`| Schema  | Per-product dynamic settings schema |
| `home-sections/<name>/config.json`    | `home_sections`       | Home    | Custom block metadata + `section_schema` |
| `home-sections/<name>/template.liquid`| `home_sections`       | Home    | Custom block Liquid template          |

Folder names under `home-sections/` become section **keys** with hyphens converted to underscores (e.g. `category-mosaic` → `category_mosaic`). Each folder must contain both `config.json` and `template.liquid`.

## Uploading Your Theme

You can upload your theme through the admin panel in two ways:

### Folder Upload

Zip or select your entire theme folder. The system automatically maps each file to the correct field based on the folder structure above.

### Individual Editing

Each section can also be edited individually through the built-in code editor in the admin panel. This is useful for quick fixes without re-uploading the entire theme.

## Quick Start

1. **Scaffold with the CLI** — `easyorders create my-theme` then `easyorders start` for live preview on your dev store (see [CLI development](./cli-development)).
2. **Edit the Liquid templates** — each section receives specific variables (documented under [Layout sections](./sections/layout-sections) and [Product sections](./sections/product-sections)).
3. **Write your CSS** — use [palette CSS variables](./palette) for merchant-configurable colors.
4. **Define your schemas** — `schema.json` for global [dynamic settings](./dynamic-theme-data) and optional `product-data-schema.json` for [per-product settings](./dynamic-theme-data#per-product-theme-data-product_theme_data).
5. **Upload and test** — upload through the admin panel or keep using the CLI tunnel until you publish.

## What's Next

| Topic                                                                                           | Description                                                     |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [CLI development](./cli-development)                                                            | Local dev server, tunnel preview, and `config.json`             |
| [Theme settings](./theme-settings)                                                              | Header, footer, announcement bar, and palette config              |
| [Palette](./palette)                                                                            | Merchant-configurable colors as CSS variables (`--hd-bg`, etc.) |
| [Dynamic theme data](./dynamic-theme-data)                                                      | `schema.json`, `product-data-schema.json`, and `section_schema` |
| [Liquid reference](./liquid-reference)                                                          | Template syntax, filters, and rendering                         |
| [Layout sections](./sections/layout-sections) · [Product sections](./sections/product-sections) · [Home sections](./sections/home-sections) | Built-in sections + custom `home-sections/` blocks              |
| [Events reference](./events-reference)                                                          | Custom DOM events, link interception, and data attributes         |
