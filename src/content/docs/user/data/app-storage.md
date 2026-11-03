---
title: Storage hub
description: Storage your organization already owns, reached by name — from your app, and from scripts and pipelines outside Toft with toft store. Which kind to ask for, and how your code finds it.
---

The storage hub is for files your app keeps: a database file, uploads,
reports, exports. It is storage your organization already owns — a bucket, a
file system, a disk — registered once and reached **by name**, so your code
never holds a bucket name or a cloud key. The same storage is reachable from
outside Toft: a CI job, a script on another server or your laptop reads and
writes it with [`toft store`](../../../cli/cli/commands/#toft-store), under a
grant, without a cloud credential.

An administrator creates storage. Your app asks for it in
[`toft.toml`](../../build/toft-toml/#storage), or an administrator — or someone
they made a delegate of that storage — attaches it in Toft.

:::note
Storage is optional. If your install has none configured, your app has none. Ask your administrator before designing around it.
:::

Files your app only needs while it works go in [scratch space](../../../cli/sdk/files/)
instead. Scratch is there for every app, and it is wiped on every restart.

## Which kind to ask for

| | **Volume** | **Object store** |
|---|---|---|
| What it is | A real file system | A folder in a bucket |
| Files can be | Appended to, renamed, locked | Read and written whole only |
| Use it for | SQLite and DuckDB, caches, working files | Datasets, model weights, exports, reports |

If your app keeps a database file, ask for a volume. An object store has no
append, no rename and no locking, so a database on one breaks.

## Access levels

The level is how the storage is attached to your app, not a permission your
code asks for. Storage attached read only can't be written to, whatever your
code does.

| Kind | Levels |
|---|---|
| Volume | **Read only** · **Read & write** |
| Object store | **Read only** · **Can add** (new files only) · **Read & write** (also replace and delete) |

Some object stores can't be attached at every level. Those levels aren't offered
when attaching.

## Find storage from your code

Look storage up by its name, never by its path, so the administrator can move it
without breaking your app. A name is lowercase letters, digits and hyphens, like
`sales-data`, and it never changes. On your app's **Overview**, each storage
under **Storage** has a **Code** section with these calls already written for
it, in Python, Node, R and Go.

```python
import toft

reports = toft.storage("reports")
(reports.path / "2026-08.csv").write_bytes(data)

toft.store("exports").put("summary.csv", "2026-08/summary.csv")  # copy a local file in

for m in toft.mounts():
    print(m.name, m.kind, m.path, m.access, m.folder)
```

A miss raises an error that lists what is attached. The Node, Go and R SDKs have
the same calls: see [Files and scratch space](../../../cli/sdk/files/).

On an install with no cluster an object store is not mounted, so it has no path.
Your app reaches it with the SDK's `upload`, `download`, `url`, `remove` and
`list` calls instead, which also work everywhere else, and from the app's jobs
as well as from the app itself.

### Where it appears

Your app and every one of its jobs see the same attached storage, in the
`TOFT_STORAGE` environment variable — JSON listing each one's name, kind,
level, folder and **path**. The SDK calls above read it for you. Read the path
from there rather than writing it into your code, because it depends on the
install:

- **On a cluster**, storage is mounted at the `path` in
  [`toft.toml`](../../build/toft-toml/#storage), or `/storage/<name>` (and
  `/storage/<name>/<folder>` for one folder) without one.
- **On an install with no cluster**, it is a folder under your app's own
  directory, and the path is somewhere else entirely.

`TOFT_STORAGE` is absent, not empty, when nothing is attached.

### Putting files on it from outside

To load data onto a volume or a store before your app runs — a reference
dataset, a seed database — use [`toft store`](../browsing-a-store/) from your
own machine: `toft store put <name> <file>`, or `toft store cp -r ./data
toft://<name>/`. You need a grant on the storage, which is separate from your
app's access (below). It works for every object store, and for every volume on
an install without a cluster. A volume on a cluster can be reached only by an
app that mounts it.

## One storage, attached twice

The same storage can be attached twice at different folders and levels, such as
the root read-only and a `drop` folder writable. Both share a name, so name the
folder:

```python
toft.storage("warehouse", folder="")      # the root
toft.storage("warehouse", folder="drop")  # the writable folder
```

## Your app's access and yours are separate

- **Attaching** gives your app a path.
- **A grant** gives a person access in the [storage browser and
  `toft store`](../browsing-a-store/).

Neither implies the other. Your app having `reports` doesn't let you browse it,
and your grant gives your app nothing — nor does it let you attach the storage
in `toft.toml`. Attaching needs a delegation from an administrator, to you or to
the app's owner; a `[[storage]]` entry naming storage you hold only a grant on
is refused with `storage_not_attachable_by_you`.

## Good to know

- **Changes reach your app on its next deploy or restart.** Storage never appears
  or disappears under a running app.
- **Removing storage never deletes files.** Detaching storage or deleting an app
  leaves the data in place.
- **On an install without a cluster, a volume needs a host directory set up by
  whoever runs Toft.** Without one, deploying an app with a volume attached is
  refused.
