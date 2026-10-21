---
title: Files and scratch space
description: Ephemeral scratch for work in progress, and durable storage an administrator attaches to your app.
---

| | Scratch | Storage |
|---|---|---|
| Lifetime | Wiped on every start, restart and redeploy | Durable |
| Set up by | The platform, for every app | An administrator, per app |
| Use for | Uploads being processed, intermediate files | Reports, datasets, anything you keep |

## Scratch

```python
toft.scratch_dir("uploads")          # pathlib.Path, created if needed
```
```js
toft.scratchDir("uploads");
```
```go
dir, err := toft.ScratchDir("uploads")
```
```r
scratch_dir()                        # no subfolder argument in R
```

Per app, never backed up, never shared. `TMPDIR` points at the same place.
Off-platform it falls back to the system temp directory, so local runs work.

### One browser session's corner

```python
sid = request.headers.get("X-Toft-Session") or request.cookies.get("viewer_sid") or toft.new_session_id()
workdir = toft.session_scratch_dir(sid)
```
```js
toft.sessionScratchDir(sessionId);
toft.newSessionId();
```
```go
toft.SessionScratchDir(sessionID)
toft.NewSessionID()
```

The proxy sends a per-login id in `X-Toft-Session`. Anonymous visitors carry
none, so mint one with `new_session_id()` and keep it in your own cookie. Never
substitute a fixed string: every anonymous visitor would share one directory.
Shiny and Streamlit already separate sessions and don't need this.

## Storage

```python
toft.storage("reports").path                 # an attached volume or store, by name
toft.store("reports").put("nightly.parquet") # copy a file into a store
toft.mounts()                                # everything attached
```
```js
toft.storage("reports").path;
await toft.store("reports").put(file);
toft.mounts();
```
```go
m, err := toft.Storage("reports")            // m.Path
s, err := toft.Store("reports")
_, err = s.Put(localPath, "nightly.parquet")
all, err := toft.Mounts()
```
```r
storage("reports")$path
store_put(store("reports"), "report.parquet")
mounts()
```

Storage is resolved **by name**. The administrator decides what `"reports"`
points at, so the same code works in either execution mode and on another
install. Each one carries its `access` level: Python `read_only`, Node
`readOnly` (and `writable`), Go `ReadOnly()`.

A `.sqlite` or `.duckdb` file on an attached volume is opened directly at its path.

### A store, mounted or not

A store is also reached through Toft's signed URLs, whether or not it is
mounted. On an install with no cluster, that is the only way: the store has no
path, `.path` raises, and `put` tells you to use `upload`.

```python
s = toft.store("uploads")
s.upload("report.csv")                        # new files only, at write
data = s.download("report.csv")
link = s.url("report.csv", attachment=True)   # for a browser, valid 15 minutes
s.remove("report.csv")                        # needs full
page = s.list("2026/")                        # iterate it; .prefixes, .next_cursor
```
```js
const s = toft.store("uploads");
await s.upload(file);
const link = await s.url("report.csv", { attachment: true });
```
```go
s, err := toft.Store("uploads")               // s.Mounted() is false with no cluster
_, err = s.Upload(ctx, localPath, "")
link, err := s.URL(ctx, "report.csv", true)
```
```r
s <- store("uploads")
store_upload(s, "report.csv")
store_url(s, "report.csv", attachment = TRUE)
```

The bytes go straight between your app and the object store. Anyone holding a
link from `url` can read that file until it expires, so don't log one.

:::caution[R: write with store_put]
`file.copy()` onto a store mount creates an empty file and returns `FALSE`.
Use `store_put()`.
:::

### One name, attached twice

An administrator can attach one resource twice, for example its root read-only and
a folder writable. Both arrive under the same name; name the folder to pick one:

```python
toft.storage("drop", folder="backup")
```
```js
toft.storage("drop", { folder: "backup" });
```
```go
toft.StorageIn("drop", "backup")             // and toft.StoreIn
```
```r
storage("drop", "backup")
```

With no folder named, a name that matches two attachments raises and lists what
is attached. An empty folder (`""`) means the root.

### Rules

- **Absent, not empty.** Asking for a name nobody attached raises and names what
  is attached. `mounts()` with nothing attached returns an empty list.
- **An app's attachment and a person's grant are separate.** Your app having
  `"reports"` attached doesn't let you browse it, and your grant gives your app
  nothing. People use [`toft store`](../../cli/commands/#toft-store).
- **`put` never escapes the storage.** A name that is really a path outside it is
  refused, and so is a write to storage attached read only.
