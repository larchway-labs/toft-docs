---
title: Environment reference
description: Every environment variable Toft reads at startup, with its default, grouped by purpose.
---

Environment variables are read once, at startup; change one and restart. Most
apply only to the capabilities you configure: an unset variable means the
capability is absent, not dormant. A `.env` file in the working directory is
loaded too, without overriding variables already set.

Four are enough to start: `DATABASE_URL`, `JWT_SECRET`, `ENCRYPTION_KEY` and
`BASE_URL`.

For runtime settings, see the [settings reference](../settings/). The seven
values that exist in both places are the [operating
dials](../../config/operating-dials/).

:::note[Booleans]
On is `1`, `true`, `yes` or `on`; off is `0`, `false`, `no` or `off`, in any
case. Anything else stops startup. The `OTEL_*` and `PROPAGATE_TRACE_TO_APPS`
switches follow OpenTelemetry's conventions instead.
:::

## Server and addresses

| Variable | Default | What it does |
|---|---|---|
| `HOST` | `0.0.0.0` | Interface the platform listens on. |
| `PORT` | `8080` | Platform port. |
| `BASE_URL` | `http://localhost:8080` | The address people use. Callbacks and links are built from it. |
| `APPS_PORT` | `8081` | Apps listener: a separate origin, on purpose. |
| `APPS_BASE_URL` | — | Set only when apps are reached through a different hostname. |
| `TRUSTED_PROXY_CIDRS` | `127.0.0.1/32,::1/128` | Proxies whose `X-Forwarded-*` headers are believed. Set but empty trusts nothing. |
| `EXTRA_ORIGINS` | — | Extra browser origins trusted for writes; also where an OAuth sign-in may return to. |
| `LOG_FORMAT` | `text` | `text` or `json`. Never a setting. |
| `LOG_LEVEL` | `info` | An operating dial. |
| `DOCS_URL` | the public docs site | Where the [Documentation](../../capabilities/documentation/) links point. A mirror URL, or `off`. Toft adds the version folder. |

## Database and secrets

| Variable | Default | What it does |
|---|---|---|
| `DATABASE_URL` | — | Postgres. Toft owns and migrates the schema. |
| `JWT_SECRET` | — | Signs sessions. Under 32 bytes stops startup. |
| `ENCRYPTION_KEY` | — | The key new records are encrypted with. Required unless `ENCRYPTION_KEY_URI` is set. |
| `ENCRYPTION_KEY_OLD` | — | Retired keys, comma-separated, kept for reading. |
| `ENCRYPTION_KEY_URI` | — | A key-encrypting key in a KMS or Vault. No fallback when set. |
| `VAULT_TOKEN` | — | Vault authentication. Without it, Kubernetes auth is used. |
| `VAULT_K8S_ROLE` | `toft` | Vault role for Kubernetes auth. |
| `BOOTSTRAP_ADMIN_PASSWORD` | — | The built-in administrator's first password. Empty generates one, printed once at first boot. |

See [at-rest encryption](../../security/encryption/).

## Bootstrap sign-in

Providers are normally created in **Admin → Authentication**. These variables
define one provider so a fresh install has a way in. A provider defined here is
read-only in the API.

| Variable | Default | What it does |
|---|---|---|
| `OIDC_ISSUER` | — | Issuer URL. |
| `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET` | — | Client credentials. |
| `OIDC_PROVIDER_ID` | `sso` | Id in the callback path. |
| `OIDC_DISPLAY_NAME` | `Single sign-on` | Button label. |
| `OIDC_SCOPES` | — | Extra scopes. |
| `OIDC_ALLOWED_DOMAINS`, `OIDC_ALLOWED_EMAILS` | — | Who may sign in, by email domain or address. |
| `OIDC_DEFAULT_ROLE` | — | Role for a new account. |
| `OIDC_PERMITTED_LOGIN_GROUPS` | — | Only members of these groups may sign in. A sign-in with no group claim is refused when set. |
| `OIDC_GROUPS_CLAIM`, `OIDC_GROUPS_SEPARATOR` | — | Which claim carries groups, and how to split it. |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | — | GitHub OAuth. |

Register `{BASE_URL}/api/v1/auth/{OIDC_PROVIDER_ID}/callback` as the redirect URI.

## Hosting and builds

