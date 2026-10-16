---
title: The build cache
description: What is shared between builds, how big it is, and how to empty it.
---

`CACHE_DIR` holds the shared package caches — npm, uv, Go's module and build
caches. It is the difference between a cold rebuild and a warm one, and on a busy
install it is the largest thing on disk after releases.

## Its size

Reported on the checks page's **build cache directory** row, and as a block on the
same report.

**Measured on a ticker, never walked on a request.** Reading the size does not
send the platform off to stat a hundred thousand files while somebody is waiting
for a page.

**Never-measured is not zero.** A size that has not been taken yet is absent, and
the page says so rather than showing a confident nought.

## Emptying it

A **Reclaim** button on Admin → Checks, above the checks themselves. It is not a
check — it is an action — which is why it sits in a card of its own.

What happens:

- Each tool is asked to **clear its own cache**, rather than the platform tidying
  the directory underneath them. Deleting files out from under npm's or uv's own
  bookkeeping is how you get a cache that is worse than empty.
- The bytes freed are recorded in the audit log.
- **A reclaim that freed nothing says so**, rather than claiming a number it did
  not achieve.

## What it refuses

**A second reclaim while one is running** — `409`. That is the only thing it
refuses.

It does **not** refuse while a build is running. A build holds the cache's read
side, and the list of paths that do so is the specification: a reclaim waits for
them rather than racing them.

It is denied to API keys, as a decision rather than a default: emptying a shared
cache is an administrator's act.

## When to reclaim

Rarely. The cache is doing its job when it is large.

The honest reasons:

- **Disk pressure**, and you want the space back today.
- **A poisoned cache** — a package that resolved wrongly and keeps resolving
  wrongly. Rare, and usually there is a better fix.

It is not a routine hygiene task and there is deliberately **no timer** for it. A
scheduled cache wipe is a scheduled slow morning.

## What it does not promise

Emptying the cache does not touch releases, does not restart anything, and does
not affect apps that are running. The next build after a reclaim is slower. That
is the whole effect.
