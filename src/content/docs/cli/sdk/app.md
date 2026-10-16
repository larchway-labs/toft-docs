---
title: The app itself
description: Read the app's id, slug, mode and mount path, and ask what an administrator attached.
---

## Who am I

```python
toft.app.id, toft.app.slug, toft.app.name, toft.app.mode, toft.app.base_path
```
```js
await toft.app.slug();   // also id(), name(), mode(), basePath()
```
```go
self, err := toft.App.Self(ctx)   // self.ID, .Slug, .Name, .Mode, .BasePath
```
```r
info <- app_info()                # info$slug, info$base_path, ...
app_base_path()
```

:::caution[Node: these are async]
In Node, `toft.app.slug()` returns a Promise. Forget the `await` and a template
renders `[object Promise]`. In Python they are plain properties.
:::

The answer is fetched once and cached for the life of the process. Call
`toft.app.refresh()` (Go: `toft.App.Refresh()`) to re-read it.

### Base path

Your app is served under `/apps/<slug>`, and `base_path` is that prefix. Build
every link and form action from it. Redirects (`Location`) must not include it;
the proxy adds it. It falls back to the `BASE_PATH` variable, so it is never empty
on a mounted app. See [Environment variables](../../reference/environment/).

### Mode

`mode` is `shared` or `isolated` for **this** running workload, taken from the
deployment that started it. It is correct on the first request.

## What did an administrator attach

```python
if toft.app.can("email"): ...
```
```js
if (await toft.app.can("email")) { … }
```
```go
ok, err := toft.App.Can(ctx, "email")
```

`can()` takes an integration name (`email`, `slack`) or a full capability
(`email.send`). `toft.app.capabilities` lists everything attached.

Check at startup. An app that does can tell someone "email is not enabled for
this app" on a settings screen instead of failing later in a log.

A kind nobody attached is absent, not switched off. The fix is to ask an
administrator, not to retry.

R has no `can()`. `app_info()` includes the capabilities the install granted.

## What the app is not told

- Which channel, folder or address an integration points at. That belongs to
  the administrator.
- Whether a viewer is a Toft administrator, from the role alone. Use
  [`who`](../viewer/).
- Other people's group memberships.
