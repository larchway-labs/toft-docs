---
title: Releases and rollback
description: Every successful deploy is a release. Roll back in seconds, download any release, and control how many are kept.
---

Every successful deploy leaves a **release** — the built app, stored by Toft.
One is serving; the others are what you roll back to. The **Deployments** tab
lists them, newest first.

## Roll back

On **Deployments**, select **Make current** on a release. Nothing is rebuilt:
the release starts, passes a health check, and traffic moves to it.

```bash
toft rollback              # the previous successful release
toft rollback <deployID>   # a specific one
```

`toft rollback` names the release before acting and asks for confirmation.
In CI, pass `--yes` — without it, a non-interactive run refuses rather than
hanging.

## What rollback does not undo

Rollback changes the code only. It does not revert:

- environment variables,
- database changes or anything else your app wrote,
- [app data](../../data/app-data/) or [storage](../../data/app-storage/).

## Restart is not redeploy

A restart starts the same release again — no rebuild, no new dependency check.
An app that has served for a month is not blocked from restarting by an
advisory published overnight.

Each start restores the release from Toft's stored copy. Editing files in a
running app's directory does not survive a restart.

## How many are kept

On the **Settings** tab, **Delete old versions automatically** keeps the
newest releases up to **Versions to keep** (the serving one included), within
your install's limit. Turned off, nothing is deleted, and deploys are refused
once the app reaches the limit.

To clear space yourself, delete one build, or select **Delete old builds** to
remove everything but the serving release. A pending rollback's target is
never deleted.

## Download a release

**Download** on a release gets its source as a ZIP — the exact answer to "what
is running right now".
