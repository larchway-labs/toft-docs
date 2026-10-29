---
title: Jobs
description: Declare jobs in toft.toml, start them from your app, answer the request with a status page, and write the code that runs inside one.
---

A job runs a command from your app's deployment as **its own process**, with
its own timeout, memory and CPU limits and run record. It is Toft's one kind of
automation: scheduled work is a job with a `schedule`, and work too long for a
web request is a job your app starts.

## Declare it

Jobs are declared in `toft.toml` and nowhere else. Every deploy makes the app's
jobs exactly what the file says, and a rollback takes them back with the code.

```toml
# toft.toml
[jobs.reconcile]
command = "python jobs/reconcile.py"
timeout = "15m"

[jobs.nightly-report]
command       = "python -m reports.nightly"
schedule      = "0 6 * * *"          # five cron fields
timezone      = "Europe/London"      # UTC without it
overlap       = "skip"               # queue (default) or skip
notify        = "failures"           # none (default), failures or always
expect_within = "26h"

[jobs.nightly-report.params.region]
type     = "string"
default  = "emea"
choices  = ["emea", "amer", "apac"]
help     = "Which region to report on"
```

| Key | |
|---|---|
| `command` | Run with the deployment's own interpreter. |
| `args` | Instead of `command`, in a Go app: arguments to the one binary the build produced, `./toft-app`. `args = ["job", "reconcile"]`. |
| `schedule`, `timezone` | Five cron fields, read in `timezone` (an IANA name) or UTC. A zoned schedule fires once per wall-clock time through daylight saving changes. Without a schedule the job runs only when started. |
| `overlap` | A scheduled firing while the job's last scheduled run is still going: `queue` waits behind it, `skip` records a `skipped` run. A start from your code or a person is never held. |
| `notify` | Email the app's owners on `failures` or `always`. Default `none`. |
| `timeout` | A duration (`"45m"`) or seconds. Without it, the install's default. |
| `expect_within` | `1h` to `31d`. Owners are told once if the job goes this long without succeeding. |
| `params.<name>` | `type` (`string`, `int`, `float`, `bool`), `required` or `default` (not both), `choices`, `help`. |

A job's memory and CPU are an administrator's to set, not yours: every job
gets the install's job defaults (1,024 MB and 2,000 millicores as shipped)
unless an administrator overrides that one job, and an override survives every
deploy. Your app's own limits do not reach its jobs. A `memory` or `cpu` key in
`[jobs.<name>]` fails `toft check` and the deploy with *an administrator sets a
job's limits; remove this key*.

A `timeout` above the administrator's ceiling fails `toft check`
and the deploy with `limit_exceeds_ceiling`; nothing is silently reduced. If an
administrator later lowers a ceiling below a job already deployed, that job is
capped, and `toft check`, the deploy and `toft job list` say `clamped`.

`retries`, `viewer_runnable`, `enabled` and `[tasks]` are refused with
`removed_key` and a hint naming what replaced them. Any other key nothing reads
is named in the build log.

## Where it runs

On an install with a cluster, each run gets its own container. On one without,
it runs on the install's machine as your app's user, in its own process group,
held to its memory and CPU limits by the kernel where the machine allows it;
otherwise memory is held by a watchdog that samples it and CPU is not limited.
`toft job list` says where runs go, and each limit says how it is held: nothing
added when it is enforced, *sampled rather than held by the kernel* or *not
enforced on this install* when it is not.

A CPU limit is an amount of CPU time, not a set of cores. So that your
program's thread pools fit it, the run's environment sets `GOMAXPROCS`,
`OMP_NUM_THREADS` and `MC_CORES` to the limit rounded up to whole cores, and
`UV_THREADPOOL_SIZE` to that or 4, whichever is larger — unless your app's own
environment sets them. A run records how long it was held at its CPU limit.

## Start one from your app

`toft.jobs` is the app acting as itself. A viewer's `jobs` is the same surface
acting for the signed-in person, and the run is recorded in their name.

```python
me = toft.viewer(request.headers)
run = me.jobs.start("reconcile", params={"month": "2026-03"})
return toft.jobs.respond(run)          # Flask; respond(run, request=request) for FastAPI
```
```js
const me = toft.viewer(req.headers);
const run = await me.jobs.start("reconcile", { params: { month: "2026-03" } });
return toft.jobs.respond(run, req);     // a Fetch Response
```
```go
me, err := toft.ViewerFor(r.Header)
run, err := me.Jobs.Start(r.Context(), "reconcile", toft.StartOptions{
	Params: map[string]any{"month": "2026-03"},
})
toft.Jobs.Respond(w, r, run)
```
```r
run <- viewer_jobs(req) |> job_start("reconcile", params = list(month = "2026-03"))
job_respond(run)                       # fills in plumber's res
```

