---
title: Deploying
description: Create an app, push your working tree to it, and read why a deploy failed.
---

`toft deploy` bundles the directory as it is, uncommitted edits included, and
deploys it. It needs no git remote, no commit, and no repository.

## First deploy

```bash
cd ~/code/my-app
toft create --link     # claim a slug, deploy this tree, write toft.toml
toft deploy            # every deploy after that
```

`toft create` names the slug it is about to claim and asks first; `--yes`
answers. If the slug is taken, the install picks a free one and `toft` says
which. All flags are in the [command reference](../commands/#toft-create).

## From a repository, or one folder of it

```bash
toft create --repo https://github.com/acme/tools --branch main --subdir services/billing
```

With `--subdir`, only that folder is deployed: no `.git`, nothing outside
it. The slug defaults to the folder's name (`billing`), and `toft status` shows
the folder. A folder path containing `..`, `.git`, or a symlink is refused.

To rebuild from the repository later:

```bash
toft redeploy
```

`toft redeploy` uploads nothing. It prints the repository and branch first, and
is refused on an app created from an upload.

:::note
`toft deploy` to a repository-backed app deploys your local tree, but does not
detach the app. The next deploy from the repository replaces your code, and
`toft status` says so while it is true.
:::

## Choosing the app

`toft` finds the app in this order: `--app`, `TOFT_APP`, `.toft.toml`, then
`toft.toml`.

```bash
toft link my-app              # write [app] slug into toft.toml
toft link my-app --local      # write .toft.toml instead, and offer to gitignore it
toft link my-app-stg --install https://staging.toft.corp
```

```toml
# toft.toml
[app]
slug = "my-app"

[app.installs."https://staging.toft.corp"]
slug = "my-app-stg"
```

`toft link` checks the slug against the install first, so a typo fails here
rather than at deploy time. `toft deploy` never creates an app.

## What goes in the bundle

Every `.gitignore` in the tree decides, with `!` negations, plus
`.git/info/exclude`. A `.toftignore` adds to them. `toft` never runs git.

| Always dropped | Dropped only when the root has a `package.json` |
|---|---|
| `.git/`, `.hg/`, `.svn/`, `node_modules/`, `venv/`, `.venv/`, `__pycache__/`, `*.pyc`, `.DS_Store` | `dist/`, `build/`, `out/`, `.next/`, `.nuxt/`, `.svelte-kit/` |

A `[static] root` that points into one of those folders keeps it.

Files that look like secrets (`.env*`, `*.pem`, `*.key`, `id_rsa*`,
`id_ed25519*`) are uploaded with a warning, not refused.

Do not install dependencies before deploying; the install resolves them. For R,
ignore `renv/library/` and ship `renv.lock`.

## Watching a deploy

```bash
toft deploy --logs          # stream the build log
toft deploy --no-watch      # start and return the deployment id
toft deploy --watch <id>    # rejoin a deploy started earlier
toft deploy --json          # NDJSON progress frames, then one result object
```

`--watch` on a deploy that already failed still prints why.

## When a deploy fails

The result carries a `reason`, the full message, and the detail that reason
needs: a tail of the build log, or the dependency findings.

| `reason` | Where to look |
|---|---|
| `build_failed` | The build log: `toft logs --deploy <id>`. |
| `start_failed`, `not_ready` | It built but did not answer. Read the app log: `toft logs`. |
| `dependency_blocked` | `toft deps`: the packages, advisories, and fixed versions. |
| `manifest_invalid` | `toft.toml`. The message names the field. |
| `unsupported_framework` | Nothing in the tree the install knows how to serve. |
| `runtime_version` | The language version you declared is not available. |
| `source_unavailable`, `source_blocked` | The repository URL, the credential, or the install's source policy. |
| `publish_failed` | The install's artifact store. Tell an administrator. |
| `internal_error` | Retry, then tell an administrator. |

A successful deploy can carry `warnings`, such as a `[tasks]` table in
`toft.toml`, which nothing reads. They print, and appear in the `--json`
result.

A locked app is refused with exit 2 before anything is built. Retrying will not
help until an administrator lifts the lock.

## A program with no web server

```toml
# toft.toml
[batch]
language = "python"   # only if the tree has more than one language's project file

[jobs.nightly-extract]
command  = "python extract.py"
schedule = "0 3 * * *"
```

A `[batch]` table makes a **batch app**: the deploy installs dependencies for
Node, Python, Go or R, starts nothing, and the app's work is its
[jobs](../../sdk/jobs/). It settles as `ready`, and `restart`, `start` and `stop`
are refused with `no_service`. `[batch]` together with `[static]` is refused.

## Publishing from RStudio

R developers can use RStudio's **Publish** button instead. Add an account of the
*Posit Connect* kind with the install's address. Sign-in goes through the same
approval page as `toft login` and creates a personal key named
*RStudio (rsconnect)*. A name already taken is refused rather than renamed. For
anything scripted, use `toft`.
