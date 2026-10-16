---
title: How apps are isolated
description: Separate origins, the environment an app receives, what shared mode does not isolate.
---

## Apps run on a separate origin

The platform serves on one origin (`:8080`); apps on another (`:8081`,
`APPS_PORT`). That stops an app's JavaScript from calling the platform API as the
person viewing it. A single-origin install gives this up: app JavaScript runs on
the platform's origin. See [listeners and origins](../../config/listeners-and-origins/).

The same reasoning puts the [metrics endpoint](../../capabilities/telemetry/) on
a listener of its own, never a path on `:8080`.

Which responses are the platform's is decided by resolving the app, never by path
prefix. An unknown route on the apps origin is not the SPA.

## Framing

Every app response carries `Content-Security-Policy: frame-ancestors`. By default
only the app itself and this install may frame it. An owner widens it per app
under **Settings → Access → Embedding** — exact origins only, no wildcards.

## Environment

A workload never inherits Toft's environment. It gets exactly:

- the app's declared variables,
- the platform's contract variables (such as `PORT` and `TOFT_APP_TOKEN`),
- credentials an administrator attached.

So the database password, the telemetry credential and the encryption keys are
never in an app's environment.

## On disk and cookies

- Per-app secrecy is enforced by a directory the app does not own, so an app
  cannot widen its own permissions.
- Every platform cookie is named `toft_*`. Any other cookie on the apps origin
  belongs to an app.

## Cloud metadata

Set `BLOCK_AWS_METADATA=1` so apps cannot reach the instance or task metadata
endpoints that hand out IAM credentials. Do **not** use an IMDS hop limit of 1
instead — it blocks Toft's own pod too.

## What is not isolated

:::caution[Shared mode]
In [shared mode](../../apps/execution-modes/) apps are processes on one machine.
App-to-app isolation is an **accepted risk**: per-app OS accounts narrow it but do
not close it. Origin isolation is about browsers, not processes. If you need
app-to-app isolation, use isolated mode.
:::

Other accepted risks:

- Builds are not sandboxed.
- PM2's dump file exists on a shared-mode install.
- Build logs are held in memory while a build runs.
