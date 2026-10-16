---
title: Automation across the estate
description: Both kinds of automation, every schedule, and every run.
---

Admin → Automation. One page for both kinds and every background run on the
install.

The two older pages — job runs, and scheduled — redirect here.

## Two kinds, named by where the work runs

| | Scheduled task | Job |
|---|---|---|
| What runs | **An HTTP request to a path the app published**, in the app's own process | **A command, in a process of its own**, with its own memory limit |
| The app must be | Running | Not necessarily — a [batch app](#batch-apps-only-jobs) has no process at all |
| Needs | Nothing | `background_jobs_enabled`, and somewhere to run — [a cluster, or this machine](#where-a-job-runs) |
| Limits | Tight — the ceiling and the memory envelope are the boundary | Generous |

They are named by **where the work runs**, never by trigger. Both can be
scheduled; both can be run on demand.

## Where a job runs

**The install decides, once, and an app's own mode is never consulted.**

- **Where isolated execution is available, a run is a pod** in the cluster, as it
  always was. Every install that ran jobs before keeps doing so.
- **Where it is not — no cluster — a run is a process on the platform's own
  machine**, started by `toft runner` (the platform binary itself, so a host
  run and a pod speak one contract) as a process group of its own **under the app's
  OS account**. It gets a directory of its own for its identity and scratch, removed
  when the run ends. It is **not** PM2, whose memory limit is a restart, and for a
  job a restart is a second run nobody asked for.

**Admin → Settings says which applies**, under Background jobs: *Runs execute in
the cluster* or *Runs execute on this server, with a sampled memory limit*. Each
run records the mode it actually ran in.

:::caution
**On this machine, the memory limit is a watchdog, not a wall.** The platform
samples the run's process tree every couple of seconds and kills it past the
limit, recording a resource-exceeded failure so the kill cannot read as an
ordinary one. Between two samples a run can allocate past its limit, and on a
machine with no headroom the kernel chooses the victim — which may be the platform.
A run that outlives a platform restart runs on, unwatched, under its deadline
alone. If you need the limit guaranteed, that is [isolated
execution](../../apps/execution-modes/).
:::

On an install that can never isolate an app, the Settings page leaves out the rows
that only govern isolated apps — Background jobs, New apps are born and the two CPU
figures — rather than showing them disabled. The Isolated execution row stays, and
says why.

## Batch apps: only jobs

A **batch app** is an app whose only entrypoints are jobs — a nightly extract that
does not need a web server it would never answer. It is **declared, never
inferred**, by a `[batch]` table in `toft.toml`, because a Go `main`, a Python
`main.py` and a Node `start` script look exactly like web apps to every detector.
Node, Python, Go and R only; `[batch]` beside `[static]` is refused.

What differs for you:

- **No service.** Dependencies install as for the language's web apps, and the deploy
  skips the start and ready steps. The flip to the new release is the whole of going
  live.
- **Its status is `ready`**, not `running`: nothing answers, so nothing is running.
  If you alert on app status — in the telemetry `toft.apps.by_status` metric,
  say — an alert written as "not `running`" now counts batch apps. Write it against
  the statuses you mean.
- **Restart and Stop answer 409 `no_service`**, and a scheduled task cannot be
  created on one (it serves no path). The app's address shows *Runs jobs*, and its
  page has no Open, Start or Stop.
- **Locking one writes no `stopped`** — there is nothing to stop. Its runs are its
  workload, and the lock cancels them (see below).

A batch app can still send mail and notifications from its jobs; see [Sending from
a job](#sending-from-a-job).

## Schedules, in a zone

A schedule of either kind is **UTC unless it names a time zone** —
`CRON_TZ=Europe/London 0 6 * * *`, or the Time zone field on the dialog, or a
`timezone` key beside `schedule` in `toft.toml`. Lists print `expression ·
zone`. A prefix typed into `schedule` in a manifest is refused: one way to say it
in a file.

**It fires once per wall-clock time, across daylight-saving changes.** A 06:00
London job runs at 06:00 in both seasons. A time that falls inside the spring gap
is moved forward by the gap; a time that occurs twice in autumn fires once. The
cron library was measured and refused for this, because it skips one day and
fires twice on another. Zones resolve the same on any image, because the zone
database is compiled into the binary.

## A run knows the instant it is for

Every job run can carry **`scheduled_for`** — the tick it belongs to, not the moment
it was dispatched. A run that waited an hour behind its app's queue limit still
knows it is the 03:00 run. The job receives it as `TOFT_SCHEDULED_FOR`,
written in the schedule's own zone, and a retry carries its original's.

**A manual run has none unless a person names one** — `toft job run --for`, or the
*Run for* dialog — because defaulting to now would make a re-run of last Tuesday
quietly process today. An app starting a job itself is acting now and cannot set it.

## Overdue, skipped and failed are three different reports

All three are recorded on the app's events, mailed to its owner under the usual
failure-notification rules, and **resolved by that job's own next success** — with
a recovery notice that names the job.

| Event | Means | Raised |
|---|---|---|
| `job_run_failed` / `cron_run_failed` | A run ended badly. | By the run. Non-manual runs only. |
| `job_schedule_skipped` | A scheduled firing was **refused by the queue** — the app already had as many runs in flight as it is allowed. | When the firing is refused. The schedule has already moved on, so without this the run would vanish with only a log line. |
| `job_run_overdue` | A job has gone **`expect_within`** without a *success*. | By the jobs sweep. |

**`expect_within`** is set in `toft.toml` or the job dialog — a duration such
as `26h` or `7d`, from one hour to 31 days. It is for work nobody watches: a job
that fails already sends a notice, but one that stops *running* — paused and
forgotten, refused by its queue limit, never placed — sends nothing.

- **Succeeded, not finished.** A job failing every night is already reported and
  would otherwise be reported twice.
- **The window starts at the later of the last success and the moment the job was
  enabled**, so a new or re-enabled job is not overdue on arrival.
- **A disabled job is never overdue** — a pause is somebody's decision, and
  alerting on it teaches people to ignore the alert. Nor is a locked app's.
- **One stuck job is one event.** The sweep skips a job that already has one open.
- **On a manifest job it is the repository's**, like `schedule`; an edit in the UI
  is the same 409 pointing at the repo.

**A lock is the one refusal not recorded as skipped**: the lock is the explanation,
and it is shown wherever the app is.

**One automation's success resolves only its own failure.** Earlier, an hourly job
succeeding closed — and mailed a recovery for — a failing nightly one in the same
app. Failure fingerprints now lead with the job or task, and a recovery names it:
*The job "nightly-extract" is succeeding again*.

## A locked app runs no jobs

Locking an app stops its jobs as well as its workload, whichever of the two lock
sources placed the lock (you, or the [dependency
policy](../../security/dependencies/)):

- a **scheduled or manual start** is refused;
- a run **queued** before the lock is **cancelled** when it comes to be dispatched;
- a run **already running** is cancelled by the jobs sweep.

## Sending from a job

A job holds no app token, and nothing in its environment opens app data, viewer
identity or job starts. It may do **one** thing on the app surface: **send through
the integrations attached to its app**, so `notify` in an SDK works inside a job —
which is what lets a batch app mail its own report.

The run's own token is accepted on `/api/v1/app/notify/*`, `/deliver/*` and
`/sends/*` **only while the run is in flight**. Anywhere else it is a 403
`job_send_only`, and after the run ends it is a 401 `run_not_in_flight`. The
integration gate, the send ledger and the idempotency window apply exactly as to
the app's own sends, and so does your attach: a job reaches only what you attached.
**Jobs still cannot start jobs**, so one compromised job is not an amplifier.

## Who can read job history

A job's definition, its run list, and a run's detail and logs are readable by the
**log audience** — people who can edit the app — and no longer by anyone who can
merely read it. A run's parameters, result, actor and output are workload output,
and a viewer, or an anonymous visitor to a public app, must not see them any more
than they see the app's logs.

## A run executes the release it was queued against

A run queued behind a deploy runs the release it was queued for, not whichever is
current when it starts. If release retention has since removed that release, the run
is refused by name rather than quietly run against a different one.

## Provenance is shown

Where a schedule came from — `toft.toml` or the UI — is on the listing.

**`toft.toml` is optional and still the better door**: it travels with the
code and is reviewed with it. An app with no manifest still has the UI.

## The caps

| Setting | |
|---|---|
| `job_concurrency_per_app` | How many of one app's runs may be in flight. Over it, a refusal the SDK names. |
| `max_run_retries` | The ceiling on how many extra attempts an automation may ask for. **0 turns retries off everywhere.** |
| `max_scheduled_tasks_per_app` | Counted per schedule rather than per endpoint. |
| `scheduled_task_timeout_seconds` | Past this the run is a failure. |
| `scheduled_run_result_bytes` | How much of the app's response is kept. 0 stores none. |

Retention for runs and logs is in [Retention](../../config/retention/).

## The rules that keep automation honest

**A retry is opt-in, unattended-only, and never silent.** A scheduled run can
retry; one somebody started by hand does not, because they are watching. Every
retry is visible as a retry.

**Parameters are never interpolated into a command.** A parameter cannot become
part of a command line, which is what makes it safe to let somebody else supply
one.

**One claim, two tables.** A run is claimed once; there is no double execution
under contention.

**Stranded runs are reconciled.** A killed runner's run does not stay `running`
forever, and the checks page's **stuck work** row finds what the reconciler has
not.

**A skipped run is recorded; a refused one is not.** A task that could not fire —
the app was stopped, locked, or the previous run was still going — is a record
with a reason. A request refused before it was a run is not. (A *scheduled job*
firing the queue refuses is the exception that proves the rule: the schedule had
already moved on, so it is recorded — see [Overdue, skipped and
failed](#overdue-skipped-and-failed-are-three-different-reports).)

## An app starting its own work

An app can start a different entrypoint of **itself**, never another app, and it
**never asserts who a viewer is** — it relays a platform-signed token.

These routes take a run id, so the ordinary rule applies: an app can only reach
the runs it started.

## When automation stops

In order:

1. **The checks page** — `stuck_work` and `scheduled_tasks`; and the app's events,
   for a job reported overdue or skipped.
2. **This page** — is the schedule there, is it enabled, when did it last run.
3. **The app** — is it locked (a locked app runs no jobs), stopped, or crash-looping.
4. **The dials** — is `max_run_retries` zero, is job concurrency at one.
