---
title: The operating dials
description: Seven numbers with an environment floor and a live setting override.
---

A **dial** has an environment variable *and* a setting on **Admin → Settings**:

- The **environment** value is the install's floor.
- The **setting** overrides it, live, with no restart.
- A **cleared or zero** setting means "use the environment value", never "off".

| Dial | Environment | Setting | Takes effect |
|---|---|---|---|
| Memory ceiling per app | `APP_MEMORY_LIMIT_MB` / `_GB` | `app_memory_limit_mb` / `_gb` | Each app start |
| CPU reserved per app | `APP_CPU_REQUEST_MILLICORES` / `_CORES` | `app_cpu_request_millicores` / `_cores` | Each app start |
| CPU ceiling per app | `APP_CPU_LIMIT_MILLICORES` / `_CORES` | `app_cpu_limit_millicores` / `_cores` | Each app start |
| Builds at once | `MAX_CONCURRENT_BUILDS` | `max_concurrent_builds` | Each dequeue |
| Auto-deploy interval | `AUTO_DEPLOY_POLL_INTERVAL` | `auto_deploy_poll_seconds` | Each tick |
| R package repository | `TOFT_R_REPOS` | `r_package_repository` | Each build |
| Platform log level | `LOG_LEVEL` | `log_level` | Immediately |

Resource dials reach a running app only when it next starts.

**Two units, one at a time.** `_MB`/`_GB` and `_MILLICORES`/`_CORES` are
alternatives; setting both is refused.

## Details that matter

| Dial | Behavior |
|---|---|
| **Builds at once** | Limits how many builds may *start*; lowering it interrupts nothing. A value above the worker pool is refused, naming `MAX_CONCURRENT_BUILDS`. |
| **Auto-deploy interval** | `AUTO_DEPLOY_POLL_INTERVAL=0` in the environment turns auto-deploy off entirely, and the setting field is disabled. A stored `0` setting means the environment value. |
| **Log level** | The only dial that applies immediately. A restart re-applies the stored level. `LOG_FORMAT` is configuration only, shown read-only beside it. |
| **CPU ceiling** | Off by default on purpose: over a CPU limit a workload is throttled, not killed, so a burst becomes a slow app. |

## Scope

- **Memory** applies in both modes; **CPU** in isolated mode only.
- **Per-app override:** an administrator can raise one app's memory ceiling. There
  is no per-app CPU.
- A job on the platform's own machine has its memory limit enforced by sampling,
  not the kernel — see [where a job runs](../../operate/automation/#where-a-job-runs).

**Admin → System info** shows the resolved envelope: the environment value, any
override, and what an app actually gets.
