---
title: Starting jobs from your app
description: Kicking off background work from a request, and the rule about who it runs as.
---

Your app can start one of its own jobs — a request presses a button, the work
happens in a container, the page comes back immediately.

```python
from toft import jobs

run = jobs.start("nightly-report", params={"region": "emea"})
```

## Two rules

**An app starts a different entrypoint of *itself*, never another app.** There is
no mechanism for one app to run work in another.

**Your app never asserts who a viewer is.** It relays a token Toft already
signed. Your app cannot claim a run was started by somebody it was not — and
"nobody in particular" is assertable, but only as a *narrowing*, and one resolver
refuses it by name if you try to use it to widen anything.

In practice: pass through what the SDK gives you, and do not construct it.

## What your app can do with its runs

List them, read one, read its log, cancel it, read its output. Only **the runs it
started** — another app's run is not found, not refused, which is the same rule
the rest of the platform follows.

## Inside the job

A run has its own view of itself: its parameters, a progress it can report, an
input, an output and a result.

```python
from toft import run

region = run.params["region"]
run.progress(0.5, "halfway")
run.result({"rows": 1240})
```

Progress is for a human watching. It is never load-bearing — the run's outcome is
the outcome.

`run.scheduled_for` is the time the run is for — see
[Jobs](../jobs/#which-time-a-run-is-for).

## Sending from a job

A job can send mail or notifications through the integrations attached to its
app: `notify` works inside a job just as it does in the app. That is all a job
can do with the app's own surface — it cannot read app data, act as a viewer or
start another job. A send is accepted only while the run is in flight.

## When to reach for this

Good: a report somebody asked for, an export, a recalculation, anything that
takes longer than a request should.

Bad: a queue. Jobs are not a message bus, there is no fan-out, and a run started
per request on a busy endpoint will hit your app's concurrency cap. If you need
a queue, you need a queue.
