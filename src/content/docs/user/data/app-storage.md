---
title: App storage
description: Durable volumes and object stores an administrator attaches to your app, and how your code finds them.
---

App storage is for files: uploads, reports, exports. An administrator creates storage resources and attaches them to apps; you cannot attach one yourself.

:::note
Storage is optional. If your install has none configured, your app has none. Ask your administrator before designing around it.
:::

## Volumes and stores

| Kind | What it is | Access levels |
|---|---|---|
| **Volume** | A durable filesystem. | `read`, `write` |
| **Store** | An object store (a bucket), also mounted as a folder in your app. People with a grant can [browse it](../browsing-a-store/). | `read`, `write` (new files only), `overwrite`, `full` (also delete) |

The level is how the resource is mounted, not a permission your code asks for. A read-only mount cannot be written to, whatever your code does. Some backings cannot express every level; those levels are not offered when attaching.

## Find storage from your code

Look a resource up by the name your administrator gave it, never by its path, so the administrator can move it without breaking your app.

```python
import toft

reports = toft.storage("reports")
(reports.path / "2026-08.csv").write_bytes(data)

toft.store("exports").put("summary.csv", "2026-08/summary.csv")  # copy a local file in

for m in toft.mounts():
    print(m.name, m.kind, m.path, m.access, m.folder)
```

A miss raises an error that lists what is attached. The Node, Go and R SDKs have the same calls: see [the app SDK](../../cli/sdk/).

## One resource, two mounts

A resource can be attached twice at different folders and levels, such as the root read-only and a `drop` folder writable. Both share a name, so name the folder:

```python
toft.storage("warehouse", folder="")      # the root
toft.storage("warehouse", folder="drop")  # the writable folder
```

## Mappings and grants are separate

- A **mapping** attaches a resource to your app.
- A **grant** gives a person access to a store, or one folder of it.

Neither implies the other.

## Good to know

- **Browser uploads need CORS on the bucket.** Files go straight from the browser to the object store, so without CORS the upload fails in the browser and Toft never sees it.
- **Removing storage never deletes files.** Detaching a resource or deleting an app leaves the data in place.
- **Shared mode needs operator-declared roots.** On an install that runs apps as processes, durable storage works only from roots the operator declared (`SHARED_STORAGE_ROOTS`); otherwise attaching it is refused.
