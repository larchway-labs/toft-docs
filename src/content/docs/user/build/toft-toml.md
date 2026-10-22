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

## `[jobs.<name>]`

One table per [job](../../automation/jobs/). This file is the only place a job
is defined; every deploy makes the app's jobs match it.

| Key | Meaning |
|---|---|
| `command` | What to run. Required, unless `args` is given. |
| `args` | Go apps only: arguments to the binary the build produced, instead of `command`. `["job", "extract"]`. |
| `schedule` | Cron expression. UTC unless `timezone` is set. Leave it out for an on-demand job. |
| `timezone` | IANA zone for `schedule`, e.g. `Europe/London`. |
| `overlap` | `queue` (default) or `skip`: what a scheduled firing does while the last run is still going. |
| `notify` | `none` (default), `failures` or `always`: when to email the app's owners about a run. |
| `expect_within` | Report the job overdue after this long without a success: `26h`, `7d` (1 hour to 31 days). |
| `timeout` | How long a run may take: `"45m"`, or seconds. Your install's default without it. |
| `memory` | Memory limit in MB. |
| `cpu` | CPU limit in millicores (50–32000). |

Declare parameters as `[jobs.<name>.params.<param>]` with `type` (`string`,
`int`, `float` or `bool`), `required` or `default`, `choices` and `help`.

A `timeout` or `memory` above what your administrator allows fails the deploy
with `limit_exceeds_ceiling`. `retries`, `viewer_runnable`, `enabled` and a
`[tasks]` table are no longer read; a deploy refuses them with `removed_key`
and says what replaced each.

:::note
Parameters are passed to your process as values, never pasted into the
command line, so it's safe to let other people supply them.
:::

## Errors and limits

A malformed `toft.toml` fails the deploy and names the problem. Unknown tables
are ignored, so a newer manifest still deploys on an older install.

Environment variables belong on the app's **Settings** tab, not here. Nothing
in this file grants permissions or changes build resources.
