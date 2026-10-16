---
title: Configuration and settings
description: Environment variables versus audited settings, and the test that decides which a knob is.
---

| | Configuration | Setting |
|---|---|---|
| **Is** | An environment variable | A database row |
| **Owned by** | The operator | An administrator |
| **Changed** | At restart | On the admin pages, live, **audited** |
| **About** | The machine: database, cluster, bucket, keys | Policy: providers, public apps, dependencies, channels, storage, retention |

A third kind, the [operating dial](../operating-dials/), is both.

## The test

The first question that answers wins:

1. **Would changing it invalidate something already written down?** (Where the
   database is, which bucket, which key encrypted what.) → **Configuration.**
2. **Is it a capability offered or withdrawn?** (Isolated execution, public apps,
   the gallery, API keys.) → **Audited setting.**
3. **Is it a quantity, pace, ceiling or verbosity?** → **Operating dial.**

## What stays in the environment

| Group | Examples | Why |
|---|---|---|
| **Facts about the install** | `DATABASE_URL`, `BASE_URL`, `APPS_PORT`, `ARTIFACT_*`, `KUBE_*`, `STORE_*`, paths and ports | Changing one invalidates something written down |
| **Where links point** | `DOCS_URL`, `GALLERY_CATALOG_URL` | Configuration, not a setting — the settings API refuses `docs_url` |
| **Secrets** | `JWT_SECRET`, `ENCRYPTION_KEY`, `BOOTSTRAP_ADMIN_PASSWORD`, `METRICS_TOKEN` | A settings page never holds the key that decrypts the settings |
| **Someone else's contract** | `OTEL_*` | The OpenTelemetry standard names |
| **Bootstrap only** | `OIDC_*`, `GITHUB_*` | A fresh install has nobody who can reach the admin pages |
| **Development** | `DEV_PASSWORD`, `DEV_INSECURE_COOKIES` | Not for any real install |

`DOCS_URL` points the **Documentation** page at a mirror of the public docs, or
`off` to remove documentation links.

Some that look like dials and are not:

- **`PORT_RANGE_START` / `PORT_RANGE_END`** — changing them strands running apps
  on ports the allocator no longer knows.
- **`RUNNER_VERSION`** — only for the window while the two halves of a release
  are upgraded.
- **`BUILD_ALLOW_SCRIPTS`** — a trust decision, not a quantity: it lets npm
  lifecycle scripts run in every later build.

Every variable is listed in the [environment reference](../../reference/environment/);
every setting in the [settings reference](../../reference/settings/).

## Booleans

| Value | Read as |
|---|---|
| `1`, `true`, `yes`, `on` | On |
| `0`, `false`, `no`, `off` | Off |
| Anything else | **Refused at startup** |

Case and surrounding spaces are ignored. In a chart or compose file, spell off as
**absent or empty**, never `0`.
