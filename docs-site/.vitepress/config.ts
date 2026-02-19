import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    title: "InsureAI",
    description:
      "AI-powered multi-agent insurance chatbot documentation",
    head: [["link", { rel: "icon", href: "/favicon.svg" }]],

    // GitHub Pages deploys to https://<user>.github.io/insure-ai/
    base: "/insure-ai/",

    themeConfig: {
      logo: "/logo/light.svg",
      siteTitle: "InsureAI",

      nav: [
        { text: "Guide", link: "/introduction/overview" },
        { text: "API Reference", link: "/api/rest-api" },
        { text: "Examples", link: "/examples/examples" },
      ],

      sidebar: [
        {
          text: "Getting Started",
          items: [
            { text: "Overview", link: "/introduction/overview" },
            { text: "Why This Project Exists", link: "/introduction/why-this-exists" },
            { text: "Key Concepts", link: "/introduction/key-concepts" },
            { text: "Quickstart", link: "/quickstart/quickstart" },
          ],
        },
        {
          text: "Installation & Setup",
          items: [
            { text: "Installation", link: "/installation/installation" },
            { text: "Configuration", link: "/installation/configuration" },
            { text: "Environment Variables", link: "/installation/environment-variables" },
          ],
        },
        {
          text: "Architecture",
          items: [
            { text: "Architecture", link: "/architecture/architecture" },
            { text: "Folder Structure", link: "/architecture/folder-structure" },
            { text: "Design Decisions", link: "/architecture/design-decisions" },
          ],
        },
        {
          text: "Usage Guides",
          items: [
            { text: "Basic Usage", link: "/usage/basic-usage" },
            { text: "Advanced Usage", link: "/usage/advanced-usage" },
            { text: "Common Workflows", link: "/usage/common-workflows" },
          ],
        },
        {
          text: "API Reference",
          items: [
            { text: "REST API", link: "/api/rest-api" },
            { text: "Authentication", link: "/api/authentication" },
            { text: "Error Handling", link: "/api/error-handling" },
          ],
        },
        {
          text: "Components & Modules",
          items: [
            { text: "Modules Overview", link: "/components/modules-overview" },
            { text: "Agents & Pipelines", link: "/components/agents" },
            { text: "Database Layer", link: "/components/database-layer" },
          ],
        },
        {
          text: "Configuration",
          items: [
            { text: "Config Reference", link: "/configuration/config-reference" },
            { text: "Environment Variables", link: "/configuration/environment-variables" },
          ],
        },
        {
          text: "Examples & Tutorials",
          items: [
            { text: "Examples", link: "/examples/examples" },
            { text: "Tutorials", link: "/examples/tutorials" },
            { text: "Use Case Recipes", link: "/examples/use-case-recipes" },
          ],
        },
        {
          text: "Deployment",
          items: [
            { text: "Deployment", link: "/deployment/deployment" },
            { text: "Production Checklist", link: "/deployment/production-checklist" },
          ],
        },
        {
          text: "Support",
          items: [
            { text: "FAQ", link: "/troubleshooting/faq" },
            { text: "Troubleshooting", link: "/troubleshooting/troubleshooting" },
          ],
        },
      ],

      socialLinks: [
        { icon: "github", link: "https://github.com/jonnyzhong/insure-ai" },
      ],

      search: {
        provider: "local",
      },

      footer: {
        message: "Built with VitePress",
        copyright: "InsureAI Documentation",
      },
    },

    // Allow localhost URLs in docs (they are examples, not real links)
    ignoreDeadLinks: [
      /localhost/,
    ],

    mermaid: {},
  })
);
