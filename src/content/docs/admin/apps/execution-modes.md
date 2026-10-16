---
title: Execution modes
description: Shared and isolated, what each gives you, and the risk one of them does not cover.
---

An app runs in one of two modes. The words are `shared` and `isolated` — **never
a backend name**, because which technology implements a mode is an
implementation detail and the mode is the contract.

## Shared

Apps run as processes on the Toft machine, managed by PM2, **bound to
`127.0.0.1`** and reached only through the platform's proxy.

- Cheap. No cluster, no images, no registry.
- Fast to start, so sleeping and waking is quick.
- Per-app secrecy on disk is enforced by **a directory the app does not own** —
  never by a mode bit on one it does.

## Isolated

One workload per app, each in its own container with its own network policy.

- App-to-app network isolation.
- Per-app resource limits that are actually enforced.
- A workload's identity is **issued by the cluster and verified**, never minted
  into a pod spec — which is what lets the kubelet restart a container in place.
- A crashing workload is restarted a **bounded** number of times and then told
  that it has stopped being restarted, rather than looping forever.

[Jobs](../../operate/automation/) do **not** need an app to be isolated, or the
install to have a cluster. A job always runs in a process of its own with its own
memory limit, never in the app's process; **where** is the install's decision, not
the app's. With isolated execution available it is a pod. Without it, it is a
process group on the platform's own machine under the app's OS account — with a
memory limit that is a sampled watchdog rather than a boundary, which is the
difference isolated mode buys.

An app with **no service at all** — a [batch app](../../operate/automation/#batch-apps-only-jobs),
declared with `[batch]` — has neither mode's long-running workload. It is `ready`
rather than `running`, and its jobs are placed as above.

## Per-app OS accounts, in shared mode

**This is the production posture.** Without it, every app runs as the Toft
user and can read the platform database and every other app's secrets.

`APP_USER_PER_APP` with `APP_USER_AUTOCREATE` gives each app a nologin system
account. It requires Toft to run as root, because PM2 setuids to the app
account.

Two structural points:

- The **primary group** (`APP_USER_GROUP`) is what the egress rules act on. The
  per-app group reaches the workload only through the launcher.
- The posture is **derived from the platform's own uid** rather than declared. An
  install running as an ordinary user reports `platform` and says so at startup;
  it does not pretend to isolate.

## The effective mode belongs to the deployment

An install can offer both. Each app's mode is decided **at creation**, by one
helper on all three creation paths, and the *effective* mode is a property of the
deployment rather than of the install.

So a release records the mode it ran under, and changing an app's mode takes
effect on its next deploy rather than retroactively.

A refused create writes nothing — there is no half-created app to clean up.

## Switching isolated execution off

`isolated_execution_enabled` off means creation refuses it. Existing isolated
apps are not migrated by the switch.

`default_execution_mode` decides what a new app is born in when whoever creates
it does not say.

## The risk you should know about

**In shared mode, app-to-app isolation is an accepted risk.** Apps run as
processes on one machine. Origin isolation stops an app's *JavaScript* from
reading the platform as the viewer; it does nothing about one app's process
reaching another's.

Do not cite origin isolation as evidence that shared-mode apps are isolated from
each other. If you need that, you need isolated mode.

## Restarts

Configuration reaches a workload **at start**. One verb starts a workload and the
platform supplies the whole description, so a start always carries the
configuration as it is now — there is no drift between what an app was given and
what it is configured with.

**A start that produced no process is not a start**, and is reported as a failure
rather than as a success with nothing behind it.

A backend's status word reads the **process** before it believes its manager: the
container before the pod's phase, the pid before PM2's word.
