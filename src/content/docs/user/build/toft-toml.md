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

`[app]` reads `slug`, `install` and `installs."<url>".slug` and nothing else.
Any other key under it is reported by `toft check` and the deploy as a
`manifest_unread` warning, like any key nothing reads.

## `[runtime]`

Version pins or ranges for `python`, `node` and `r`, each a quoted string:

```toml
[runtime]
python = "3.13"        # or a range: ">=3.12,<3.14", "==3.13.*"
node   = "22"
r      = "4.5"
```

- **A pin is a quoted string.** `node = 22` is refused with *runtime.node must
  be a quoted string — write node = "..."*.
- **A pin has the line's own width**: Node is matched on the major alone, Python
  and R on major and minor. A pin of the wrong width is refused, and the hint is
  your own line at the right width: `node = "22.1.0"` → write `"22"`, `python =
  "3.13.18"` → `"3.13"`, `python = "3"` → `"==3.*"`, `">=3"` → `">=3.0"`.
- A version the install doesn't carry is refused with `runtime_version`, and the
  hint names one it does. `toft whoami` lists what it carries.
- A `python` pin that your `pyproject.toml`'s `requires-python` excludes is a
  warning, `pin_excluded_by_requires_python`.
- A `go` key is refused: Go reads `go.mod`, whose `go` line is a minimum, not a
  pin.

See [Language versions](../versions/).

## `[static]`

Serve the repository, or a folder of it, as a static site. Overrides all other
detection.

| Key | Meaning |
|---|---|
| `root` | Folder to serve, relative to the repository. `"."` is the repository itself. |
| `entry` | Page served at `/apps/<slug>/`. Defaults to `index.html`. |
| `fallback` | `true` to serve `entry` for unmatched routes (single-page apps). |

A `[static]` table `toft check` can't read — a key of the wrong type, say — is
a problem it reports, not a table it skips.

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

See [Settings and environment variables](../../run/settings/), and [Different environments](../../run/settings/#different-environments) for a dev, staging and production app.

## `[jobs.<name>]`

One table per [job](../../automation/jobs/). This file is the only place a job
is defined; every deploy makes the app's jobs match it.

| Key | Meaning |
|---|---|
| `command` | What to run. Required, unless `args` is given. |
| `args` | Go apps only, `[batch]` Go apps included: arguments to the binary the build produced, instead of `command`. `["job", "extract"]`. A leading `"./toft-app"` is dropped, never passed on as the first argument. |
| `schedule` | Cron expression. UTC unless `timezone` is set. Leave it out for an on-demand job. |
| `timezone` | IANA zone for `schedule`, e.g. `Europe/London`. |
| `overlap` | `queue` (default) or `skip`: what a scheduled firing does while the job's last scheduled run is still going — wait behind it, or record a skipped run. |
| `notify` | `none` (default), `failures` or `always`: when to email the app's owners about a run. |
| `expect_within` | Report the job overdue after this long without a success: `26h`, `7d` (1 hour to 31 days). |
| `timeout` | How long a run may take: `"90s"`, `"45m"`, `"2h"`, `"7d"`, or whole seconds — from 1 second to 7 days. Your install's default without it. |

Declare parameters as `[jobs.<name>.params.<param>]` with `type` (`string`,
`int`, `float` or `bool`), `required` or `default`, `choices` and `help`. A
`float` parameter reaches the job as a float — `2` and `"2"` arrive as `2.0`,
and so does a default.

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

## `[[storage]]`

Storage an administrator has created, attached to your app by name:

```toml
[[storage]]
name   = "sales-data"
access = "full"          # read, write or full — leave it out for what the storage can serve
folder = "2026"          # optional: one folder of the storage
path   = "/data/sales"   # optional: /storage/<name>[/<folder>] without it
```

Your code finds it by name, never by path — see the [storage hub](../../data/app-storage/).

- **The app's owner has to be able to attach each entry.** For an app a group
  owns, an administrator lets the group itself attach it, not just its members.
- **Whoever deploys has to be able to attach it too**, but only when the deploy
  adds an entry or raises its level. Anyone who can deploy the app can keep it
  as it is.
- **A deploy with nobody behind it** — an automatic deploy after a push, a
  scheduled re-render — can keep and remove storage but not add it. A deploy key
  can add it only if an administrator let that key attach storage.
- **The change happens at the end of the deploy.** Until then the running app,
  its restarts and its jobs keep the storage they had. A new store can't be
  reached by signed URL until the deploy that adds it finishes.
- **Removing an entry detaches the storage** at the next deploy. Its files stay.
- Storage `toft.toml` attaches can't be changed in Toft: edit the entry and
  deploy. Storage an administrator attached stays theirs even when `toft.toml`
  declares it the same way.
- `toft check` shows what the deploy would attach, change and detach, and
  `toft storage ls` lists what you can attach.
- **A `toft store` grant is not a right to attach.** A grant lets a person put
  and get files with `toft store`. Attaching storage to an app needs a
  delegation from an administrator, to you or to the app's owner; an entry
  naming storage you hold only a grant on is refused with
  `storage_not_attachable_by_you`, and the message says what to ask for.

| Refused with | When |
|---|---|
| `storage_unknown` | You hold nothing on a storage of that name — the same answer whether or not it exists |
| `storage_not_attachable_by_owner` | You can attach it but the app's owner can't — ask an administrator |
| `storage_not_attachable_by_you` | The owner can, but you can't, and the deploy adds it or raises its level — including when all you hold is a `toft store` grant |
| `storage_level_above_ceiling` | The level is higher than you or the owner may attach |
| `storage_requires_person` | A deploy with nobody behind it would add storage |
| `storage_conflicts_console_mapping` | An administrator attached it differently; detach it there first |
| `storage_revoked_during_deploy` | Permission was taken away during the deploy; the previous version is still serving |

## Errors and limits

A malformed `toft.toml` fails `toft check` and the deploy with `reason`
`manifest_invalid`, and every problem carries a `code` and a `hint` naming the
line to write instead:

| Code | When |
|---|---|
| `manifest_syntax` | The file doesn't parse; the message names the line |
| `invalid_runtime` | A `[runtime]` pin Toft can't read |
| `invalid_job_name`, `invalid_job_command` | A job's name, or its `command` or `args` |
| `invalid_timeout` | A `timeout` that isn't a duration or is outside 1 second to 7 days; the message names the value |
| `invalid_schedule`, `invalid_timezone`, `invalid_overlap`, `invalid_notify`, `invalid_expect_within` | The matching job key |
| `invalid_param` | A parameter declaration |
| `batch_and_static` | `[batch]` together with `[static]` |
| `manifest_invalid` | Anything with no finer code |

Unknown tables and keys are not refused, so a newer manifest still deploys on
an older install — but `toft check` and the build log name each one as a
`manifest_unread` warning, since a misspelled key is a setting left at its
default.

Secret values belong on the app's **Settings** tab, not here; `[env]` only
declares them. Nothing in this file grants permissions or changes
build resources.
