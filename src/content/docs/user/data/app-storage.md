---
title: App storage
description: Durable volumes and object stores an administrator attaches to your app, which one to ask for, and how your code finds them.
---

App storage is for files your app keeps: a database file, uploads, reports,
exports. An administrator creates storage and attaches it to apps. You can't
attach it yourself unless an administrator made you a delegate of that storage.

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
and your grant gives your app nothing.

## Good to know

- **Changes reach your app on its next deploy or restart.** Storage never appears
  or disappears under a running app.
- **Removing storage never deletes files.** Detaching storage or deleting an app
  leaves the data in place.
- **On an install without a cluster, a volume needs a host directory set up by
  whoever runs Toft.** Without one, deploying an app with a volume attached is
  refused.
