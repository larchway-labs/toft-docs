---
title: Automation across the estate
description: Jobs on every app — where runs execute, their limits, schedules, alerts, caps and troubleshooting.
---

Toft has one kind of automation: the **job**. A job is a command an app
declares in its `toft.toml`, run as a process of its own with its own timeout
and its own memory and CPU limits. Scheduled work is a job with a schedule; work an app starts
for a person is a job too. Each start is a **run**.

**Admin → Automation** lists every schedule on the install, read-only, with its
app, owner, next run and last outcome, and says where runs go. Jobs are defined
only in `toft.toml`: neither you nor an app's owner can create or edit one in
the UI. An owner can run one now, pause its schedule until the next deploy,
run a finished run again, and cancel.

## Where a job runs

Jobs are on by default (`background_jobs_enabled`). The install decides where a
run goes; an app's own execution mode is not consulted.

| Install | A run is | Memory limit | CPU limit |
|---|---|---|---|
| Isolated execution available | A pod in the cluster | Enforced by the cluster | Enforced by the cluster |
| No cluster | A process group on the platform's machine, started by `toft runner` under the app's OS account, with a scratch directory removed when it ends | Enforced by the kernel through a cgroup where the machine allows it; otherwise a sampled watchdog | Enforced by the kernel through the same cgroup, where the machine gives Toft its `cpu` controller; otherwise not enforced |

**Admin → Settings → Jobs** shows both facts read-only: **Where runs go** (*Jobs
run on the cluster* or *Jobs run on this machine*) and, on this machine,
**Memory limits** (*Enforced by the kernel* or *Sampled by a watchdog*). Each
run records the mode it ran in.

The kernel holds the limit when the platform can write to a cgroup v2
hierarchy: running as root in a container, as a systemd service with
`Delegate=yes`, or under a parent you name in `AGENT_CGROUP_PARENT`. The run is
placed in its cgroup before it starts, so there is no moment it runs unlimited.

:::caution[Without a cgroup the memory limit is a watchdog]
The agent samples the run's process tree every 100 ms and stops it past the
limit, recording `out_of_memory`. Between samples a run can overshoot, and on a
machine with no headroom the kernel may kill the platform instead. A run that
outlives a platform restart continues unwatched until its deadline. For a
guaranteed limit, give the platform a cgroup or use [isolated
execution](../../apps/execution-modes/).
:::

`JOB_RUN_DIR` sets where a host run's copy of the release is unpacked. Point it
at local disk when `APPS_DIR` is on a network file system; see the [environment
reference](../../reference/environment/).

## Limits

A job's **timeout** is the developer's: they declare it in `toft.toml`, and you
set its default and its ceiling. A job's **memory and CPU** are yours alone: a
`memory` or `cpu` key in `toft.toml` is refused at `toft check` and at deploy
with *an administrator sets a job's limits; remove this key*. Every job gets the
install's job defaults unless you give it an override. An app's own memory and
CPU limits never reach its jobs.

| Setting | Controls | Range, default |
|---|---|---|
| `default_job_timeout_seconds` | **Stop a job after** — the timeout of a job that declares none | 60–604,800 s, 3,600 |
| `max_job_timeout_seconds` | **Longest a job may run** | 60–604,800 s, 86,400 |
| `job_memory_limit_mb` / `_gb` | **Memory per job run** — `JOB_MEMORY_LIMIT_MB` / `_GB` in the environment; 0 uses it | 64–1,048,576 MB, 1,024 |
| `job_cpu_limit_millicores` / `_cores` | **CPU per job run** — the most CPU time a run may use, 1,000 m being one core; `JOB_CPU_LIMIT_MILLICORES` / `_CORES` in the environment; 0 uses it | 50–64,000 m, 2,000 |
| `job_concurrency_per_app` | **Concurrent runs per app** — runs of one app executing at once; the rest wait | 1–100 |
| `max_queued_runs_per_app` | **Runs waiting per app** — a start past this is refused with `queue_full` until one finishes | 1–10,000, 50 |

A **new or changed** timeout above the ceiling is refused at `toft check` and
at deploy with `limit_exceeds_ceiling`, so a developer never believes they have
more than they get. If you **lower** the ceiling below jobs already deployed,
those jobs are capped rather than broken: each is recorded as `limit_clamped`,
and the next check and deploy say so.

**Overriding one job.** On the app's **Automation** tab, set the job's memory or
CPU; or call `PATCH /api/v1/apps/{appID}/jobs/{jobID}` with `memory_limit_mb`
(or `memory_limit_gb`) and `cpu_limit_millicores` (or `cpu_limit_cores`).
`null` or `0` clears an override back to the install default. Only an
administrator may set these — anyone else gets 403 and nothing changes, though
an owner can still pause the job's schedule with the same call. Each change is
audited as `job.resources.change`. **An override survives every redeploy**; it
goes only when the job is removed from `toft.toml`.

Every surface — the Automation tab, `toft job list`, `toft check` — shows each
of a job's limits with its source (`declared`, `install default`, `override` or
`clamped` for the timeout; `install default` or `override` for memory and CPU)
and, for memory and CPU, how it is held: `enforced` by the kernel, `sampled` by
the watchdog, or `not_enforced`. A run records the time it spent held at its CPU
limit (`cpu_throttled_seconds`), shown beside its peak memory.

## Batch apps

A batch app has only jobs — no web server. It is declared with a `[batch]` table
in `toft.toml`, never inferred. Node, Python, Go and R only; `[batch]` beside
`[static]` is refused.

