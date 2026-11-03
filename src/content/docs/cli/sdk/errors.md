---
title: When the platform says no
description: Reading a refusal in each SDK — the code to branch on, whether to retry, and the hint to log.
---

When the platform refuses a call, the SDK raises an error carrying the platform's
own sentence and three fields beside it. **Branch on the fields, never on the
sentence**: the wording is for a person and can change.

| Field | Means | Python / Node | Go | R |
|---|---|---|---|---|
| `code` | A stable name: `queue_full`, `not_found`, `app_locked` | `err.code` | `err.Code()` | `e$code` |
| `retryable` | Whether trying again could work | `err.retryable` | `err.Retryable()` | `e$retryable` |
| `hint` | The next step, when there is one | `err.hint` (`None` / `undefined`) | `err.Hint()` (`""`) | `e$hint` (`NULL`) |

The status is there too (`err.status`, `Status`, `e$status`), and so is the
decoded body (`err.body`, `Body`, `e$body`), for refusals that carry figures
such as a full queue's limit. A current install always sends a `code`.

The same fields are on every refusal, whether it came from your app's own calls
or, inside a [job](../jobs/), from the run's calls such as `run.progress()` and
`write_output()`.

## Refusals the SDK makes itself

Some refusals never reach the platform, because the SDK can see the answer
first: a storage name nothing maps, a store that is reached over signed URLs
rather than a path, a level too low to write, a bad argument, a missing local
file, a call made off the platform. **They always carry a `code`, and
`retryable` is always false** — a mapping, a name or an argument is wrong, and
trying again changes none of them. Only a request that failed in transport,
never reaching the platform, comes back without a code and retryable, so a retry
loop cannot spin on a local mistake.

In R, a request that never got an answer is a `toft_error` too, with `code`
`""` and `retryable` `TRUE`, rather than curl's own condition. It is tried once
more before it is raised.

An **object store** that answers a signed URL with an error is coded as well,
with its HTTP status in the error: `output_unwritable` when writing a run's
output, `output_unreadable` when reading it back, and `store_refused` for any
`store` call. These are retryable only for a 429 or a 5xx.

