---
title: Automation across the estate
description: Scheduled tasks and jobs on every app — where runs execute, schedules, alerts, caps and troubleshooting.
---

**Admin → Automation** lists every schedule and every background run on the
install, for both kinds of automation.

## Two kinds

They are named by where the work runs, not by trigger. Both can be scheduled and
both can be run on demand.

| | Scheduled task | Job |
|---|---|---|
| What runs | An HTTP request to a path the app published, in the app's own process | A command, in a process of its own, with its own memory limit |
| App must be | Running | Anything — a [batch app](#batch-apps) has no process at all |
| Needs | Nothing | `background_jobs_enabled`, and [somewhere to run](#where-a-job-runs) |
| Limits | Tight: the task timeout and the app's memory | Generous |

## Where a job runs

The install decides; an app's own execution mode is not consulted.

| Install | A run is | Memory limit |
|---|---|---|
| Isolated execution available | A pod in the cluster | Enforced by the cluster |
| No cluster | A process group on the platform's machine, started by `toft runner` under the app's OS account, with a scratch directory removed when it ends (not PM2) | Sampled watchdog |

**Admin → Settings → Background jobs** says which applies: *Runs execute in the
cluster* or *Runs execute on this server, with a sampled memory limit*. Each run
records the mode it ran in.

:::caution[On this machine the memory limit is a watchdog]
The platform samples the run's process tree every few seconds and kills it past
the limit, recording a resource-exceeded failure. Between samples a run can
overshoot, and on a machine with no headroom the kernel may kill the platform
instead. A run that outlives a platform restart continues unwatched until its
deadline. For a guaranteed limit, use [isolated execution](../../apps/execution-modes/).
:::

On an install that can never isolate apps, Settings hides the rows that only
govern isolated apps (Background jobs, New apps are born, the two CPU figures).

## Batch apps

A batch app has only jobs — no web server. It is declared with a `[batch]` table
in `toft.toml`, never inferred. Node, Python, Go and R only; `[batch]` beside
`[static]` is refused.

| Behavior | Batch app |
|---|---|
| Deploy | Installs dependencies, skips start and ready; the release switch is going live |
| Status | `ready`, never `running` — alerts written as "not `running`" will count batch apps |
| Restart / Stop | `409 no_service`; no Open, Start or Stop in the UI |
| Scheduled tasks | Cannot be created (it serves no path) |
| Lock | Writes no `stopped`; cancels its runs |

A batch app can still [send mail and notifications from its jobs](#sending-from-a-job).

## Schedules and time zones

- A schedule is **UTC** unless it names a zone: `CRON_TZ=Europe/London 0 6 * * *`,
  the dialog's **Time zone** field, or `timezone` beside `schedule` in
  `toft.toml`. A `CRON_TZ=` prefix inside a manifest `schedule` is refused.
- It fires **once per wall-clock time** across daylight-saving changes. A time in
  the spring gap moves forward; a time repeated in autumn fires once.
- The zone database is compiled into the binary, so zones resolve the same on any image.

### The instant a run is for

A run can carry `scheduled_for` — the tick it belongs to, not when it was
dispatched. The job receives it as `TOFT_SCHEDULED_FOR`, in the schedule's zone;
a retry keeps its original's. A manual run has none unless someone sets it with
`toft job run --for` or the **Run for** dialog.

## Failed, skipped and overdue

Each is an app event, mailed to the owner under the usual failure-notification
rules, and resolved by **that job's own** next success (the recovery notice names
the job).

| Event | Means | Raised by |
|---|---|---|
| `job_run_failed` / `cron_run_failed` | A non-manual run ended badly | The run |
| `job_schedule_skipped` | A scheduled firing was refused because the app had its maximum runs in flight | The scheduler, at the refusal |
| `job_run_overdue` | No *success* within `expect_within` | The jobs sweep |

`expect_within` is set in `toft.toml` or the job dialog: a duration such as `26h`
or `7d`, from 1 hour to 31 days.

- The window starts at the later of the last success and when the job was enabled.
- A disabled job, or a locked app's, is never overdue.
- One stuck job raises one event until it resolves.
- On a manifest job it belongs to the repository; editing it in the UI returns 409.

A firing refused because the app is locked is not recorded as skipped — the lock
is shown wherever the app is.

## Locked apps run no jobs

Whoever placed the lock (an admin or the [dependency policy](../../security/dependencies/)):

| Run state | Effect |
|---|---|
| Scheduled or manual start | Refused |
| Queued before the lock | Cancelled at dispatch |
| Already running | Cancelled by the jobs sweep |

## Sending from a job

A job holds no app token. Its run token is accepted only on
`/api/v1/app/notify/*`, `/deliver/*` and `/sends/*`, so SDK `notify` works inside
a job and only through integrations attached to its app.

| Call | Result |
|---|---|
| Any other app route | `403 job_send_only` |
| After the run ends | `401 run_not_in_flight` |

The integration gate, send ledger and idempotency window apply as for the app.
Jobs cannot start jobs.

## Other rules

| Rule | Detail |
|---|---|
| Who reads job history | Definitions, runs, run detail and logs need edit access to the app — the same audience as logs |
| Which release runs | The release the run was queued against; if retention removed it, the run is refused by name |
| Provenance | The listing shows whether a schedule came from `toft.toml` or the UI |
| Retries | Opt-in, scheduled runs only (never manual), always shown as retries |
| Parameters | Never interpolated into a command line |
| Claims | A run is claimed once; no double execution |
| Stranded runs | Reconciled; the **Stuck work** check finds the rest |
| Skipped tasks | A task that could not fire (app stopped, locked, previous run still going) is recorded with a reason |
| App-started work | An app may start another entrypoint of itself, never another app, and reach only runs it started |

## Caps

Set in **Admin → Settings**. Run and log retention is on [Retention](../../config/retention/).

| Setting | Controls |
|---|---|
| `job_concurrency_per_app` | Runs of one app in flight at once |
| `max_run_retries` | Ceiling on extra attempts; `0` turns retries off everywhere |
| `max_scheduled_tasks_per_app` | Schedules per app |
| `scheduled_task_timeout_seconds` | Past this a task run fails |
| `scheduled_run_result_bytes` | Response bytes kept per run; `0` keeps none |

## When automation stops

1. **Admin → Checks**: `stuck_work` and `scheduled_tasks`; the app's events for overdue or skipped.
2. **Admin → Automation**: is the schedule there, enabled, and when did it last run?
3. **The app**: locked, stopped or crash-looping?
4. **The caps**: is `max_run_retries` zero, or `job_concurrency_per_app` one?
