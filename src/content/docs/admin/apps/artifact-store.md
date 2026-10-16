---
title: The artifact store
description: Where built releases are published so they outlive the machine — S3, Azure Blob or a local directory.
---

By default a release is a directory under `APPS_DIR`. An **artifact store**
publishes it somewhere durable, so a restart can rehydrate it. Unset, releases
stay local and nothing in the UI suggests otherwise.

## When you need one

- The host's disk does not survive replacement — a container, an autoscaled
  instance, an ECS task.
- You run **isolated mode**. A workload in a cluster cannot read `APPS_DIR`, so
  the store is required.

## Configuration

`ARTIFACT_STORE` names a backend: `s3`, `azblob` or `local`. Any other value is
refused at startup. There is no `CLOUD` variable.

```bash
# S3 or S3-compatible
ARTIFACT_STORE=s3
ARTIFACT_BUCKET=toft-releases
ARTIFACT_REGION=eu-west-1
ARTIFACT_ENDPOINT=          # MinIO or a self-hosted server only
ARTIFACT_S3_PATH_STYLE=1    # MinIO and most compatible servers
ARTIFACT_PREFIX=releases/   # when the bucket is shared

# Azure Blob — ARTIFACT_BUCKET is the container; ARTIFACT_ACCOUNT is required
ARTIFACT_STORE=azblob
ARTIFACT_BUCKET=toft-releases
ARTIFACT_ACCOUNT=toftartifacts

# A local directory you trust
ARTIFACT_STORE=local
ARTIFACT_DIR=/var/lib/toft/artifacts
```

**Credentials come from the ambient chain** — an EC2 instance role, an ECS task
role, AKS workload identity, an Azure managed identity. The one exception is
`ARTIFACT_CONNECTION_STRING`, for the Azurite emulator.

## Not the apps' object store

| | Holds | Configured by |
|---|---|---|
| **Artifact store** | Toft's built releases | `ARTIFACT_*` |
| **App storage** | Apps' own files | `STORE_*` and a [storage resource](../../capabilities/storage/) |

`STORE_BACKEND` is never derived from `ARTIFACT_STORE`.

:::caution[Back it up]
Back up the artifact store with Postgres. A release the database remembers and
the store has lost is an app that cannot start.
:::
