---
sidebar_position: 1
---

# Layout Sections

Layout sections define the persistent shell of your store — the header and footer that appear across multiple pages.

---

## Header

**File:** `sections/header.liquid`

The header is the most complex section. It is rendered **server-side** on the first page load for performance, and then hydrated on the client for interactive elements (cart, language switcher, mobile menu).

### Variables

| Variable                   | Type     | Description                                                          |
| -------------------------- | -------- | -------------------------------------------------------------------- |
| `logo`                     | string   | Store logo image URL                                                 |
| `store_name`               | string   | Store name (use as fallback when no logo)                            |
| `categories`               | array    | Navigation items — each has `name`, `url`, and optional `children[]` |
| `secondary_links`          | array    | Additional header links (from config) with `name` and `url`          |
| `announcement_config`      | object   | Announcement bar settings from merchant theme settings               |
| `announcement_config.text` | string[] | Announcement messages                                                |
| `announcement_config.type` | string   | `"simple"`, `"slider"`, or `"marquee"`                               |
| `announcement_text`        | string   | Fallback single announcement (from store settings)                   |
| `cart_count`               | number   | Current number of items in the cart                                  |
| `theme_data`               | object   | Merchant-configured dynamic settings                                 |

### Required Data Attributes

These `data-eo` attributes **must** be present for the storefront to function correctly:

| Attribute              | Element | Purpose                                       |
| ---------------------- | ------- | --------------------------------------------- |
| `data-eo="cart-btn"`   | button  | Opens the side cart drawer                    |
| `data-eo="cart-badge"` | span    | Displays and auto-updates the cart item count |
| `data-eo="lang-btn"`   | button  | Triggers the language switcher dropdown       |
| `data-eo="search-btn"` | button  | Opens search                                  |

### Required Events

| Event        | Dispatched On          | Purpose                                        |
| ------------ | ---------------------- | ---------------------------------------------- |
| `lang-click` | `[data-eo="lang-btn"]` | Notifies the app to open the language dropdown |

Dispatch it from your language button:

```html
onclick="this.dispatchEvent(new CustomEvent('lang-click',{bubbles:true}))"
```

### Example

```liquid
{% if announcement_config and announcement_config.text.size > 0 %}
<div class="announce" data-ann-type="{{ announcement_config.type }}">
  {% for item in announcement_config.text %}
    <span>{{ item }}</span>
  {% endfor %}
</div>
{% endif %}

<header class="header">
  <a href="/" class="logo">
    {% if logo %}
      <img src="{{ logo }}" alt="{{ store_name }}" />
    {% else %}
      <span>{{ store_name }}</span>
    {% endif %}
  </a>

  <nav>
    {% for category in categories %}
      {% if category.children.size > 0 %}
        <div class="dropdown">
          <a href="{{ category.url }}">{{ category.name }}</a>
          <div class="dropdown-panel">
            {% for child in category.children %}
              <a href="{{ child.url }}">{{ child.name }}</a>
            {% endfor %}
          </div>
        </div>
      {% else %}
        <a href="{{ category.url }}">{{ category.name }}</a>
      {% endif %}
    {% endfor %}
  </nav>

  <div class="header-actions">
    <button data-eo="search-btn" type="button" aria-label="Search"></button>

    <button data-eo="lang-btn" type="button" aria-label="Language"
      onclick="this.dispatchEvent(new CustomEvent('lang-click',{bubbles:true}))">
    </button>

    <button data-eo="cart-btn" type="button" aria-label="Cart">
      {% if cart_count > 0 %}
        <span data-eo="cart-badge">{{ cart_count }}</span>
      {% endif %}
    </button>
  </div>
</header>
```

:::warning
The `data-eo` attributes are **mandatory**. Without `data-eo="cart-btn"`, the cart drawer will not open. Without `data-eo="cart-badge"`, the badge count will not update when items are added.
:::

---

## Footer

