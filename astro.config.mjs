// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

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
        SocialIcons: "./src/components/empty.astro",
      },
      customCss: [
        "@fontsource-variable/geist",
        "@fontsource-variable/geist-mono",
        "./src/styles/toft.css",
      ],
      pagination: true,
      lastUpdated: false,
      pagefind: true,
      sidebar: [
        {
          label: "User guide",
          items: [
          {
            label: "Get started",
            items: [
              { label: "What Toft is", slug: "user/start/what-toft-is" },
              { label: "Signing in", slug: "user/start/signing-in" },
              { label: "Deploy your first app", slug: "user/start/first-app" },
              { label: "Finding your way around", slug: "user/start/finding-your-way" },
            ],
          },
          {
            label: "Deploying",
            items: [
              { label: "From a git repository", slug: "user/deploy/from-git" },
              { label: "From your machine", slug: "user/deploy/from-your-machine" },
              { label: "From RStudio", slug: "user/deploy/from-rstudio" },
              { label: "From an archive", slug: "user/deploy/from-an-archive" },
              { label: "From the gallery", slug: "user/deploy/from-the-gallery" },
              { label: "Watching a deploy", slug: "user/deploy/watching" },
              { label: "Deploying on every push", slug: "user/deploy/auto-deploy" },
              { label: "Releases and rollback", slug: "user/deploy/releases" },
            ],
          },
          {
            label: "Building",
            items: [
              { label: "How Toft reads your repository", slug: "user/build/how-detection-works" },
              { label: "Node and Next.js", slug: "user/build/node" },
              { label: "Python", slug: "user/build/python" },
              { label: "Go", slug: "user/build/go" },
              { label: "R", slug: "user/build/r" },
              { label: "Static sites", slug: "user/build/static" },
              { label: "Notebooks and documents", slug: "user/build/notebooks" },
              { label: "Scheduled re-renders", slug: "user/build/reports" },
              { label: "Language versions", slug: "user/build/versions" },
              { label: "Base paths", slug: "user/build/base-paths" },
              { label: "toft.toml", slug: "user/build/toft-toml" },
            ],
          },
          {
            label: "Running",
            items: [
              { label: "The app page", slug: "user/run/the-app-page" },
              { label: "Status and sleeping", slug: "user/run/status" },
              { label: "Logs", slug: "user/run/logs" },
              { label: "Events", slug: "user/run/events" },
              { label: "Settings and variables", slug: "user/run/settings" },
              { label: "Attached credentials", slug: "user/run/credentials" },
              { label: "Usage and resources", slug: "user/run/usage" },
              { label: "Dependencies and policy", slug: "user/run/dependencies" },
              { label: "When an app is locked", slug: "user/run/locked" },
              { label: "Quiet apps", slug: "user/run/quiet" },
            ],
          },
          {
            label: "Sharing",
            items: [
              { label: "Who can see your app", slug: "user/share/visibility" },
              { label: "Sharing with people and groups", slug: "user/share/people" },
              { label: "Asking for access", slug: "user/share/requesting-access" },
              { label: "Ownership and transfer", slug: "user/share/ownership" },
              { label: "Tags", slug: "user/share/tags" },
              { label: "What your app learns about a viewer", slug: "user/share/viewer" },
            ],
          },
          {
            label: "Automating",
            items: [
              { label: "Scheduled tasks", slug: "user/automation/scheduled-tasks" },
              { label: "Jobs", slug: "user/automation/jobs" },
              { label: "Starting jobs from your app", slug: "user/automation/from-your-app" },
            ],
          },
          {
            label: "Data and files",
            items: [
              { label: "App data", slug: "user/data/app-data" },
              { label: "App storage", slug: "user/data/app-storage" },
              { label: "Browsing a store", slug: "user/data/browsing-a-store" },
              { label: "Sending messages and files", slug: "user/data/integrations" },
            ],
          },
          {
            label: "The command line",
            items: [
              { label: "Installing toft", slug: "user/cli/installing" },
              { label: "Deploying with toft", slug: "user/cli/deploying" },
              { label: "API keys", slug: "user/cli/api-keys" },
              { label: "The app SDK", slug: "user/cli/sdk" },
            ],
          },
          {
            label: "Your account",
            items: [
              { label: "Your account", slug: "user/account/your-account" },
              { label: "Becoming a publisher", slug: "user/account/becoming-a-publisher" },
            ],
          },
          {
            label: "Reference",
            items: [
              { label: "Troubleshooting", slug: "user/reference/troubleshooting" },
              { label: "Limits and caps", slug: "user/reference/limits" },
              { label: "Glossary", slug: "user/reference/glossary" },
            ],
          },
      
          ],
        },
        {
          label: "Admin guide",
          items: [
          {
            label: "Get started",
            items: [
              { label: "What you are running", slug: "admin/start/architecture" },
              { label: "Ways to install", slug: "admin/start/install-options" },
              { label: "First run", slug: "admin/start/first-run" },
              { label: "Upgrading", slug: "admin/start/upgrading" },
            ],
          },
          {
            label: "Configuration",
            items: [
              { label: "Configuration and settings", slug: "admin/config/configuration-vs-settings" },
              { label: "Listeners, origins and proxies", slug: "admin/config/listeners-and-origins" },
              { label: "The operating dials", slug: "admin/config/operating-dials" },
              { label: "Retention", slug: "admin/config/retention" },
            ],
          },
          {
            label: "Identity",
            items: [
              { label: "Sign-in providers", slug: "admin/identity/providers" },
              { label: "The built-in administrator", slug: "admin/identity/local-administrator" },
              { label: "Accounts awaiting activation", slug: "admin/identity/activation" },
              { label: "Sessions", slug: "admin/identity/sessions" },
              { label: "Users and roles", slug: "admin/identity/users-and-roles" },
              { label: "Groups", slug: "admin/identity/groups" },
              { label: "Directory groups", slug: "admin/identity/directory-groups" },
              { label: "Permitted login groups", slug: "admin/identity/permitted-groups" },
              { label: "The directory feed (SCIM)", slug: "admin/identity/directory-feed" },
              { label: "Offboarding and dormancy", slug: "admin/identity/offboarding" },
            ],
          },
          {
            label: "Apps and the estate",
            items: [
              { label: "Execution modes", slug: "admin/apps/execution-modes" },
              { label: "Ownership and grants", slug: "admin/apps/ownership-and-grants" },
              { label: "Listing and access requests", slug: "admin/apps/listing" },
              { label: "Locking and retirement", slug: "admin/apps/locking" },
              { label: "Quiet apps", slug: "admin/apps/quiet" },
              { label: "Tags", slug: "admin/apps/tags" },
              { label: "Releases and retention", slug: "admin/apps/releases" },
              { label: "The artifact store", slug: "admin/apps/artifact-store" },
              { label: "The estate views", slug: "admin/apps/estate-views" },
              { label: "What an app can reach", slug: "admin/apps/reach" },
            ],
          },
          {
            label: "Builds",
            items: [
              { label: "What a deploy does", slug: "admin/build/pipeline" },
              { label: "The build queue", slug: "admin/build/queue-and-limits" },
              { label: "The build cache", slug: "admin/build/cache" },
              { label: "Language versions", slug: "admin/build/languages" },
              { label: "Runner images", slug: "admin/build/runner-images" },
            ],
          },
          {
            label: "Security",
            items: [
              { label: "How apps are isolated", slug: "admin/security/isolation" },
              { label: "Anonymous access", slug: "admin/security/anonymous" },
              { label: "Reachability", slug: "admin/security/reachability" },
              { label: "Trusted app sources", slug: "admin/security/sources" },
              { label: "Connected git hosts", slug: "admin/security/git-connections" },
              { label: "Dependency policy", slug: "admin/security/dependencies" },
              { label: "At-rest encryption", slug: "admin/security/encryption" },
              { label: "Machine credentials", slug: "admin/security/keys" },
              { label: "The audit log", slug: "admin/security/audit" },
              { label: "Scan targets", slug: "admin/security/scan-targets" },
              { label: "What an assessor is told", slug: "admin/security/compliance" },
            ],
          },
          {
            label: "Capabilities",
            items: [
              { label: "What is optional", slug: "admin/capabilities/optional" },
              { label: "App storage", slug: "admin/capabilities/storage" },
              { label: "The credentials broker", slug: "admin/capabilities/credentials" },
              { label: "Integrations", slug: "admin/capabilities/integrations" },
              { label: "Email and notifications", slug: "admin/capabilities/email" },
              { label: "Announcements and messages", slug: "admin/capabilities/announcements" },
              { label: "Publishing from RStudio", slug: "admin/capabilities/rstudio-publishing" },
              { label: "The gallery", slug: "admin/capabilities/gallery" },
              { label: "Documentation", slug: "admin/capabilities/documentation" },
              { label: "Telemetry", slug: "admin/capabilities/telemetry" },
            ],
          },
          {
            label: "Operating",
            items: [
              { label: "System checks", slug: "admin/operate/checks" },
              { label: "Health and processes", slug: "admin/operate/health-and-processes" },
              { label: "Usage and cost", slug: "admin/operate/usage" },
              { label: "Automation", slug: "admin/operate/automation" },
              { label: "Licensing", slug: "admin/operate/licensing" },
              { label: "The binary's subcommands", slug: "admin/operate/command-line" },
              { label: "Troubleshooting", slug: "admin/operate/troubleshooting" },
            ],
          },
          {
            label: "Reference",
            items: [
              { label: "Settings reference", slug: "admin/reference/settings" },
              { label: "Environment reference", slug: "admin/reference/environment" },
              { label: "The admin pages", slug: "admin/reference/admin-pages" },
              { label: "Checks reference", slug: "admin/reference/checks-reference" },
            ],
          },
      
          ],
        },
        {
          label: "CLI & SDK guide",
          items: [
          {
            label: "The CLI",
            items: [
              { label: "Installing toft", slug: "cli/cli/installing" },
              { label: "Signing in", slug: "cli/cli/signing-in" },
              { label: "Deploying", slug: "cli/cli/deploying" },
              { label: "Command reference", slug: "cli/cli/commands" },
              { label: "Skills for coding agents", slug: "cli/cli/agents" },
              { label: "Exit codes", slug: "cli/cli/exit-codes" },
              { label: "CI and automation", slug: "cli/cli/ci" },
            ],
          },
          {
            label: "The SDK",
            items: [
              { label: "What the SDK is", slug: "cli/sdk/what-it-is" },
              { label: "Vendoring it", slug: "cli/sdk/vendoring" },
              { label: "The app itself", slug: "cli/sdk/app" },
              { label: "App data", slug: "cli/sdk/data" },
              { label: "Files and scratch space", slug: "cli/sdk/files" },
              { label: "Notifications", slug: "cli/sdk/notify" },
              { label: "Jobs", slug: "cli/sdk/jobs" },
              { label: "Who is asking", slug: "cli/sdk/viewer" },
              { label: "Scheduled tasks", slug: "cli/sdk/tasks" },
            ],
          },
          {
            label: "Reference",
            items: [
              { label: "Environment variables", slug: "cli/reference/environment" },
              { label: "The six roles", slug: "cli/reference/roles" },
              { label: "Language notes", slug: "cli/reference/languages" },
            ],
          },
      
          ],
        },
      ],
    }),
  ],
});
