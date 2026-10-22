---
title: Limits and caps
description: Fixed limits, the ones your administrator sets, and features that may be absent.
---

## Fixed

| Limit | Value |
|---|---|
| App data | One JSON document per app, up to 256 KiB |
| Slug | Lowercase letters, digits and hyphens |
| Reserved slugs | Anything starting with `_` |
| Language version pins | Comparators only (`>=3.12,<3.13`); no `^`, `~` or patch versions |
| Personal API keys | 10 per person |
| Integrations | One of each kind per app |

## Set by your administrator

These vary by install. When you hit one, the app page, build log or error message names it.

| Area | Limits |
|---|---|
| Building | Build timeout, concurrent builds, archive upload size, available language versions |
| Running | Memory per app (overridable per app), CPU in isolated mode, idle time before sleeping |
| Automation | Default job timeout; the most time and memory a job may ask for; concurrent job runs and waiting runs per app |
| History | Deployments kept per app; how long logs and events are kept |
| Access | Whether apps can be public, session length, whether personal API keys are offered, dependency policy and waiver length |

## Features that may be absent

A feature your install has not configured is not shown at all — no disabled buttons. This applies to file storage, jobs, integrations, the artifact store, isolated execution, telemetry, the gallery, and mail. Check with your administrator before relying on one.

:::note
A feature withheld by your **license** is the exception: it is shown, marked as locked.
:::