| Variable | Default | What it does |
|---|---|---|
| `APPS_DIR` | `./apps` | Releases. Resolved to an absolute path. |
| `LOGS_DIR` | `./logs` | App logs. |
| `JOB_RUN_DIR` | — | Shared mode: where each job run gets its own working folder and copy of the app's release. Unset, runs live under `APPS_DIR`. Point it at local disk when `APPS_DIR` is a network filesystem such as EFS, where copying a large release can take minutes per run. Needs room for the releases of all runs in progress at once. Toft creates it if missing; an existing directory is never changed, so it must already let other users pass through (mode `0711` or `1777`). |
| `CACHE_DIR` | `./data/cache` | Build cache. |
| `PORT_RANGE_START`, `PORT_RANGE_END` | `3100`, `3999` | Ports for shared-mode apps. Not a dial: changing it strands running apps. |
| `RUNTIME` | `pm2` | Process manager for shared mode. |
| `MAX_CONCURRENT_BUILDS` | `1` | An operating dial. |
| `AUTO_DEPLOY_POLL_INTERVAL` | `60` | Seconds. An operating dial; `0` starts no poller at all. |
| `BUILD_ALLOW_SCRIPTS` | off | Lets npm lifecycle scripts run. Not a dial: it decides what code a build executes. |
| `TOFT_R_REPOS` | Posit Package Manager | An operating dial; the biggest lever on R build time. |
| `GALLERY_CATALOG_URL` | `larchway-labs/toft-gallery` `catalog.json` | Where the [gallery](../../capabilities/gallery/) catalog is fetched from. Point it at a mirror. |

### Resource limits per app

Operating dials. Each has two spellings; set only one.

| Variable | Default |
|---|---|
| `APP_MEMORY_LIMIT_MB` / `APP_MEMORY_LIMIT_GB` | 512 MB |
| `APP_CPU_REQUEST_MILLICORES` / `APP_CPU_REQUEST_CORES` | 100m |
| `APP_CPU_LIMIT_MILLICORES` / `APP_CPU_LIMIT_CORES` | off |

Over the memory limit an app is killed; over a CPU limit it is only throttled.

### Toolchain passthrough

`NPM_CONFIG_REGISTRY`, `UV_INDEX_URL`, `GOPROXY`, `GOTOOLCHAIN`, the other `GO*`
variables, registry credentials, and proxy and CA variables pass from the
platform's environment into builds, overriding the app's own values. `GOOS` and
`GOARCH` are stripped; a Go app that sets them is refused.

## App process isolation (shared mode)

Without per-app accounts every app runs as the Toft user and can read the
platform database and other apps' secrets. The defaults turn them on when Toft
runs as root under PM2.

| Variable | Default | What it does |
|---|---|---|
| `APP_USER_PER_APP` | on as root | One OS account per app. Requires root. |
| `APP_USER_AUTOCREATE` | on as root | Create missing accounts at deploy. |
| `APP_USER_GROUP` | `toft-apps` | Shared primary group. The egress rule acts on it. |
| `APP_USER_PREFIX` | `toft-app-` | Account name prefix. An app runs as prefix + slug; when that is over 32 characters the slug is shortened and six characters of its hash added. |
| `APP_RUN_AS` | — | Run every app as this one account instead. |
| `BLOCK_AWS_METADATA` | off | Stops apps reaching instance and task IAM credentials. Set it on AWS. |
| `SHARED_STORAGE_ROOTS` | — | Storage for shared-mode apps: `name=/path[:ro]`, comma-separated. You mount; Toft mounts nothing. |
| `SHARED_STORAGE_GID_RANGE` | `62000-62999` | Group numbers for storage, as `low-high`. The numbers are kept in the database, so they survive a container replacement. Change it only if the host uses that range. |

## Artifact store

Required for isolated execution; unset, there is no artifact store. `s3` needs
`ARTIFACT_BUCKET`; `azblob` needs `ARTIFACT_BUCKET` (the container) and an
account. Credentials come from the ambient chain. See [the artifact store](../../apps/artifact-store/).

| Variable | What it does |
|---|---|
| `ARTIFACT_STORE` | `s3`, `azblob` or `local`. |
| `ARTIFACT_BUCKET`, `ARTIFACT_PREFIX` | Where releases go. |
| `ARTIFACT_DIR` | For `local`. Default `./data/artifacts`. |
| `ARTIFACT_ENDPOINT`, `ARTIFACT_REGION`, `ARTIFACT_S3_PATH_STYLE` | S3-compatible endpoints. Region falls back to `AWS_REGION`. |
| `ARTIFACT_ACCOUNT`, `ARTIFACT_CONNECTION_STRING` | Azure Blob. |

