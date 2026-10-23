/**
 * Per-page route data, before Starlight renders anything.
 *
 * - **The sidebar shows one guide.** All three in one tree is 138 links, two
 *   of them to pages called "Language versions". A page's sidebar is the guide
 *   it sits in; the header switches guides.
 * - **Every page names its Markdown copy** in a `<link rel="alternate">`, so
 *   an agent that fetched the HTML can find the cheaper version of it.
 */
import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import type { StarlightRouteData } from "@astrojs/starlight/route-data";
import { markdownHref } from "./lib/markdown";

type Entry = StarlightRouteData["sidebar"][number];

function holdsCurrent(entry: Entry): boolean {
  return entry.type === "link" ? entry.isCurrent : entry.entries.some(holdsCurrent);
}

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  if (route.id === "" || route.id === "index" || route.id === "404") return;

  const guide = route.sidebar.find(holdsCurrent);
  if (guide?.type === "group") route.sidebar = guide.entries;

  route.head.push({
    tag: "link",
    attrs: { rel: "alternate", type: "text/markdown", href: markdownHref(route.id) },
    content: "",
  });
});