| Behavior | Batch app |
|---|---|
| Deploy | Installs dependencies, skips start and ready; the release switch is going live |
| Status | `ready`, never `running` — alerts written as "not `running`" will count batch apps |
| Its address | Lists each job's schedule, next run and last outcome to anyone who can see the app |
| Restart / Stop | `409 no_service`; no Open, Start or Stop in the UI |
| Lock | Writes no `stopped`; cancels its runs |

## Schedules and time zones

- A schedule is **UTC** unless the job names a `timezone` beside `schedule` in
  `toft.toml`. A `CRON_TZ=` prefix inside a manifest `schedule` is refused.
- It fires **once per wall-clock time** across daylight saving changes. A time
  in the spring gap moves forward; a time repeated in autumn fires once.
- The zone database is compiled into the binary, so zones resolve the same on
  any image.
- A missed firing (the platform was down) is skipped, never fired late.
- `overlap` decides what a firing does while the job's last scheduled run is
  still going: `queue` (the default) waits behind it and starts when it ends,
  `skip` records a `skipped` run with its reason. A run a person or the app
  starts is never held behind a scheduled one.
- Each tick is one run. A deploy that leaves a schedule unchanged keeps its next
  firing where it was, so deploying just after a firing time neither drops nor
  repeats it.
- A firing the app's full queue turns away is a `skipped` run too, its reason
  *the app's queue was full*, and raises `job_schedule_skipped`.
- A schedule does not keep an app awake.

A paused schedule stays paused until the app's next deploy, which re-applies
`toft.toml`.

### The instant a run is for

A run can carry `scheduled_for` — the tick it belongs to, not when it was
dispatched. The job receives it as `TOFT_SCHEDULED_FOR`, in the schedule's
zone; a rerun keeps its original's. A manual run has none unless someone sets
it with `toft job run --for` or **Run for a past date** in the Run now form.

## How runs end

A run ends once, in one of six states, with its reason in words.

| State | Means |
|---|---|
| `succeeded` | Exit 0. |
| `failed` | Another exit code, or the platform could not start it (stage `platform`). |
| `timed_out` | Stopped at its timeout. |
| `out_of_memory` | Stopped at its memory limit. |
| `cancelled` | Cancelled by a person, the app, or a lock. |
| `skipped` | A scheduled firing `overlap = "skip"` stood down, or a full queue turned away. |

**Nothing is retried automatically.** A failure is one run, shown once. Running
it again is a deliberate act — **Run again**, `toft job rerun`, or the app
starting it again — and the new run records which run it repeats.

## Failed, skipped and overdue

Each is an app event, mailed to the app's owners under the usual
failure-notification rules, and resolved by **that job's own** next success.
A job's `notify` key adds a message to its owners per run.

| Event | Means | Raised by |
|---|---|---|
| `job_run_failed` | A run ended `failed`, `timed_out` or `out_of_memory`, whoever started it | The run |
| `job_schedule_skipped` | A scheduled firing was refused because the app's queue was full | The scheduler |
| `job_run_overdue` | No *success* within the job's `expect_within` | The jobs sweep |
| `limit_clamped` | A ceiling you lowered is below the job's declaration | Dispatch |
| `schedule_disabled` | A schedule could not be read and was switched off | The scheduler |

`expect_within` is a duration such as `26h` or `7d`, from 1 hour to 31 days.

- The window starts at the later of the last success and when the schedule was
  turned on.
- A paused job, or a locked app's, is never overdue.
- One stuck job raises one event until it resolves.

## Locked apps run no jobs

Whoever placed the lock (an admin or the [dependency policy](../../security/dependencies/)):

| Run state | Effect |
|---|---|
| Scheduled or manual start | Refused |
| Queued before the lock | Cancelled at dispatch |
| Already running | Cancelled by the jobs sweep |

## What a job may reach

A job holds no app token. Its run token is accepted only on the send routes
(`/api/v1/app/notify/*`, `/deliver/*`, `/sends/*`) and the store routes, so the
SDK's notifications and store calls work inside a job, through integrations
and stores attached to its app.

| Call | Result |
|---|---|
| Any other app route | `403 job_send_only` — the refusal names the job and the run, says it is deliberate rather than a broken deploy, and its hint gives the two ways round: do it from the app's own process, or write the result as the run's output for an endpoint to read |
| After the run ends | `401 run_not_in_flight` |

Jobs cannot start jobs.

## Other rules

| Rule | Detail |
|---|---|
| Who sees job history | Definitions, runs, logs and output need edit access to the app — the same audience as logs |
| Who starts a run | Owners and editors from Toft or the CLI; the app as itself; the app for a signed-in viewer, where the app decides who may |
| The status page | Served on the app's own origin; a run started for a person is shown to that person and the app's editors |
| Which deployment runs | The deployment the run was queued against; if retention removed it, the run is refused by name |
| Parameters | Typed, checked at the start, never interpolated into a command line |
| Claims | A run is claimed once; no double execution |
| Stranded runs | Reconciled; the **Stuck work** check finds the rest |
| App-started work | An app may start another entrypoint of itself, never another app, and reach only its own runs |

Run and log retention is on [Retention](../../config/retention/).

## When automation stops

1. **Admin → Checks**: `stuck_work` and `scheduled_jobs`; the app's events for
   overdue, skipped or clamped.
2. **Admin → Automation**: is the schedule there, not paused, and when did it
   last run?
3. **Admin → Settings → Jobs**: are jobs on, and is there somewhere to run them?
4. **The app**: is it locked?
5. **The caps**: is `job_concurrency_per_app` one, or the queue full?
