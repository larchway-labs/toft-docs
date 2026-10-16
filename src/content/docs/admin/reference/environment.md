---
title: Environment reference
description: Every environment variable, grouped by what it is for.
---

Configuration is read at startup. Around 120 names exist; **most of them do not
apply to your install**, which is the absent-not-dormant rule working.

**Four are enough to start**: `DATABASE_URL`, `JWT_SECRET`, `ENCRYPTION_KEY` and
`BASE_URL`.

For the runtime side, see the [settings reference](../settings/). For the seven
that are both, see [operating dials](../../config/operating-dials/).

## Booleans

On is `1`, `true`, `yes` or `on`. Off is `0`, `false`, `no` or `off`. Case and
surrounding spaces do not matter, and **anything else is refused at startup**. A
switch is never read by presence.

The `OTEL_*` switches follow OpenTelemetry's own conventions instead, because the
names are somebody else's contract.

## Server and addresses

| | |
|---|---|
| `HOST`, `PORT` | Where the platform listens. |
| `BASE_URL` | The address people reach this install at. Used for callbacks and links. |
| `APPS_PORT` | The apps listener. **A different origin, on purpose.** |
| `APPS_BASE_URL` | Only when apps are reached through a different hostname. |
| `TRUSTED_PROXY_CIDRS` | Proxies whose `X-Forwarded-*` are believed. Defaults to loopback; **present but empty trusts nothing**. |
| `EXTRA_ORIGINS` | Extra browser origins trusted for writes. Also decides where an OAuth sign-in returns to. |
| `LOG_FORMAT` | `text` or `json`. Not a setting, ever. |
| `LOG_LEVEL` | A [dial](../../config/operating-dials/). |

## Database

| | |
|---|---|
| `DATABASE_URL` | Postgres. Toft owns and migrates the schema. |
| `TEST_DATABASE_URL` | Tests only. |

## Secrets

| | |
|---|---|
| `JWT_SECRET` | Session signing. **Under 32 bytes refuses to start**, naming the length. |
| `ENCRYPTION_KEY` | The key that writes. |
| `ENCRYPTION_KEY_OLD` | Retired keys, comma-separated, kept for reading. |
| `ENCRYPTION_KEY_URI` | Put the key that encrypts the key into a KMS. Presence decides; there is no fallback. |
| `VAULT_TOKEN`, `VAULT_K8S_ROLE` | HashiCorp Vault authentication only. |
| `BOOTSTRAP_ADMIN_PASSWORD` | The built-in administrator's first password. Empty generates one, printed once at first boot. |

## Sign-in, for bootstrap only

Providers are normally database rows. These exist because a fresh install has no
users, so nobody can reach the admin page to configure the way in. A provider
that came from here is **read-only in the API**.

`OIDC_ISSUER` · `OIDC_CLIENT_ID` · `OIDC_CLIENT_SECRET` · `OIDC_PROVIDER_ID` ·
`OIDC_DISPLAY_NAME` · `OIDC_SCOPES` · `OIDC_ALLOWED_DOMAINS` ·
`OIDC_DEFAULT_ROLE` · `GITHUB_CLIENT_ID` · `GITHUB_CLIENT_SECRET`

Register `{BASE_URL}/api/v1/auth/{OIDC_PROVIDER_ID}/callback` as the redirect URI.

## App hosting and builds

| | |
|---|---|
| `APPS_DIR`, `LOGS_DIR`, `CACHE_DIR` | Resolved to absolute paths. |
| `PORT_RANGE_START`, `PORT_RANGE_END` | The shared-mode port allocator. **Not a dial** — a change strands running apps. |
| `RUNTIME` | `pm2`, which is what every install runs. |
| `MAX_CONCURRENT_BUILDS` | A dial. |
| `AUTO_DEPLOY_POLL_INTERVAL` | A dial. **`0` constructs no poller at all.** |
| `BUILD_ALLOW_SCRIPTS` | Admits npm lifecycle scripts. Not a dial: it decides what code a build may execute. |
| `GALLERY_CATALOG_URL` | Where the catalog lives. Configuration, not a switch — the switch is a setting. |

## The resource envelope

Each is a [dial](../../config/operating-dials/), with two spellings of which only
one may be set.

`APP_MEMORY_LIMIT_MB` / `_GB` · `APP_CPU_REQUEST_MILLICORES` / `_CORES` ·
`APP_CPU_LIMIT_MILLICORES` / `_CORES`

The CPU ceiling is off by default: over a memory limit a workload is killed, but
over a CPU limit it is merely throttled.

## App process isolation — the production posture

Without these, **every app runs as the Toft user** and can read the platform
database and every other app's secrets.

| | |
|---|---|
| `APP_USER_PER_APP` | Per-app OS accounts. Requires running as root. |
| `APP_USER_AUTOCREATE` | Create missing accounts at deploy time. |
| `APP_USER_GROUP` | The accounts' shared **primary** group. Load-bearing: the egress rule acts on it. |
| `APP_USER_PREFIX` | Naming. |
| `APP_RUN_AS` | Override. |

