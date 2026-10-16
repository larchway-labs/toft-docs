---
title: Releases and rollback
description: What a successful build leaves behind, how to go back, and how long history is kept.
---

Every successful deploy leaves a **release** — the built output, kept on the
install. One of them is *serving*; the rest are what you roll back to.

The **Deployments** tab lists them, newest first, with which one is current.

## Rolling back

Pick a release and **Make current**. The workload is restarted onto it; nothing
is rebuilt, because the release is already built.

```bash
toft rollback              # the newest successful release that is not serving
toft rollback <deployID>   # a specific one
```

`toft rollback` names the release it is about to make current **before** it acts,
and asks unless you pass `--yes`. In a pipeline, where it cannot ask, it refuses
rather than hanging.

## What rollback does not change

Rolling back changes the **code**. It does not roll back:

- Environment variables — those are current, not versioned.
- Data your app wrote, anywhere.
- The [app data document](../../data/app-data/).
- Anything in [storage](../../data/app-storage/).

If your last deploy migrated a database, rolling back the code does not
unmigrate it. That is yours to think about.

## A restart is not a deploy

Restarting an app puts the same release back up. It does not rebuild, does not
re-resolve your language version, and does not re-run the dependency checks —
the verdict that applies is the one made about *that release*, not today's.

This is why an app that has been serving for a month does not fail to come back
because an advisory landed overnight.

## Retention

Your install caps how many releases one app keeps. The Deployments tab tells
you the number that applies to you; when a new release pushes the count over it,
the oldest goes.

You can also clear them yourself: delete one deployment, or every one that is
not current.

A rollback that is still queued protects the release it is returning to.
Retention and a bulk delete both leave that one alone until the rollback has
landed, so "roll back, then tidy up" cannot delete the thing you were rolling
back to.

## Downloading a release

The source archive of any release can be downloaded from its entry on the
Deployments tab. That is the fastest honest answer to "what exactly is running
right now" — better than reading the branch, which has moved since.

## What is on disk is not trusted

A start replaces the release tree from the stored artifact rather than trusting
what is on disk. Editing files inside a running app's directory does not survive
a restart, and it is not a way to patch production.
