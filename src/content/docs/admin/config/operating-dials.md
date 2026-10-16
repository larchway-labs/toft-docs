---
title: The operating dials
description: Seven numbers that are both configuration and setting, and how zero is read.
---

A **dial** is a quantity, a pace, a ceiling or a verbosity. Each has an
environment variable *and* a setting, and they are not two knobs for one thing:

- **The environment is the floor** — the install's own number.
- **The setting is an override** an administrator can change from Admin →
  Settings, without a restart and without shell access.
- **A cleared or zero setting means the environment's number**, never "off".

## The seven

| Dial | Environment | Setting | Read at |
|---|---|---|---|
| Memory ceiling per app | `APP_MEMORY_LIMIT_MB` / `_GB` | `app_memory_limit_mb` / `_gb` | each start |
| CPU reserved per app | `APP_CPU_REQUEST_MILLICORES` / `_CORES` | `app_cpu_request_millicores` / `_cores` | each start |
| CPU ceiling per app | `APP_CPU_LIMIT_MILLICORES` / `_CORES` | `app_cpu_limit_millicores` / `_cores` | each start |
| Builds at once | `MAX_CONCURRENT_BUILDS` | `max_concurrent_builds` | each dequeue |
| Auto-deploy interval | `AUTO_DEPLOY_POLL_INTERVAL` | `auto_deploy_poll_seconds` | each tick |
| R package repository | `TOFT_R_REPOS` | `r_package_repository` | each build |
| Platform log level | `LOG_LEVEL` | `log_level` | immediately |

**A dial reaches a workload the next time that workload starts.** Lowering the
memory ceiling does not reach into running apps.

## Two spellings, and only one may be set

Each quantity dial has a small unit and a large one — `_MB` and `_GB`,
`_MILLICORES` and `_CORES`. They are **peers**, not a fallback chain, and setting
both is refused rather than resolved by precedence.

## Three of them have structure worth knowing

**Build concurrency is how many builds may *start*.** Lowering it interrupts
nothing already running — a build in flight holds a token it took when the
number was higher. Raising it above the worker pool is **refused, naming
`MAX_CONCURRENT_BUILDS`**, because the page cannot conjure a worker and a
silently clamped field is a field that lies.

**The auto-deploy interval's zero means two things, deliberately.**
`AUTO_DEPLOY_POLL_INTERVAL=0` in the environment means no poller is ever
constructed. A stored `0` in the setting means the environment's number, like
every other dial. Whether auto-deploy is offered at all is a capability
question, not a pace — so it stays in the environment. The settings page renders
the field disabled rather than silently doing nothing.

**The log level takes effect immediately, and it is the only one that does.**
It may, because it reaches no workload — it is the platform's own verbosity.
A restart re-applies the stored level, so an administrator's change is not
quietly reverted.

**`LOG_FORMAT` is not a dial** and never will be: it is a fact about who is
reading the stream, and changing it mid-flight hands a collector a format change
it did not ask for. It is reported read-only on the settings document, beside
the effective log level.

## Per-app overrides

**Memory has one and CPU does not.** An administrator can give a single app a
higher memory ceiling than the install's; there is no per-app CPU, and no
per-job-definition CPU. Those numbers are the operator's.

## The resource envelope

Install-wide. CPU applies in isolated mode only; memory applies in both. A job run on
the platform's own machine has its memory limit enforced by sampling, not by the
kernel (see [where a job runs](../../operate/automation/#where-a-job-runs)).

A CPU **ceiling** is off by default, and that is deliberate: over its memory
limit a workload is killed, but over a CPU limit it is merely throttled — which
turns a burst into a slow app and is usually worse than letting it burst.

Admin → Info shows the resolved envelope on one screen: what the environment
says, what a setting overrides, and what an app will actually get.