The posture is **derived from the platform's own uid**, not declared.

## Artifact store

Names a backend, never a cloud. Unset means the capability is not offered.

`ARTIFACT_STORE` (`s3` \| `azblob` \| `local`) · `ARTIFACT_BUCKET` ·
`ARTIFACT_DIR` · `ARTIFACT_ENDPOINT` · `ARTIFACT_REGION` · `ARTIFACT_PREFIX` ·
`ARTIFACT_S3_PATH_STYLE` · `ARTIFACT_ACCOUNT` · `ARTIFACT_CONNECTION_STRING`

Credentials come from the ambient chain. See [The artifact
store](../../apps/artifact-store/).

## Isolated execution

**Exactly one backend may be configured.** `KUBE_NAMESPACE` and `ECS_CLUSTER` both
set is refused at startup.

**Kubernetes** · `KUBE_NAMESPACE` · `KUBECONFIG` · `KUBE_CONTEXT` · `CALLBACK_URL`

**ECS** · `ECS_CLUSTER` · `ECS_SUBNETS` · `ECS_SECURITY_GROUPS` ·
`ECS_EXECUTION_ROLE_ARN` · `ECS_TASK_ROLE_ARN` · `ECS_ASSIGN_PUBLIC_IP`

**Runner images** · `RUNNER_IMAGE_PYTHON` · `_NODE` · `_GO` · `_R` · `_STATIC` ·
`RUNNER_VERSION` · `RUNNER_PYTHON_VERSION` · `RUNNER_NODE_VERSION` ·
`RUNNER_R_VERSION`

Either backend also needs an artifact store, at least one runner image, and a
callback address a workload can resolve.

## App storage

**Cluster-backed** · `KUBE_STORAGE_CLASS` · `KUBE_S3FILES_STORAGE_CLASS` ·
`KUBE_STORE_CSI_DRIVER` · `KUBE_STORE_REGION`

**Shared mode** · `SHARED_STORAGE_ROOTS` — `name=/path[:ro]`, comma-separated. The
operator mounts; Toft mounts nothing.

**The signer's object store** · `STORE_BACKEND` (`s3` \| `azblob`) ·
`STORE_ENDPOINT` · `STORE_REGION` · `STORE_S3_PATH_STYLE` · `STORE_ACCOUNT` ·
`STORE_CONNECTION_STRING` · `STORE_UPLOADS`

**`STORE_BACKEND` is never derived from `ARTIFACT_STORE`.** Two different things
that both happen to be object storage.

## Build toolchain passthrough

Read from this process's environment and **beating the app's**:
`NPM_CONFIG_REGISTRY`, `UV_INDEX_URL`, `GOPROXY`, the registry credentials, the
proxy and CA variables, `GOTOOLCHAIN`, and the rest of the `GO*` family.

`TOFT_R_REPOS` is a dial, and is the largest single lever on R build times.

`GOOS` and `GOARCH` are **refused** rather than passed.

## Telemetry

`OTEL_EXPORTER_OTLP_ENDPOINT` is the master switch, and **absent means absent**. A
half-configured pipeline is refused at startup.

`OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` · `_METRICS_ENDPOINT` · `_PROTOCOL` ·
`_HEADERS` · `_CERTIFICATE` · `_TIMEOUT` · `OTEL_SERVICE_NAME` · `_NAMESPACE` ·
`_INSTANCE_ID` · `OTEL_RESOURCE_ATTRIBUTES` · `OTEL_TRACES_EXPORTER` ·
`OTEL_METRICS_EXPORTER` · `OTEL_METRIC_EXPORT_INTERVAL` ·
`OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE` · `OTEL_TRACES_SAMPLER` ·
`_SAMPLER_ARG` · `OTEL_RECORD_ENDUSER_ID` · `OTEL_DB_TRACE` ·
`TOFT_METRIC_APP_CARDINALITY_CAP` · `PROPAGATE_TRACE_TO_APPS`

**The scrape endpoint** · `METRICS_ADDR` · `METRICS_TOKEN`. A listener of its own,
never a path on `:8080`.

## Outbound services

| | |
|---|---|
| `PRESENCE_ENDPOINT` | [Reachability](../../security/reachability/). Absent means absent. |
| `LICENSE_ENDPOINT` | Compiled in with nothing that overrides it; a private address is refused. |
| `BLOCK_AWS_METADATA` | Stops apps reaching instance and task IAM credentials. **Set it.** |

## Development only

Not part of any install. The [checks page](../../operate/checks/) says the first
two out loud off loopback.

`DEV_INSECURE_COOKIES` · `DEV_PASSWORD` · `TEST_DATABASE_URL` ·
`TEST_S3_ENDPOINT` · `TEST_AZURITE_ENDPOINT`

## `.env`

Loaded at startup, so a value in `.env` reaches configuration. Convenient on one
box; a secret store is better anywhere else.
