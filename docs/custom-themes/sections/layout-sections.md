---
sidebar_position: 1
---

# Layout Sections

Layout sections define the persistent shell of your store — the header and footer that appear across multiple pages.

## Header

**File:** `sections/header.liquid`

The header HTML is rendered **server-side** on first load (`header_html`) for fast paint. The storefront injects that HTML into the page and wires **element IDs** (cart count and language controls below), **CSS class selectors** (theme styling and `lang-click` targeting via `lang-btn`), **bubbling `CustomEvent`s**, and **client-side link interception** for internal routes (for example `/search`, `/collections/...`).

### Variables

| Variable              | Type   | Description                                                                                                                    |
| --------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `logo`                | string | Store logo image URL                                                                                                           |
| `store_name`          | string | Store name (fallback when no logo)                                                                                             |
| `categories`          | array  | Nav items: each item has `name`, `url`, and optional `children[]` (each child: `name`, `url`)                                  |
| `announcement_config` | object | Announcement bar from merchant theme settings: `text` is `string[]`, `type` is `"simple"`, `"slider"`, or `"marquee"`          |
| `announcement_text`   | string | Fallback single-line announcement when config is not used                                                                      |
| `cart_count`          | number | Cart item count at SSR time; should match the initial `#header-cart-count` text and `hidden` state (client keeps them in sync) |
| `theme_data`          | object | Merchant-configured dynamic settings from `schema.json`                                                                        |

### Required element IDs

| ID                                       | Purpose                                                                                                                                                                                                           |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `header-cart-count`                      | Put this **`id`** on the cart badge element (e.g. a `<span>`). The storefront **replaces its text content** with the live cart count and toggles the HTML `hidden` attribute based on whether that count is zero. |
| `header-lang-btn` , `header-lang-mobile` | Put this **id** on the language control (e.g. a `<button>`) one for desktop and one for mobile. When the Multi-language plugin is **not** active, the storefront sets **`hidden`** attribute on this element.     |

IDs must be **unique** in the document (one cart badge; one desktop language control; at most one mobile language control with `header-lang-mobile`).

### Required custom events

Dispatch **bubbling** `CustomEvent`s from the header so they reach the section root where the app listens.

| Event        | Element          | Purpose                                                                                                                                                                                 |
| ------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cart-click` | Cart control     | Opens the side cart. Example: `onclick="this.dispatchEvent(new CustomEvent('cart-click',{bubbles:true}))"` on the cart `<button>` (keep class `cart-btn` if your theme CSS targets it). |
| `lang-click` | Language control | Toggles the language dropdown. Example: `onclick="this.dispatchEvent(new CustomEvent('lang-click',{bubbles:true}))"` on the element with class `lang-btn`.                              |

### Full example

Below is an end-to-end header (announcement bar, desktop nav, cart/language/search, mobile drawer) with matching **`script.js`** behavior (scroll hide, mobile menu, announcement slider/marquee) and **`style.css`**. Class names are **generic** (no `ab-` prefix); only storefront hooks use fixed names: **`cart-btn`**, **`lang-btn`**, **`search-btn`**, **`id="header-cart-count"`**, and the **`cart-click`** / **`lang-click`** events.

:::warning
Without event **`cart-click`** on the cart control, the side cart will not open. Without a persistent **`id="header-cart-count"`** badge, the cart count will not stay in sync. Without **`lang-btn`** (and **`lang-click`**), the language UI will not work.
:::

#### `sections/header.liquid`

```liquid
<div class="theme-shell">

{% if announcement_config and announcement_config.text.size > 0 %}
<div class="announce-bar" data-ann-type="{{ announcement_config.type }}">
  {% if announcement_config.type == "marquee" %}
    <div class="announce-marquee">
      <div class="announce-marquee-track">
        {% for item in announcement_config.text %}
          <span class="announce-marquee-item">{{ item }}</span>
        {% endfor %}
      </div>
    </div>
  {% elsif announcement_config.type == "slider" %}
    <div class="announce-slider">
      {% for item in announcement_config.text %}
        <div class="announce-slide{% if forloop.first %} is-active{% endif %}">{{ item }}</div>
      {% endfor %}
    </div>
  {% else %}
    <div class="announce-simple">
      {% for item in announcement_config.text %}
        <span>{{ item }}</span>
        {% unless forloop.last %}<span class="announce-sep">&mdash;</span>{% endunless %}
      {% endfor %}
    </div>
  {% endif %}
