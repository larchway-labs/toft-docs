---
title: Configuration and settings
description: Which knob is which, and the three-question test that sorts them.
---

Toft splits its knobs in two, and the split is not arbitrary.

## Configuration is the operator's

Environment variables, read at startup. Facts about the **machine** — where
Postgres is, which cluster, which bucket, which key encrypted what.

They cannot be changed from the web interface, because changing where the
database is from inside the application is not a feature.

## Settings are the administrator's

Database rows, changed from the admin pages, **audited**, no restart. Sign-in
providers, the dependency policy, whether apps may be public, notification
channels, storage resources, retention.

## The test that sorts them

In order — the first that answers wins:

1. **Would changing it invalidate something already written down?** Where the
   database is, which bucket, which key encrypted what. → **Configuration**, and
   it stays in the environment forever.
2. **Is it a capability being offered or withdrawn?** Isolated execution, public
   apps, the gallery, API keys. → **Audited setting**.
3. **Is it a quantity, a pace, a ceiling or a verbosity?** → an
   [**operating dial**](../operating-dials/), which is both.

Deliberately *not* "how often does it change": a collector address changes when
the collector moves, and a memory ceiling may never change at all, so frequency
sorts neither.

## What is left in the environment, and why

| Group | Examples | Why it stays |
|---|---|---|
| **Facts about the install** | `DATABASE_URL`, `BASE_URL`, `APPS_PORT`, `ARTIFACT_*`, `KUBE_*`, `STORE_*`, the paths and ports | Changing one invalidates something already written down |
| **Secrets** | `JWT_SECRET`, `ENCRYPTION_KEY`, `BOOTSTRAP_ADMIN_PASSWORD`, `METRICS_TOKEN` | A settings page never holds the key that decrypts the settings |
| **Somebody else's contract** | the `OTEL_*` family | The names are the OpenTelemetry standard ones, because every runbook already knows them |
| **Bootstrap-only** | the `OIDC_*` and `GITHUB_*` pairs | A fresh install has no users, so nobody can reach the admin page to configure the way in |
| **Development** | `DEV_PASSWORD`, `DEV_INSECURE_COOKIES` | Not part of any install |

## Three that look like dials and are not

- **`GALLERY_CATALOG_URL`** — where the catalog lives is configuration.
- **`PORT_RANGE_START` / `_END`** — the allocator is built from them, and a
  change strands running apps at addresses the platform no longer believes in.
- **`RUNNER_VERSION`** — it exists only for the window in which the two halves of
  a release are upgraded in some order.

And one that looks like a dial and is a trust decision: **`BUILD_ALLOW_SCRIPTS`**
is not a quantity. It admits npm lifecycle scripts, which widens the trust
boundary of every subsequent deploy with nothing about the result looking
different.

## A change of one does not silently move the other

An environment variable that has a setting over it is a **floor**, not a value —
see [dials](../operating-dials/). Restarting with a changed variable moves the
bootstrap values; it does not overwrite what an administrator chose.

## Booleans

Switches are read as booleans: on is `1`, `true`, `yes` or `on`; off is `0`,
`false`, `no` or `off`. Case and surrounding spaces do not matter, and **anything
else is refused at startup** rather than treated as false.

A switch is never read by *presence*. And in a delivery artifact — a chart, a
compose file — off is spelled as **absent or empty**, never `0`.
