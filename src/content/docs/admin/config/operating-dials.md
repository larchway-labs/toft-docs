---
title: The operating dials
description: Nine numbers with an environment floor and a live setting override.
---

A **dial** has an environment variable *and* a setting on **Admin → Settings**:

- The **environment** value is the install's floor.
- The **setting** overrides it, live, with no restart.
- A **cleared or zero** setting means "use the environment value", never "off".

| Dial | Environment | Setting | Takes effect |
|---|---|---|---|
| Memory ceiling per app | `APP_MEMORY_LIMIT_MB` / `_GB` | `app_memory_limit_mb` / `_gb` | Each app start |
| CPU reserved per app | `APP_CPU_REQUEST_MILLICORES` / `_CORES` | `app_cpu_request_millicores` / `_cores` | Each app start |
| CPU limit per app | `APP_CPU_LIMIT_MILLICORES` / `_CORES` | `app_cpu_limit_millicores` / `_cores` | Each app start |
| Memory per job run | `JOB_MEMORY_LIMIT_MB` / `_GB` | `job_memory_limit_mb` / `_gb` | Each run start |
| CPU per job run | `JOB_CPU_LIMIT_MILLICORES` / `_CORES` | `job_cpu_limit_millicores` / `_cores` | Each run start |
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
| **CPU limit** | One core per app (1,000 m) and two per job run (2,000 m) unless you change them. A CPU limit is an amount of CPU time, not a set of cores: an app with a one-core limit can run on every core, but only for one core's worth of time in total. Over it a workload is slowed (throttled), never killed. When an app is held at its limit for more than a quarter of an hour, Toft raises an `app_cpu_throttled` warning. |
| **Memory and CPU per job run** | 1,024 MB and 2,000 m by default. These apply to every job; an app's own limits never reach its jobs, and developers cannot declare a job's memory or CPU in `toft.toml`. To give one job more or less, set an override on it — see [job limits](../../operate/automation/#limits). |

## Scope

- **Memory and the CPU limit** apply in both modes. The **CPU reservation** applies
  in isolated mode only.
- **Per-app override:** an administrator can set one app's memory limit and CPU
  limit on the app's **Settings → Runtime**, or with `PATCH /api/v1/apps/{id}`
  (`memory_limit_mb` / `_gb`, `cpu_limit_millicores` / `_cores`; 0 returns to the
  install's figure). Each change is audited (`app.memory_limit.change`,
  `app.cpu_limit.change`).
- **Per-job override:** the same, for one job — see [job limits](../../operate/automation/#limits).
- **How a limit is held** depends on where the workload runs, and every surface
  that shows a limit says which:

| Where it runs | Memory | CPU limit |
|---|---|---|
| A pod (isolated) | Enforced | Enforced |
| This machine, with a cgroup or namespace (shared) | Enforced | Enforced, where the machine gives Toft the cgroup `cpu` controller; otherwise not enforced |
| This machine, processes only (shared) | Sampled by a watchdog | Not enforced |

In the API these are the words `enforced`, `sampled` and `not_enforced`.

So that programs size their thread pools to the limit rather than to the
machine, Toft sets `GOMAXPROCS`, `OMP_NUM_THREADS` and `MC_CORES` to the CPU
limit rounded up to whole cores, and `UV_THREADPOOL_SIZE` to that or 4, whichever
is larger — unless the app's own environment sets them.

**Admin → System info** shows the resolved envelope: the environment value, any
override, and what an app actually gets.
