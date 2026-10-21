---
title: When an app is locked
description: What a lock blocks, why you can't lift it, and how to get your app back.
---

An administrator can **lock** an app. Locking stops it, and it stays stopped until the lock is lifted. Only an administrator can lift it.

## Locked is not stopped

| | Stopped | Locked |
|---|---|---|
| Who can undo it | Any editor, with Start | Only an administrator |
| Visitors see | — | The lock message |
| After it ends | — | The app stays stopped until somebody presses Start |

## What a lock blocks

- Deploying, uploading and auto-deploy
- Starting and restarting
- **Rolling back**, because it would change what is served
- Running jobs: scheduled runs don't fire, queued runs are canceled, and a run in progress is stopped
- Changing the app's settings, including its visibility and environment variables

Every refusal includes the lock message: the administrator's own words, or the install's default if they didn't write one. Read it; it is written for you.

From the CLI, a locked app exits with code **2**, not 1, and prints that nothing was built.

## Who locked it

The refusal says which of two things placed the lock:

- **An administrator.** Reply to them; Toft has no way around a lock.
- **This install's dependency policy.** The serving deployment installs a package the policy won't run, and the **Dependencies** tab says which. Deploy again without it, or ask for a waiver. An unlock alone is undone by the next check. See [Dependencies and policy](../dependencies/).

## Retired apps

An app that is no longer needed is retired by locking it; there is no separate archived state. If the message doesn't say whether your app was retired or locked for a reason, ask the administrator.
