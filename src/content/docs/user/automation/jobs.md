---
title: Jobs
description: Run a command from your app's deployment in its own process, on a schedule or on demand.
---

A job runs a command from your app's deployment in its own process, with its own memory limit. Use one for reports, exports and other work that takes longer than a request should. Jobs are optional; if your install has not configured them, Toft says so.

## Declare a job

In [`toft.toml`](../../build/toft-toml/) (preferred, since it is reviewed with the code), or with **New job** on the **Automation** tab.

```toml
[jobs.nightly-report]
command       = "python jobs/report.py"
schedule      = "0 2 * * *"         # optional; five cron fields
timezone      = "Europe/London"     # optional; UTC if absent
timeout       = 900                 # seconds
memory        = 1024                # MiB
retries       = 2                   # extra attempts, unattended runs only
expect_within = "26h"               # alert if no success for this long
```

| Key | Notes |
|---|---|
| `schedule` | Leave it out for a job that only runs when started. Over the API the zone goes in the expression: `CRON_TZ=Europe/London 0 6 * * *`; in `toft.toml` use `timezone` instead. |
| `retries` | Retries apply to scheduled and app-started runs. A run someone starts by hand, or one that ran out of time or memory, is not retried. Your administrator caps the number. |
| `expect_within` | `1h` to `31d`. Past it the job is reported **overdue** once, as an event and by email where your install sends mail. In the UI: **Alert if no success within**. |
| `viewer_runnable` | `true` lets anyone who can view the app start this job. In the UI: **Viewers can run** the job. |
| `enabled` | Whether the job is armed when first deployed. A job you pause on the Automation tab stays paused across deploys. |

## Where a job runs

On a cluster install each run gets its own pod; otherwise it is a separate process on the install's machine. Your app does not need to be running, and a run uses the deployment it was queued against.

A queued run starts as soon as the install picks it up, and runs queued
together start side by side, up to the app's in-flight limit. A run is stopped
when its `timeout` is reached and recorded as **timed out**; what it printed up
to then stays in its log.

- **Static apps** cannot have jobs; declaring one fails the deploy. Rendered documents can.
- A **locked** app runs no jobs: schedules stop, queued runs are cancelled and running ones stopped. See [locked apps](../../run/locked/).
- A **batch app**, declared with `[batch]` in `toft.toml`, has jobs and no web server. Its status is **Ready** once deployed, and Restart, Stop and scheduled tasks are refused with `no_service`.

## Parameters

```toml
[jobs.report.params.region]
type     = "string"       # string, int, float or bool
required = true
help     = "Which region to report on"
```

```bash
toft job run report --param region=emea
```

Parameters are never put into the command line; your process reads them as values (`toft.run.params`). A **payload** is a larger body of input your app passes when it [starts a run](../from-your-app/); read it at the start of the run, because its link expires.

## The time a run is for

A scheduled run knows the tick it was scheduled for, even if it started late or is a retry: `TOFT_SCHEDULED_FOR` (such as `2026-10-06T03:00:00+01:00`), or `run.scheduled_for` in the SDK. A run started by hand has none unless you name one:

```bash
toft job run nightly-report --for 2026-10-06T03:00:00+01:00
```

`--for` also takes `2026-10-06T03:00` or `2026-10-06`, read as UTC. In the UI, use **Run for** on the job's row.

## Running and reading runs

```bash
toft job run nightly-report     # waits; exit code is the run's outcome
toft job runs [name]            # recent runs, of one job if named
toft job logs --follow <runID>
toft job cancel <runID>
```

Your install caps in-flight runs per app, run output size and how long runs and logs are kept.

Only people who can edit the app see definitions, runs, logs and output. A viewer allowed to run a job can start it, and the run is recorded as theirs, but cannot read its runs.

A failed run sends a notice. A scheduled firing the queue refused is recorded as a warning event, and `expect_within` catches a job that stopped succeeding. Resuming a paused job schedules its next firing from now, not the ones it missed.
