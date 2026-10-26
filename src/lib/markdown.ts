/**
 * Every page as plain Markdown, for coding agents.
 *
 * A page's source is already Markdown, so this is a small translation rather
 * than an HTML-to-text pass: the title and description come back from the
 * frontmatter as a heading and a summary line, Starlight's `:::note` asides
 * become blockquotes any Markdown reader understands, and every link between
 * pages is rewritten to point at the Markdown copy of its target. Links are
 * written relative to the site's root rather than as full URLs, so a mirror
 * copied onto another host keeps working — the same rule the HTML follows.
 */
import { getCollection, type CollectionEntry } from "astro:content";
import { readingOrder } from "../sidebar.mjs";

type Doc = CollectionEntry<"docs">;

/** The site's base, without its trailing slash: `/0.9`. */
export const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");

/** Where the Markdown copy of a page is served. */
export function markdownHref(id: string): string {
  return `${BASE}/${id}.md`;
}

/** Which minor these guides describe, read from the folder they are built into. */
export function versionLabel(): string {
  const last = BASE.split("/").pop() ?? "";
  if (/^\d+\.\d+$/.test(last)) return `version ${last}`;
  if (last === "latest") return "the newest published version";
  return "the unreleased next version";
}

/** The pages in reading order, each joined to its collection entry. */
export async function pagesInOrder() {
  const docs = new Map((await getCollection("docs")).map((d) => [d.id, d]));
  return readingOrder().flatMap((p) => {
    const entry = docs.get(p.slug);
    return entry ? [{ ...p, entry }] : [];
  });
}

const ASIDE_TITLE: Record<string, string> = {
  note: "Note",
  tip: "Tip",
  caution: "Caution",
  danger: "Warning",
};

/** One page, as an agent should read it. */
export function pageMarkdown(entry: Doc, ids: Set<string>): string {
  const { title, description } = entry.data;
  const head = [`# ${title}`, ""];
  if (description) head.push(`> ${description}`, "");
  head.push(`Source: ${BASE}/${entry.id}/`, "", "");
  return head.join("\n") + body(entry, ids).trim() + "\n";
}

function body(entry: Doc, ids: Set<string>): string {
  const out: string[] = [];
  let fence: string | null = null;
  let aside = false;
  for (const line of (entry.body ?? "").split("\n")) {
    const fenceMark = line.match(/^\s*(```+|~~~+)/)?.[1];
    if (fenceMark && (fence === null || fenceMark.startsWith(fence))) {
      fence = fence === null ? fenceMark : null;
      out.push(aside ? quote(line) : line);
      continue;
    }
    if (fence === null) {
      const open = line.match(/^:::(note|tip|caution|danger)(?:\[(.*)\])?\s*$/);
      if (open) {
        aside = true;
        out.push(`> **${open[2] || ASIDE_TITLE[open[1]]}**`, ">");
        continue;
      }
      if (aside && /^:::\s*$/.test(line)) {
        aside = false;
        continue;
      }
    }
    const text = fence === null ? relink(line, entry.id, ids) : line;
    out.push(aside ? quote(text) : text);
  }
  return out.join("\n");
}

function quote(line: string): string {
  return line.trim() === "" ? ">" : `> ${line}`;
}

/** Rewrite every relative link on a line to the Markdown copy of its target. */
function relink(line: string, from: string, ids: Set<string>): string {
  return line.replace(/\]\(([^)\s]+)\)/g, (whole, target: string) => {
    if (/^([a-z]+:|#|\/)/i.test(target)) return whole;
    const url = new URL(target, `https://docs.invalid${BASE}/${from}/`);
    const id = url.pathname.slice(BASE.length + 1).replace(/\/+$/, "");
    const path = ids.has(id) ? markdownHref(id) : url.pathname;
    return `](${path}${url.hash})`;
  });
}

export function markdownResponse(text: string, type = "text/markdown"): Response {
  return new Response(text, { headers: { "Content-Type": `${type}; charset=utf-8` } });
}
