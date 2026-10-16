---
title: Runner images
description: The per-language container images isolated mode runs workloads in, and the version sets they declare.
---

In isolated mode each workload runs in a **runner image** — one per language
family, never per framework or per app.

```bash
RUNNER_IMAGE_PYTHON=ghcr.io/example/toft-runner-python:1
RUNNER_IMAGE_NODE=ghcr.io/example/toft-runner-node:1
RUNNER_IMAGE_GO=ghcr.io/example/toft-runner-go:1
RUNNER_IMAGE_R=ghcr.io/example/toft-runner-r:1
RUNNER_IMAGE_STATIC=ghcr.io/example/toft-runner-static:1
```

An app whose family has no image is refused **at start, naming the family**.
The **Runner images** row on **Admin → System checks** warns for a missing image
and for one tagged `latest` or untagged.

## Declaring the versions an image carries

```bash
RUNNER_PYTHON_VERSION=3.15,3.14,3.13
RUNNER_NODE_VERSION=24,22,20
RUNNER_R_VERSION=4.6,4.5,4.4
```

| Rule | Effect |
|---|---|
| First entry is the default | Same as the platform's probe |
| Every entry is required | At bootstrap the runner checks its image for each series and refuses to start a workload if one is missing |
| A malformed entry voids the whole list | Never silently shortened |
| Platform and runner images carry the same set | An R library is restored on the platform and loaded in the pod; a mismatch fails at `dyn.load` |

There is no `RUNNER_GO_VERSION`: Go builds a binary. See
[language versions](../languages/#go).

## Tags and upgrades

- Never tag `latest`; a moving tag changes what runs at an unplanned restart.
- To add a series: rebuild the image, push a new tag, change the variable.
- `RUNNER_VERSION` is the runner contract version the platform expects. It is
  configuration, for the window when the two halves of an upgrade are out of step.

## The static runner

Static apps and rendered documents are served by a subcommand of the platform
binary; `RUNNER_IMAGE_STATIC` is a thin image around it. Shared mode runs the
same subcommand.
