---
sidebar_position: 5
---

# Blog Sections

Blog sections render the storefront blog experience across the listing page (`/blog`) and individual article pages (`/blog/<slug>`).

---

## Blog Header

**File:** `sections/blog-header.liquid`

Displays the editorial title and optional subtitle at the top of the `/blog` listing page.

The listing page is a hybrid page: breadcrumbs, category filter pills, and pagination are handled natively by the storefront runtime. The Liquid template only renders the header fragment.

:::warning
Do not wrap listing templates in `.ps-blog`. That container class includes full page-level padding intended only for the single article page (`/blog/<slug>`).
:::

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| `latest_news` | string | Blog heading title (e.g. "Latest News" or "أحدث المقالات") |
| `latest_news_subtitle` | string | Optional subtitle or description |
| `theme_data` | object | Merchant-configured dynamic settings |

### Example

```liquid
<header class="ps-blog-heading">
  <h1 class="ps-blog-title">{{ latest_news }}</h1>
  {% if latest_news_subtitle != blank %}
    <p class="ps-blog-subtitle">{{ latest_news_subtitle }}</p>
  {% endif %}
</header>
```

---

## Blog Latest

**File:** `sections/blog-latest.liquid`

Displays the featured or most recent article at the top of the `/blog` listing page, below the category filter pills.

:::info
The storefront only renders this section on **page 1** of the blog listing, and only when there is **more than one article** (`posts.length > 1`). On subsequent pages or when only a single post exists, this section is omitted automatically.
:::

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| `post` | object | Featured article object (see properties below) |
| `view_details` | string | Translated label for the read-more button (e.g. "View details" or "اقرأ المزيد") |
| `theme_data` | object | Merchant-configured dynamic settings |

**Post properties:**

| Property | Type | Description |
|----------|------|-------------|
| `post.url` | string | Relative link to the article (`/blog/<slug>`) |
| `post.title` | string | Article headline |
| `post.cover_image` | string | Cover image URL |
| `post.formatted_date` | string | Formatted publication date for display |
| `post.published_at` | string | Publication datetime (ISO format) for `<time datetime="...">` |
| `post.category` | string | Category name |
| `post.excerpt` | string | Short teaser or summary |

### Example

```liquid
<article class="ps-blog-featured">
  <a href="{{ post.url }}" class="ps-blog-featured-media">
    {% if post.cover_image != blank %}
      <img
        src="{{ post.cover_image }}"
        alt="{{ post.title }}"
        width="1200"
        height="560"
        loading="eager"
      />
    {% endif %}
  </a>
  <div class="ps-blog-featured-copy">
    <p class="ps-blog-meta">
      {{ post.formatted_date }}{% if post.category != blank %} · {{ post.category }}{% endif %}
    </p>
    <h2 class="ps-blog-featured-title">
      <a href="{{ post.url }}">{{ post.title }}</a>
    </h2>
    {% if post.excerpt != blank %}
      <p class="ps-blog-excerpt">{{ post.excerpt }}</p>
    {% endif %}
    <a href="{{ post.url }}" class="ps-blog-featured-cta">{{ view_details }}</a>
  </div>
</article>
```

---

## Blog Grid

**File:** `sections/blog-grid.liquid`

Renders the grid of article cards on the `/blog` listing page.

:::info
The storefront does not wrap this section in a grid container. Your template owns the grid wrapper and its responsive columns via CSS.
:::

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| `posts` | array | Array of article objects (see properties below) |
| `theme_data` | object | Merchant-configured dynamic settings |

**Post properties:**

| Property | Type | Description |
|----------|------|-------------|
| `post.url` | string | Relative link to the article (`/blog/<slug>`) |
| `post.title` | string | Article headline |
| `post.cover_image` | string | Thumbnail image URL |
| `post.formatted_date` | string | Formatted publication date |
| `post.category` | string | Category name |
| `post.excerpt` | string | Short teaser or summary |

