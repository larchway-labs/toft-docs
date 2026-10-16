---
title: App data
description: One small JSON document every app can read and write, kept across restarts, redeploys and rollbacks.
---

Every app has one JSON document for small state that belongs to the app: saved settings, a last-run timestamp, a flag your app set itself. It needs nothing switched on.

| | |
|---|---|
| **Size** | Up to 256 KiB. |
| **Shape** | One JSON object. No keys, listing or queries. |
| **Lifetime** | Survives restarts, redeploys and rollbacks. |

```python
import toft

settings = toft.data.get() or {"period": "monthly"}
toft.data.set({**settings, "period": "weekly"})
```

`get()` returns `None` when nothing is stored, which is different from a stored `{}`. `clear()` removes the document and returns the app to storing nothing.

## Two writers

`set()` is last-write-wins. If a job and the web process both write, use `update()`: it reads, applies your change and writes back conditionally, retrying if someone else wrote in between.

```python
toft.data.update(lambda s: s.update(runs=s.get("runs", 0) + 1))
```

For explicit control, `read()` returns the document with its `version`, and `set(doc, if_version=v)` raises `toft.VersionConflict` if the stored version has changed. `if_version=0` means "only if nothing is stored".

## What it is not for

App data is not a database. Anything you need to search, or anything per user, belongs in a real database.

## In the UI

**Settings → Saved data** shows whether the app has saved anything, its size and when it changed. It never shows the contents. If your app saved something its own startup code cannot read, people who can edit the app can **Clear** it; a redeploy will not fix that.
