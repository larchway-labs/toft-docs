---
title: When an app is locked
description: What a lock is, why you cannot lift it, and what to do.
---

An administrator can **lock** an app. When they do, it stops, and it stays
stopped.

## A lock is not a status

Your app can be stopped because you stopped it — you can start it again. A lock
is different: you cannot lift it, and starting the app is refused with the
administrator's own words explaining why.

- The owner may leave `stopped`.
- The owner may never leave a lock.

**Locking stops the workload. Unlocking does not start one** — somebody still
has to press start.

## What a lock blocks

Deploying, starting, changing visibility, running jobs (scheduled firings do not
fire, queued runs are cancelled and a run in flight is stopped), **rolling back**, and
everything else that would bring the app back or change what it serves. Visitors
to the app's URL get the administrator's message too.

Rollback is on that list for the same reason a deploy is: it changes what would
be served the moment the app came back.

The refusal always carries the reason the administrator typed. **Read it** — it
is a message written to you, not a generic error string. From the CLI a locked
app is **exit 2**, not exit 1 — nothing was attempted and failed; you were
refused — and the refusal names who locked it.

## Two things can lock an app

Usually a person did. But your install may also be set to lock an app
automatically when the release it is serving carries a serious enough
[dependency finding](../dependencies/), and the refusal tells you which kind
you are looking at.

If it was the dependency sweep, you will have been emailed, and the way out is
to deploy a release that fixes the finding. Asking an administrator to unlock it
is a temporary answer: an app unlocked while the finding still matches is
**locked again on the next pass**. What makes an unlock stick is a waiver, and
that is an administrator's decision to make deliberately.

## What to do

Reply to the administrator who locked it. Toft deliberately gives you no
way around a lock — not a flag, not an API call, not a redeploy under a new name
that inherits the old one's state.

## Retirement

An app that is finished with is locked rather than moved to some third state. So
"this app was retired" and "this app was locked for cause" look the same to you,
and the administrator's message is what tells them apart.

If the message does not tell you which it is, ask. That is a copy problem, not
your misreading.