### Example

```liquid
<div class="ps-blog-grid">
  {% for post in posts %}
    <a class="ps-blog-card" href="{{ post.url }}">
      {% if post.cover_image != blank %}
        <img
          class="ps-blog-card-img"
          src="{{ post.cover_image }}"
          alt="{{ post.title }}"
          width="400"
          height="260"
          loading="lazy"
        />
      {% endif %}
      <div class="ps-blog-card-body">
        <p class="ps-blog-meta">
          {{ post.formatted_date }}{% if post.category != blank %} · {{ post.category }}{% endif %}
        </p>
        <h3 class="ps-blog-card-title">{{ post.title }}</h3>
        {% if post.excerpt != blank %}
          <p class="ps-blog-excerpt">{{ post.excerpt }}</p>
        {% endif %}
      </div>
    </a>
  {% endfor %}
</div>
```

---

## Blog Post

**File:** `sections/blog-post.liquid`

Renders the full article page at `/blog/<slug>`. This template owns the entire article view, including breadcrumbs, title, social sharing buttons, featured cover image, rich HTML content, tags, back link, and related articles.

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| `post` | object | Full article object (see properties below) |
| `share_links` | array | Social share links (see properties below) |
| `share_url` | string | Canonical post URL fallback |
| `tags` | array | Tag objects for this article — each item has `label` (no `tag.url`) |
| `related_posts` | array | Array of related article objects (same fields as `post`, without `content_html`) |
| `home_text` | string | Translated "Home" label (default: `"Home"`) |
| `blog_text` | string | Translated "Blog" label (default: `"Blog"`) |
| `share_text` | string | Translated "Share" label (default: `"Share"`) |
| `tags_text` | string | Translated "Tags" label (default: `"Tags"`) |
| `back_to_blog` | string | Translated "Back to blog" label (default: `"Back to blog"`) |
| `you_may_also_like` | string | Translated "You may also like" label (default: `"You may also like"`) |
| `theme_data` | object | Merchant-configured dynamic settings |

**Post properties:**

| Property | Type | Description |
|----------|------|-------------|
| `post.title` | string | Article headline |
| `post.url` | string | Relative link to the article (`/blog/<slug>`) |
| `post.cover_image` | string | Main cover image URL |
| `post.content_html` | string | Full HTML content body — render with `{{ post.content_html \| raw }}` |
| `post.published_at` | string | ISO datetime for `<time datetime="...">` |
| `post.formatted_date` | string | Formatted publication date |
| `post.category` | string | Category name |

**Share link properties:**

| Property | Type | Description |
|----------|------|-------------|
| `link.key` | string | Platform identifier (`facebook`, `twitter`, `whatsapp`) |
| `link.label` | string | Display label (e.g. "Facebook", "X", "WhatsApp") |
| `link.href` | string | Pre-encoded share URL — do not apply `url_encode` |
| `link.icon` | string | Optional CDN URL for the social icon |

:::note
- **Article content:** Always output `post.content_html` with the `raw` filter (`{{ post.content_html | raw }}`) so that HTML from the editor renders unescaped.
- **Tags:** Each tag object has only a `label` property (`tag.label`). There is no `tag.url`; render tags as `<span>` elements, not `<a>` links.
- **Social sharing:** The `href` in `share_links` is already URL-encoded by the storefront runtime. Do not apply `url_encode` in Liquid.
- **Related articles:** The storefront does not call `blog-grid.liquid` on the article page. Related articles are rendered directly in `blog-post.liquid` using `related_posts`.
:::

### Example

