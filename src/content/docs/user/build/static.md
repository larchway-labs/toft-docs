---
title: Static sites
description: Serve a folder of HTML, or the committed output of a front-end build.
---

A folder of HTML, CSS, JavaScript and images deploys with no configuration.
Toft serves the files itself.

## Two ways in

**A plain folder.** Detected automatically when the root has HTML and none of
`package.json`, `requirements.txt`, `pyproject.toml`, `Pipfile` or `go.mod`.

**A built front end** (Vite, Astro, Hugo, Docusaurus and so on). Commit the
build output and declare where it is:

```toml
# toft.toml
[static]
root = "dist"
```

A `[static]` table overrides detection, so a repository with a `package.json`
is served as static.

:::caution
Toft never runs your build for a static app. The output folder must be
committed, and not listed in `.gitignore`.
:::

## Settings

| Key | Default | Meaning |
|---|---|---|
| `root` | repository root | Folder to serve, relative to the repository. |
| `entry` | `index.html`, else the only `.html` file in the root | The page served at `/apps/<slug>/`. Several candidates and no `entry` fails the deploy. |
| `fallback` | `false` | Serve `entry` for unmatched paths with no file extension that accept HTML. Turn on for single-page apps with client-side routing. |

A `404.html` in the root is used for unmatched paths. A subfolder with its own
`index.html` is served at its path; directory listings are off.

## Set your generator's base path

Your site lives under `/apps/<slug>/`.

| Generator | Setting |
|---|---|
| Vite, Astro | `base` |
| Next.js (static export) | `basePath` |
| Hugo | `baseURL` |
| Docusaurus | `baseUrl` |

Relative URLs (`href="styles.css"`) need no setting. Root-absolute ones
(`href="/styles.css"`) miss your app and return 404; the build log names the
first few it finds.

## Never served

Dotfiles and dot-folders (`.git/`, `.env`), `toft.toml` and
`ecosystem.config.json` return 404 at any depth.

## Limits

A static app answers `GET` and `HEAD` only. It has no process, so it can't
declare [jobs](../../automation/jobs/) or a `[runtime]` pin — either one fails
the deploy.
