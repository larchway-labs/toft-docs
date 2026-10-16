---
title: Exit codes
description: What each toft exit code means, and which ones are worth retrying.
---

| Code | Meaning | Retry? |
|---|---|---|
| `0` | It worked. | |
| `1` | The platform did the thing and it failed: a failed build, a failed job run. | No. Fix the cause. |
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
{"error":"that key has expired","kind":"auth","code":"key_expired","exit":3}
```

`kind` is one of `usage`, `auth`, `unreachable`, `locked`, `failed`. `code` is
the install's own and is present only when it sent one. A failed deploy writes
its result object instead, with no second document.
