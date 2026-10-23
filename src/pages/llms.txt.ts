/**
 * The index an agent reads first (llmstxt.org): what Toft is, then every page
 * in reading order with its one-line description, each linking to the page's
 * Markdown copy. The descriptions are the pages' own frontmatter, so a page
 * that lacks one is visible here as a bare link.
 */
import type { APIRoute } from "astro";
import { guides } from "../sidebar.mjs";
import { BASE, markdownHref, markdownResponse, pagesInOrder, versionLabel } from "../lib/markdown";

export const GET: APIRoute = async () => {
  const pages = await pagesInOrder();
  const lines = [
    "# Toft",
    "",
    "> Toft is a self-hosted platform for an organization's own software: web apps, APIs, dashboards, reports and scheduled jobs. Give it a git repository or a folder and it detects the framework, builds the app, runs it, and serves it behind the organization's sign-in. These are its three guides, for " +
      versionLabel() +
      ".",
    "",
    "Every link below is the Markdown copy of one page; adding `.md` to any page's address gives the same thing. Links inside the pages point at other pages' Markdown copies. Addresses are relative to this site's root.",
    "",
    "Each guide is also one file, and the whole site is one file:",
    "",
    ...guides.map((g) => `- [${g.label}](${BASE}/llms-${g.id}.txt): ${g.audience}`),
    `- [Everything](${BASE}/llms-full.txt): all three guides, in reading order.`,
    "",
    "To deploy or manage apps from an agent, install the `toft` CLI and its two agent skills; see " +
      `[Skills for coding agents](${markdownHref("cli/cli/agents")}).`,
  ];
  let heading = "";
  for (const p of pages) {
    const h = `${p.guide.label}: ${p.section}`;
    if (h !== heading) {
      lines.push("", `## ${h}`, "");
      heading = h;
    }
    const d = p.entry.data.description;
    lines.push(`- [${p.entry.data.title}](${markdownHref(p.slug)})${d ? `: ${d}` : ""}`);
  }
  return markdownResponse(lines.join("\n") + "\n", "text/plain");
};
