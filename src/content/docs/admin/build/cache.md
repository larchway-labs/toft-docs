---
title: The build cache
description: The shared package caches under CACHE_DIR — how big they are and how to empty them.
---

`CACHE_DIR` holds the package caches builds use: npm, uv, Go's module and
build caches, and renv's cache of installed R packages. It is what makes a
rebuild warm, and on a busy install it is the largest thing on disk after
releases.

When apps run under accounts of their own, each app's builds get their own
caches under `CACHE_DIR/accounts/`, so one app can never change a package
another app installs. An app's caches are removed when the app is deleted, so
an app created again with the same name builds from scratch.

## Size

Shown on **Admin → System checks** on the **Build cache** card, with how full
the disk under it is. The size is measured on a timer, never on a request. A
size not yet measured shows as absent, not as zero.

## Reclaiming it

**Admin → System checks → Reclaim** (API: `POST /api/v1/system/build-cache/reclaim`).

- Each tool clears its own cache rather than having files deleted underneath it.
  The R package cache is the exception: it is removed, since no release refers
  to it. It and Go's module cache are only cleared when clearing npm and uv
  freed less than a quarter of the cache.
- A reclaim waits for running builds to finish; new builds wait for the reclaim.
- The bytes freed are recorded in the audit log.
- A second reclaim while one runs is refused with `409`.
- API keys are refused: it is an administrator's action.

Releases and running apps are untouched. The only effect is that the next builds
are slower.

## When to reclaim

Rarely — a large cache is a working cache. Reclaim for disk pressure, or for a
package that keeps resolving wrongly. There is deliberately no schedule for it.
