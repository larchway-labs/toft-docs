---
title: Schedule work with jobs
description: Declare jobs in toft.toml, put them on a schedule, run them from Toft, and start them from your web app.
---

A **job** is a command from your app's deployment that runs as its own process,
with its own timeout and memory limit. It is how you do anything on a schedule —
a nightly report, an hourly sync — and anything too long for a web request, such
as an export a person asks for.

Jobs are the one kind of automation in Toft. Each time a job starts, that is a
**run**. A run happens once and ends in a state that says how it went.

## Declare a job

Jobs live in [`toft.toml`](../../build/toft-toml/), next to your code, so they
are reviewed, versioned and rolled back with it. Every deploy makes the app's
jobs exactly what the file says.

```toml
[jobs.nightly-report]
command       = "python -m reports.nightly"
schedule      = "0 6 * * *"          # optional; leave it out for an on-demand job
timezone      = "Europe/London"      # optional; UTC without it
overlap       = "skip"               # optional; queue (default) or skip
notify        = "failures"           # optional; none (default), failures or always
timeout       = "45m"                # optional; your install's default without it
memory        = 1024                 # optional; MB
expect_within = "26h"                # optional; tell the owners if it stops succeeding

[jobs.nightly-report.params.region]
type     = "string"                  # string, int, float or bool
default  = "emea"
choices  = ["emea", "amer", "apac"]
help     = "Which region to report on"
```

| Key | Notes |
|---|---|
| `command` | What to run, with your deployment's own interpreter and packages. |
| `args` | Instead of `command`, for a Go app: arguments to the one binary your build produced. `args = ["job", "nightly-report"]` runs it as `./toft-app job nightly-report`. |
| `schedule` | Five cron fields. Leave it out and the job runs only when something starts it. |
| `timezone` | An IANA zone such as `Europe/London`. The schedule follows the local clock through daylight saving changes and fires once per local time. |
| `overlap` | What a scheduled firing does if the last run is still going: `queue` waits its turn (the default), `skip` records a **skipped** run instead. |
| `notify` | Email the app's owners on `failures` (when a run fails) or `always` (after every run). `none` by default. |
| `timeout` | `"45m"`, `"2h"`, or a number of seconds. Your administrator sets the default and the most a job may ask for. |
| `memory` | In MB. Your administrator sets the most a job may ask for. |
| `expect_within` | `1h` to `31d`. If the job goes this long without a successful run, its owners are told once. A paused job is never overdue. |

A job may not ask for more time or memory than your install allows. A deploy
that does is refused with `limit_exceeds_ceiling`, and the message says what
you may ask for. Run `toft check` before you deploy to see each job's limits
and where they came from.

Older keys are refused with `removed_key` and a hint naming what replaced them:
`retries`, `viewer_runnable`, `enabled`, and any `[tasks]` table.

### Parameters

A parameter is declared under `[jobs.<name>.params.<param>]`:

| Key | Notes |
|---|---|
| `type` | `string`, `int`, `float` or `bool`. |
| `required` | `true` if every run must be given it. Not together with `default`. |
| `default` | Used when a run is not given it. |
| `choices` | The only values allowed. |
| `help` | Shown next to the field in Toft. |

Parameters are checked when a run starts, not part way through it. A missing
required one is refused with `param_required`, a wrong type with `param_type`
and a value outside `choices` with `param_choice`. Your job receives them typed:
`--param rows=500` arrives as the number 500.

Parameters are a run's only input. They are recorded on the run and shown in
its history, so never put secrets in them, and keep them under 64 KB. For
larger input, put a file in your app's [storage](../../data/app-storage/) and
pass its name.

## Where a job runs

Each run is a separate process from your app's current deployment, with the
app's environment variables. On an install with a cluster it gets its own
container; otherwise it runs on the install's own machine. Your web app does
not have to be running, and a schedule does not keep it awake.