`start` returns as soon as the run is queued. Parameters are checked against
the declaration there: `param_required`, `param_type` or `param_choice`, before
anything runs. They are passed as values, never put into a command line, and
recorded on the run, so they must not carry secrets; they are capped at 64 KB.
For larger input, write it to the app's storage and pass its name.

A start that matches a run already in flight, or one that finished in the last
minute, returns that run with `deduplicated` set. Pass an idempotency key to
widen that to 24 hours.

A full queue raises `QueueFull` (Python, Node; `*toft.QueueFullError` in Go;
code `queue_full` in R), retryable. `viewer()` on a request with no viewer
header — an API key, a health check, a local server — raises `no_viewer`. An
anonymous visitor to a public app does carry one, which names nobody: the start
is refused `viewer_anonymous`, with a hint to start the job as the app instead
(`toft.jobs.start`).

### Respond, don't wait

`respond` answers the request now. A browser is sent (`303`) to the run's
**status page**, which Toft serves on your app's own origin at
`/apps/<slug>/__toft/runs/<id>`: the job's place in the queue, its progress and
message, and how it ended with the reason. Anything else gets `202 Accepted`,
`Location` set to that address, and the run as JSON. Asking that address for
JSON returns `{id, job, status, progress, progress_message, queue_position,
failure_reason, started_at, finished_at, done}`, for your own front end to
poll.

| | `respond` takes | returns |
|---|---|---|
| Python | `respond(run)` in Flask; `respond(run, request=request)` in FastAPI or Starlette | That framework's response; otherwise a `(body, status, headers)` tuple |
| Node | `respond(run, req)` with a Fetch `Request` or a Node `IncomingMessage` | A Fetch `Response`. In Express: `res.status(r.status).set(Object.fromEntries(r.headers)).send(await r.text())` |
| Go | `Respond(w, r, run)` | Writes the response |
| R | `job_respond(run)` inside a plumber endpoint | plumber's `res`, filled in; otherwise a list of `status`, `headers`, `body` |

Every request Toft forwards to your app carries `X-Toft-Request-Deadline`, when
the request will be cut off (300 seconds by default). **`wait` refuses inside a
request** with `would_outlive_request` when it has no timeout, or one longer
than the request has left; the hint is `return toft.jobs.respond(run)`. A short
wait that fits is allowed. The SDK sees the request through the headers given
to `viewer()`, an explicit `headers`/`request` argument, or (Python) Flask's
current request.

### Waiting and reading runs

`wait` is for scripts, notebooks and one job waiting on another.

```python
run = run.wait(timeout=600)
run.succeeded, run.failure_reason, run.output_json()
```
```js
const done = await run.wait({ timeoutMs: 600_000 });
```
```go
done, err := run.Wait(ctx, toft.WaitOptions{Timeout: 10 * time.Minute})
```
```r
done <- job_wait(run, timeout = 600)
```

A wait that runs out raises code `wait_timeout`, retryable, because the run is
still going (in Python, `toft.WaitTimeout`, which is also a `TimeoutError`).

| Python | Node | Go | R | |
|---|---|---|---|---|
| `jobs.get(id)` | `jobs.get(id)` | `Jobs.Get(ctx, id)` | `job_get(id)` | One run. |
| `jobs.list(job=…)` | `jobs.list({ job })` | `Jobs.List(ctx, toft.ListOptions{Job: …})` | `job_list(job = …)` | This app's runs, newest first. |
| `me.jobs.mine(job=…)` | `me.jobs.mine({ job })` | `me.Jobs.Mine(ctx, …)` | `job_mine(req, job = …)` | This person's runs. |
| `run.refresh()` | `run.refresh()` | `run.Refresh(ctx)` | `job_refresh(run)` | Read it again. |
| `run.logs()`, `run.tail()` | `run.logs()`, `run.tail()` | `run.Logs(ctx, 0)`, `run.Tail(ctx, fn)` | `job_logs(run)` | What it printed. |
| `run.output()`, `run.output_json()` | `run.output()`, `run.outputJson()` | `run.Output(ctx)`, `run.OutputJSON(ctx, &v)` | `job_output(run, json = TRUE)` | What it wrote. |
| `run.cancel()` | `run.cancel()` | `run.Cancel(ctx)` | `job_cancel(run)` | Stop it. A person may cancel only their own runs. |

