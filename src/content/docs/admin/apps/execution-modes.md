---
title: Execution modes
description: Shared and isolated execution — what each gives you, per-app OS accounts, and the risk shared mode accepts.
---

An app runs `shared` or `isolated`. The mode is the contract; the backend behind
it is an implementation detail.

| | Shared | Isolated |
|---|---|---|
| Runs as | A process on the Toft machine, placed and restarted by Toft's agent, bound to `127.0.0.1`, reached only through the proxy | One container per app, with its own network policy |
| App-to-app isolation | **No** on most installs — an accepted risk. Where the machine allows it, each app gets its own network, files and processes (see [isolation](../../security/isolation/)) | Yes |
| Resource limits | Held by the kernel where the machine allows it, otherwise sampled | Enforced per app |
| Cost | No cluster, images or registry; fast sleep and wake | A cluster, [runner images](../../build/runner-images/), an [artifact store](../artifact-store/) |

An isolated workload that keeps crashing is restarted a bounded number of times, then reported as no longer restarted.

:::caution[Origin isolation is not process isolation]
Origin isolation stops an app's JavaScript reading the platform as the viewer.
It does nothing about one app's process reaching another's. If apps must be
isolated from each other, use isolated mode.
:::

## Per-app OS accounts (shared mode)

The production posture. Without it every app runs as the Toft user and can read
the platform database and other apps' secrets.

| Variable | Effect |
|---|---|
| `APP_USER_PER_APP` | Each app runs under its own nologin account |
| `APP_USER_AUTOCREATE` | Toft creates those accounts |
| `APP_USER_GROUP` | The primary group, which egress rules act on |

Toft must run as root, because it starts each app as its own account. The posture is
derived from the platform's own uid: an install running as an ordinary user
reports `platform` at startup rather than pretending to isolate.

## Choosing a mode

| Setting (**Admin → Settings**) | Effect |
|---|---|
| **Isolated execution** (`isolated_execution_enabled`) | Off: creating an isolated app is refused. Existing isolated apps are not migrated. |
| **New apps are born** (`default_execution_mode`) | The mode when the creator does not say |

A mode is decided at creation, the same way on every creation path. A deployment
records the mode it ran under; changing an app's mode takes effect at its next
deploy. A refused create writes nothing.

## Jobs and batch apps

[Jobs](../../operate/automation/) always run in their own process with their own
memory limit, never in the app's process. Where is the install's choice: a pod
when isolated execution is available, otherwise a process group on the platform
machine under the app's OS account, where the memory limit is a sampled watchdog
rather than a boundary.

A [batch app](../../operate/automation/) (`[batch]`) has no
long-running workload; it is `ready` rather than `running`.

## Starts

Configuration reaches a workload **at start**, always as currently configured. A
start that produced no process is reported as a failure. Status reads the process
itself — the container, the pid — before the manager's word.
