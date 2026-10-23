// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { sidebar } from "./src/sidebar.mjs";

/**
 * Toft's documentation: the user, admin and CLI & SDK guides as one site.
 *
 * Published to GitHub Pages one folder per Toft minor (`/toft-docs/0.7/`), so
 * `base` comes from the build — the workflow sets DOCS_BASE per release branch —
 * and an install links to the folder for the minor it runs (ADR, *The manual*).
 * The default is for `npm run dev`.
 *
 * Pagefind stays: its index is static files inside each version's folder, so
 * search is per version, works on GitHub Pages, and works on a mirror copied
 * whole onto a network with no route out.
 */
const base = (process.env.DOCS_BASE ?? "/toft-docs/dev").replace(/\/+$/, "");

export default defineConfig({
  base,
  trailingSlash: "always",
  // Each guide's front door is its first page. The site's own is the home
  // page (src/content/docs/index.mdx): one combined site needs somewhere that
  // says it holds three guides.
  redirects: {
    "/user/": `${base}/user/start/what-toft-is/`,
    "/admin/": `${base}/admin/start/architecture/`,
    "/cli/": `${base}/cli/cli/installing/`,
    // Scheduled tasks were removed; scheduled work is a job.
    "/user/automation/scheduled-tasks/": `${base}/user/automation/jobs/`,
    "/cli/sdk/tasks/": `${base}/cli/sdk/jobs/`,
  },
  integrations: [
    starlight({
      title: "Toft",
      logo: { src: "./src/assets/logo.svg", alt: "Toft" },
      description: "How to use, run and build on Toft.",
      // Light only, like the platform: the documented way to remove Starlight's
      // theme toggle is an empty component, not CSS a reader can defeat.
      components: {
        ThemeSelect: "./src/components/empty.astro",
        // The header's right-hand slot holds the guide switcher instead.
        SocialIcons: "./src/components/GuideNav.astro",
        Sidebar: "./src/components/Sidebar.astro",
        PageTitle: "./src/components/PageTitle.astro",
        Hero: "./src/components/Hero.astro",
      },
      // One guide in the sidebar, and a Markdown alternate on every page.
      routeMiddleware: "./src/routeData.ts",
      // Code reads against the page, not a terminal window: one light theme,
      // the hairline every other surface has, and no window chrome.
      expressiveCode: {
        themes: ["github-light"],
        styleOverrides: {
          borderRadius: "0.5rem",
          borderColor: "var(--lp-border)",
          codeFontFamily: "var(--sl-font-mono)",
          codeFontSize: "0.8125rem",
          codeLineHeight: "1.65",
          codeBackground: "var(--lp-muted)",
          frames: {
            shadowColor: "transparent",
            frameBoxShadowCssValue: "none",
            editorTabBarBackground: "var(--lp-card)",
            editorActiveTabBackground: "var(--lp-card)",
            editorActiveTabIndicatorTopColor: "transparent",
            editorActiveTabIndicatorBottomColor: "var(--lp-primary)",
            terminalBackground: "var(--lp-muted)",
            terminalTitlebarBackground: "var(--lp-card)",
            terminalTitlebarBorderBottomColor: "var(--lp-border)",
            terminalTitlebarDotsOpacity: "0",
            inlineButtonBorder: "var(--lp-border)",
          },
        },
      },
      customCss: [
        "@fontsource-variable/geist",
        "@fontsource-variable/geist-mono",
        "./src/styles/toft.css",
      ],
      pagination: true,
      lastUpdated: false,
      pagefind: true,
      sidebar,
    }),
  ],
});
