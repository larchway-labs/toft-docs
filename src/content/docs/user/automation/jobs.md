---
title: Jobs
description: Running a command from your app's own code, on a schedule or on demand.
---

A job runs a command in a **fresh process built from your app's release, with
its own memory limit** — never inside your app's process. It is your app's code,
running a different entry point of itself.

Jobs are an optional capability. If your install has not configured them, there
are no jobs — and the refusal says so rather than failing oddly.

## Declaring one

In [`toft.toml`](../../build/toft-toml/):

```toml
[jobs.nightly-report]
command  = "python jobs/report.py"
schedule = "0 2 * * *"
timeout  = 900
memory   = 1024
retries  = 2
```

Or in the UI, on the Automation tab. Both are first-class; the manifest is the
better door because it travels with the code and is reviewed with it.

## Where jobs run

On a cluster install, in a pod of their own. On an install with no cluster, on
the platform's own machine, as a separate process under your app's account with
the same memory limit — so a job works either way. Admin → Settings says which
your install does. Off a cluster the memory limit is checked by sampling, so a
run that spikes between two samples can overshoot it before it is stopped.

A run executes the release it was queued against. A deploy that lands while it
waits does not change what it runs.

## What a job can and cannot be

- **It is your app.** A job starts a different entry point of the same app —
  never another app, and never an arbitrary command from outside the repository.
- **It does not need your app running.** It is a separate process.
- **Static apps cannot have jobs.** A `toft.toml` declaring one on a static
  app fails the deploy: there is no runtime for a command to mean anything in.
  Documents *can* — a rendered notebook's release has an interpreter.

## Batch apps

Most apps serve something and have jobs on the side. A **batch app** is only
jobs — a nightly extract, a report that mails itself — with no web server to
write, deploy, sleep and wake. Declare it with `[batch]` in `toft.toml`
([details](../../build/toft-toml/)); Node, Python, Go and R are supported.

- Dependencies install as for any app of that language. No entrypoint or `PORT`
  is needed, and nothing is started.
- Its status is **Ready** once a release is deployed: ready to run jobs.
- Restart, Stop and creating a [scheduled task](../scheduled-tasks/) are refused
  with `no_service` — there is no service. Its address shows **Runs jobs**, and
  the app page has no Open, Start or Stop.
- It declares at least one job, or it runs nothing; the build log says so.

## Time zones

A schedule is read in UTC unless it names a zone. In `toft.toml`:

```toml
[jobs.morning-report]
command  = "python jobs/report.py"
schedule = "0 6 * * *"
timezone = "Europe/London"
```

In the UI, fill in the **Time zone** field. Over the API the zone rides in the
expression: `CRON_TZ=Europe/London 0 6 * * *`. In the manifest, use `timezone`
— a `CRON_TZ=` prefix inside `schedule` there is refused, so a file has one way
to say it.

The schedule keeps its wall-clock time through daylight saving: it fires once
per scheduled time. A time that falls in the spring gap runs after it, by the
length of the gap; a time that happens twice in autumn runs once. Lists show
`expression · zone`.

## Parameters

```toml
[jobs.report.params.region]
type     = "string"
required = true
help     = "Which region to report on"
```

Parameters are **never interpolated into the command**. Your process is given
them as values and reads them as input. There is no way to turn a parameter into
part of a command line, which is what makes it safe to let somebody else supply
one.

```bash
toft job run report --param region=emea
```

## Parameters are not a payload

Those are two different things, and a run can have either, both or neither.

**Parameters** are small named values, declared in `toft.toml` and read
from `run.params`. **A payload** is a body of data handed to the run, which the
platform stores and gives your process a link to.

**A run given no payload is given no input location at all** — the variable is
absent, so *"was I given one?"* is answerable by looking rather than by reading
something and interpreting the error. A run started with parameters alone has no
input; read the parameters.

If you do read a payload, read it **at the start of the run**. The link is
presigned and expires, so a job that reads its input an hour in gets a refusal
that is about the link, not about the data.

## Which time a run is for

A scheduled run knows the time it was scheduled for — the tick in the
schedule's own zone, not the moment it actually started. A run that waited an
hour behind the queue still knows it is the 03:00 run, and a retry keeps the
original's. Your process reads it as `TOFT_SCHEDULED_FOR` (for example
`2026-10-06T03:00:00+01:00`), or `run.scheduled_for` in the SDKs.

A run you start by hand has none unless you name one — it is never defaulted to
now, so re-running last Tuesday's extract cannot quietly process today. Name it
with the **Run for** dialog on the Automation tab, or:

```bash
toft job run nightly-report --for 2026-10-06T03:00:00+01:00
```

`--for` also takes `2026-10-06T03:00` (UTC) or `2026-10-06`. A run your app
starts with `jobs.start` carries none.

## Concurrency and queueing

Your install caps how many of one app's runs may be in flight. Over that, a run
is refused with a queue-full error the SDK names — so your code can back off
rather than guess.

## Retries

**Opt-in, unattended-only, and never silent.** A scheduled job can retry; a run
somebody started by hand does not, because they are watching. Every retry is
visible as a retry rather than folded into one result.

Your administrator sets a ceiling on how many an app may ask for.

## Knowing a job has stopped succeeding

A failing job sends a notice. A job that stops *running* sends nothing — paused
and forgotten, refused by the queue, never placed. Two things cover that:

- **`expect_within`** — how long the job may go without a *success*, from `1h`
  to `31d` (`"26h"`, `"7d"`). Past it, the job is reported **overdue**, once,
  as an event and an email where your install sends mail. The next success
  resolves it. In the dialog it is **Alert if no success within**.

  ```toml
  [jobs.nightly-report]
  schedule      = "0 2 * * *"
  expect_within = "26h"
  ```

  A paused job is never overdue, and neither is a job on a locked app. A new or
  re-enabled job starts its window then, not at its last success.
- **A skipped firing is recorded.** When a scheduled job fires and the queue
  refuses it, that is a warning event on the app rather than a line in a log.

A success resolves only its own job's (or task's) failure, never another's, and
the recovery notice names which one.

A locked app runs no jobs: scheduled ones do not fire, queued runs are
cancelled, and a run in flight is stopped. See [locked apps](../../run/locked/).

## Letting viewers run a job

```toml
viewer_runnable = true
```

Off by default. With it on, somebody who can view the app can start that job.
They still cannot see its command, edit it, or run any other one — and the run
is attributed to them. Job definitions, runs and logs — parameters, output and
results included — are read by people who can edit the app, the same audience
as its logs. A viewer, or a visitor to a public app, can start a runnable job
but does not read the runs.

## Pausing a job

A job you switch off from the Automation tab stays off across deploys. The
manifest's `enabled` arms a job the first time the platform sees it and never
re-arms one you paused, so redeploying does not undo the pause. Switching it
back on schedules the next firing from now, not from the window it missed — a
job paused on Monday does not fire on Friday for Tuesday.

## Reading a run

List runs, read one, read its log, read its output, cancel it — from the
Automation tab, from `toft job runs`, `toft job logs`, `toft job cancel`, or from your
own code.

```bash
toft job run nightly-report
```

Waits by default, and **the run's outcome is the exit code**, so a failing
nightly job fails your pipeline without you parsing anything.

A run's log on the Automation tab is the same pane as the app log — search,
follow, wrap, copy, download, color rendered rather than shown as escape codes
— and a long run pages to its end. The pane holds the newest lines and says how
many earlier ones are not on screen.

Run output is capped, and runs and their logs are pruned on a retention your
administrator sets.