- A **batch app**, declared with `[batch]` in `toft.toml`, has jobs and no web
  server. Opening its address shows each job's schedule, next run and last
  outcome.
- **Static sites** cannot have jobs. Rendered documents can.
- A **locked** app runs no jobs: schedules stop, queued runs are cancelled and
  running ones are stopped. See [locked apps](../../run/locked/).

## Run it from Toft

The app's **Automation** tab lists its jobs with their schedule in your local
time, the next run, the last outcome, and the limits each run will get. Only
the app's owners and editors see it.

| Action | What it does |
|---|---|
| **Run now** | Opens a form built from the job's parameters, with defaults filled in and choices as a list. It also shows the `toft job run` command that does the same thing. |
| **Pause until next deploy** | Stops the schedule. The next deploy turns it back on, because `toft.toml` says the job is scheduled. **Resume schedule** turns it back on sooner. |
| **Run again** | On a finished run: starts a new run with the same parameters, marked as a rerun of the first. |
| **Cancel** | On a run that is queued or running. |

**New job** does not create a job. It helps you write one: fill in the form and
it gives you the `[jobs.<name>]` block to paste into `toft.toml`, with the
schedule read back in plain words. Commit it and deploy.

From the command line:

```bash
toft job list                                  # jobs, schedules, params and limits
toft job run nightly-report --param region=emea
toft job run nightly-report --no-wait          # start it and return the run id
toft job runs nightly-report                   # recent runs
toft job logs 3f9a2c1d --follow
toft job rerun 3f9a2c1d                        # the same params again
toft job cancel 3f9a2c1d
```

`toft job run` waits and exits with the run's outcome. See the [command
reference](../../../cli/cli/commands/#toft-job) for every flag.

### The time a run is for

A scheduled run knows the time it was scheduled for, even if it started late:
`TOFT_SCHEDULED_FOR`, such as `2026-10-06T03:00:00+01:00`, or
`run.scheduled_for` in the SDK. A run started by hand has none unless you name
one, so re-running Tuesday's work on Thursday processes Tuesday:

```bash
toft job run nightly-report --for 2026-10-06T03:00:00+01:00
```

In Toft, set **Run for a past date** in the Run now form. A rerun keeps the
original's time.

## How a run ends

| State | Means |
|---|---|
| **Succeeded** | The command exited 0. |
| **Failed** | It exited with another code, or could not start. |
| **Timed out** | It reached its timeout and was stopped. |
| **Out of memory** | It went over its memory limit and was stopped. |
| **Cancelled** | Someone cancelled it, or the app was locked. |
| **Skipped** | A scheduled firing that `overlap = "skip"` stood down. |

Every run that did not succeed says why in words, such as `exit 3: connection
refused`, `timed out after 45m` or `stopped at 1024 MB`. What it printed up to
then stays in its log.

Nothing is retried for you. To try again, use **Run again** or `toft job rerun`;
the new run points at the one it repeats.

A failed run is recorded as an event on the app, and with `notify` set its
owners are emailed. A scheduled firing refused because the app already had too
many runs waiting is recorded as a warning.

## Jobs and your web app

A web request is cut off after a few minutes, and a job can take much longer.
So a page that starts a job should **answer straight away and let the job run**:

```python
import toft

@app.post("/reports")
def make_report():
    me = toft.viewer(request.headers)            # the person who clicked
    run = me.jobs.start("nightly-report", params={"region": "emea"})
    return toft.jobs.respond(run)
```

`respond` sends a browser to the run's **status page**: a live page Toft serves
at your app's own address, showing the job's progress, any message the job
reports, and how it ended. You write no polling code and no template. A script
calling the same endpoint gets `202 Accepted` and the run as JSON instead.

A run started for a person is shown on its status page to that person and to
the app's owners and editors.

Waiting for the run inside the request (`run.wait()`) is refused with
`would_outlive_request`, because the request would be cut off first. See
[Starting jobs from your app](../from-your-app/) for the rest.
