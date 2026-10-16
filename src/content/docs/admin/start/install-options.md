---
title: Ways to install
description: One box or a cluster, and which one you want.
---

Two supported shapes, and the same image behind both.

## One box, with Docker Compose

The whole install on one Linux machine: Toft, Postgres, and the apps it
runs. Apps run in **shared mode** — as processes on that machine, bound to
loopback.

The right choice for a team, a department, or a first install. One machine to
back up and one thing to upgrade. [Jobs](../../operate/automation/#where-a-job-runs)
and [batch apps](../../operate/automation/#batch-apps-only-jobs) run here too, on
the same machine, under the app's own account — with a memory limit that is a
sampled watchdog rather than a boundary.

The bundle is published to its own public repository and is what a customer
installs. It runs on loopback and expects a proxy or an SSH tunnel in front of
it.

## A cluster, with the Helm chart

Apps run in **isolated mode** — one workload per app, each in its own container
with its own network policy.

Choose this when you need app-to-app isolation, when apps have very different
resource profiles, or when you already run Kubernetes.

Isolated mode also needs an [artifact store](../../apps/artifact-store/) — a
workload in a cluster cannot read the platform's local `APPS_DIR` — at least one
[runner image](../../build/runner-images/), and a callback address a workload can
resolve.

There is a second isolated backend on Amazon ECS. **Exactly one** may be
configured: `KUBE_NAMESPACE` and `ECS_CLUSTER` both set is refused at startup
rather than resolved by precedence.

## Which mode, and can you change it

Execution mode is `shared` or `isolated` — **never a backend name**, because
which technology implements a mode is an implementation detail and the mode is
the contract.

An install can offer both. See [Execution modes](../../apps/execution-modes/).

## The image

Both pull the same published image, `gopanair/toft`, multi-arch, **tagged
with a version and never `latest`**.

Pinning is the point: an install that follows `latest` upgrades itself at a
restart you did not plan.

## What you have to provide

| | |
|---|---|
| **Postgres 17** | The schema is migrated by the binary at startup. |
| **A hostname** | For outbound links. The install works out its own inbound address. |
| **TLS** | Terminated in front of Toft, by your own proxy or ingress. |
| **An apps address** | Apps are served on a **different origin**. A second port is enough; a second hostname is better. |

## What the chart must not template

Five things in the Helm chart are compiled into the binary and must never be
made configurable:

- The `app.kubernetes.io/name: toft` pod label — every isolated workload's
  NetworkPolicy admits ingress from it.
- The workload UID `10001`.
- The unauthenticated `/api/v1/config` probe.
- The `toft-workload` ServiceAccount, and the `toft-bootstrap` token
  audience that names it.

If you are adapting the chart, leave those alone. Changing one produces an
install that comes up and then cannot start a workload.
