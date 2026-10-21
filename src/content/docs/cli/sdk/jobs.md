---
title: Jobs
description: Declare jobs in toft.toml, start them from your app, and write the code that runs inside one.
---

A job runs a command from your app's deployment as **its own process**, with its
own memory limit, deadline and run record. Use it for work too long or too large
for a web request.

## Declare it

```toml
# toft.toml
[jobs.reconcile]
command = "python jobs/reconcile.py"
timeout = 900          # seconds
memory  = 2048         # MiB

[jobs.nightly-report]
command       = "python -m reports.nightly"
schedule      = "0 6 * * *"        # optional; five cron fields
timezone      = "Europe/London"    # optional; UTC without it
expect_within = "26h"              # optional; alert owners after this long without a success
retries       = 2                  # optional; off by default
viewer_runnable = true             # a viewer may start it

[jobs.nightly-report.params.region]
type     = "string"
required = true
```

| Key | |
|---|---|
| `command` | Run with the deployment's own interpreter. |
| `schedule`, `timezone` | Five cron fields, read in `timezone` (IANA name) or UTC. A zoned schedule fires once per wall-clock time through daylight saving changes. |
| `timeout`, `memory`, `cpu` | Seconds, MiB, millicores. |
| `retries` | Extra attempts for unattended runs. Off by default. |
| `expect_within` | `1h` to `31d`. Owners are told once if the job goes this long without succeeding. |
| `viewer_runnable` | Lets a viewer start it. |
| `enabled` | Whether it is switched on. |
| `params.<name>` | `type`, `required`, `default`, `help`. |

The declaration ships with the code, so a rollback takes the job definition back
with it. The build log names any key it did not read.

## Where it runs

On an install with a cluster, each run gets its own container. On one without,
it runs on the install's machine as your app's user, in its own process group;
there the memory limit is checked by sampling, so a sudden spike can exceed it
briefly. `toft job runs` marks which.

## Start one from your app

```python
run = toft.jobs.start("reconcile", params={"month": "2026-03"})
run = run.wait(timeout=600)
run.succeeded, run.output(), run.logs()
```
```js
const run = await toft.jobs.start("reconcile", { params: { month: "2026-03" } });
const done = await run.wait({ timeoutMs: 600_000 });
```
```go
run, err := toft.Jobs.Start(ctx, "reconcile", toft.StartOptions{Params: params})
run, err = run.Wait(ctx, 2*time.Second)
```
```r
id <- job_start("reconcile", params = list(month = "2026-03"))
job_status(id)
```

`start` returns immediately with a run. Parameters are passed to the process as
values, never interpolated into the command, so a viewer can safely supply them.

`wait()` follows retries: if the platform retried, you get the outcome of the
retry, not of the first attempt. A full queue raises `QueueFull`
(`*toft.QueueFullError` in Go).

### As a person

```js
const me = toft.viewer(req.headers);
await me.jobs.start("reconcile", { params });
await me.jobs.mine("reconcile", { limit: 20 });
```

The run is recorded in the viewer's name, and they see only runs they started.
`viewer()` throws when no one is signed in. See [Who is asking](../viewer/).

## Inside the job

`toft.run` is the run's view of itself, and `null` everywhere else.

| Python | Node | Go | |
|---|---|---|---|
| `run.params` | `run.params` | `run.Params(&v)` | The parameters. |
| `run.scheduled_for` | `run.scheduledFor` | `run.ScheduledFor()` | The instant this run is for, or none. |
| `run.progress(n)` | `run.progress(n)` | `run.Progress(ctx, n)` | Report 0–100. |
| `run.set_result(x)` | `run.setResult(x)` | `run.SetResult(ctx, x)` | Store a structured result. Does not end the run. |
| `run.read_input()` | `run.readInput()` | `run.ReadInput(ctx)` | The payload, if one was given. |
| `run.write_output(b)` | `run.writeOutput(b)` | `run.WriteOutput(ctx, b)` | The run's output. |

In Go, call `toft.CurrentRun()`; it returns `nil` outside a job. In R,
`scheduled_for()` is the one in-job call. Each variable is also in the
environment; see [Environment variables](../../reference/environment/#inside-a-job).

- **Read the payload early.** Its link expires. A run started with parameters
  alone has no payload at all.
- **The exit code decides the outcome.** A job that records a result and then
  exits non-zero has failed.
- **A job can send notifications**, through the app's integrations, and nothing
  else as the app. Data, viewer identity and starting another job are refused
  with `job_send_only`.

### The instant a run is for

A scheduled run carries the tick it fired for, in the schedule's zone, even if
it started late. A manual run has one only if someone named it, with
`toft job run --for` or **Run for** on the app's **Automation** tab. It is never
defaulted to now, so re-running Tuesday's work on Thursday processes Tuesday.

## Which apps can have jobs

| App type | Jobs |
|---|---|
| Web apps | Yes. |
| Batch apps (`[batch]`) | Yes; jobs are all they do. See [Deploying](../../cli/deploying/#a-program-with-no-web-server). |
| Rendered documents (`.Rmd`, `.qmd`, `.ipynb`) | Yes. The job has the full SDK; it cannot see a request. |
| Static sites | No. A `[jobs]` table fails the deploy with `manifest_invalid`. |
