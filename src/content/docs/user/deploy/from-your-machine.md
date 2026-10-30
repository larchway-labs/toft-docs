---
title: From your machine
description: Deploy your working tree with toft deploy — uncommitted changes included, no git push needed.
---

`toft deploy` sends the folder you are in, exactly as it is on disk —
uncommitted edits included, no commit or push required. It is the fast loop
while you are iterating.

```bash
toft login https://toft.your-company.com   # once
toft create                                 # first time: create an app from this folder
toft deploy                                 # every time after
```

Install `toft` first: [Installing toft](../../cli/installing/). The full
command reference is in the CLI & SDK guide.

## Which app it deploys to

`toft link <slug>` records the app in `toft.toml`, which you commit:

```toml
[app]
slug = "sales-dashboard"
```

`toft create --link` does the same when it creates the app. `--app <slug>`
overrides it for one command.

## What gets sent

- **`.gitignore` decides** — every `.gitignore` in the tree, plus
  `.git/info/exclude`. A `.toftignore` adds more patterns; it never replaces
  them. `toft` reads the files itself, so a folder that is not a git
  repository works too.
- **Always dropped:** `.git/`, `.hg/`, `.svn/`, `node_modules/`, `venv/`,
  `.venv/`, `__pycache__/`, `*.pyc`, `.DS_Store`.
- **Never sent:** `.env` and `.env.*`, whatever `.gitignore` says
  (`.env.example` and `.env.sample` still go). Send the values with
  `toft env set --from-file .env`; see
  [Settings and environment variables](../../run/settings/).
- **Dropped when the root has a `package.json`:** `dist/`, `build/`, `out/`,
  `.next/`, `.nuxt/`, `.svelte-kit/` — the build recreates them. A static site
  whose `[static] root` points into one of these still ships it.

The bundle can be at most 100 MB.

:::note[Git-backed apps]
`toft deploy` to an app created from a repository sends your tree once. It does
not detach the app: the next deploy from the repository replaces this code.
:::

## Watching

`toft deploy` streams progress and exits with the deploy's outcome. `--logs`
interleaves the build log. If you lose the terminal, rejoin:

```bash
toft deploy --watch <deployID>
```

## In a pipeline

```bash
export TOFT_URL=https://toft.your-company.com
export TOFT_TOKEN_FILE=/run/secrets/toft    # or TOFT_TOKEN
toft deploy --app reports
```

There is no `--token` flag, so secrets stay out of shell history and the
process list. Use a [deploy key](../../cli/api-keys/) (`toftd_…`) rather than
your personal key, so the pipeline survives your leaving.

| Exit code | Meaning |
|---|---|
| `0` | Deployed. |
| `1` | The deploy ran and failed — read the build log. Also when another deploy of the app is still queued: wait, then retry. |
| `2` | Usage or configuration: no app linked, a bad flag, an unknown deployment id. |
| `3` | Not authenticated, or the credential was refused. |
| `4` | The install did not answer. |
