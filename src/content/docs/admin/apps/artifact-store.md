---
title: The artifact store
description: Where built releases live so they outlive the machine.
---

By default a release is a directory under `APPS_DIR` on the platform's own disk.
An **artifact store** publishes it somewhere durable, so a restart can rehydrate
it.

**Unset means the capability is not offered** — releases stay local, the routes
say so, and nothing in the UI implies otherwise.

## When you need one

- The host's disk does **not** survive replacement: a container, an autoscaled
  instance, an ECS task.
- You run **isolated mode**. A workload in a cluster cannot read the platform's
  local `APPS_DIR`, so this is required rather than advisable.

## It names a backend, never a cloud

`ARTIFACT_STORE` is one of `s3`, `azblob` or `local`. **There is no `CLOUD`
variable anywhere** — the platform never works out which cloud it is on, and a
misspelling is refused at startup naming the three that exist.

```
# S3 or S3-compatible
ARTIFACT_STORE=s3
ARTIFACT_BUCKET=toft-releases
ARTIFACT_REGION=eu-west-1
ARTIFACT_ENDPOINT=          # only for MinIO or a self-hosted server
ARTIFACT_S3_PATH_STYLE=1    # required by MinIO and most compatible servers
ARTIFACT_PREFIX=releases/   # when the bucket is shared

# Azure Blob — ARTIFACT_BUCKET is the container
ARTIFACT_STORE=azblob
ARTIFACT_BUCKET=toft-releases
ARTIFACT_ACCOUNT=toftartifacts

# A local directory, for a box whose disk you trust
ARTIFACT_STORE=local
ARTIFACT_DIR=/var/lib/toft/artifacts
```

`ARTIFACT_STORE=azblob` without `ARTIFACT_ACCOUNT` is refused at startup.

## Credentials

From the **ambient chain**, not from variables you set here: an instance role on
EC2, a task role on ECS, workload identity on AKS, a managed identity on Azure.

That is the same posture the rest of the platform takes — the credential belongs
to the machine, not to the settings document.

The one exception is an emulator: `ARTIFACT_CONNECTION_STRING` exists for
Azurite, which ships a single well-known credential and has nothing to attach a
managed identity to.

## It is not the object store apps use

**`STORE_BACKEND` is a separate variable and is never derived from
`ARTIFACT_STORE`.** They are two different things that both happen to be object
storage:

| | Holds | Configured by |
|---|---|---|
| **Artifact store** | Toft's built releases | `ARTIFACT_*` |
| **App storage** | Your apps' own files | `STORE_*`, and a [storage resource](../../capabilities/storage/) |

Deriving one from the other would mean an install that gave apps object storage
and thereby also moved its releases into the same bucket. They are separate on
purpose.

## Backing it up

Whatever holds your artifacts is part of your backup, alongside Postgres. A
database that remembers a release the store no longer has is an app that cannot
start.
