---
title: Starting jobs from your app
description: Start one of your app's own jobs from a request, as the app or for the person using it.
---

Your app can start one of its own [jobs](../jobs/) and return at once: a button starts the work, the job runs in its own process, and the request returns without waiting.

```python
import toft

# As the app itself
run = toft.jobs.start("nightly-report", params={"region": "emea"})

# For the person looking at the page; the run is recorded as theirs
me = toft.viewer(request.headers)
run = me.jobs.start("nightly-report", params={"region": "emea"})
```

`start` returns as soon as the run is queued. Pass `payload=` for a larger body of input.

## Rules

- **An app starts only its own jobs**, never another app's.
- **Your app never claims who the viewer is.** `toft.viewer(headers)` relays a token Toft signed. Toft checks the person's own permissions before starting the run. If there is no signed-in person, `toft.viewer` raises rather than starting the run as nobody.
- **A repeated start is not a second run.** A start matching a run already in flight, or one that finished in the last minute, returns that run with `deduplicated` set. This keeps a Streamlit rerun from starting the job twice.
- **The queue is capped.** Past your install's limit for in-flight runs, `start` raises `toft.QueueFull`, so your code can back off.

## Following runs

```python
run = run.wait()                     # for scripts; never call it in a request
toft.jobs.list("nightly-report")     # every run of this app
me.jobs.mine("nightly-report")       # this viewer's runs only
run.logs(); run.output(); run.cancel()
```

An app sees only its own runs. `refresh()` and `wait()` follow retries to the final outcome.

## Inside the job

`toft.run` is the job's view of itself, and `None` outside a job:

```python
import toft

region = toft.run.params["region"]
data = toft.run.read_input_json()    # the payload, or None
toft.run.progress(50)                # 0–100, for people watching
toft.run.set_result({"rows": 1240})
toft.run.write_output("region,rows\nemea,1240\n")
```

`toft.run.scheduled_for` is the time the run is for: see [Jobs](../jobs/#the-time-a-run-is-for).

A job can send messages and files through the app's [integrations](../../data/integrations/), while the run is in progress. It cannot read app data, act as a viewer or start another job.

Jobs are not a message queue: there is no fan-out, and a run per request on a busy endpoint will hit the queue cap.
