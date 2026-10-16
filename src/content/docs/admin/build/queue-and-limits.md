---
title: The build queue and its limits
description: How many builds run at once, what happens to the rest, and the ceilings.
---

Admin → Queue shows what is building, what is waiting, and what each one is
doing.

## Concurrency

**`MAX_CONCURRENT_BUILDS`**, overridable as the `max_concurrent_builds`
[dial](../../config/operating-dials/).

It is how many builds may **start**. Lowering it interrupts nothing already
running — a build in flight holds a token it took when the number was higher.

Raising it above the worker pool is **refused, naming the variable**, because the
page cannot conjure a worker and a silently clamped field is a field that lies.
The pool has a floor of four so the dial has room on an install that never
touched the variable.

## Timeout

**`build_timeout_seconds`**, with a per-app override.

It bounds any one build step — installing dependencies, compiling, bundling. Past
it the deploy fails and the release already serving stays up.

A notebook render has its own: **`notebook_render_timeout_seconds`**, because
executing a document is a different shape of work from compiling one.

## Memory

Builds compete with running apps for the machine. On a one-box install this is
the usual cause of "builds are queued and not starting", and the usual culprits
are a Next.js build or an R package that compiles from source.

Two levers: fewer concurrent builds, or more machine. A [binary R
repository](../languages/) is the third and is often the largest single win.

## The cache

Shared across builds — npm, uv, Go's module and build caches. See [The build
cache](../cache/).

## When a queue is not moving

In order:

1. **Admin → Queue.** Is something building, or is nothing building?
2. **The concurrency dial.** Is it lower than you think?
3. **The machine.** Memory, and disk under `CACHE_DIR` and `APPS_DIR`.
4. **The checks page.** `stuck_work` finds work claimed and abandoned; `db_pool`
   reports pool saturation.

A build that is running and slow is a different problem from a build that never
started, and the queue page is what tells them apart.
