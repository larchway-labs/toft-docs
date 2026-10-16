---
title: toft.toml
description: The optional manifest, and every table it can carry.
---

`toft.toml` at the root of your repository is optional. Without one,
Toft detects what it can and uses defaults. With one, you can say the
things detection cannot work out for itself.

Every key is optional.

```toml
[app]
slug = "phase-test"

[runtime]
python = ">=3.12"
node   = ">=22"
r      = ">=4.4"

[static]
root     = "dist"
entry    = "index.html"
fallback = false

[notebook]
file   = "report.qmd"
engine = "knitr"

[jobs.nightly-report]
command  = "python jobs/report.py"
schedule = "0 2 * * *"
timeout  = 900
memory   = 1024
retries  = 2
enabled  = true

[jobs.nightly-report.params.region]
type     = "string"
required = true
help     = "Which region to report on"
```

## `[app]`

Which app on which install `toft` deploys to. Read by the CLI, never by the
platform.

```toml
[app]
slug = "phase-test"

# one checkout, two installs, and neither is wrong
[app.installs."https://staging.toft.corp"]
slug = "phase-test-stg"
```

`toft link` writes this for you and validates the slug against the install first.

## `[runtime]`

Language version pins: `python`, `node`, `go`, `r`. Comparators only, never a
patch version. Go's real declaration is `go.mod` — a `go` key here is normally
omitted. See [Language versions](../versions/).

## `[static]`

| Key | Meaning |
|---|---|
| `root` | Document root, relative to the repository. |
| `entry` | What `/apps/your-slug/` serves. Defaults to `index.html`. |
| `fallback` | Serve `entry` for unmatched extensionless paths. Off by default. |

Declaring this table **overrides** the rule that a `package.json` disqualifies a
repository from static hosting, and it is read before every other branch of
detection. See [Static sites](../static/).

## `[notebook]`

| Key | Meaning |
|---|---|
| `file` | Which document to render, when the root has more than one candidate. |
| `engine` | `"knitr"` to force a `.qmd` to be treated as R. |

Only needed when the repository is ambiguous or the document's own header does
not say. See [Notebooks](../notebooks/).

## `[batch]`

Declares an app that is nothing but jobs: no web server, nothing to start.

```toml
[batch]
language = "python"   # only when the repository has more than one language

[jobs.extract]
command  = "python extract.py"
schedule = "0 2 * * *"
```

See [Batch apps](../../automation/jobs/#batch-apps). It is never inferred, so
a script that merely looks like a web app is still deployed as one. It cannot be
combined with `[static]`.

## `[jobs.<name>]`

One table per job. See [Jobs](../../automation/jobs/) for what a job is.

| Key | Meaning |
|---|---|
| `command` | What to run. Required. |
| `schedule` | Cron expression, for a job that runs unattended. UTC unless `timezone` is set. |
| `timezone` | IANA zone the schedule is read in, e.g. `Europe/London`. Do not also put `CRON_TZ=` in `schedule`. |
| `expect_within` | `"26h"`, `"7d"` (1h to 31d): report the job overdue if it has no success in that window. See [Jobs](../../automation/jobs/#knowing-a-job-has-stopped-succeeding). |
| `timeout` | Seconds before the run is killed. |
| `memory` | Megabytes. |
| `cpu` | CPU allowance. |
| `retries` | Retries on failure. Opt-in, unattended-only, and never silent. |
| `enabled` | `false` to define a job without arming it. |
| `viewer_runnable` | `true` to let a viewer of the app start it. Off by default. |

`[jobs.<name>.params.<param>]` declares a parameter, with `type`, `required`,
`default` and `help`.

:::caution
Parameters are **never interpolated into the command**. They are passed to your
process as values; you read them the way you read any other input. A parameter
cannot become part of a command line, which is what makes it safe to let
somebody else supply one.
:::

## Reading and refusing

- A **malformed** `toft.toml` fails the deploy, with the line number.
- A **table Toft does not know** is ignored rather than refused, so a newer
  key in a repository deployed to an older install is not a hard failure.
- `toft.toml` is **never served** by a static app, at any depth.

## What is deliberately not in here

**Environment variables.** Those are set on the app's Settings tab, not
committed to the repository — which is the whole point of them.

**Anything that grants a permission.** Nothing in this file gives your app a
credential, a capability, or access to anything. A repository cannot widen its
own privileges by declaring something.

**Build resources.** Build memory, CPU and timeout are the operator's numbers,
not yours. A repository cannot ask for a bigger builder.