```liquid
{% if post %}
  <article class="ps-blog ps-blog--post ps-sr-scope" data-liquid-blog-post>
    <nav class="ps-blog-crumbs" aria-label="Breadcrumb" data-anim="fadeInUp" data-seq="0">
      <a href="/">{{ home_text | default: "Home" }}</a>
      <span aria-hidden="true">/</span>
      <a href="/blog">{{ blog_text | default: "Blog" }}</a>
      <span aria-hidden="true">/</span>
      <span>{{ post.title }}</span>
    </nav>

    <header class="ps-blog-post-header" data-anim="fadeInUp" data-seq="1">
      <div class="ps-blog-post-meta">
        {% if post.formatted_date != blank %}
          <time datetime="{{ post.published_at }}">{{ post.formatted_date }}</time>
        {% endif %}
        {% if post.category != blank %}
          <span>{{ post.category }}</span>
        {% endif %}
      </div>
      <div class="ps-blog-post-heading">
        <h1 class="ps-blog-post-title">{{ post.title }}</h1>
        {% if share_links.size > 0 %}
          <div class="ps-blog-share">
            <span>{{ share_text | default: "Share" }}</span>
            {% for link in share_links %}
              <a href="{{ link.href }}" target="_blank" rel="noopener noreferrer" aria-label="{{ link.label }}">
                {% if link.icon != blank %}
                  <img src="{{ link.icon }}" alt="{{ link.label }}" />
                {% else %}
                  {{ link.label }}
                {% endif %}
              </a>
            {% endfor %}
          </div>
        {% endif %}
      </div>
    </header>

    {% if post.cover_image != blank %}
      <img
        class="ps-blog-post-cover"
        src="{{ post.cover_image }}"
        alt="{{ post.title }}"
        width="1200"
        height="560"
        loading="eager"
        data-anim="fadeInUp"
        data-seq="2"
      />
    {% endif %}

    {% if post.content_html != blank %}
      <div class="ps-blog-post-body" data-anim="fadeInUp" data-seq="3">
        {{ post.content_html | raw }}
      </div>
    {% endif %}

    {% if tags and tags.size > 0 %}
      <div class="ps-blog-tags" data-anim="fadeInUp" data-seq="4">
        <span>{{ tags_text | default: "Tags" }}:</span>
        {% for tag in tags %}
          <span class="ps-blog-tag">{{ tag.label }}</span>
        {% endfor %}
      </div>
    {% endif %}

    <a class="ps-blog-back" href="/blog">{{ back_to_blog | default: "Back to blog" }}</a>
  </article>

  {% if related_posts and related_posts.size > 0 %}
    <section class="ps-blog ps-blog--related ps-sr-scope">
      <h2 class="ps-blog-related-title" data-anim="fadeInUp" data-seq="5">
        {{ you_may_also_like | default: "You may also like" }}
      </h2>
      <div class="ps-blog-grid">
        {% for item in related_posts %}
          <a class="ps-blog-card" href="{{ item.url }}" data-anim="fadeInUp" data-seq="{{ forloop.index0 | plus: 6 }}">
            {% if item.cover_image != blank %}
              <img
                class="ps-blog-card-img"
                src="{{ item.cover_image }}"
                alt="{{ item.title }}"
                width="400"
                height="260"
                loading="lazy"
              />
            {% endif %}
            <div class="ps-blog-card-body">
              <p class="ps-blog-meta">
                {{ item.formatted_date }}{% if item.category != blank %} · {{ item.category }}{% endif %}
              </p>
              <h3 class="ps-blog-card-title">{{ item.title }}</h3>
              {% if item.excerpt != blank %}
                <p class="ps-blog-excerpt">{{ item.excerpt }}</p>
              {% endif %}
            </div>
          </a>
        {% endfor %}
      </div>
    </section>
  {% endif %}
{% endif %}
```

---

## Homepage Blog

The storefront homepage builder includes a built-in React blog section. There is **no Liquid template** for the homepage blog (do not create `sections/blog.liquid`).

To style the homepage blog cards, target the standardized CSS class hooks in your `style.css`:

```css
.blog-home { }
.blog-home-heading { }
.blog-home-title { }
.blog-home-subtitle { }
.blog-home-grid { }
.blog-home-featured { }
.blog-home-card { }
```
