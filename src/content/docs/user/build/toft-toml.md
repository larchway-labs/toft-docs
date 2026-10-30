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

The names of the environment variables your app needs — names only, never
values.

```toml
[env]
names = ["DB_PASSWORD", "API_TOKEN", "DB_HOST"]
```

Each deploy adds any name the app doesn't have yet as an empty, sensitive
variable, which shows as **not set** on the app's Settings tab until someone
fills it in. A variable that already exists is never changed, and a name you
take off the list is never deleted. A name an attached credential supplies is
skipped. The build log says what was added:
`==> toft.toml [env]: added DB_HOST, API_TOKEN (3 declared, 1 already set)`.

Values go to each install separately, with the Settings tab or
`toft env set --from-file .env`. A default that is the same everywhere belongs
in your code, such as `os.getenv("LOG_LEVEL", "info")`.

`toft check` and the deploy refuse:

| Code | When |
|---|---|
| `env_values_not_read` | Anything under `[env]` other than `names`, such as `LOG_LEVEL = "info"` or an `[env.prod]` table |
| `invalid_env_name` | A name that isn't letters, digits and underscores, or starts with a digit |
| `reserved_env_name` | A name Toft sets itself, such as `PORT`, `HOST` or `BASE_PATH` |
| `env_names_not_list` | `names` that isn't a list of strings |

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

## Errors and limits

A malformed `toft.toml` fails the deploy and names the problem. Unknown tables
are ignored, so a newer manifest still deploys on an older install.

Environment variable values belong on the app's **Settings** tab, not here;
`[env]` only names them. Nothing in this file grants permissions or changes
build resources.
