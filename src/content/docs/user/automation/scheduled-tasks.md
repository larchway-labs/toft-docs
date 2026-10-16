---
title: Scheduled tasks
description: Have Toft call a path in your running app on a schedule or on demand.
---

A scheduled task is an HTTP request Toft makes to a path in your running app, on a schedule or on demand. Your handler does the work and returns. For long work in its own process, use a [job](../jobs/), which is available only where your install has configured jobs.

## Create a task

On the app's **Automation** tab, select **New task**, or use the CLI:

```bash
toft task create refresh --path /internal/refresh                 # on demand
toft task create nightly --path /internal/roll --schedule "0 2 * * *" \
  --timezone Europe/London --method POST
toft task edit nightly --schedule ""                              # now on demand
toft task delete nightly                                          # asks first
```

| Setting | Notes |
|---|---|
| Path | Relative to your app, such as `/internal/refresh`. Required. |
| Method | `GET` (default) or `POST`. |
| Schedule | Five cron fields, read in UTC. Optional: a task with no schedule runs only when someone asks. |
| Time zone | An IANA zone, such as `Europe/London`. Over the API, prefix the schedule: `CRON_TZ=Europe/London 0 6 * * *`. |
| Overlap | `skip` or `allow` a firing while the previous run is still going. |
| Retries | Off by default. Applies to scheduled and app-triggered firings, never to a run someone starts by hand. |

## What your app must handle

- **The app must be running.** An app with an enabled schedule does not sleep. If it is stopped or locked, the run fails with the reason.
- **There is a timeout**, set by your administrator. Move long work to a job.
- **Protect the path.** It is reachable like any other. Check a shared secret, or the [role](../../share/viewer/): a scheduled firing arrives as `system`.
- **Return something small.** The response body is stored as the run's result, up to a cap.

## Tell a firing from a visit

`toft.task(request.headers)` returns the run, or `None` for an ordinary visit. `task.log()` writes to the run's own log; your app's normal output goes to the app log.

```python
import toft

@app.post("/internal/refresh")
def refresh():
    task = toft.task(request.headers)
    if task:
        task.log(f"refreshing {task.name}")
    ...
    return {"rows": 1240}
```

## Run a task now

Use the run button on the task's row on the Automation tab, or:

```bash
toft task run refresh
```

The command waits, and its exit code is the run's outcome; a run skipped for overlap exits `1`. Read past runs with `toft task runs <name>` and `toft task logs <runID> --task <name>`.

A switched-off task does not run from anywhere: not on schedule, not by hand, and not from your app, which gets `schedule_disabled`.
