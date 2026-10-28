---
title: Starting jobs from your app
description: Start one of your app's own jobs from a request, answer at once, and let the person follow it on a status page.
---

Your app can start one of its own [jobs](../jobs/): a button starts the work,
the job runs in its own process, and the request answers straight away.

```python
import toft

# As the app itself
run = toft.jobs.start("nightly-report", params={"region": "emea"})

# For the person looking at the page; the run is recorded as theirs
me = toft.viewer(request.headers)
run = me.jobs.start("nightly-report", params={"region": "emea"})

return toft.jobs.respond(run)
```

`start` returns as soon as the run is queued. Parameters are checked against
the job's declaration then and there, so a missing or wrong one is refused
before anything runs.

## Answer the request, don't wait

Toft cuts off a web request after a set time (five minutes unless your
administrator changed it), and every request your app receives carries that
deadline in the `X-Toft-Request-Deadline` header. A job can take far longer.

`toft.jobs.respond(run)` answers now:

- A **browser** is sent to the run's live **status page**, which Toft serves
  at your app's own address (`/apps/<your-app>/__toft/runs/<id>`). It shows
  the job, its place in the queue, its progress and message, and how it ended,
  with the reason if it failed. You write no polling code and no template.
- **Anything else** — a script, or your own front end — gets `202 Accepted`,
  a `Location` header pointing at the same address, and the run as JSON.
  Requesting that address without asking for HTML returns the run's current
  status as JSON, which is what your front end can poll.

A run started for a person is shown to that person and to the app's owners and
editors.

`run.wait()` is for scripts, notebooks and jobs. Called while your app is
serving a request, it is refused with `would_outlive_request` unless you give
it a timeout that ends before the request does. The hint in the error is the
fix: `return toft.jobs.respond(run)`.

## Rules

- **An app starts only its own jobs**, never another app's.
- **Your app decides who may start a job.** Declaring a job in `toft.toml`
  allows your app to start it; whether a given person may press the button is
  your code's decision, for example with their [role](../../share/viewer/).
- **Your app never claims who the viewer is.** `toft.viewer(headers)` relays a
  token Toft signed. On a request with no viewer on it (an API key, a health
  check), it raises `no_viewer` rather than starting the run as nobody, and a
  start for an anonymous visitor to a public app is refused `viewer_anonymous`,
  with a hint to start the job as the app instead.
- **A repeated start is not a second run.** A start matching a run already in
  flight, or one that finished in the last minute, returns that run with
  `deduplicated` set. This keeps a Streamlit rerun or a double click from
  starting the job twice.
- **The queue is capped.** When the app already has as many runs waiting as
  your install allows, `start` raises `toft.QueueFull`, so your code can say
  "try again in a moment".

## Following runs

```python
toft.jobs.list(job="nightly-report")     # every run of this app
me.jobs.mine(job="nightly-report")       # this person's runs only
run = run.refresh()
run.status, run.progress, run.failure_reason
run.logs(); run.output(); run.cancel()
```

An app sees only its own runs. A person can cancel a run they started, not
somebody else's.

## Inside the job

`toft.run` is the job's view of itself, and `None` outside a job:

```python
import toft

run = toft.run
region = run.params["region"]          # typed as toft.toml declares it
run.progress(40, "reading ledgers")    # shown on the status page
run.log("12,044 rows")                 # a line in the run's log
run.write_output_json({"rows": 12044})
```

`run.rerun_of` is set when a person ran it again, so a job that must not repeat
a side effect can check it. `run.deadline` is when the run will be stopped, so
a long loop can stop cleanly first. `run.scheduled_for` is the time the run is
for: see [The time a run is for](../jobs/#the-time-a-run-is-for).

A job can send messages and files through the app's
[integrations](../../data/integrations/) and reach the app's storage while the
run is in progress. It cannot read app data, act as a viewer or start another
job.

Jobs are not a message queue: there is no fan-out, and a run per request on a
busy endpoint will fill the queue.
