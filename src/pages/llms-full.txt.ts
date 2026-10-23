/** All three guides as one Markdown file, in reading order. */
import type { APIRoute } from "astro";
import { fullText } from "../lib/full-text";

export const GET: APIRoute = async () => fullText();
