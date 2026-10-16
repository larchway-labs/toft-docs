---
title: The build cache
description: The shared package caches under CACHE_DIR — how big they are and how to empty them.
---

`CACHE_DIR` holds the package caches every build shares: npm, uv, and Go's module
and build caches. It is what makes a rebuild warm, and on a busy install it is
the largest thing on disk after releases.

## Size

Shown on **Admin → System checks** as the **build cache directory** row. It is
measured on a timer, never on a request. A size not yet measured shows as absent,
not as zero.

## Reclaiming it

**Admin → System checks → Reclaim** (API: `POST /api/v1/system/build-cache/reclaim`).

- Each tool clears its own cache rather than having files deleted underneath it.
- A reclaim waits for running builds to finish; new builds wait for the reclaim.
- The bytes freed are recorded in the audit log.
- A second reclaim while one runs is refused with `409`.
- API keys are refused: it is an administrator's action.

Releases and running apps are untouched. The only effect is that the next builds
are slower.

## When to reclaim

Rarely — a large cache is a working cache. Reclaim for disk pressure, or for a
package that keeps resolving wrongly. There is deliberately no schedule for it.
