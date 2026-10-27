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

## How shared apps are held

**Admin → Info → Shared containment** says which of three levels this machine
gives shared-mode apps, and why it is not the next one up:

| Level | What each app gets | What it needs |
|---|---|---|
| **Processes** | Its own OS account and directory; memory limits sampled | Nothing beyond root |
| **cgroups** | That, plus a memory limit the kernel enforces and a cap of 4,096 processes; CPU shared fairly | A cgroup v2 hierarchy Toft may write (root on a host, or a container allowed to write its cgroups) |
| **Namespaces** | That, plus its own network address, its own view of the files (no other app's tree, a private `/tmp`) and its own process list; no app can reach another | `CAP_SYS_ADMIN` and `CAP_NET_ADMIN`, `iptables` and `ip`, and Toft listening on every interface |

Most container installs run at **Processes**: a container usually may not write
its cgroups. The level is detected when Toft starts its agent.

At every level, **an app's run ends when the app exits**, and anything the app
started is stopped with it — given a few seconds to exit, then killed. An app
that starts a helper in the background and exits loses the helper. Run a helper
in the foreground instead.

At the **Namespaces** level, apps resolve names whatever this machine's resolver
is. When the machine's `/etc/resolv.conf` names only a resolver on its own
loopback — `127.0.0.53` on Ubuntu, `127.0.0.11` in Docker — Toft gives apps the
real upstream servers instead, or, where there are none to name, relays their
queries to the machine's resolver itself. Toft reads the machine's resolver
settings when its agent starts, so restart the agent after changing them.

**Admin → System checks** has three rows about this:

- **Shared containment** states the level and why it is not the next one up,
  and at the **Namespaces** level how apps resolve names. It warns in one case
  only: names may not resolve inside apps, because the machine's resolver is on
  its own loopback and Toft could not listen on port 53 of its bridge address to
  relay to it. Free that port and restart the agent. **Processes** is never a
  warning: it is the expected answer in most containers.
- **Workload cgroups**, at the cgroups level and above, warns with the name of
  each running app that could not get a cgroup of its own. That app's memory
  limit is sampled, not enforced by the kernel. Restarting the app tries again.
- **Agent** warns when the agent is leaking: a finished job still holding its
  log open, or file descriptors at 80% of the agent's limit.

## What is not isolated

:::caution[Shared mode]
In [shared mode](../../apps/execution-modes/) apps are processes on one machine.
Below the namespaces level, app-to-app isolation is an **accepted risk**:
per-app OS accounts narrow it but do not close it. Origin isolation is about browsers, not processes. If you need
app-to-app isolation, use isolated mode.
:::

Other accepted risks:

- Builds are not sandboxed.
- Build logs are held in memory while a build runs.
