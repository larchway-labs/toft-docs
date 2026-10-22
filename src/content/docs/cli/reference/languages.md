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

await toft.app.slug();                      // every toft.app call is async
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
the scratch helpers are synchronous.

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
- Values read from `toft.Data` have been through JSON, so numbers are `float64`.
- No `require` line is needed: the build's `go.work` resolves the import. For
  local builds, see [Vendoring it](../../sdk/vendoring/).

## R

```r
library(toft)

app_info(); app_base_path()
app_data_get(); app_data_set(list(period = p), if_version = NULL)
notify("slack", text = "done")
run <- job_start("reconcile", params = list(month = "2026-03")); job_respond(run)
caller_role(req$HEADERS); caller_can(req$HEADERS, "editor")
viewer(req$HEADERS)                         # who is looking, or NULL
scratch_dir(); mounts(); storage("reports"); store("drop", "backup")
store_put(store("reports"), "report.parquet")
current_run(); run_progress(40, "loading")  # inside a job
```

Flat functions instead of objects, and a **smaller surface** than the other
three:

| Not in R | Use instead |
|---|---|
| `app.can()` | `app_info()` lists the capabilities. |
| `data.update()` | `app_data_set(..., if_version = n)` |
| Session scratch, subfolders of scratch | `scratch_dir()` only |

A refusal in R is a condition of class `toft_error`, with `e$code`,
`e$retryable` and `e$hint`. `viewer()` in R answers *who is looking* (like `who`
elsewhere). Write to a store
with `store_put()`, never `file.copy()`.

## The same everywhere

- [Roles](../roles/) are verified identically, against shared test vectors.
- [App data](../../sdk/data/) is one document; `None` and `{}` differ.
- [Notifications](../../sdk/notify/) return a record, not a delivery.
- Inside a [job](../../sdk/jobs/), the instant the run is for and sending
  notifications work the same way.
- Off-platform, every call that needs the platform fails, naming the missing
  variable.
- A refusal carries the same `code`, `retryable` and `hint`. See
  [When the platform says no](../../sdk/errors/).

Use the language your app is already written in. The SDK is not a reason to
switch.
