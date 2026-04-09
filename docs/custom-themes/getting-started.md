---
sidebar_position: 1
---

# Getting Started

Custom themes give you full control over the storefront by writing **Liquid templates**, **CSS**, and **JavaScript** from scratch. Unlike CSS-only themes that override an existing skeleton, a custom theme defines every visual section independently.

## How It Works

1. You write `.liquid` section files, a `style.css`, a `script.js`, and a `schema.json`.
2. You upload them through the **admin panel** (either individually or as a folder).
3. The storefront renders each section using **LiquidJS**, injecting store data (products, categories, merchant settings) as template variables.
4. Your CSS and JS are loaded globally on every page.

## Theme Folder Structure

Every custom theme follows this exact folder layout:

```
my-theme/
├── sections/
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
│   └── order-invoice.liquid
├── style.css
├── script.js
└── schema.json
```

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
| `style.css`                           | `theme_style`         | Asset   | Global CSS (minified on upload)       |
| `script.js`                           | `theme_script`        | Asset   | Global JS (minified on upload)        |
| `schema.json`                         | `theme_data_schema`   | Schema  | Dynamic settings schema               |

## Uploading Your Theme

You can upload your theme through the admin panel in two ways:

### Folder Upload

Zip or select your entire theme folder. The system automatically maps each file to the correct field based on the folder structure above.

### Individual Editing

Each section can also be edited individually through the built-in code editor in the admin panel. This is useful for quick fixes without re-uploading the entire theme.

## Quick Start

1. **Copy the Allbirds example** as a starting point — it implements all 20 sections with a clean, modern design.
2. **Edit the Liquid templates** — each section receives specific variables (documented under [Layout sections](./sections/layout-sections) and [Product sections](./sections/product-sections)).
3. **Write your CSS** — use [palette CSS variables](./palette) for merchant-configurable colors.
4. **Define your schema** — add [dynamic settings](./dynamic-theme-data) so merchants can customize the theme without touching code.
5. **Upload and test** — upload through the admin panel and preview on a test store.

## What's Next

| Topic                                                                                           | Description                                                     |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [Palette](./palette)                                                                            | Merchant-configurable colors as CSS variables (`--hd-bg`, etc.) |
| [Dynamic Theme Data](./dynamic-theme-data)                                                      | Merchant-configurable settings via `schema.json`                |
| [Liquid Reference](./liquid-reference)                                                          | Template syntax, filters, and rendering                         |
| [Layout sections](./sections/layout-sections) · [Product sections](./sections/product-sections) · [Home sections](./sections/home-sections) | All 20 section templates with variables, events, and examples   |
| [Events Reference](./events-reference)                                                          | Custom DOM events, link interception, and section data attributes |
