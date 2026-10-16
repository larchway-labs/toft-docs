---
title: Scheduled tasks
description: Having Toft call a path in your app on a schedule.
---

A scheduled task is **an HTTP request to a path your app publishes**, made on a
schedule. It runs no command. It starts no process of its own.

```
Every day at 02:00  →  POST /internal/refresh  →  your running app
```

Your app does the work in the handler and returns. That is the whole mechanism.

## Setting one up

On the app's **Automation** tab: the path, the method, and — if you want one —
the schedule as a cron expression. The path is relative to your app —
`/internal/refresh`, not the full URL.

Your install caps how many schedules one app may have.

## Time zones

A schedule runs in UTC unless it names a zone: fill in the **Time zone** field,
or write `CRON_TZ=Europe/London 0 6 * * *` as the schedule. It fires once per
wall-clock time across daylight saving, and lists show `expression · zone`.
From the client, `toft task create nightly --path /internal/roll --schedule "0 6 * * *" --timezone Europe/London`.

## A task without a schedule is on demand

**The cron expression is optional.** Leave it empty and nothing fires the task:
it sits there as a named, reusable operation that **Run now** and your app's own
trigger can both still fire.

That is the right shape for the thing you run by hand — a re-index, a cache
purge, a one-off recalculation — because the alternative was inventing a
schedule you did not want and then remembering to ignore it.

Clearing the schedule on an existing task turns it into an on-demand one, and
adding one back turns it into a scheduled one. Nothing else about it changes,
including its run history.

Jobs have always worked this way. Tasks now do too.

## What you have to know

**Your app has to be running.** The request wakes a sleeping app the way any
other request does. A stopped or locked app does not answer, and the run is
recorded as skipped.

**There is a ceiling on how long it may take**, and a memory envelope — both
tighter than a [job](../jobs/)'s. A scheduled task is meant for a request, not
for an hour of batch work.

**Protect the path.** It is a path in your app, reachable like any other. Give it
a check of its own — the usual approach is a shared secret in a header, from an
environment variable.

**Tell a firing from a visit.** The request carries headers naming the task and
the run, so your handler can behave differently when a person opens the same
path. The SDK exposes them, and what it gives you is the task's **name** —
`refresh`, not `0 2 * * *`. Nothing hands your app its own cron expression.

## Switching a task off

A task you switch off does not run **from anywhere** — not on its schedule, not
from **Run now**, and not from your app's own trigger, which is refused with
`schedule_disabled`. Off means off, not "off unless somebody asks".

## Reading the result

Each run has an outcome, a duration, and a log. Your app can write into that
run's own log through the SDK while it works, which is how a task that takes two
minutes says what it is doing. The log is read in the same pane as the app log
— search, follow, wrap, copy, download — and a long run pages to its end rather
than stopping at its first thousand lines.

What your app answers becomes the run's stored result, up to a cap your
administrator sets. Return something small and useful — a count, a summary —
rather than the whole payload.

## A skipped run is recorded; a refused one is not

If your app returns an error, that is a run that happened and failed, and you
will see it. If Toft never made the request — the app was stopped, locked,
or the previous run was still going — that is recorded too, with the reason.

What is not recorded is a request that was refused before it was a run at all.

## Running one now

```bash
toft task run <name>
```

Waits by default, and the run's outcome is the exit code. **A skipped task is
exit 1**: a firing that did not happen is not a success. That is true of the
`--json` rendering too — the document prints *and* the exit code is 1.

A task takes no parameters. Its parameters, if it needs any, belong to its
schedule.

The client also creates and changes them, so a task can live in the same place
as the code that answers it:

```bash
toft task create refresh --path /internal/refresh          # on demand
toft task create nightly --path /internal/roll --schedule "0 2 * * *"
toft task edit nightly --schedule ""                       # now on demand
toft task delete nightly
```

`--schedule` is the optional flag it looks like. `edit` sends only the flags you
name, and `delete` asks first.

## This is not the job system

| | Scheduled task | Job |
|---|---|---|
| What runs | An HTTP request to your app | A command, in a fresh process |
| Your app must be | Running | Not necessarily |
| Good for | A refresh, a cache warm, a nightly poke | Batch work, reports, migrations |
| Limits | Tight | Generous |
| Available | Always | Where your install has it configured |
