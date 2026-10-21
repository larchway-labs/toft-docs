---
title: Exit codes
description: What each toft exit code means, and which ones are worth retrying.
---

| Code | Meaning | Retry? |
|---|---|---|
| `0` | It worked. | |
| `1` | The platform did the thing and it failed: a failed build, a failed job run, a `toft check` that found a problem, a `toft fetch` or `--verify` that got an error page. | No. Fix the cause. |
| `2` | Usage or configuration: a bad flag, no app linked, a refused prompt. | No. Fix the command. |
| `3` | Not authenticated, or refused: no key, an expired or read-only key, a license limit. | No. Fix the credential. |
| `4` | The install could not be reached. | Yes. |

## Cases that land on 2

These exit 2 because nothing was attempted:

- **A locked app.** An administrator or the dependency policy locked it. Nothing
  was built.
- **A name that does not resolve**, such as `toft job run <unknown>`.
- **A path matching no route** in `toft api` (`route_not_found`).
- **A confirmation nothing could answer**, in CI or with stdin redirected.
- **A token without `TOFT_URL`**, or both `TOFT_TOKEN` and `TOFT_TOKEN_FILE`.

## Cases that land on 3

| Code in the error | What happened |
|---|---|
| `key_expired` | Run `toft login` to replace the key. |
| `key_read_scope` | The key can read but not write. Mint a full key. |
| `deny_system_role` | Your account is a viewer; deploying needs the publisher role. Ask an administrator. |
| `tier_limit` | A license limit on the install. Nothing already deployed has stopped. |

## A run's outcome is the exit code

`toft job run` and `toft task run` wait by default, and exit with the run's
outcome:

```bash
toft job run nightly-report --param region=emea   # exits 1 if the job fails
```

A task run that was `skipped` exits 1. The exit code is the same with `--json`.

## Restart with `--wait`

`toft restart --wait` exits 0 for `running`, `sleeping` or `ready`, and 1 for
`crashed` or `failed`. Without `--wait`, exit 0 means only that the install
accepted the request.

## Errors as JSON

With `--json`, a refusal also writes one object to stdout. The sentence still
goes to stderr.

```json
{"error":"that key has expired","kind":"auth","code":"key_expired","exit":3,
 "retryable":false,"hint":"mint a new key — `toft login` replaces the stored one; retrying will not help"}
```

| Field | |
|---|---|
| `error` | The sentence, for a person. Don't match on it; the wording can change. |
| `kind` | `usage`, `auth`, `unreachable`, `locked` or `failed`. |
| `exit` | The exit code, repeated. |
| `code` | A stable name to branch on, such as `key_expired`, `app_locked` or `not_found`. Present whenever the install refused; absent for a refusal `toft` made itself, such as a bad flag. |
| `retryable` | Always present. Whether trying again could work. |
| `hint` | The next step in the install's words, when there is one. |

**Branch on `code` and `retryable`, not on the exit code alone.** `retryable`
is the install's decision: a `409 queue_full` is worth retrying, a `503` that
means the install is not configured for something is not. A refusal `toft` made
itself is retryable only when the install could not be reached.

When the install sends a `hint`, `toft` prints it under the sentence on stderr
too.

A failed deploy writes its result object instead, with no second document. So
does a failed `toft check`, `toft fetch` or `--verify`: the result already says
what went wrong.

The same fields are in the body of every refusal the API sends, so a script
using `toft api`, or the [app SDK](../../sdk/errors/), reads them the same way.
