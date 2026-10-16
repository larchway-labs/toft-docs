---
title: Scheduled tasks
description: Recognize a task firing in your handler and push lines to that run's log.
---

A scheduled task is an HTTP request the platform makes to a path your app
published. Your handler runs in your app's own process, like any other request.
Create tasks with [`toft task create`](../../cli/commands/#toft-task) or on the
app's **Automation** tab, not in `toft.toml`.

## Recognize a firing

```python
task = toft.task(request.headers)        # Task, or None on an ordinary visit
if task and task.name == "nightly":
    ...
```
```js
const task = toft.task(req.headers);     // Task, or null
```
```go
task := toft.TaskFor(r.Header)           // *Task, or nil
```

One handler can serve both a schedule and a person: an ordinary visit gets
`None`. `task.name` is the name of the task that fired. No SDK call gives your
app its cron expression or time zone.

A task with no schedule is fired only on demand (`toft task run`, **Run now**, or
your app). Your handler sees it the same way.

## Push the run's log

```python
task.log("read 1,204 rows")
task.log("row 88 malformed", error=True)
task.log_lines(["…", "…"])
```
```js
await task?.log("read 1,204 rows");
await task?.log("row 88 malformed", { error: true });
await task?.logLines(["…", "…"]);
```
```go
task.Log(ctx, "read 1,204 rows")
task.LogError(ctx, "row 88 malformed")
```

Your app's stdout belongs to the app, not to this run. These lines are the only
log the run gets, and they appear on the run where someone investigating it will
look. Add them to anything that might outlive the timeout: a run that never
answers is recorded as a failure with nothing else in it.

Logging never raises. Every failure returns false, and after the first refusal
the SDK stops sending. Once a run has closed (finished or timed out), the
platform refuses lines with `409 run_finished`. In Go, logging on a `nil` task
is a safe no-op.

## Who fired it

A task firing on its schedule carries the role `system`. A manual firing carries
the role of the person who pressed the button. Don't treat a task request as
proof nobody is there.

## Protect the path

The path is reachable like any other. Give it a check of its own, such as a
shared secret from an environment variable.

## Limits

- A task has a tighter time and memory budget than a [job](../jobs/). For
  minutes or gigabytes of work, have the handler start a job and return.
- A disabled task does not fire, and **Run now**, `toft task run` and your app's
  own trigger are refused with `409 schedule_disabled`.
- A batch app serves no path, so it cannot have tasks. Use a job with a
  `schedule`.
- The R SDK has no task helper.
