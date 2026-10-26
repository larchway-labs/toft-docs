---
title: Ways to install
description: One box with Docker Compose, or a cluster with the Helm chart — same image behind both.
---

Two supported shapes. Both run the published image **`gopanair/toft:<version>`**
(multi-arch, linux/amd64 and linux/arm64), always pinned to a version — there is
no `latest` tag.

| | One box (Docker Compose) | Cluster (Helm chart) |
|---|---|---|
| **Apps run** | In **shared mode**: processes run by Toft's agent, each as its own OS account | In **isolated mode**: one container per app, with its own network policy |
| **Choose it for** | A team, a department, a first install | App-to-app isolation, mixed resource profiles, an existing Kubernetes |
| **Jobs run** | As processes on the machine, under their app's account | In their own pods |
| **Not available** | Isolated execution, the artifact store, telemetry export | — |

## One box

```bash
curl -fsSL https://raw.githubusercontent.com/larchway-labs/toft-install/main/install.sh | sh
```

The installer, from the public `larchway-labs/toft-install` repository, checks
the machine, offers to install Docker, and prints the administrator password
once. It needs Linux (x86_64 or arm64), 4 GB of RAM and 20 GB free.

The install listens on **loopback only** (`:8080` and `:8081`). Reach it over an
SSH tunnel forwarding both ports, or put a TLS proxy in front and set `BASE_URL`,
`APPS_BASE_URL` and `TRUSTED_PROXY_CIDRS`. Its README covers backup, upgrade,
uninstall and adding durable storage.

## A cluster

The Helm chart defaults to `gopanair/toft` at the chart's app version. Isolated
mode also needs:

- an [artifact store](../../apps/artifact-store/) — a workload cannot read the
  platform's local `APPS_DIR`;
- at least one [runner image](../../build/runner-images/);
- a callback address the workloads can resolve.

Amazon ECS is a second isolated backend. Set **one** of `KUBE_NAMESPACE` or
`ECS_CLUSTER`; both is refused at startup. Execution mode is always `shared` or
`isolated`, never a backend name, and an install can offer both — see
[Execution modes](../../apps/execution-modes/).

:::caution[Adapting the chart]
Five things are compiled into the binary and must never be templated: the
`app.kubernetes.io/name: toft` pod label, workload UID `10001`, the
unauthenticated `/api/v1/config` probe, the `toft-workload` ServiceAccount, and
the `toft-bootstrap` token audience. Change one and the install starts but cannot
start a workload.
:::

## What you provide

| | |
|---|---|
| **Postgres 17** | The binary migrates the schema at startup. The one-box bundle runs its own. |
| **TLS** | Terminated by your proxy or ingress. |
| **An apps address** | A second origin. A second port works; a second hostname is easier to put TLS in front of. |
