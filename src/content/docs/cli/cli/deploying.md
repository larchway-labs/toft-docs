---
title: Deploying
description: Create an app, push your working tree to it, and read why a deploy failed.
---

`toft deploy` bundles the directory as it is, uncommitted edits included, and
deploys it. It needs no git remote, no commit, and no repository.

## Before the first deploy

```bash
toft whoami
```

`toft whoami` says whether you can create apps, whether this install takes
uploaded bundles, and which language versions it has. Each of those would
otherwise surface as a refused deploy. See the
[command reference](../commands/#toft-whoami).

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

## Checking before you deploy

```bash
toft check             # or: toft deploy --dry-run
```

`toft check` uploads the bundle and asks the install what a deploy would decide
before building anything: the framework it detects, the language version it
would use, the jobs in `toft.toml`, and any problem that would refuse the
deploy. Nothing is deployed or recorded. It exits 1 if the deploy would be
refused, naming the same `reason` the deploy would fail with.

A check cannot tell you whether the dependency policy will accept your packages,
or whether the build and start will succeed. It says so in its answer.

You don't need an app yet. In a directory that is not linked, `toft check`
checks the tree as a new app, so you can run it before `toft create` and claim a
slug only once the answer is clean.

## Checking that it works

A successful deploy means the app started and answered. To check that a
particular page works, add `--verify`:

```bash
toft deploy --verify /healthz
```

Once the deploy succeeds, `toft` requests that path as you and exits 1 unless it
answers 2xx or 3xx. A 5xx is retried for up to 30 seconds while the new release
warms up (`--verify-timeout` changes that). `redeploy`, `rollback` and `create`
take the same flags.

To look at any page yourself, use `toft fetch`:

```bash
toft fetch /healthz
toft fetch / --anonymous     # what somebody who is not signed in sees
```

A new app is private, so an anonymous request gets `401`. That is the app
working; your own request carries your credential.

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

A deploy the install refuses before it starts, such as a locked app or a key
that cannot write, carries a `code`, a `retryable` flag and often a `hint`
naming the next step. See [Errors as JSON](../exit-codes/#errors-as-json).

## After it is deployed

```bash
toft env set LOG_LEVEL=debug --restart     # change a variable and apply it
toft visibility authenticated              # let anyone signed in open it
toft deployments list                      # the history, * marks what is serving
toft deployments prune --yes               # keep only the serving deployment
toft delete my-app --yes                   # remove the app entirely
```

All of these are in the [command reference](../commands/#toft-env).

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
