---
title: What you are running
description: One Go binary, Postgres and a filesystem — the pieces, the listeners and the origin boundary.
---

Toft is a **single Go binary**. It serves its own web interface, migrates its own
schema, and clones, builds and runs the apps you give it.

:::note
This guide is for whoever runs an install. Deploying apps is the **user guide**;
`toft` and the app SDKs are the **CLI & SDK guide**. The **Documentation** page in
Toft links to all three for your version.
:::

## The pieces

| Piece | Role |
|---|---|
| **The binary** | Platform API, web interface, build pipeline, scheduler, app proxy. |
| **Postgres 17** | Everything Toft knows. The binary migrates the schema at startup. |
| **A filesystem** | Releases, logs, build caches. |
| **PM2** | Runs apps as processes (shared mode). Bundled in the image. |
| **A cluster** | Optional — only for isolated execution. |

No app registry, build service or CI is required.

## Three listeners

| Listener | Serves | Present |
|---|---|---|
| `PORT` (`:8080`) | The platform | Always |
| `APPS_PORT` (`:8081`) | Deployed apps, on a **different origin** | Always |
| `METRICS_ADDR` | Prometheus scrape endpoint | Only when set |

Metrics never live as a path on `:8080`. See
[Listeners, origins and proxies](../../config/listeners-and-origins/).

## The boundary everything rests on

**Apps are served on a different origin from the platform.** That is what stops an
app's JavaScript from calling the platform API as the person viewing it. A
single-origin install gives that up — see
[How apps are isolated](../../security/isolation/).

Toft works out its own inbound address from each request. `BASE_URL` sets only
**outbound** links, such as those in notification emails.

## Configuration and settings

| Kind | Where | Changed by |
|---|---|---|
| **Configuration** | Environment variables, read at startup | The operator, with a restart |
| **Setting** | Database rows, audited | An administrator, on the admin pages |
| **Operating dial** | Both: environment floor, setting override | Either |

See [Configuration and settings](../../config/configuration-vs-settings/).

## Four variables to start

`DATABASE_URL`, `JWT_SECRET`, `ENCRYPTION_KEY` and `BASE_URL`. Everything else
has a default or switches on a capability you have not asked for. The full list is
in the [environment reference](../../reference/environment/).
