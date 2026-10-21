---
title: The build queue and its limits
description: How many builds run at once, the timeouts, and what to check when the queue stops moving.
---

**Admin → Queue** shows what is building, what is waiting, and what each build is
doing.

## Limits

| Limit | Set by | Notes |
|---|---|---|
| Builds at once | `MAX_CONCURRENT_BUILDS`; overridable as **Builds at once** (`max_concurrent_builds`) on **Admin → Settings** | Lowering it interrupts nothing running. It cannot exceed the worker pool, which has a floor of four; a higher value is refused, naming the variable. |
| Build step timeout | **Let a build command run for** (`build_timeout_seconds`), with a per-app override | Bounds each step — install, compile, bundle. Past it the deploy fails; the serving deployment stays up. |
| Notebook render timeout | **Let a notebook render for** (`notebook_render_timeout_seconds`) | Separate, because executing a document is different work. |

## Memory

Builds compete with running apps. On a one-box install, memory is the usual
reason builds queue without starting — typically a Next.js build or an R package
compiling from source. Run fewer builds at once, add memory, or point R at a
[binary repository](../languages/#r).

The [build cache](../cache/) is shared across builds.

## When the queue is not moving

1. **Admin → Queue** — is anything building at all?
2. **Builds at once** — is it lower than you think?
3. **The machine** — memory, and disk under `CACHE_DIR` and `APPS_DIR`.
4. **Admin → System checks** — `stuck_work` finds work claimed and abandoned;
   `db_pool` reports pool saturation.