A run carries `status` (`queued`, `running`, `succeeded`, `failed`,
`timed_out`, `out_of_memory`, `cancelled`, `skipped`), `started_by` (`app`,
`viewer`, `cli`, `schedule`, `ui`), `rerun_of`, `params`, `scheduled_for`,
`deadline`, `progress` and `progress_message`, `queue_position` while queued,
`exit_code`, `failure_reason` in words (`exit 3: connection refused`, `timed
out after 45m`, `stopped at 1024 MB`), `peak_memory_mb` and `status_url`. Node
and Go use their own casing.

**A run is never retried.** A failed run stays failed, with its reason. Trying
again is a decision: your app starting the job again, **Run again** in Toft, or
`toft job rerun`, which records `rerun_of`.

## Inside the job

The run's view of itself, and nothing outside a job:

| Python | Node | Go | R | |
|---|---|---|---|---|
| `toft.run` | `toft.run` | `toft.CurrentRun()` | `current_run()` | `None`, `null`, `nil` or `NULL` outside a job. |
| `run.params` | `run.params` | `run.Params(&v)` | `$params` | The parameters, typed. |
| `run.rerun_of` | `run.rerunOf` | `run.RerunOf` | `$rerun_of` | The run this one repeats, if any. |
| `run.scheduled_for` | `run.scheduledFor` | `run.ScheduledFor()` | `$scheduled_for` | The instant this run is for, or none. |
| `run.deadline` | `run.deadline` | `run.Deadline()` | `$deadline` | When the run will be stopped. |
| `run.trigger`, `run.trigger_role` | `run.trigger`, `run.triggerRole` | `run.Trigger`, `run.TriggerRole` | `$trigger`, `$trigger_role` | How it started, and with which role. |
| `run.progress(n, msg)` | `run.progress(n, msg)` | `run.Progress(ctx, n, msg)` | `run_progress(n, msg)` | 0–100 and a few words, shown on the status page. |
| `run.log(msg)` | `run.log(msg)` | `run.Log(msg, false)` | `run_log(msg)` | A line in the run's log (stdout; stderr with the error flag). |
| `run.write_output(b)`, `run.write_output_json(x)` | `run.writeOutput(b)`, `run.writeOutputJson(x)` | `run.WriteOutput(ctx, b)`, `run.WriteOutputJSON(ctx, x)` | `run_write_output(x, json = TRUE)` | The run's one output. |

Each value is also in the environment; see [Environment
variables](../../reference/environment/#inside-a-job).

- **The exit code decides the outcome.** Exit 0 is `succeeded`; anything else
  is `failed`, and the last line the job wrote to stderr becomes its reason
  when it gives none.
- **Watch the deadline.** A long loop that checks `deadline` can stop cleanly
  instead of being stopped mid-write.
- **A rerun has the same parameters.** A job that must not repeat a side effect
  checks `rerun_of`.
- **A job can send notifications** through the app's integrations, and reach
  the stores its app is attached to with the SDK's `upload`, `download`, `url`,
  `remove` and `list` calls. App data, viewer identity and starting another job
  are refused with `job_send_only`, by design: the refusal names the job and
  the run, and its hint gives the two ways round — do it from the app's own
  process, or write the result with `run.write_output_json(...)` and let an
  endpoint read it back.

### The instant a run is for

A scheduled run carries the tick it fired for, in the schedule's zone, even if
it started late. A manual run has one only if someone named it, with
`toft job run --for` or **Run for a past date** in Toft's Run now form, and a
rerun keeps its original's. It is never defaulted to now, so re-running
Tuesday's work on Thursday processes Tuesday.

## Which apps can have jobs

| App type | Jobs |
|---|---|
| Web apps | Yes. |
| Batch apps (`[batch]`) | Yes; jobs are all they do. See [Deploying](../../cli/deploying/#a-program-with-no-web-server). |
| Rendered documents (`.Rmd`, `.qmd`, `.ipynb`) | Yes. The job has the full SDK; it cannot see a request. |
| Static sites | No. A `[jobs]` table fails the deploy with `manifest_invalid`. |
