---
title: Language notes
description: The SDK in Python, Node, Go and R — how each spells the same calls, and what R lacks.
---

One model, four spellings. The source for all four is published at
[larchway-labs/toft-sdk](https://github.com/larchway-labs/toft-sdk)
(Apache-2.0).

## Python

```python
import toft

toft.app.slug                               # properties, not methods
toft.app.can("email")
toft.data.update(lambda s: s.update(runs=s.get("runs", 0) + 1))
toft.notify.slack("done")
toft.jobs.start("reconcile", params={"month": "2026-03"})
toft.caller(request.headers).at_least(toft.ROLE_EDITOR)
toft.who(request.headers); toft.viewer(request.headers)
toft.scratch_dir("uploads"); toft.storage("reports").path
toft.run                                    # inside a job; None elsewhere
return toft.jobs.respond(run)               # answer a request that started a job
```

`snake_case`. Errors are `toft.ToftError` and its subclasses `VersionConflict`
and `QueueFull`, each with `code`, `retryable` and `hint`. No third-party
dependencies.

## Node

```js
import toft from "@larchway/toft";

toft.app.slug;                              // id and slug are properties
await toft.app.basePath();                  // the rest of toft.app is async
await toft.app.can("email");
await toft.data.update((s) => { s.runs = (s.runs ?? 0) + 1; });
await toft.notify.email({ to, subject, text });
await toft.jobs.start("reconcile", { params });
toft.caller(req.headers).atLeast(toft.ROLE_EDITOR);
await toft.who(req.headers); toft.viewer(req.headers);
toft.scratchDir("uploads"); toft.storage("reports").path;
toft.run;                                   // inside a job; null elsewhere
return toft.jobs.respond(run, req);         // a Fetch Response
```

ES module, Node 18 or later. From CommonJS, use `await import("@larchway/toft")`.
Network calls return Promises; `caller`, `viewer`, `run`, `storage`, `respond` and
the scratch helpers are synchronous. `RUN_STATUSES` is exported, the eight run
statuses `jobs.list` accepts.
`outputJson()` on output that is not JSON raises `not_json`, and a malformed
`TOFT_STORAGE` raises `storage_env_invalid`.

## Go

```go
import "toft"

self, err := toft.App.Self(ctx)
ok, err := toft.App.Can(ctx, "email")
doc, err := toft.Data.Update(ctx, bump)
send, err := toft.Notify.Slack(ctx, "done")
run, err := toft.Jobs.Start(ctx, "reconcile", toft.StartOptions{Params: params})
c := toft.CallerFor(r.Header)
me, err := toft.Who(ctx, r.Header); v, err := toft.ViewerFor(r.Header)
dir, err := toft.ScratchDir("uploads"); m, err := toft.Storage("reports")
toft.CurrentRun()                           // nil outside a job
toft.Jobs.Respond(w, r, run)
```

- `context.Context` first on anything that touches the network; `error` last.
- Options are structs: `toft.EmailMessage`, `toft.StartOptions`,
  `toft.SlackFileOptions`.
- `*toft.Error` carries the status, the platform's message, `Code()`,
  `Retryable()` and `Hint()`. Use `errors.As` for `*toft.QueueFullError` and
  `*toft.VersionConflictError`.
- Values read from `toft.Data` have been through JSON, so numbers are `float64`
  — in `Set`'s answer as in `Get`'s. `doc.Decode(&v)` reads the document into
  your own type exactly, an `int64` field getting the integer.
- No `require` line is needed: the build's `go.work` resolves the import. For
  local builds, see [Vendoring it](../../sdk/vendoring/).

## R

```r
library(toft)

app_info(); app_base_path()
app_data_get(); app_data_set(list(period = p), if_version = NULL)   # returns the document
app_data_update(function(s) { s$n <- (s$n %||% 0) + 1; s }); app_data_clear()
notify("slack", text = "done")
run <- job_start("reconcile", params = list(month = "2026-03")); job_respond(run, res, req)
caller_role(req$HEADERS); caller_can(req$HEADERS, "editor")
viewer(req$HEADERS)                         # who is looking, or NULL
scratch_dir(); mounts(); storage("reports"); store("drop", "backup")
store_put(store("reports"), "report.parquet")   # or store_put("reports", ...)
current_run(); run_progress(40, "loading")  # inside a job; $trigger, no started_by
```

Flat functions instead of objects, and a **smaller surface** than the other
three:

| Not in R | Use instead |
|---|---|
| `app.can()` | `app_info()` lists the capabilities. |
| Session scratch, subfolders of scratch | `scratch_dir()` only |

A refusal in R is a condition of class `toft_error`, with `e$code`,
`e$retryable` and `e$hint`. `viewer()` in R answers *who is looking* (like `who`
elsewhere). Write to a store
with `store_put()`, never `file.copy()`. Every `store_*()` function takes the
store or its name, and a name not mapped to the app is `not_mapped`.
`app_data_set()` and `app_data_update()` return the document, `list(data,
version, empty = FALSE)` — before 3 November 2026 they returned the version
number. `job_cancel()` returns the run read again.

## The same everywhere

- [Roles](../roles/) are verified identically, against shared test vectors.
- [App data](../../sdk/data/) is one document; `None` and `{}` differ.
- [Notifications](../../sdk/notify/) return a record, not a delivery.
- Inside a [job](../../sdk/jobs/), the instant the run is for and sending
  notifications work the same way.
- Off-platform, every call that needs the platform fails with `off_platform`,
  naming the missing variable.
- A refusal the SDK makes itself — a bad argument, a missing local file — is
  coded and never retryable.
- A refusal carries the same `code`, `retryable` and `hint`. See
  [When the platform says no](../../sdk/errors/).

Use the language your app is already written in. The SDK is not a reason to
switch.
