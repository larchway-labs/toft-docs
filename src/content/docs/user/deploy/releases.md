---
title: Deployments and rollback
description: Every successful deploy is kept as a deployment. Roll back in seconds, download any deployment, and control how many are kept.
---

Every successful deploy leaves a **deployment** — the built app, stored by Toft.
One is serving; the others are what you roll back to. The **Deployments** tab
lists them, newest first.

## Roll back

On **Deployments**, select **Make current** on a deployment. Nothing is rebuilt:
the deployment starts, passes a health check, and traffic moves to it.

```bash
toft rollback              # the previous successful deployment
toft rollback <deployID>   # a specific one
```

`toft rollback` names the deployment before acting and asks for confirmation.
In CI, pass `--yes` — without it, a non-interactive run refuses rather than
hanging.

## What rollback does not undo

Rollback changes the code only. It does not revert:

- environment variables,
- database changes or anything else your app wrote,
- [app data](../../data/app-data/) or [storage](../../data/app-storage/).

## Restart is not redeploy

A restart starts the same deployment again — no rebuild, no new dependency check.
An app that has served for a month is not blocked from restarting by an
advisory published overnight.

Each start restores the deployment from Toft's stored copy. Editing files in a
running app's directory does not survive a restart.

## How many are kept

On the **Settings** tab, **Delete old deployments automatically** keeps the
newest deployments up to **Deployments to keep** (the serving one included), within
your install's limit. Turned off, nothing is deleted, and deploys are refused
once the app reaches the limit.

To clear space yourself, delete one deployment, or select **Delete old deployments** to
remove everything but the serving deployment. A pending rollback's target is
never deleted.

## Download a deployment

**Download** on a deployment gets its source as a ZIP — the exact answer to "what
is running right now".
