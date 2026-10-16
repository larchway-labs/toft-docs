---
title: Static sites
description: Serving a folder of HTML, and using it to host a built front end.
---

A repository that is HTML, CSS, images and JavaScript deploys with no
configuration. Nothing is installed and nothing is compiled — the folder *is*
the site, served by Toft itself.

## Two ways to get one

**A plain folder of files.** Commit it and deploy. Detection picks it up as long
as the tree has none of `package.json`, `requirements.txt`, `pyproject.toml`,
`Pipfile` or `go.mod`.

**A built front end.** Vite, Astro, Create React App, Hugo, Docusaurus — anything
that compiles to a folder. Commit the build output and declare where it is:

```toml
# toft.toml
[static]
root = "dist"
```

That declaration **overrides the disqualifiers**, so a repository with a
`package.json` is served as static rather than refused. It is opt-in on purpose:
without it, a Vite repository would deploy successfully and serve a blank page
forever.

:::caution
**Toft does not run your build.** It never runs `npm install` or
`npm run build` for a static app. `dist/` has to be committed, and it has to not
be in your `.gitignore`.
:::

## The keys

```toml
[static]
root     = "dist"          # document root, relative to the repo
entry    = "report.html"   # what /apps/your-slug/ serves
fallback = true            # for client-side routing
```

- **`entry`** defaults to `index.html`, else the only `.html` file in the root.
  Several candidates and no declaration fails the deploy, naming them.
- **`fallback`** serves the entry document for any unmatched path that has no
  file extension and accepts HTML. Single-page apps need it; nothing else does.
  On by default it would turn every missing image into an HTML page, so it is
  off by default.
- A **`404.html`** in the root is used for unmatched paths.

Root, entry and fallback are resolved **from the release**, so they cannot drift
away from the files they describe.

## Set your generator's base path

Your site is served under `/apps/your-slug/`. Almost every generator has a
setting for that:

| Generator | Setting |
|---|---|
| Vite | `base` |
| Astro | `base` |
| Next (static export) | `basePath` |
| Hugo | `baseURL` |
| Docusaurus | `baseUrl` |

Relative URLs (`href="styles.css"`, `./img/x.png`) work without any of this.
Root-absolute ones (`href="/styles.css"`) ask the platform and get a 404. The
build log names the first few offenders it finds.

## What is never served

At any depth, and not configurable:

- Anything beginning with a dot.
- `toft.toml` and `ecosystem.config.json`.
- Source files and lockfiles.

They return **404**, not 403 — a 403 would confirm the file is there.

Directory listings are off. A subdirectory with an `index.html` is served at its
own path.

## What a static app does not have

- **No process.** Nothing is running between requests.
- **No dependencies.** The tab says *no dependencies*, not "zero findings".
- **No jobs.** A `toft.toml` declaring one on a static app fails the
  deploy: there is no runtime for a command to mean anything in.
- **No viewer identity.** There is nothing to hold a token.

[Scheduled tasks](../../automation/scheduled-tasks/) do work, because they are
just HTTP requests.
