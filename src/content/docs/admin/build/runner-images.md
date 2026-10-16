---
title: Runner images
description: What an isolated install needs per language family, and the declaration that must be true.
---

In isolated mode, a workload runs in a container built from a **runner image** —
one per language family, never per framework and never per app.

```
RUNNER_IMAGE_PYTHON=ghcr.io/example/toft-runner-python:1
RUNNER_IMAGE_NODE=ghcr.io/example/toft-runner-node:1
RUNNER_IMAGE_GO=ghcr.io/example/toft-runner-go:1
RUNNER_IMAGE_R=ghcr.io/example/toft-runner-r:1
RUNNER_IMAGE_STATIC=ghcr.io/example/toft-runner-static:1
```

## A missing image is refused by name

An app in a family with no image configured is refused **at start, naming the
family** — not left to fail as `ImagePullBackOff` twenty seconds later in a place
only you can see.

The checks page has a **runner images** row: `warn` for a family with no image,
and `warn` for one pinned to `latest` or to no tag at all.

## What an image carries is a set

```
RUNNER_PYTHON_VERSION=3.15,3.14,3.13
RUNNER_NODE_VERSION=24,22,20
RUNNER_R_VERSION=4.6,4.5,4.4
```

Comma-separated, **the first entry is the default**, and **every entry is
required**: at bootstrap the runner checks its own image for *every* series in
the list, not just the first that matches, and refuses to start a workload the
declaration lied about.

That is the rule that keeps the declaration honest. An image that says it carries
Python 3.13 and does not is a deploy that fails at the worst moment, in the
container, where nobody is watching.

Two more properties of the list:

- **A malformed entry voids the whole declaration** rather than shortening it.
  Half a list is worse than none, because you would not know which half.
- **Both images carry the same set** — the platform's and the runner's. An R
  library is restored on the platform host and loaded in the pod, so a series
  present on one side and not the other fails at `dyn.load`, one shared object
  at a time.

There is no `RUNNER_GO_VERSION`. Go builds produce a binary, so no Go reaches
the runner — see [language versions](../languages/).

## Tag them

Never `latest`. An image tag that moves is an install that changes what it runs
at a restart you did not plan — the same argument as the platform image itself.

`RUNNER_VERSION` is the runner **contract** version the platform expects those
images to speak. It exists only for the window in which the two halves of a
release are upgraded in some order, which is why it is configuration and not a
dial.

## Rebuilding them

When you add a language series, rebuild the image, push it under a new tag, and
change the variable. The platform then offers what the image declares.

There is no partial upgrade: an image is a set, and the set is what an app can be
placed on.

## The static runner

Static apps and rendered documents are served by a subcommand of the platform's
own binary, so `RUNNER_IMAGE_STATIC` is a thin image around it. One
implementation serves both modes — the shared launcher runs the same subcommand.
