---
title: What you are running
description: The pieces, the listeners, and the one boundary everything else rests on.
---

Toft is a **single Go binary** that embeds its own web interface, migrates
its own schema, and builds and runs the apps you give it. It needs Postgres and
a place to put files. That is the whole dependency list.

:::note
This guide is for people who run a Toft install. If you are deploying an
app onto one, you want the **user guide**; for `toft` and the app SDK, the **CLI
and SDK guide**. Both are separate apps, installable from the gallery.
:::

## The pieces

| | |
|---|---|
| **The binary** | The platform API, the SPA, the build pipeline, the scheduler, the proxy. |
| **Postgres 17** | Everything Toft knows. The binary owns the schema and migrates it at startup. |
| **A filesystem** | Releases, logs and build caches. |
| **A process manager** | PM2, for apps that run as processes. Bundled in the image. |
| **A cluster** | Optional. Only for isolated execution. |

No Docker registry for apps, no build service, no CI. Toft clones, builds
and runs apps itself.

## Three listeners

| Port | Serves | Present |
|---|---|---|
| `:8080` | The platform — the pages people sign in to. | Always |
| `APPS_PORT` (`:8081`) | Deployed apps. **A different origin, on purpose.** | Always |
| `METRICS_ADDR` | The Prometheus scrape endpoint. | Only when configured |

The third **never lives as a path on `:8080`**. On a single-origin install, an
app's JavaScript could read a metrics path as the viewer — so it gets a listener
of its own, or none at all.

## The boundary everything rests on

**Apps are served on a different origin from the platform.** That is not a
deployment convenience. It is what stops code inside a deployed app from reading
the platform API, or forging writes, as the person looking at it.

You can run single-origin, and some installs do. Understand what you give up:
on a single-origin install, an app's JavaScript runs on the same origin as the
platform's own pages. See [How apps are isolated](../../security/isolation/).

## What Toft works out for itself

**Its own inbound address.** You do not tell it its own URL. It reads how the
caller reached it, which is why an install moved behind a new hostname keeps
working.

What you configure is **outbound** links — where a link in a notification email
should point.

## Two kinds of knob

**Configuration** is the operator's: environment variables, read at startup,
about the machine. **Settings** are the administrator's: database rows, changed
from the admin pages, audited, no restart.

There is a third kind — an **operating dial** — that is both. See
[Configuration and settings](../../config/configuration-vs-settings/).

## Four variables to start

`DATABASE_URL`, `JWT_SECRET`, `ENCRYPTION_KEY` and `BASE_URL`. Everything else
has a default or is a capability you have not asked for.

Around 120 names exist. Most of them do not apply to your install, which is the
absent-not-dormant rule working: the ten `ARTIFACT_*` variables are simply not
part of a VM install.
