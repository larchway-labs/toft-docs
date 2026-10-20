---
title: App storage
description: Storage resources, backings, grants and mappings — how files reach apps and people, and what is refused.
---

App storage gives apps files to read and write. Manage it in **Admin → Storage**.

## Four parts

| Part | What it is | Belongs to |
|---|---|---|
| **Resource** | A named store on this install | The install |
| **Backing** | Where the bytes live | The resource |
| **Grant** | Access to a folder for a person | A person |
| **Mapping** | A resource attached to an app, at a level and folder | An app |

A grant and a mapping never imply each other: granting yourself a folder does not
let an app read it, and attaching a resource to an app does not let you browse it.

## Kinds, backings and levels

| Kind | Backings | Levels |
|---|---|---|
| **volume** — durable filesystem | `efs`, `s3files`, `azurefiles`, `host` | `read`, `write` |
| **store** — object store | `mountpoint` (S3), `blob` (Azure) | `read`, `write`, `overwrite`, `full` |

- A level the driver cannot mount is **refused at attach**, never approximated. A
  `blob` store mounts only `read` and `full`; `write` and `overwrite` remain
  available over signed URLs (`toft store put`).
- A resource gets browser and signed-URL routes when it names a bucket or lives
  under a shared storage root.
- An `azurefiles` volume needs NFS 4.1 for an embedded database; the form says so,
  because the platform cannot check through the mount.

## Grants

- A grant narrows only by folder. Two grants on the same key combine to the wider level.
- **No admin bypass.** An administrator sees only folders granted to them; grant
  yourself access if you need to look (it is audited).
- Someone with no grant on the root sees the folders they were granted, not an empty store.

## Mappings

A mapping is unique by **(resource, app, folder)**, so one app can mount two
folders of one resource at different paths and levels. The SDKs then take the
folder — `toft.storage(name, folder=…)` in Python, and peers in the other
languages; asking by name alone when two mounts match is refused, naming both.

**Storage managers** may attach resources. A mapping records who wrote it, and
revoking a manager unmounts their mappings — the one permission change that
restarts a workload.

## Shared mode

Toft mounts nothing itself in shared mode. You mount the filesystem and declare
it:

```bash
SHARED_STORAGE_ROOTS=reports=/srv/toft/reports,archive=/srv/toft/archive:ro
```

A resource under a `:ro` root can only be mapped read-only. The **Storage**
check fails when a root's mount is gone or has turned read-only.

With no cluster there is nothing to mount a bucket with, but you can still offer
**object stores**. Set `STORE_UPLOADS=1` and grant the platform's credential
access to the bucket, and *Object store* appears as a kind. People browse it
with a grant, as anywhere else. Apps you map it to reach it through the SDK's
`upload`, `download`, `url`, `remove` and `list` calls, at the mapping's level.
The mapping's path is used only if the app later runs isolated.

A store needs no root, and a volume still does. Two apps mapped to one ordinary
volume share it.

### Partitioned volumes

Create a volume as **Partitioned** to give out one share by folder. Each app is
mapped to a folder, never the whole volume. Apps on the same folder share it and
can edit each other's files, and no other app can open it. A folder can't sit
inside another mapped folder, so `teams` is refused while `teams/sales` is mapped.
Partitioned is fixed when the volume is created, and needs every app to run under
its own account (`APP_USER_PER_APP`).

### Limits

An install holds at most **25** storage resources, and an app at most **5**
mappings. A partitioned volume's folders don't count against the 25, so one
partitioned share is the way to give many apps their own folder.

### People reaching a shared root

Grant someone a volume under a root and they reach it with `toft store` and the
Files page, with Toft carrying the bytes. What they upload belongs to the apps on
that folder, so those apps can edit and delete it. On a partitioned volume an
upload goes into a mapped folder, never beside one. Under a `:ro` root a grant is
`read` at most. It needs every app on its own account and the host's
`fs.protected_hardlinks` set to 1; the **Storage** check says which is missing.

## Things to know

| | |
|---|---|
| Names | A resource's slug is permanent; only its label can change |
| Browser uploads | Need **CORS on the bucket**. Without it the browser fails the upload and Toft never sees it |
| Audit | Records the signed URL being issued; on a shared root, also the file arriving |
| Deleting an app | Detaches its storage; **the data is kept** |