| `code` | When |
|---|---|
| `not_mapped` | No storage resource by that name is mapped to the app — in every language and for every operation. The message lists what is mapped. The fix is a mapping on the app's Storage tab by an administrator, or a [`[[storage]]`](../../../user/build/toft-toml/#storage) entry in `toft.toml` from someone who may attach it; the SDK's sentence names only the first. |
| `ambiguous_mount` | One name is mapped twice (two folders) and no folder was named. The message names the call to make with the accessor you used — `store(…, folder=…)` or `storage(…, folder=…)`. |
| `not_mounted` | `.path` or `put` on a store that is not mounted here; use `upload`, `download`, `list`, `url`. |
| `insufficient_access` | A write through a mapping that does not allow it. |
| `already_exists` | An upload of a name that exists, at `write`. |
| `not_a_store` | A store-only call on a volume. |
| `invalid_name` | An empty name, an absolute one, or one with `.` or `..`. |
| `no_viewer` | `viewer(headers)` on a request with no viewer header — an API key, a health check, a local server — or `jobs.mine()` on the app acting as itself. The hint names starting the job as the app instead. (An anonymous visitor to a public app does carry one; a start in their name is refused by the platform, `viewer_anonymous`.) |
| `would_outlive_request` | `wait()` while serving a request, with no timeout or one past the request's deadline. The hint is `return toft.jobs.respond(run)`. |
| `wait_timeout` | `wait()` ran out of time before the run finished. Retryable: the run is still going. |
| `no_recipient` | An email that names nobody: pass an address in `to` (or `cc`, `bcc`). An email has no default recipient. |
| `bad_request` | An argument the SDK rejects before sending: blank text; an empty send id, session id or job name; a `jobs.list` status that is not one of the eight run statuses, or a `limit` out of range; `progress` outside 0–100; `app.can("")`; `access_token("")`; a body that is not JSON (`NaN` or `Inf` anywhere in it included, in all four languages, before any request is made); app data that is not an object (in R, anything but a named list); a scratch path outside the scratch folder; an email `to` that is not a string or a list of strings (`None` included) — a string that is not an address is sent, and the platform answers `bad_recipient`; an unreadable local file; in R also `store_put()` or a store call given no store. |
| `not_found` | A local file that is not there — an upload from a path that does not exist. |
| `no_output` | `write_output` in a run that has no output location. |
| `no_run` | An in-job call (R's `run_progress()`, `run_write_output()`) outside a job. |
| `off_platform` | A variable the platform injects is missing — the code is running outside Toft, or in a notebook or R Markdown render, which is a build step — or a run handle was made outside a job. Off the platform, `storage()` and `store()` raise this rather than `not_mapped`, in all four languages; set `TOFT_STORAGE` to stand a mount in locally. |
| `storage_env_invalid` | R and Node: `TOFT_STORAGE` is not valid JSON. |
| `not_json` | `output_json()` / `outputJson()` / `OutputJSON` / `job_output(json = TRUE)` on a run output that is not JSON, an output written empty included, in all four languages. A run that wrote no output at all answers `None` / `null` / `false` / `NULL` instead. |
| `write_failed`, `scratch_unavailable`, `entropy_unavailable` | Go: a local write failed, the scratch folder could not be made, or the system could not supply random bytes. |

In R these are `toft_error` conditions like the platform's, with `e$status` `NA`.

## Platform refusals worth handling

Each of these carries a `hint` naming the way out.

| `code` | When |
|---|---|
| `too_large` | 413. App data over 256 KiB (the body's `limit` is 262144), or a notification whose message or attachment is over the limit. |
| `params_too_large` | 413. Job parameters over 64 KB. The limit is in the body's `limit_bytes` (65536): Python `e.body["limit_bytes"]`, Node `err.body.limit_bytes`, Go `e.Body["limit_bytes"]` (a `float64`), R `e$body$limit_bytes`. Put the data in a store and pass its name. |
| `bad_recipient` | 400. An email address the platform will not send to — a `to` that is a string but not an address included. |
| `destination_not_allowed` | 400. A send that names a destination, such as a Slack `channel` or a folder. The app's owners choose it on the Integrations tab. |
| `sender_not_allowed` | 400. An email with `from`, `reply_to` or headers. |
| `<kind>_not_attached` | 403. The integration is not attached to this app, for example `email_not_attached` or `slack_not_attached`. |

## Should I retry?

Use `retryable`. It is the platform's decision, not a guess from the status: a
`409 queue_full` means "wait for a run to finish", which is worth retrying, while
a `503` that means "this install is not configured for that" never succeeds on a
retry. The SDK falls back to the status (429, and any 5xx except 501) only when
the platform said nothing, such as a network failure or a proxy's error page.

When the platform says how long to wait, the error carries it: `retry_after`
(Python, seconds), `retryAfter` (Node, seconds), `RetryAfter` (Go, a
`time.Duration`), `e$retry_after` (R, seconds).

The SDK retries once on its own, and only for a request that never reached the
platform's handler, such as a rate limit at the gateway. Any other retry, a
retryable `409` included, is your code's to make.

**Log the `hint`.** It is written for whoever reads the failure, and it is
usually the part they act on: "an administrator has to lift the lock", "mint a
new key".

## Python

```python
import time
import toft

try:
    toft.jobs.start("reconcile", params={"month": "2026-03"})
except toft.ToftError as err:
    log.warning("refused: %s (%s) %s", err, err.code, err.hint or "")
    if err.retryable:
        time.sleep(err.retry_after or 5)
        toft.jobs.start("reconcile", params={"month": "2026-03"})
    else:
        raise
```

`toft.QueueFull` and `toft.VersionConflict` are subclasses, so one `except
toft.ToftError` catches them too.

## Node

```js
import toft from "@larchway/toft";

try {
  await toft.jobs.start("reconcile", { params: { month: "2026-03" } });
} catch (err) {
  if (!(err instanceof toft.ToftError)) throw err;
  console.warn(`refused: ${err.message} (${err.code}) ${err.hint ?? ""}`);
  if (!err.retryable) throw err;
  await new Promise((r) => setTimeout(r, (err.retryAfter ?? 5) * 1000));
}
```

`ToftError` is also a named export: `import { ToftError } from "@larchway/toft"`.

## Go

```go
run, err := toft.Jobs.Start(ctx, "reconcile", toft.StartOptions{Params: params})
var terr *toft.Error
if errors.As(err, &terr) {
	log.Printf("refused: %v (%s) %s", terr, terr.Code(), terr.Hint())
	if terr.Retryable() {
		time.Sleep(max(terr.RetryAfter, 5*time.Second))
		run, err = toft.Jobs.Start(ctx, "reconcile", toft.StartOptions{Params: params})
	}
}
```

`errors.As` also reaches `*toft.QueueFullError` and `*toft.VersionConflictError`
for their extra fields.

## R

A refusal is a condition of class `toft_error`, so a handler for it catches the
platform's refusals and nothing else.

```r
library(toft)

tryCatch(
  job_start("reconcile", params = list(month = "2026-03")),
  toft_error = function(e) {
    message("refused: ", conditionMessage(e), " (", e$code, ") ", e$hint %||% "")
    if (isTRUE(e$retryable)) {
      Sys.sleep(e$retry_after %||% 5)
      job_start("reconcile", params = list(month = "2026-03"))
    } else {
      stop(e)
    }
  }
)
```

The message is the same one earlier versions raised, so code matching it keeps
working, but new code should read `e$code`.

## The same fields everywhere

The platform puts `error`, `code`, `retryable` and, where it has one, `hint` in
the body of every refusal its API sends. `toft` reads them in its
[`--json` errors](../../cli/exit-codes/#errors-as-json), and a script calling the
API with `curl` or `toft api` can read them the same way.
