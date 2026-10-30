---
title: Exit codes
description: What each toft exit code means, and which ones are worth retrying.
---

| Code | Meaning | Retry? |
|---|---|---|
| `0` | It worked. | |
| `1` | The platform did the thing and it failed: a failed build, a failed job run, a `toft check` that found a problem, a `toft fetch` or `--verify` that got an error page. | No. Fix the cause. |
| `2` | Usage or configuration: a bad flag, an argument no command reads, no app linked, a refused prompt, a name that does not exist or is already taken. | No. Fix the command. |
| `3` | Not authenticated, or refused: no key, an expired or read-only key, a license limit, jobs switched off on the install, or the app's state, such as rerunning a run that has not finished or deleting the serving deployment. | No. Fix the credential, or the state. |
| `4` | The install could not be reached. | Yes. |

## Cases that land on 2

These exit 2 because nothing was attempted:

- **A locked app.** An administrator or the dependency policy locked it. Nothing
  was built.
- **A name that does not resolve**: `toft job run <unknown>` (`no_such_job`),
  an unknown run id in `toft job runs`, `rerun`, `wait` or `logs`, an unknown
  deployment id in `toft logs --deploy`, `toft deploy --watch` or
  `toft deployments delete`, or a store you cannot reach (`not_found`). A deployment id that is too short
  (`invalid_id`) or matches several (`ambiguous_id`) lands here too.
- **A name that is already taken** (`name_taken`): `toft create` with a slug
  you named (`--app`, `toft.toml`) that someone has claimed.
- **Nothing older to roll back to** (`nothing_older`): `toft rollback` with no
  argument when the serving deployment is the oldest successful one, or the
  only one.
- **A `.` or `..` segment in a `toft fetch` path, or an absolute URL**
  (`invalid_path`), with `--verify` too. Nothing is sent.
- **`toft logs --lines` below 1** (`invalid_lines`), and **`-j` below 1** on the
  store tree commands (`invalid_jobs`).
- **A parameter the job refuses**: a required one missing (`param_required`), a
  value of the wrong type (`param_type`) or not among its choices
  (`param_choice`). The hint is the command with the parameter filled in.
- **A `toft job run --param` with no name** (`=x`, `invalid_param`).
- **A `toft.toml` asking for something the install will not give**:
  `limit_exceeds_ceiling` for a job's timeout or memory above the
  administrator's ceiling, and `removed_key` for `retries`, `viewer_runnable`,
  `enabled` or a `[tasks]` table, at `toft check` and deploy.
- **`toft task`**, which is gone (`removed_command`). Declare `[jobs.<name>]` in
  `toft.toml` instead.
- **A word no command reads.**
- **A `toft.toml` that does not parse** (`manifest_invalid`).
- **A directory argument that is not a directory** (`no_such_directory`).
- **An environment variable name `toft env set` refuses**: not letters, digits
  and underscores (`invalid_env_name`), or one of `PORT`, `HOST`, `BASE_PATH`
  (`reserved_env_name`) — or a `--from-file` line that is not `KEY=VALUE`
  (`invalid_env_file`).
- **A path matching no route** in `toft api` (`route_not_found`), or a route
  that exists but not for that method (`method_not_allowed`) — whose hint names
  the method it takes.
- **A confirmation nothing could answer**, in CI or with stdin redirected.
- **A token without `TOFT_URL`**, or both `TOFT_TOKEN` and `TOFT_TOKEN_FILE`, or
  `TOFT_TOKEN` and `TOFT_URL` together with an `--install` that names an
  install too — drop one.

## Cases that land on 3

| Code in the error | What happened |
|---|---|
| `key_expired` | Run `toft login` to replace the key. |
| `key_read_scope` | The key can read but not write. Mint a full key. |
| `deny_system_role` | Your account is a viewer; deploying needs the publisher role. Ask an administrator. |
| `tier_limit` | A license limit on the install. Nothing already deployed has stopped. |
| `jobs_unavailable` | Jobs are switched off on this install, or there is nowhere to run them. An administrator's decision. |
| `run_still_open` | `toft job rerun` of a run still queued or running. `toft job wait` it first. |
| `deployment_protected` | `toft deployments delete` of the serving deployment. Roll back or deploy first. |
| `already_current` | The deployment you asked to make current is already serving. |
| `already_exists` | `toft store put` or `cp` onto a name that exists, when your access is `write`. Upload under another name, or ask for `full`. |

Any refusal of this kind, where the app's state rather than your credential says
no, has `"kind": "refused"` under `--json`, with the install's `code`.

## Cases that land on 1 because they are worth waiting for

Some refusals mean "not now" rather than "no", and exit 1: another deployment
is already queued for the app (`deploy_queued`), a run is already going
(`already_running`), or the job queue is full (`queue_full`). Wait, then run the
command again. `retryable` says which ones are worth retrying automatically.

## A run's outcome is the exit code

`toft job run`, `toft job rerun` and `toft job wait` wait by default, and exit
with the run's outcome: 0 for `succeeded`, 1 for `failed`, `timed_out`,
`out_of_memory`, `cancelled` or `skipped`.

```bash
toft job run nightly-report --param region=emea   # exits 1 if the job fails
```

The last line names the state and its reason, such as `timed out after 45m`,
because two of those states send you to different fixes. A run skipped by its
job's `overlap` rule did no work, so it exits 1 too. The exit code is the same
with `--json`.

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
| `kind` | `usage`, `auth`, `refused`, `unreachable`, `locked` or `failed`. |
| `exit` | The exit code, repeated. |
| `code` | A stable name to branch on, such as `key_expired`, `app_locked` or `not_found`. Present whenever the install refused, and on the exit-2 refusals `toft` makes itself that have a name, such as `manifest_invalid` or `no_such_directory`. Absent for a plain usage mistake, such as a bad flag. |
| `retryable` | Always present. Whether trying again could work. |
| `hint` | The next step in the install's words, when there is one. |

**Branch on `code` and `retryable`, not on the exit code alone.** `retryable`
is the install's decision: a `409 queue_full` is worth retrying, a `503` that
means the install is not configured for something is not. A refusal `toft` made
itself is retryable only when the install could not be reached, and not even
then when the host name does not resolve, because retrying will not fix a
misspelled address.

When the install sends a `hint`, `toft` prints it under the sentence on stderr
too.

A failed deploy writes its result object instead, with no second document. So
does a failed `toft check`, `toft fetch` or `--verify`: the result already says
what went wrong.

The same fields are in the body of every refusal the API sends. `toft api`
prints that body on stdout as it is, with no second document, so a script
using `toft api`, or the [app SDK](../../sdk/errors/), reads them the same way.
`toft api` exits by the same rules as every other command.
