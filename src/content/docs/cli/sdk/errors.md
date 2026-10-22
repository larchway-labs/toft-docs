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
`set_result()`.

## Refusals the SDK makes itself

Some refusals never reach the platform, because the SDK can see the answer
first: a storage name nothing maps, a store that is reached over signed URLs
rather than a path, a level too low to write. They carry the same fields, with
`retryable` always false — a mapping or a name is wrong, and trying again
changes neither.

| `code` | When |
|---|---|
| `not_mapped` | No storage resource by that name is mapped to the app. |
| `ambiguous_mount` | One name is mapped twice (two folders) and no folder was named. |
| `not_mounted` | `.path` or `put` on a store that is not mounted here; use `upload`, `download`, `list`, `url`. |
| `insufficient_access` | A write through a mapping that does not allow it. |
| `already_exists` | An upload of a name that exists, at `write`. |
| `not_a_store` | A store-only call on a volume. |
| `invalid_name` | An empty name, an absolute one, or one with `.` or `..`. |
| `viewer_required` | `jobs.mine()` on the app acting as itself. |
| `no_viewer` | `viewer(headers)` on a request with nobody signed in — an API key, a health check, a local server. |
| `bad_request` | An argument the SDK rejects before sending: an email with no recipient, blank text, an empty send or session id, app data that is not an object. |
| `input_not_given`, `input_expired` | A job reading a payload it was never given, or after its link expired. |
| `no_output` | `write_output` in a run that has no output location. |
| `off_platform` | A variable the platform injects is missing — the code is running outside Toft. |

In R these are `toft_error` conditions like the platform's, with `e$status` `NA`.

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
