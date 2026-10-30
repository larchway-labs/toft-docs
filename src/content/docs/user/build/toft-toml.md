---
title: toft.toml
description: The optional manifest at your repository root, and every table it can carry.
---

`toft.toml` is optional. Without it, Toft detects your app and uses defaults.
Add it to tell Toft what detection can't work out. Every key is optional.

## `[app]`

Which app the `toft` CLI deploys to, optionally per install. Only the CLI
reads it; `toft link` writes it.

```toml
[app]
slug = "sales-dashboard"

[app.installs."https://staging.toft.example.com"]
slug = "sales-dashboard-stg"
```

## `[runtime]`

Version ranges for `python`, `node` and `r`. A `go` key is refused — Go reads
`go.mod`. See [Language versions](../versions/).

## `[static]`

Serve the repository, or a folder of it, as a static site. Overrides all other
detection.

| Key | Meaning |
|---|---|
| `root` | Folder to serve, relative to the repository. |
| `entry` | Page served at `/apps/<slug>/`. Defaults to `index.html`. |
| `fallback` | `true` to serve `entry` for unmatched routes (single-page apps). |

See [Static sites](../static/).

## `[notebook]`

| Key | Meaning |
|---|---|
| `file` | The document to render, when there are several or it's in a subfolder. |
| `engine` | `"nbconvert"` or `"quarto"` for an `.ipynb`; `"knitr"` (R) or `"jupyter"` (Python) for a `.qmd`. |

See [Notebooks and documents](../notebooks/).

## `[batch]`

Declares an app that is only jobs: no web server. Never inferred, and can't be
combined with `[static]`.

```toml
[batch]
language = "python"   # only needed if the repository has several languages

[jobs.extract]
command  = "python extract.py"
schedule = "0 2 * * *"
```

See [Schedule work with jobs](../../automation/jobs/).

## `[env]`

The environment variables your app needs, one key each. You decide which are
secrets.

```toml
[env]
DB_HOST     = "db.internal"          # visible, with a default
API_URL     = {}                     # visible, no default
LOG_LEVEL   = { default = "info" }   # visible, with a default
DB_PASSWORD = { sensitive = true }   # sensitive, never a default
```

A string or `{ default = "…" }` is a visible variable with that default, `{}`
a visible one with none, and `{ sensitive = true }` a secret. Each deploy adds
any variable the app doesn't have yet, with its default and its flag. A secret
shows as **not set** on the app's Settings tab until someone fills it in. A
variable that already exists is never changed, and one you take out of the
file is never deleted. A name an attached credential supplies is skipped. The
build log says what was added:
`==> toft.toml [env]: added API_URL, DB_PASSWORD (4 declared, 2 already set)`.

A secret's value goes to each install separately, with the Settings tab or
`toft env set --from-file .env`.

`toft check` and the deploy refuse:

| Code | When |
|---|---|
| `sensitive_default` | A sensitive variable with a default, such as `DB_PASSWORD = { sensitive = true, default = "x" }`. Send its value with `toft env set --from-file` |
| `env_entry_invalid` | Any other entry that isn't a string or a table of `default` (a string) and `sensitive` (true or false), such as a number or an unknown key |
| `invalid_env_name` | A name that isn't letters, digits and underscores, or starts with a digit |
| `reserved_env_name` | A name Toft sets itself, such as `PORT`, `HOST` or `BASE_PATH` |

See [Settings and environment variables](../../run/settings/).

## `[jobs.<name>]`

One table per [job](../../automation/jobs/). This file is the only place a job
is defined; every deploy makes the app's jobs match it.

| Key | Meaning |
|---|---|
| `command` | What to run. Required, unless `args` is given. |
| `args` | Go apps only: arguments to the binary the build produced, instead of `command`. `["job", "extract"]`. |
| `schedule` | Cron expression. UTC unless `timezone` is set. Leave it out for an on-demand job. |
| `timezone` | IANA zone for `schedule`, e.g. `Europe/London`. |
| `overlap` | `queue` (default) or `skip`: what a scheduled firing does while the job's last scheduled run is still going — wait behind it, or record a skipped run. |
| `notify` | `none` (default), `failures` or `always`: when to email the app's owners about a run. |
| `expect_within` | Report the job overdue after this long without a success: `26h`, `7d` (1 hour to 31 days). |
| `timeout` | How long a run may take: `"45m"`, or seconds. Your install's default without it. |

Declare parameters as `[jobs.<name>.params.<param>]` with `type` (`string`,
`int`, `float` or `bool`), `required` or `default`, `choices` and `help`.

A job's memory and CPU are not declared here: your administrator sets them, as
the install's job defaults or an override on one job. A `memory` or `cpu` key
fails `toft check` and the deploy with `removed_key`, and the hint says an
administrator sets it on the app's Automation tab. A `timeout` above what your administrator allows fails the
deploy with `limit_exceeds_ceiling`. `retries`, `viewer_runnable`, `enabled` and a
`[tasks]` table are no longer read; a deploy refuses them with `removed_key`
and says what replaced each.

:::note
Parameters are passed to your process as values, never pasted into the
command line, so it's safe to let other people supply them.
:::

## `[restart]` and `[render]`

An app's other two schedules, one of each per app:

```toml
[restart]                    # restart a serving app
schedule = "0 4 * * *"
timezone = "Europe/London"   # optional; UTC without it

[render]                     # re-render a document as a new deployment
schedule = "0 6 * * 1"
```

Both take `schedule` (required) and `timezone`, with a job's rules. This file is
the only place either is set: a deploy records it, and a deploy whose
`toft.toml` no longer has the table removes it, with a warning on the deploy
and an event on the app. Pause one on the app's **Settings** tab until the next
deploy. See [Scheduled restarts](../../run/scheduled-restarts/) and
[Scheduled re-renders](../reports/).

| Refused with | When |
|---|---|
| `restart_no_service` | `[restart]` on a batch app, which has no process to restart |
| `restart_changes_nothing` | `[restart]` on a static app, or on a document — use `[render]` |
| `render_not_a_document` | `[render]` on anything but a notebook, Quarto or R Markdown app |
| `schedule_too_frequent` | Either firing less than an hour apart |
| `removed_key` | `enabled` in either; pause it on the Settings tab instead |

## Errors and limits

A malformed `toft.toml` fails the deploy and names the problem. Unknown tables
are ignored, so a newer manifest still deploys on an older install.

Secret values belong on the app's **Settings** tab, not here; `[env]` only
declares them. Nothing in this file grants permissions or changes
build resources.