</div>
{% elsif announcement_text and announcement_text != "" %}
<div class="announce-bar">
  {{ announcement_text }}
</div>
{% endif %}

<header id="eo-header" class="site-header">
  <div class="site-header-inner">
    <div style="display:flex;align-items:center;">
      <button id="eo-menu-btn" class="nav-hamburger" aria-label="Menu"></button>
      <a href="/" class="site-logo">
        {% if logo %}
          <img src="{{ logo }}" alt="{{ store_name }}" />
        {% else %}
          <span class="site-logo-text">{{ store_name }}</span>
        {% endif %}
      </a>
    </div>

    <nav class="main-nav">
      {% for category in categories %}
        {% if category.children.size > 0 %}
          <div class="nav-dropdown">
            <a href="{{ category.url }}" class="nav-dropdown-trigger">{{ category.name }}</a>
            <div class="nav-dropdown-panel">
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
      <a href="/search" class="header-icon-btn search-btn" aria-label="Search"></a>

      <button type="button" class="header-icon-btn lang-btn" aria-label="Change Language" onclick="this.dispatchEvent(new CustomEvent('lang-click',{bubbles:true}))"></button>

      <button type="button" class="header-icon-btn cart-btn" aria-label="Cart" onclick="this.dispatchEvent(new CustomEvent('cart-click',{bubbles:true}))">
        <span id="header-cart-count" class="cart-badge" hidden>{{ cart_count }}</span>
      </button>
    </div>
  </div>
</header>

<div id="eo-mobile-overlay" class="mobile-nav-overlay"></div>
<div id="eo-mobile-menu" class="mobile-nav-panel">
  <div class="mobile-nav-panel-header">
    <button id="eo-mobile-close" class="mobile-nav-close" aria-label="Close menu"></button>
    <a href="/" class="site-logo">
      {% if logo %}
        <img src="{{ logo }}" alt="{{ store_name }}" />
      {% else %}
        <span class="site-logo-text">{{ store_name }}</span>
      {% endif %}
    </a>
  </div>
  <nav class="mobile-nav">
    {% for category in categories %}
      {% if category.children.size > 0 %}
        <div class="mobile-nav-accordion">
          <button type="button" class="mobile-nav-accordion-trigger">
            <span>{{ category.name }}</span>
            <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="mobile-nav-accordion-panel">
            <a href="{{ category.url }}">All {{ category.name }}</a>
            {% for child in category.children %}
              <a href="{{ child.url }}">{{ child.name }}</a>
            {% endfor %}
          </div>
        </div>
      {% else %}
        <a href="{{ category.url }}">
          <span>{{ category.name }}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M10 8l4 4-4 4"/></svg>
        </a>
      {% endif %}
    {% endfor %}
    <a href="/search">
      <span>Search</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </a>
    <a id="header-lang-mobile" class="lang-btn" onclick="this.dispatchEvent(new CustomEvent('lang-click',{bubbles:true}));return false;" href="#">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M10 8l4 4-4 4"/></svg>
    </a>
  </nav>
</div>

