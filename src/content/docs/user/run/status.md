---
title: Status and sleeping
description: Running, sleeping, stopped and crashed — what each means and who caused it.
---

| Status | What it means |
|---|---|
| **Running** | The workload is up and serving. |
| **Sleeping** | Nobody has used it for a while, so Toft stopped the process to free the machine. The next request wakes it. |
| **Stopped** | Somebody stopped it on purpose. It stays stopped until somebody starts it. |
| **Ready** | A [batch app](../../automation/jobs/#batch-apps) with a release: it serves nothing and runs jobs. |
| **Crashed** | It started and then exited, repeatedly. |
| **Failed** | The last deploy did not produce a working release. |

## Sleeping is not stopped

This is the distinction worth internalising. A **sleeping** app is still
deployed, still published, and still answers its URL — the first request after a
nap just takes longer while the process comes back. Nothing is wrong.

A **stopped** app does not answer at all, and only a person can change that.

## Waking

You do not wake an app; visiting it does. If your app is slow on its first
request and fast afterwards, that is what you are seeing, and the fix — if you
want one — is to make your app start faster, not to keep it awake artificially.

A [scheduled task](../../automation/scheduled-tasks/) hitting your app counts as
a request. One running every five minutes means your app effectively never
sleeps.

The idle clock belongs to the workload, so a restart does not begin with the app
looking idle.

## Crashed

The **Logs** tab has the reason. Common causes, in the order they actually
happen:

- The app did not bind to the port in `PORT`, or bound to a fixed port of its
  own.
- A missing environment variable, discovered at startup. Remember your app gets
  **only** what you set — never your shell's environment.
- The process ran to completion and exited. A workload has to keep running; a
  script that finishes is a crash as far as the supervisor is concerned. If you
  want something that runs and exits, that is a [job](../../automation/jobs/).
- It ran out of memory. See below.

## Restarts are bounded

A crashing app is restarted a limited number of times and then told that it has
stopped being restarted. It does not loop forever, and you are not left guessing
whether something is still trying.

**A start that produced no process is not a start.** You will not see "running"
over a workload that never came up.

**A restart loop is found either way it arrives** — five restarts inside fifteen
minutes, whether they all land at once or one at a time over the window. And the
restart count on the page says what it is counting, so the number you read and
the verdict you are shown are about the same stretch of time.

## A workload that never starts

A start gets five minutes. Past that it is not *starting* any more, and the app
reads **crashed** with the reason your install's backend gave — which, for the
failure that used to hang indefinitely, is the scheduler's own sentence: no
machine with that much memory, nothing matching that placement rule.

There is no process to crash and no log to read in that case, so the platform
says what it was told rather than waiting for something that is never coming.

## Out of memory

Every app has a memory ceiling — your install's figure, or a higher one an
administrator set for your app specifically. Exceed it and the workload is
killed and restarted.

An app the platform keeps killing for its memory is eventually **stopped rather
than restarted forever**. That is a deliberate end to the loop: a restart that
will fail the same way in ninety seconds is not a recovery.

If that happens, the answer is in your app — a request loading a whole dataset
into memory, a leak, a worker count too high for the ceiling. Your administrator
can raise the ceiling for one app, but ask for it knowing what it is for.

## Starting and stopping

From the app page, or:

```bash
toft stop
toft start
toft restart
```

A restart puts the **same release** back up. It is not a deploy, it does not
rebuild, and it does not re-run the dependency checks.
