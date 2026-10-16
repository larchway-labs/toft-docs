---
title: How apps are isolated
description: Origin isolation, what it protects, and what it does not.
---

## Apps are on a different origin

The platform serves on one address; apps are served on another. That is not a
deployment convenience — it is the boundary that stops an app's JavaScript from
reading the platform API, or forging writes, as the person looking at it.

An install can be single-origin, and some are. Understand what you give up: on a
single-origin install, an app's JavaScript runs on the same origin as the
platform's own pages.

It is also why the [metrics endpoint](../../capabilities/telemetry/) gets a
listener of its own and is never a path on `:8080`.

## What decides a response is the platform's

**Not the path.** Which responses are the platform's own is decided by *resolving
the app*, never by matching a path prefix — because a path rule is one clever URL
away from being wrong, and an app that owns a path looking like the platform's
still gets it.

An unknown route on the apps gateway is **not** the SPA. It answers differently
from `:8080`, deliberately.

## Framing

Who may frame an app is the install's answer, with a per-app override. The
default is the install itself.

**Empty is not "anyone".** An empty list means nobody.

## The environment

**Never `os.Environ()`.** A child process gets the variables the platform chose
to give it and nothing else. The workload's environment has exactly three
sources: the app's declared variables, the platform's contract variables, and
credentials an administrator attached.

So a database password in Toft's own environment is not in every app's. Nor
is the collector credential, nor any encryption key.

## On disk

Per-app secrecy is enforced by **a directory the app does not own**, never by a
mode bit on one it does. An app cannot widen its own permissions by changing a
file it controls.

The app's **primary group** belongs to the egress rule; the per-app group reaches
the workload only through the launcher.

## Cookies

Every cookie the platform sets is named `toft_*`. Any other cookie name on
an app's origin is the app's own. That is how the two are told apart with no
ambiguity, and an app may set whatever it likes.

## Cloud metadata

`BLOCK_AWS_METADATA=1` stops deployed apps reaching the endpoints that hand out
instance and task IAM credentials.

Set it. And do **not** instead set the IMDS hop limit to 1 — that blocks
Toft's own pod as well.

## The thing this does not cover

**In [shared mode](../../apps/execution-modes/), app-to-app isolation is an
accepted risk.** Apps are processes on one machine.

Origin isolation is about browsers. It says nothing about one app's process
reaching another's files or sockets. **Never present it as if it did.** If you
need app-to-app isolation, that is isolated mode.

Per-app OS accounts narrow it considerably and do not close it.

## Other accepted risks, stated

- **Builds are unsandboxed.**
- **PM2's dump file** exists on a shared-mode install.
- **Build logs are held in memory** while a build runs.

These are written down rather than hidden, so a security review reads them here
rather than discovering them.
