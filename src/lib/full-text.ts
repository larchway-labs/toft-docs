import { getCollection } from "astro:content";
import { markdownResponse, pageMarkdown, pagesInOrder, versionLabel } from "./markdown";

/** Pages concatenated in reading order — every guide, or the one named. */
export async function fullText(guide?: string): Promise<Response> {
  const ids = new Set((await getCollection("docs")).map((d) => d.id));
  const pages = (await pagesInOrder()).filter((p) => !guide || p.guide.id === guide);
  const title = guide ? `Toft ${pages[0]?.guide.label ?? guide}` : "Toft documentation";
  const intro = `# ${title}\n\n> ${pages.length} pages, for ${versionLabel()}. Each page starts at a level-one heading; the pages are separated by a horizontal rule.\n`;
  const text = [intro, ...pages.map((p) => pageMarkdown(p.entry, ids))].join("\n---\n\n");
  return markdownResponse(text, "text/plain");
}
