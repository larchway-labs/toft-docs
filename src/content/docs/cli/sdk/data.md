---
title: App data
description: One JSON document per app, up to 256 KiB, that survives restarts, redeploys and rollbacks.
---

Every app has **one JSON document**, up to 256 KiB. There are no keys, no
collections and no queries. Use it for a saved filter, a last-run timestamp, or
settings someone edited in your UI.

```python
doc = toft.data.get()                       # dict, or None
saved = toft.data.set({"period": p})        # returns the Document written
toft.data.update(lambda s: s.update(runs=s.get("runs", 0) + 1))
toft.data.clear()
```
```js
await toft.data.get();                      // object, or null
await toft.data.set({ period });
await toft.data.update((s) => { s.runs = (s.runs ?? 0) + 1; });
await toft.data.clear();
```
```go
doc, err := toft.Data.Get(ctx)              // map[string]any, nil if none
saved, err := toft.Data.Set(ctx, settings)
saved, err = toft.Data.Update(ctx, func(s map[string]any) (map[string]any, error) { … })
ok, err := toft.Data.Clear(ctx)
```
```r
doc <- app_data_get()                       # list, or NULL
version <- app_data_set(list(period = p))   # a named list
```

## Writes return what they wrote

`set` and `update` return a `Document` with `data`, `version`, `updated_at` and
`bytes`, so you don't need to read it back. (R's `app_data_set` returns the new
version.) `read()` returns the same `Document` for the current state.

## Two writers need `update`

`set` is last-write-wins. If a job and a web request both save, one change is
lost.

`update` reads the document, applies your function, and writes it back only if
the version is unchanged, retrying if someone else wrote in between. Your
function may change the document in place or return a replacement. It receives
`{}` when nothing is stored.

For a single conditional write, pass the version you read:
`set(doc, if_version=n)` in Python, `{ ifVersion }` in Node, `SetIf` in Go,
`if_version =` in R. A mismatch raises `VersionConflict`
(`*toft.VersionConflictError` in Go).

## Empty is not nothing

Nothing stored (never written, or cleared) reads as `None` / `null` / `nil` /
`NULL`. An empty object, `{}`, is a document the app wrote on purpose. Don't fold
one into the other.

## Not a database

The platform stores the bytes and never reads them: no schema, no indexing. It
is one document for the whole app, so anything per user or anything you need to
search belongs in a real database.
