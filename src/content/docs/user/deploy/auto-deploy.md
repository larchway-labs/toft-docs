---
title: Deploying on every push
description: Rebuilding when the branch moves, and the two ways that happens.
---

An app that names a git repository can rebuild itself when its branch moves.
Turn it on from the app's **Settings** tab.

## Two mechanisms, and you rarely choose

**A webhook**, when your git host is connected by an administrator and can reach
this install. The push arrives, the build starts. This is the fast path.

**Polling**, when a hook cannot reach in — a Toft that is not exposed to
your git host, for instance. The install asks the branch for new commits on an
interval your administrator sets. Slower, and otherwise identical.

Which one applies is a property of how your install is set up. You do not
configure it per app.

## What it deploys

The head of the branch the app names, with the app's subdirectory if it has
one. Exactly what pressing **Deploy** would have done.

## What it does not do

- **It does not skip the checks.** An auto-deploy goes through the same three
  phases, the same [dependency policy](../../run/dependencies/), and the same
  source rules as one you started by hand.
- **It does not touch a locked app.** A [locked](../../run/locked/) app refuses
  a deploy from every direction, including this one.
- **It does not take your app down when it fails.** A failed auto-deploy leaves
  the serving release exactly where it was, and shows up on the app's
  [events](../../run/events/) so you find out.

## When it is the wrong tool

If a push should run tests before it becomes a deploy, put Toft at the end
of your pipeline instead: let CI decide, then have it run `toft deploy` or
`toft redeploy` with a [deploy key](../../cli/api-keys/). Auto-deploy has no
opinion about whether your branch is good.
