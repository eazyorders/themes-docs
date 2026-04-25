import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import React from "react";

const features = [
  {
    title: "Custom Themes",
    description:
      "Build fully custom storefronts using Liquid templates, dynamic data, and powerful section-based layouts.",
    link: "/docs/custom-themes/getting-started",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    ),
  },
  {
    title: "Liquid Reference",
    description:
      "Master the Liquid templating language with a complete reference of objects, filters, and tags available in EasyOrders.",
    link: "/docs/custom-themes/liquid-reference",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "Sections & Layouts",
    description:
      "Explore home, product, layout, and utility sections to compose dynamic, reusable page structures for your store.",
    link: "/docs/category/sections",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
  },
  {
    title: "Theme Palette",
    description:
      "Customize colors, fonts, and visual styles with the palette system. Give your storefront a unique look without touching code.",
    link: "/docs/custom-themes/palette",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
      </svg>
    ),
  },
  {
    title: "Events Reference",
    description:
      "Hook into storefront events to add analytics, custom behavior, and dynamic interactions to your theme.",
    link: "/docs/custom-themes/events-reference",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  {
    title: "Funnels Builder",
    description:
      "Create high-converting sales funnels with custom HTML. Build landing pages, checkout flows, and more.",
    link: "/docs/funnels/funnels",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
      </svg>
    ),
  },
];

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <span>Theme Development</span>
        </div>
        <h1 className="hero-title">
          Design your <span className="hero-gradient">perfect storefront</span>
        </h1>
        <p className="hero-subtitle">
          Everything you need to build, customize, and manage beautiful
          EasyOrders themes. From Liquid templates to pre-built designs.
        </p>
        <div className="hero-actions">
          <Link className="hero-button hero-button--primary" to="/docs/custom-themes/getting-started">
            Get Started
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            className="hero-button hero-button--secondary"
            to="/docs/funnels/funnels"
          >
            Funnels Builder
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Explore the Docs</h2>
          <p className="features-subtitle">
            Everything you need to build stunning storefronts
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.link}
              className="feature-card"
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-description">
                {feature.description}
              </p>
              <span className="feature-card-link">
                Learn more
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickStartSection() {
  return (
    <section className="quickstart-section">
      <div className="quickstart-container">
        <div className="quickstart-content">
          <h2 className="quickstart-title">Quick Start</h2>
          <p className="quickstart-subtitle">
            Start building your custom theme in minutes
          </p>
          <div className="quickstart-steps">
            <div className="quickstart-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Set up your theme</h4>
                <p>Create a new custom theme from your EasyOrders dashboard</p>
              </div>
            </div>
            <div className="quickstart-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Write Liquid templates</h4>
                <p>Use Liquid to access product data, collections, and store settings</p>
              </div>
            </div>
            <div className="quickstart-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Add sections</h4>
                <p>Compose your pages with reusable home, product, and layout sections</p>
              </div>
            </div>
          </div>
          <Link className="hero-button hero-button--primary" to="/docs/custom-themes/getting-started">
            Read the Guide
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
        <div className="quickstart-code">
          <div className="code-window">
            <div className="code-window-header">
              <div className="code-window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="code-window-title">product.liquid</span>
            </div>
            <pre className="code-window-body">
              <code>{`<div class="product">
  <h1>{{ product.name }}</h1>
  <p class="price">
    {{ product.price | money }}
  </p>
  <img src="{{ product.image }}"
       alt="{{ product.name }}" />
  <button data-action="add-to-cart"
          data-id="{{ product.id }}">
    Add to Cart
  </button>
</div>`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
    >
      <main className="landing-main">
        <HeroSection />
        <FeaturesSection />
        <QuickStartSection />
      </main>
    </Layout>
  );
}
