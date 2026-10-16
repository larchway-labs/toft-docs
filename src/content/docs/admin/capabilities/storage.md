---
title: App storage
description: Resources, backings, grants and mappings — four things that are not each other.
---

App storage lets apps read and write files. It has four moving parts, and keeping
them distinct is most of understanding it.

## The four

| | What it is | Whose |
|---|---|---|
| **Resource** | A named store on this install | The install's |
| **Backing** | Where the bytes actually live | The resource's |
| **Grant** | Access to a folder, for a person | A person's |
| **Mapping** | An attachment of a resource to an app, at a level, at a folder | An app's |

**A grant is a person's and a mapping is an app's. Neither implies the other.**
Granting yourself a folder does not let any app read it, and attaching a resource
to an app does not let you browse it.

That surprises people once, and then it is obvious.

## Two kinds, six backings

| Kind | Backings |
|---|---|
| **volume** — a durable filesystem | `efs`, `s3files`, `azurefiles`, `host` |
| **store** — an object store | `mountpoint` (S3), `blob` (Azure) |

**A backing belongs to a kind**, and a root belongs to a file store. A resource has
a **data plane when it names a bucket**, never because it is called a store — the
browser routes are present or absent accordingly.

An `azurefiles` volume's copy carries the NFS 4.1 condition for an embedded
database, because the platform cannot see through a mount to check.

## A level the driver cannot express is refused

**Refused at attach, never approximated.** A `blob` store offers `read` and `full`
as mappings; `write` and `overwrite` are refused, naming the driver and where they
still work. No row is written.

On `azblob` a rung is a **SAS permission**, not a header, so `write` is
create-only and Azure itself refuses an overwrite.

A promise the platform cannot check is **copy on the form that makes the choice**,
not a silent assumption.

## Grants

**A grant narrows only by folder**, and a folder is what gets mounted. Resolution
is **union-of-max per key**: two grants combine to the wider level.

**There is no admin bypass.** A folder nobody granted you is not a row you can see,
and being an administrator does not change that. If you need to look inside, grant
yourself access — and the grant is audited.

A caller with no grant on the root is not told the store is empty: they get the
folders they were granted, listed as prefixes.

## A mapping's identity includes its folder

**One app can mount two folders of the same resource**, at two paths and two
levels — `(resource, app, folder)` is what makes a mapping unique, not
`(resource, app)`.

The app then has two mounts sharing one name, which is why the SDKs let an app
say *which* — `toft.storage(name, folder=…)` and its peers in the other
languages. An app asking for a name that matches two mounts without saying which
folder is refused, naming both.

## Who may attach

**A fourth fact and a fourth table**: storage managers. A mapping is stamped with
the authority that wrote it.

**Revoking a manager collects exactly those mappings and unmounts them** — which is
**the one permission change that restarts a workload**, because an unmount cannot
take effect in a running process. Every other permission change does not.

## Shared mode

**What shared mode refuses is storage with nowhere to put it.** The operator
mounts the filesystem; **Toft mounts nothing itself**.

```
SHARED_STORAGE_ROOTS=reports=/srv/toft/reports,archive=/srv/toft/archive:ro
```

A level is **which mount** an app gets, not a permission Toft applies — so a
resource under a `:ro` root can only be mapped read-only. **The URL is never more
generous than the mount.**

The checks page probes these roots and reads `fail` when a mount is gone or has
become read-only.

## Naming

**A resource's slug is its identity** and cannot be renamed. Only its label can. A
path is a name plus a trailing slash and goes through the same validator
everywhere.

## Two things that surprise people

**A browser upload needs CORS on the bucket.** Without it the upload fails in the
browser, and Toft never sees it — so **it is never reported as a failed
upload**. Configure CORS when you configure the bucket, and the refusal copy names
CORS when it can.

**The audit records the mint, never the landing.** You can see that a signed URL was
issued. Whether the file arrived is the object store's record.

## Deleting an app

Detaches its storage. **It does not delete the data.**
