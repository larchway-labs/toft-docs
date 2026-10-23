/** One guide as one Markdown file: `llms-user.txt`, `llms-admin.txt`, `llms-cli.txt`. */
import type { APIRoute, GetStaticPaths } from "astro";
import { guides } from "../sidebar.mjs";
import { fullText } from "../lib/full-text";

export const getStaticPaths: GetStaticPaths = () => guides.map((g) => ({ params: { guide: g.id } }));

export const GET: APIRoute = async ({ params }) => fullText(params.guide);
