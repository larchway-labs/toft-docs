---
title: Deployments, rollback and retention
description: What a build leaves behind, how rollback works, and how many deployments each app keeps.
---

Every successful deploy is kept as a **deployment**. One is serving; the others are what an
owner can roll back to.

## Retention

| Setting | Where | Effect |
|---|---|---|
| **Most deployments an app may keep** (`max_versions_per_app`) | Admin → Settings | Caps every app, whatever its owner asks. `0` means no limit. |
| **Delete old deployments automatically**, **Deployments to keep** | The app's settings | The owner's choice, within your cap |

Owners see the policy that applies on the app's **Deployments** tab.

An owner can delete one deployment, or every one that is not current. Deleting an
app removes its deployments, workload and storage attachments — not the data in a
store.

## Rollback

The owner picks a deployment and makes it current; the workload restarts onto it
with no rebuild. `toft rollback` does the same and names the deployment first.

**A restart is not a deploy.** The dependency policy, source policy and language
version are judged as they were for that deployment, so an app does not fail to
return because an advisory landed overnight.

:::note[Rollback changes code only]
Environment variables, app data, storage contents and anything the app wrote are
unchanged. Rolling back code does not unmigrate a database.
:::

## Deployments are not edited in place

A start replaces the deployment's directory from the stored artifact. Editing
files in a running app's directory does not survive a restart.

Deployments live under `APPS_DIR` by default. If the disk does not survive
replacement, or you run isolated mode, configure an
[artifact store](../artifact-store/).