## Isolated execution

Configure exactly one backend; `KUBE_NAMESPACE` and `ECS_CLUSTER` together stop
startup. Either backend also needs an artifact store, at least one runner image,
and a `CALLBACK_URL` a workload can resolve.

| Variable | What it does |
|---|---|
| `KUBE_NAMESPACE`, `KUBECONFIG`, `KUBE_CONTEXT` | Kubernetes backend. |
| `ECS_CLUSTER`, `ECS_SUBNETS`, `ECS_SECURITY_GROUPS` | ECS backend; lists are comma-separated. |
| `ECS_EXECUTION_ROLE_ARN`, `ECS_TASK_ROLE_ARN`, `ECS_ASSIGN_PUBLIC_IP` | ECS task roles and networking. |
| `CALLBACK_URL` | Where a workload reaches the platform. |
| `RUNNER_IMAGE_PYTHON`, `RUNNER_IMAGE_NODE`, `RUNNER_IMAGE_GO`, `RUNNER_IMAGE_R`, `RUNNER_IMAGE_STATIC` | [Runner images](../../build/runner-images/), one per language. |
| `RUNNER_VERSION` | The runner contract version. Leave unset. |

## App storage (isolated mode)

| Variable | What it does |
|---|---|
| `KUBE_STORAGE_CLASS`, `KUBE_S3FILES_STORAGE_CLASS` | Storage classes for volumes: the default drive for each backing. |
| `KUBE_STORAGE_CLASSES` | Further drives, as `name[=backing]`, comma-separated. `=s3files` is required for an S3 Files class. |
| `KUBE_STORE_CSI_DRIVER`, `KUBE_STORE_REGION` | Object-store mounts. |
| `STORE_BACKEND` | `s3` (default) or `azblob`. Never derived from `ARTIFACT_STORE`. |
| `STORE_ENDPOINT`, `STORE_REGION`, `STORE_S3_PATH_STYLE` | S3-compatible signer. Region falls back to `KUBE_STORE_REGION`, then `AWS_REGION`. |
| `STORE_ACCOUNT`, `STORE_CONNECTION_STRING` | Azure Blob signer. |
| `STORE_UPLOADS` | Turns on `toft store put`: presigned uploads and downloads. Unset, the `/api/v1/store` routes do not exist. |

See [app storage](../../capabilities/storage/).

## Telemetry

`OTEL_EXPORTER_OTLP_ENDPOINT` is the master switch: unset, nothing is exported.
A half-configured pipeline stops startup. See [telemetry](../../capabilities/telemetry/).

| Variable | Default |
|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT`, `_TRACES_ENDPOINT`, `_METRICS_ENDPOINT` | — |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | `http/protobuf` |
| `OTEL_EXPORTER_OTLP_HEADERS`, `_CERTIFICATE`, `_TIMEOUT` | —, —, 10 s |
| `OTEL_SERVICE_NAME`, `OTEL_SERVICE_NAMESPACE`, `OTEL_SERVICE_INSTANCE_ID`, `OTEL_RESOURCE_ATTRIBUTES` | `toft`, —, —, — |
| `OTEL_TRACES_EXPORTER`, `OTEL_METRICS_EXPORTER` | `otlp` |
| `OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE` | `cumulative` |
| `OTEL_TRACES_SAMPLER`, `OTEL_TRACES_SAMPLER_ARG` | `parentbased_traceidratio` |
| `OTEL_METRIC_EXPORT_INTERVAL` | — |
| `OTEL_RECORD_ENDUSER_ID`, `OTEL_DB_TRACE`, `PROPAGATE_TRACE_TO_APPS` | off |
| `TOFT_METRIC_APP_CARDINALITY_CAP` | — |
| `METRICS_ADDR`, `METRICS_TOKEN` | — |

`METRICS_ADDR` opens a Prometheus scrape listener of its own, never a path on
`:8080`. `METRICS_TOKEN` without `METRICS_ADDR` stops startup.

## Development only

Not for any real install. **System checks** warns about the first two when the
install is not loopback-only.

`DEV_PASSWORD` · `DEV_INSECURE_COOKIES`

:::note[Not configurable]
The license and reachability services' addresses are compiled into the binary.
There is no variable for either.
:::
