/**
 * The Markdown copy of every page, at the page's own address plus `.md`:
 * `/user/start/first-app/` is also `/user/start/first-app.md`.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { markdownResponse, pageMarkdown } from "../lib/markdown";

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = (await getCollection("docs")).filter((d) => d.id !== "index");
  const ids = new Set(docs.map((d) => d.id));
  return docs.map((entry) => ({ params: { slug: entry.id }, props: { entry, ids } }));
};

export const GET: APIRoute = ({ props }) => markdownResponse(pageMarkdown(props.entry, props.ids));
