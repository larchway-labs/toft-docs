---
title: Status and sleeping
description: What each app status means, how sleeping and waking work, and why an app crashes.
---

| Status | Meaning |
|---|---|
| **Building** | A deploy is in progress. |
| **Running** | Up and serving. |
| **Sleeping** | Idle, so Toft stopped the process. The next request wakes it. |
| **Stopped** | Stopped by a person or a lock. Stays down until started. |
| **Ready** | A [batch app](../../automation/jobs/#where-a-job-runs) with a deployment. Runs jobs, serves nothing. |
| **Crashed** | Exited, never came up, or kept running out of memory. |
| **Failed** | The last deploy didn't produce a working deployment. |

## Sleeping

A sleeping app still answers its address; the first request is slower while it starts. If that delay matters, make startup faster.

Apps sleep only if your administrator set an idle timeout; **Settings → Runtime → Never sleep** shows it. An app never sleeps if it runs in isolated mode or an administrator exempted it. A [job's](../../automation/jobs/) schedule does not keep it awake: jobs run in their own process.

## What visitors see when the app can't answer

If your app is stopped, sleeping, starting, crashed, locked or still building,
Toft answers in its place with a page saying so, with status `503`. That page
always carries an `X-Toft-Interstitial` header naming the state — for example
`stopped`, `sleeping`, `waking`, `crashed` or `deploy_failed` — and your app's own
responses never do. A monitor or script can check for the header to tell Toft's
page from a `503` your app sent itself.

## Why an app crashes

The **Logs** tab has the reason. Usually:

- It didn't listen on the port in `PORT`.
- A variable is missing. Your app gets only what is set for it, never your shell's environment.
- The process exited. A web app must keep running; for run-and-exit work, use a [job](../../automation/jobs/).
- It ran out of memory.

A start that isn't up after five minutes reads **Crashed**, with the backend's reason.

## Restarts are bounded

- Five restarts within fifteen minutes raises a **Restart loop** event.
- An isolated app is restarted up to five times, then left down with a **Not restarting** event.
- After three memory kills on one deployment, the app is stopped and marked **Crashed**. The memory ceiling is under **Settings → Runtime**; only an administrator can raise it.

## Starting and stopping

On the app page, a stopped app's first button is **Start app** and a crashed app's is **Restart app**. Start, Restart and Stop are also in the **⋯** menu. From the command line:

```bash
toft stop
toft start
toft restart --wait
```

A restart runs the same deployment again. It doesn't rebuild or re-check dependencies.
