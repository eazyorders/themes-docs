import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "EasyOrders Themes Docs",
  tagline: "Build beautiful storefronts with EasyOrders themes",
  favicon: "https://www.easyorders.eg/easy-icon.png",

  url: "https://themes-docs.easyorders.eg",
  baseUrl: "/",

  organizationName: "easyorders",
  projectName: "easyorders themes",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/eazyorders/themes-docs/blob/main/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "https://www.easyorders.eg/easy-icon.png",
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "EasyOrders Themes",
      logo: {
        alt: "EasyOrders",
        src: "https://www.easyorders.eg/easy-icon.png",
        style: { height: "28px" },
      },
      items: [
        {
          type: "doc",
          docId: "custom-themes/getting-started",
          position: "left",
          label: "Custom Themes",
        },
        {
          type: "doc",
          docId: "funnels/funnels",
          position: "left",
          label: "Funnels Builder",
        },
        {
          href: "https://www.easyorders.eg",
          label: "EasyOrders.eg",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Custom Themes",
          items: [
            { label: "Getting Started", to: "/docs/custom-themes/getting-started" },
            { label: "Liquid Reference", to: "/docs/custom-themes/liquid-reference" },
            { label: "Events Reference", to: "/docs/custom-themes/events-reference" },
          ],
        },
        {
          title: "Funnels Builder",
          items: [
            { label: "Funnels", to: "/docs/funnels/funnels" },
          ],
        },
        {
          title: "Resources",
          items: [
            { label: "Palette", to: "/docs/custom-themes/palette" },
            { label: "Sections", to: "/docs/category/sections" },
            { label: "EasyOrders Website", href: "https://www.easyorders.eg" },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} EasyOrders. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json"],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