**File:** `sections/footer.liquid`

The footer is rendered client-side and supports newsletter subscription, category/page links, social media icons, and contact information.

### Variables

| Variable            | Type    | Description                                                           |
| ------------------- | ------- | --------------------------------------------------------------------- |
| `logo`              | string  | Store logo URL                                                        |
| `store_name`        | string  | Store name                                                            |
| `categories`        | array   | Footer category links — each has `name` and `slug`                    |
| `pages`             | array   | Footer page links — each has `title` and `slug`                       |
| `social`            | array   | Social media — each has `type`, `url`, `label`, and `icon` (icon URL) |
| `year`              | number  | Current year                                                          |
| `payment_img`       | string  | Payment methods image URL                                             |
| `phone`             | string  | Store phone number                                                    |
| `email`             | string  | Store email address                                                   |
| `address`           | string  | Store physical address                                                |
| `has_contact`       | boolean | `true` if any contact info exists                                     |
| `shop_label`        | string  | Translated "Shop" heading                                             |
| `help_label`        | string  | Translated "Help" heading                                             |
| `subscribe_label`   | string  | Translated "Subscribe" heading                                        |
| `email_placeholder` | string  | Translated email input placeholder                                    |
| `follow_label`      | string  | Translated "Follow us" label                                          |
| `rights_label`      | string  | Translated copyright text                                             |
| `show_powered`      | boolean | Whether to show "Powered by EasyOrders"                               |
| `palette`           | object  | Palette color values                                                  |
| `theme_data`        | object  | Merchant-configured dynamic settings                                  |

### Required Data Attributes

| Attribute                         | Element | Purpose                                           |
| --------------------------------- | ------- | ------------------------------------------------- |
| `data-eo="footer-subscribe-form"` | form    | Newsletter subscription form — handled by the app |
| `data-eo="footer-subscribe-msg"`  | element | Displays success/error message after form submit  |

### Example

```liquid
<footer class="footer">
  <div class="footer-columns">
    <div class="footer-brand">
      <a href="/">
        {% if logo != "" %}
          <img src="{{ logo }}" alt="{{ store_name }}" />
        {% else %}
          <span>{{ store_name }}</span>
        {% endif %}
      </a>
    </div>

    {% if categories.size > 0 %}
      <div class="footer-col">
        <h4>{{ shop_label }}</h4>
        <ul>
          {% for cat in categories %}
            <li><a href="/collections/{{ cat.slug }}">{{ cat.name }}</a></li>
          {% endfor %}
        </ul>
      </div>
    {% endif %}

    {% if pages.size > 0 %}
      <div class="footer-col">
        <h4>{{ help_label }}</h4>
        <ul>
          {% for page in pages %}
            <li><a href="/pages/{{ page.slug }}">{{ page.title }}</a></li>
          {% endfor %}
        </ul>
      </div>
    {% endif %}
  </div>

  <div class="footer-subscribe">
    <h4>{{ subscribe_label }}</h4>
    <form data-eo="footer-subscribe-form">
      <input type="email" name="email" placeholder="{{ email_placeholder }}" required />
      <button type="submit">Subscribe</button>
    </form>
    <p data-eo="footer-subscribe-msg" hidden></p>
  </div>

  {% if social.size > 0 %}
    <div class="footer-social">
      {% for item in social %}
        <a href="{{ item.url }}" target="_blank" rel="noreferrer" aria-label="{{ item.label }}">
          <span style="-webkit-mask-image:url({{ item.icon }});mask-image:url({{ item.icon }})"></span>
        </a>
      {% endfor %}
    </div>
  {% endif %}

  <p>&copy; {{ year }} {{ store_name }}. {{ rights_label }}</p>

     {% if show_powered %}
      <p class="ab-footer-powered">Powered by <a href="https://www.easy-orders.net" target="_blank" rel="noreferrer">easyorders</a></p>
    {% endif %}
</footer>
```