</div>
```

#### `script.js`

```javascript
!(function () {
  function initHeaderScrollHide() {
    var header = document.querySelector(".site-header");
    if (header && !header.dataset.scrollInit) {
      header.dataset.scrollInit = "1";
      var lastY = window.scrollY;
      window.addEventListener(
        "scroll",
        function () {
          var y = window.scrollY;
          if (Math.abs(y - lastY) < 5) return;
          if (y > lastY && y > 100) header.classList.add("is-header-hidden");
          else header.classList.remove("is-header-hidden");
          lastY = y;
        },
        { passive: true }
      );
    }
  }

  function initMobileNav() {
    var openBtn = document.getElementById("eo-menu-btn");
    var panel = document.getElementById("eo-mobile-menu");
    var overlay = document.getElementById("eo-mobile-overlay");
    var closeBtn = document.getElementById("eo-mobile-close");

    function close() {
      panel.classList.remove("is-open");
      if (overlay) overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    if (!openBtn || !panel || openBtn.dataset.menuInit) return;
    openBtn.dataset.menuInit = "1";
    openBtn.addEventListener("click", function () {
      panel.classList.add("is-open");
      if (overlay) overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (overlay) overlay.addEventListener("click", close);
    panel.querySelectorAll(".mobile-nav > a").forEach(function (el) {
      el.addEventListener("click", close);
    });
    panel
      .querySelectorAll(".mobile-nav-accordion-panel a")
      .forEach(function (el) {
        el.addEventListener("click", close);
      });
    panel
      .querySelectorAll(".mobile-nav-accordion-trigger")
      .forEach(function (trigger) {
        if (trigger.dataset.accordionInit) return;
        trigger.dataset.accordionInit = "1";
        trigger.addEventListener("click", function () {
          var acc = trigger.closest(".mobile-nav-accordion");
          if (!acc) return;
          var wasOpen = acc.classList.contains("is-open");
          panel
            .querySelectorAll(".mobile-nav-accordion.is-open")
            .forEach(function (other) {
              if (other !== acc) other.classList.remove("is-open");
            });
          acc.classList.toggle("is-open", !wasOpen);
        });
      });
  }

  function initAnnounceSlider() {
    document
      .querySelectorAll('.announce-bar[data-ann-type="slider"]')
      .forEach(function (root) {
        if (root.dataset.annSliderInit) return;
        root.dataset.annSliderInit = "1";
        var slides = root.querySelectorAll(".announce-slide");
        if (slides.length < 2) return;
        var i = 0;
        setInterval(function () {
          var cur = slides[i];
          var next = (i + 1) % slides.length;
          cur.classList.remove("is-active");
          cur.classList.add("is-exiting-left");
          slides[next].classList.add("is-active");
          setTimeout(function () {
            cur.classList.remove("is-exiting-left");
          }, 500);
          i = next;
        }, 3000);
      });
  }

  function initAnnounceMarquee() {
    document.querySelectorAll(".announce-marquee").forEach(function (wrap) {
      if (wrap.dataset.marqueeInit) return;
      wrap.dataset.marqueeInit = "1";
      var track = wrap.querySelector(".announce-marquee-track");
      if (!track) return;
      var chunk = track.innerHTML;
      var w = track.scrollWidth;
      var viewW = wrap.offsetWidth;
      if (w < 1) return;
      var copies = Math.ceil((2 * viewW) / w);
      if (copies < 2) copies = 2;
      track.innerHTML = "";
      for (var c = 0; c < copies; c++)
        track.insertAdjacentHTML("beforeend", chunk);
      var seg = track.scrollWidth / copies;
      var dur = Math.max(seg / 40, 5);
      track.style.setProperty("--marquee-dur", dur + "s");
      track.style.setProperty("--marquee-offset", "-" + seg + "px");
      track.classList.add("is-running");
    });
  }

  function runHeader() {
    initHeaderScrollHide();
    initMobileNav();
    initAnnounceSlider();
    initAnnounceMarquee();
  }

  runHeader();
  new MutationObserver(runHeader).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
```

#### `style.css`

```css
@keyframes announce-marquee-shift {
  0% {
    transform: translateX(0);
  }
  to {
    transform: translateX(var(--marquee-offset, -50%));
  }
}

.announce-bar {
  background: var(--ann-bg, #212a2f);
  color: var(--ann-text, #fff);
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.03em;
  line-height: 1.4;
  height: 35px;
  position: relative;
  z-index: 2;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.announce-bar a {
  color: var(--ann-text, #fff);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.announce-simple {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 16px;
  white-space: nowrap;
}
.announce-sep {
  opacity: 0.45;
  font-size: 10px;
}
.announce-marquee {
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 100%;
}
.announce-marquee-track {
  display: flex;
  align-items: center;
  white-space: nowrap;
  will-change: transform;
}
.announce-marquee-track.is-running {
  animation: announce-marquee-shift var(--marquee-dur, 20s) linear infinite;
}
.announce-marquee-item {
  flex-shrink: 0;
  padding: 0 32px;
}
.announce-slider {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.announce-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  opacity: 0;
  transform: translateX(100%);
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: none;
}
.announce-slide.is-active {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}
.announce-slide.is-exiting-left {
  opacity: 0;
  transform: translateX(-100%);
}

div:has(> .site-header) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: transparent;
  pointer-events: none;
}
div:has(> .site-header) > * {
  pointer-events: auto;
}
.site-header {
  position: relative;
  z-index: 1;
  background: var(--hd-bg, #fff);
  color: var(--hd-text, #212a2f);
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 1400px;
  width: calc(100% - 48px);
  margin: 10px auto;
}
.site-header.is-header-hidden {
  transform: translateY(calc(-100% - 16px));
}
.site-header-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 28px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 50px;
}
.site-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.site-logo img {
  height: 47px;
  width: auto;
  object-fit: contain;
  display: block;
}
.site-logo-text {
  font-style: italic;
  font-size: 34px;
  font-weight: 400;
  color: var(--hd-text, #212a2f);
  letter-spacing: -0.02em;
  line-height: 1;
  text-decoration: none;
}
.main-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
}
.main-nav .nav-dropdown-trigger,
.main-nav > a {
  text-decoration: none;
  color: var(--hd-text, #212a2f);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 0;
  position: relative;
  transition: opacity 0.2s;
  cursor: pointer;
}
.main-nav .nav-dropdown-trigger::after,
.main-nav > a::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1.5px;
  background: var(--hd-text, #212a2f);
  transition: width 0.25s ease;
}
.main-nav .nav-dropdown-trigger:hover::after,
.main-nav > a:hover::after {
  width: 100%;
}
.nav-dropdown {
  position: relative;
}
.nav-dropdown-panel {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 12px;
  z-index: 200;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.nav-dropdown:hover .nav-dropdown-panel {
  display: block;
}
.nav-dropdown-panel::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 12px;
}
.nav-dropdown-panel > a {
  display: block;
  white-space: nowrap;
  padding: 10px 24px;
  text-decoration: none;
  color: var(--hd-text, #212a2f);
  font-size: 13px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
  background: var(--hd-bg, #fff);
}
.nav-dropdown-panel > a:first-child {
  border-radius: 10px 10px 0 0;
  padding-top: 14px;
}
.nav-dropdown-panel > a:last-child {
  border-radius: 0 0 10px 10px;
  padding-bottom: 14px;
}
.nav-dropdown-panel > a:only-child {
  border-radius: 10px;
}
.nav-dropdown-panel > a:hover {
  background: #f5f0eb;
}
.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}
.header-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  border-radius: 50%;
  color: var(--hd-text, #212a2f);
  transition: background 0.2s, opacity 0.2s;
  position: relative;
  width: 36px;
  height: 36px;
}
.header-icon-btn::before,
.mobile-nav-close::before {
  content: "";
  display: block;
  background: currentColor;
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}
.header-icon-btn::before {
  width: 28px;
  height: 28px;
  -webkit-mask-position: center;
  mask-position: center;
}
.header-icon-btn:hover {
  background: #f5f5f5;
}
.header-icon-btn.search-btn::before {
  -webkit-mask-image: url(https://files.easy-orders.net/1772538329933375167ab-search.svg);
  mask-image: url(https://files.easy-orders.net/1772538329933375167ab-search.svg);
}
.header-icon-btn.cart-btn::before {
  -webkit-mask-image: url(https://files.easy-orders.net/1772538329933191621ab-cart.svg);
  mask-image: url(https://files.easy-orders.net/1772538329933191621ab-cart.svg);
}
.header-icon-btn.lang-btn::before {
  width: 20px;
  height: 20px;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M2 12h20'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M2 12h20'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z'/%3E%3C/svg%3E");
}
.cart-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 2px;
  right: 2px;
  background: var(--hd-text, #212a2f);
  color: var(--hd-bg, #fff);
  font-size: 9px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  line-height: 1;
  padding: 0 4px;
  pointer-events: none;
}
.cart-badge[hidden] {
  display: none;
}
.mobile-nav-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.mobile-nav-overlay.is-open {
  display: block;
  opacity: 1;
}
.mobile-nav-panel {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  max-width: 100%;
  background: #f5f0eb;
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.mobile-nav-panel.is-open {
  transform: translateX(0);
}
.mobile-nav-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  background: #f5f0eb;
  z-index: 1;
}
.mobile-nav-panel-header .site-logo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.mobile-nav-panel-header .site-logo img {
  height: 32px;
  width: auto;
  display: block;
  object-fit: contain;
}
.mobile-nav-panel-header .site-logo-text {
  font-size: 24px;
}
.mobile-nav-close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: var(--hd-text, #212a2f);
  width: 36px;
  height: 36px;
  padding: 0;
}
.mobile-nav-close::before {
  width: 22px;
  height: 22px;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'/%3E%3Cline x1='6' y1='6' x2='18' y2='18'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'/%3E%3Cline x1='6' y1='6' x2='18' y2='18'/%3E%3C/svg%3E");
}
.mobile-nav {
  padding: 8px 0;
}
.mobile-nav-accordion-trigger,
.mobile-nav > a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 20px;
  text-decoration: none;
  color: var(--hd-text, #212a2f);
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: transparent;
  border-left: none;
  border-right: none;
  border-top: none;
  cursor: pointer;
  box-sizing: border-box;
}
.mobile-nav > .mobile-nav-accordion:first-child .mobile-nav-accordion-trigger,
.mobile-nav > a:first-child {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
.mobile-nav-accordion-trigger svg,
.mobile-nav > a svg {
  width: 24px;
  height: 24px;
  opacity: 0.5;
  flex-shrink: 0;
}
.mobile-nav-accordion {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.mobile-nav-accordion-trigger {
  border-bottom: none !important;
}
.accordion-chevron {
  transition: transform 0.3s ease;
}
.mobile-nav-accordion.is-open .accordion-chevron {
  transform: rotate(180deg);
}
.mobile-nav-accordion-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-nav-accordion.is-open .mobile-nav-accordion-panel {
  max-height: 500px;
}
.mobile-nav-accordion-panel a {
  display: block;
  padding: 12px 20px 12px 36px;
  text-decoration: none;
  color: var(--hd-text, #212a2f);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: background 0.15s;
}
.mobile-nav-accordion-panel a:hover {
  background: rgba(0, 0, 0, 0.04);
}
.nav-hamburger {
  display: none;
}

@media (max-width: 1024px) {
  .mobile-nav-panel {
    display: block;
  }
  .site-header {
    width: auto;
    margin: 6px 12px;
  }
  .site-header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    height: 50px;
    position: relative;
  }
  .main-nav {
    display: none;
  }
  .header-actions {
    justify-content: flex-end;
    gap: 2px;
  }
  .nav-hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 0;
    cursor: pointer;
    color: var(--hd-text, #212a2f);
    width: 36px;
    height: 36px;
    margin-right: 4px;
  }
  .nav-hamburger::before {
    content: "";
    display: block;
    width: 26px;
    height: 26px;
    background: currentColor;
    -webkit-mask-image: url(https://files.easy-orders.net/1772538761869984865ab-menu.svg);
    mask-image: url(https://files.easy-orders.net/1772538761869984865ab-menu.svg);
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
  }
  .site-header-inner .site-logo {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .site-logo-text {
    font-size: 24px;
  }
  .site-logo img {
    height: 32px;
  }
}
```

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
| `theme_data`        | object  | Merchant-configured dynamic settings                                  |

### Footer newsletter (if needed)

The newsletter form in the footer should dispatch a single event **`footer-subscribe`** when the user submits a valid email.

```js
this.dispatchEvent(
  new CustomEvent("footer-subscribe", {
    bubbles: true,
    detail: { email: email },
  })
);
```

Add email input validation using standard HTML input attributes. After dispatching the `footer-subscribe` event, call `this.reset()` to clear the form.

Minimal HTML form:

```html
<form
  class="footer-subscribe-form"
  novalidate
  onsubmit="
    event.preventDefault();
    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }
    var input = this.elements.email;
    var email = input && input.value ? String(input.value).trim() : '';
    this.dispatchEvent(
      new CustomEvent('footer-subscribe', {
        bubbles: true,
        detail: { email: email }
      })
    );
    this.reset();
  "
>
  <input
    type="email"
    name="email"
    autocomplete="email"
    inputmode="email"
    maxlength="254"
    pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
    title="Valid email required"
    required
    aria-required="true"
  />
  <button type="submit">Subscribe</button>
</form>
```

### Full example

Below is a complete footer (brand + contact, shop/help columns, newsletter, social icons, payment strip, copyright, optional powered-by) with matching **`style.css`**. Class names are **generic** (no theme-specific `ab-` prefix). The subscribe block uses the same **`footer-subscribe`** / **`detail: { email }`** behavior as the form above.

#### `sections/footer.liquid`

```liquid
<footer class="site-footer">
  <div class="site-footer-inner">
    <div class="site-footer-columns">
      <div class="site-footer-col site-footer-brand">
        <a href="/" class="site-footer-logo">
          {% if logo != "" %}
            <img src="{{ logo }}" alt="{{ store_name }}" />
          {% else %}
            <span class="site-footer-logo-text">{{ store_name }}</span>
          {% endif %}
        </a>
        {% if has_contact %}
          <address class="site-footer-contact">
            {% if phone != "" %}
              <a href="tel:{{ phone }}" class="site-footer-contact-item">
                <span class="site-footer-contact-icon icon-phone" aria-hidden="true"></span>
                <span dir="ltr">{{ phone }}</span>
              </a>
            {% endif %}
            {% if email != "" %}
              <a href="mailto:{{ email }}" class="site-footer-contact-item">
                <span class="site-footer-contact-icon icon-email" aria-hidden="true"></span>
                {{ email }}
              </a>
            {% endif %}
            {% if address != "" %}
              <span class="site-footer-contact-item">
                <span class="site-footer-contact-icon icon-address" aria-hidden="true"></span>
                {{ address }}
              </span>
            {% endif %}
          </address>
        {% endif %}
      </div>

      {% if categories.size > 0 %}
        <div class="site-footer-col">
          <h4 class="site-footer-heading">{{ shop_label }}</h4>
          <ul class="site-footer-links">
            {% for cat in categories %}
              <li><a href="/collections/{{ cat.slug }}">{{ cat.name }}</a></li>
            {% endfor %}
          </ul>
        </div>
      {% endif %}

      {% if pages.size > 0 %}
        <div class="site-footer-col">
          <h4 class="site-footer-heading">{{ help_label }}</h4>
          <ul class="site-footer-links">
            {% for page in pages %}
              <li><a href="/pages/{{ page.slug }}">{{ page.title }}</a></li>
            {% endfor %}
          </ul>
        </div>
      {% endif %}
    </div>

    <div class="site-footer-aside">
      <div class="site-footer-subscribe-block">
        <h4 class="site-footer-heading">{{ subscribe_label }}</h4>
        <form
          class="footer-subscribe-form"
          novalidate
          onsubmit="
            event.preventDefault();
            if (!this.checkValidity()) {
              this.reportValidity();
              return;
            }
            var input = this.elements.email;
            var email = input && input.value ? String(input.value).trim() : '';
            this.dispatchEvent(
              new CustomEvent('footer-subscribe', {
                bubbles: true,
                detail: { email: email }
              })
            );
            this.reset();
          "
        >
          <input
            type="email"
            name="email"
            class="site-footer-subscribe-input"
            placeholder="{{ email_placeholder }}"
            autocomplete="email"
            inputmode="email"
            maxlength="254"
            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
            title="{{ email_placeholder }}"
            required
            aria-required="true"
          />
          <button type="submit" class="site-footer-subscribe-btn" aria-label="Subscribe">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </form>
      </div>

      {% if social.size > 0 %}
        <div class="site-footer-social">
          <p class="site-footer-social-label">{{ follow_label }}</p>
          <div class="site-footer-social-icons">
            {% for item in social %}
              <a href="{{ item.url }}" target="_blank" rel="noreferrer" aria-label="{{ item.label }}">
                <span class="site-footer-social-img" style="-webkit-mask-image:url({{ item.icon }});mask-image:url({{ item.icon }})"></span>
              </a>
            {% endfor %}
          </div>
        </div>
      {% endif %}
    </div>
  </div>

  <div class="site-footer-bottom">
    {% if payment_img != "" %}
      <div class="site-footer-payment">
        <img src="{{ payment_img }}" alt="Accepted payment methods" />
      </div>
    {% endif %}

    <p class="site-footer-copy">&copy; {{ year }} {{ store_name }}. {{ rights_label }}</p>
    {% if show_powered %}
      <p class="site-footer-powered">Powered by <a href="https://www.easy-orders.net" target="_blank" rel="noreferrer">easyorders</a></p>
    {% endif %}
  </div>
</footer>
```

#### `style.css`

```css
.site-footer {
  background: var(--ft-bg, #000);
  color: var(--ft-text, #fff);
  margin-top: 40px;
}
.site-footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px 32px;
  display: flex;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}
.site-footer-columns {
  display: flex;
  gap: 60px;
  flex-wrap: wrap;
}
.site-footer-col {
  min-width: 140px;
}
.site-footer-heading {
  margin: 0 0 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  opacity: 0.5;
}
.site-footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
}
.site-footer-links li {
  margin-bottom: 10px;
}
.site-footer-links a {
  font-size: 13px;
  font-weight: 400;
  transition: opacity 0.2s;
}
.site-footer-links a:hover {
  opacity: 0.7;
}
.site-footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.site-footer-links a,
.site-footer-logo {
  text-decoration: none;
  color: var(--ft-text, #fff);
}
.site-footer-logo {
  display: inline-block;
}
.site-footer-logo img {
  max-height: 40px;
  width: auto;
}
.site-footer-logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.site-footer-contact {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  font-style: normal;
}
.site-footer-contact-item,
.site-footer-social-icons a {
  display: flex;
  align-items: center;
  color: var(--ft-text, #fff);
}
.site-footer-contact-item {
  gap: 0.5rem;
  font-size: 13px;
  text-decoration: none;
}
a.site-footer-contact-item:hover {
  opacity: 0.9;
}
.site-footer-contact-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  min-width: 16px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  filter: brightness(0) invert(1);
  opacity: 0.8;
}
.site-footer-contact-icon.icon-phone {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23000' stroke-width='1.8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z'/%3E%3C/svg%3E");
}
.site-footer-contact-icon.icon-email {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23000' stroke-width='1.8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'/%3E%3C/svg%3E");
}
.site-footer-contact-icon.icon-address {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23000' stroke-width='1.8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z'/%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'/%3E%3C/svg%3E");
}
.site-footer-social {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.site-footer-social-label {
  margin: 0 0 14px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  opacity: 0.5;
}
.site-footer-social-icons {
  display: flex;
  gap: 10px;
}
.site-footer-social-icons a {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--ft-text, #fff);
  opacity: 0.7;
  justify-content: center;
  color: var(--ft-text, #fff);
}
.site-footer-social-icons a:hover {
  opacity: 1;
}
.site-footer-social-img {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: var(--ft-text, #fff);
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}
.site-footer-payment {
  margin-block: 1.25rem;
  display: flex;
  justify-content: center;
}
.site-footer-payment img {
  max-height: 95px;
  width: auto;
}
.site-footer-bottom {
  padding: 16px 24px;
  text-align: center;
}
.site-footer-copy {
  margin: 0;
  font-size: 12px;
}
.site-footer-powered {
  margin: 8px 0 0;
  font-size: 12px;
}
.site-footer-powered a {
  color: #34d399;
  text-decoration: none;
  font-weight: 600;
}
.site-footer-powered a:hover {
  text-decoration: underline;
}
.site-footer-aside {
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 320px;
  flex: 1;
  max-width: 420px;
}
.footer-subscribe-form {
  display: flex;
  gap: 0;
}
.site-footer-subscribe-input {
  flex: 1;
  height: 40px;
  padding: 0 12px;
  font-size: 13px;
  color: #fff;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0;
  outline: none;
  transition: border-color 0.2s;
}
.site-footer-subscribe-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
.site-footer-subscribe-input:focus {
  border-color: rgba(255, 255, 255, 0.7);
}
.site-footer-subscribe-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ft-text, #fff);
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.2s;
}
.site-footer-subscribe-btn svg {
  width: 18px;
  height: 18px;
  stroke: var(--ft-bg, #000);
}
.site-footer-subscribe-btn:hover {
  opacity: 0.85;
}

@media (max-width: 768px) {
  .site-footer-inner {
    flex-direction: column;
    padding: 32px 20px 24px;
    gap: 32px;
  }
  .site-footer-columns {
    flex-direction: column;
    gap: 32px;
  }
  .site-footer-payment {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
```
