---
title: Releases, rollback and retention
description: What a build leaves behind, and how much of it you keep.
---

Every successful build is a **release** on disk. One of them is serving; the
others are what an owner rolls back to.

## What you control

**`max_versions_per_app`** caps what any one app keeps, however many its owner
asked for. Resolved in one place, and the owner can see the policy that applies
to their app on its Deployments tab — so "why did my old release disappear" is
answerable without asking you.

Zero means no limit, which on a busy install means disk.

## What is not trusted

**A release on disk is not trusted: a start replaces the tree**, from the stored
artifact. Editing files inside a running app's release directory does not survive
a restart, and it is not a way to patch production.

The one exception is the tree the build itself drives, which is being written
rather than served.

## Rollback

An owner picks a release and makes it current; the workload restarts onto it and
nothing is rebuilt. `toft rollback` does the same and names the release before
acting.

**A restart is not a deploy.** The verdicts that apply — the dependency policy,
the source policy, the language version — are the ones made about *that release*,
not today's. An app that has been serving for a month does not fail to come back
because an advisory landed overnight.

## What rollback does not change

Environment variables, app data, storage contents, and anything the app wrote
anywhere. Rolling back the code does not unmigrate a database.

Worth saying out loud to owners once, because it is the assumption that bites.

## Where releases live

By default, on the platform's own disk under `APPS_DIR`. That is fine for a
one-box install whose disk survives a restart.

If the disk does not survive replacement — a container, an autoscaled instance,
a cluster — you need an [artifact store](../artifact-store/). Isolated mode needs
one regardless: a workload in a cluster cannot read `APPS_DIR`.

## Deleting

An owner can delete one deployment, or every one that is not current. Deleting
the app removes its releases, its workload and its storage attachments — but not
the data in a store.
