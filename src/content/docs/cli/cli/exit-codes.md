---
title: Exit codes
description: What each toft exit code means, and which ones are worth retrying.
---

| Code | Meaning | Retry? |
|---|---|---|
| `0` | It worked. | |
| `1` | The platform did the thing and it failed: a failed build, a failed job run, a `toft check` that found a problem, a `toft fetch` or `--verify` that got an error page or the platform's own page in the app's place (a fetch the app answered with a failing status is `unexpected_status`). Also a wait that ran out (`wait_timeout`, `timeout`): the work carries on. | No, except a wait that ran out or a platform page whose state passes on its own (`retryable` says). |
| `2` | Usage or configuration: a bad flag, an argument no command reads, no app linked, a refused prompt, a name that does not exist or is already taken. | No. Fix the command. |
| `3` | Not authenticated, or refused: no key, an expired or read-only key, a license limit, jobs switched off on the install, or the app's state, such as rerunning a run that has not finished or deleting the serving deployment. | No. Fix the credential, or the state. |
| `4` | The install, or the app's address, could not be reached (`unreachable`). For `toft fetch`, `hostname_unresolved` means the app's own hostname has no DNS pointing at the install: fix the record, or `toft hostname --off`. | Yes, except `hostname_unresolved`. |

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
  you named (`--app`, `toft.toml`) that someone has claimed — and a hostname
  another app holds (`hostname_taken`). A slug you named that is not a slug at
  all is `invalid_slug`, from `toft check` as from `toft create`, and the
  message names the slug it would be.
- **An address that is not an install**: a `TOFT_URL` or `--install` that is
  not a URL (`invalid_url`), or a server that answers with a web page rather
  than Toft's API (`not_toft`).
- **No app linked** for `toft deploy` (`no_app`), which never creates one, and
  `toft link` into an `[app]` table that already names a slug
  (`app_already_named`).
- **Unattended `toft login <url>`** (`unattended_login`): with `--plain`,
  `TOFT_PLAIN`, `CI` set or stdin not a terminal, nobody can approve the browser
  sign-in. Use `--token-stdin` or `--password-stdin`.
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
- **A `toft job run --param` with no name** (`=x`, `invalid_param`), or
  parameters over 64 KB (`params_too_large`): put the data in a store and pass
  its name.
- **A `toft.toml` asking for something the install will not give**:
  `limit_exceeds_ceiling` for a job's timeout or memory above the
  administrator's ceiling, and `removed_key` for `retries`, `viewer_runnable`,
  `enabled` or a `[tasks]` table, at `toft check` and deploy.
- **`toft task`**, which is gone (`removed_command`). Declare `[jobs.<name>]` in
  `toft.toml` instead.
- **A word no command reads** (`unexpected_argument`), an unknown flag
  (`unknown_flag`), a flag written wrong (`bad_flag`), or an unknown command
  (`unknown_command`; `no_command` for a bare `toft --json`).
- **A flag value `toft` cannot read**: a duration such as `--since`,
  `--timeout` or `--wait-timeout` (`invalid_duration`), a time such as `--for`
  (`invalid_time`), or, in `toft api`, a `--data` that is not JSON
  (`invalid_json`) or a method that is not one (`invalid_method`).
- **Nothing to act on**: `toft login --forget` of an install with no stored
  credential (`no_credential`), `toft redeploy` of an uploaded app with nothing
  to rebuild from (`nothing_to_rebuild`), `toft sdk vendor --lang` of a language
  there is no SDK for (`sdk_language_unknown`), or `toft skill` of a name it
  does not have (`unknown_skill`).
- **`toft events --kind` or `--severity`** naming something the install does not
  record (`invalid_kind`, `invalid_severity`); the message lists the valid
  values.
- **`toft store` given a folder where a file was wanted** (`is_a_folder`), or
  a file's path to `ls` (`is_an_object`),
  `toft://` with no store (`no_store`), or `get -o - --json`
  (`conflicting_flags`). A `cp` or `mv` source that is not there is
  `not_found`, with `-r` as without it.
- **A download onto a file that exists**, without `--force` (`file_exists`):
  `toft store get` and `toft fetch -o` alike. `toft fetch -o` naming a
  directory is `is_a_directory`, and `-o - --json` is `conflicting_flags`.
- **A `toft.toml` that does not parse** (`manifest_invalid`).
- **A directory argument that is not a directory** (`no_such_directory`).
- **Nothing on stdin where something was asked for** (`empty_input`):
  `--token-stdin`, `--password-stdin`, `env set --from-file -`, and `toft fetch
  --data @-` or `toft api --data @-` with an empty pipe. A local file `toft`
  cannot read — a `--data @file`, an item of a `toft store` upload — is
  `unreadable_file`.
- **`toft apps --mine` with a deploy key** (`needs_personal_credential`): a
  deploy key belongs to nobody, so nothing is its own. Drop `--mine`, or use a
  personal key.
- **`toft skill install` with nowhere to write** (`no_agent_folder`): neither
  `~/.claude` nor `~/.agents` exists. Name a folder with `--dir`.
- **`toft create` with a deploy key and no `--owner-group`**
  (`owner_group_required`), checked before anything is uploaded, and an owner
  the install will not accept (`owner_group_empty`, `owner_is_viewer` and the
  rest of the `owner_*` codes).
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
| `invalid_key` | The install does not know this key: it was revoked, or minted on another install. Check `TOFT_TOKEN`, or run `toft login`. A credential that is not shaped like a Toft key at all — one that does not begin `toft` — gets the same refusal from `toft` itself, before anything is sent. |
| `key_read_scope` | The key can read but not write. Mint a full key. |
| `no_install` | No install named and none stored — `toft login` with no address included. Run `toft login <install-url>`, or set `TOFT_URL` and `TOFT_TOKEN`. |
| `deny_system_role` | Your account is a viewer, and creating an app needs the publisher role. Ask an administrator. |
| `deny_no_action` | Your role on this app does not allow that — you are its viewer, and deploying, rolling back, changing its settings, or reading its logs, events, process figures, serving release or job runs needs editor (whether the app is running or sleeping is every reader's). Ask its owner for editor (`toft api POST apps/<id>/access-requests --data '{"role":"editor"}'`). If your account is itself a viewer, it needs the publisher role first. |
| `deny_owner_only` | Deleting the app, changing who can see it and managing who has access are its owner's alone (or an administrator's), so no role you could ask for allows it — an editor is refused too. Ask the owner. |
| `deny_list_only` | You can see that this app exists but not open it. Ask its owner for access (`toft api POST apps/<id>/access-requests --data '{"role":"viewer"}'`, or `"editor"` to deploy to it). |
| `tier_limit` | A license limit on the install. Nothing already deployed has stopped. |
| `jobs_unavailable` | Jobs are switched off on this install, or there is nowhere to run them. An administrator's decision. |
| `run_still_open` | `toft job rerun` of a run still queued or running. `toft job wait` it first. |
| `deployment_protected` | `toft deployments delete` of the serving deployment. Roll back or deploy first. |
| `already_current` | The deployment you asked to make current is already serving. |
| `already_exists` | `toft store put` or `cp` onto a name that exists, when your access is `write`. Upload under another name, or ask for `full`. |
| `insufficient_access` | `toft store put` below `write`, `rm` below `full`, or an `mv` your levels do not allow. Ask an administrator for a higher level; `toft store ls` shows yours. |
| `idempotency_key_reused` | `toft job run --idempotency-key` with a key already used for a different job, parameters or `--for`. Use a new key. |

Any refusal of this kind, where the app's state rather than your credential says
no, has `"kind": "refused"` under `--json`, with the install's `code`.

## Cases that land on 1 because they are worth waiting for

Some refusals mean "not now" rather than "no", and exit 1: another deployment
is already queued for the app (`deploy_queued`), a run is already going
(`already_running`), the job queue is full (`queue_full` — its document
carries `in_flight`, `limit` and `retry_after`), or the store is pacing your
transfers (`store_busy`; `cp`, `mv` and `rm -r` retry it themselves). Wait, then run
the command again. `retryable` says which ones are worth retrying automatically.

A signal (Ctrl-C, SIGTERM) while `toft` was reading stdin exits 1 too, with the
code `interrupted`: nothing was sent.

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

`toft restart --wait` and `toft start --wait` exit 0 for `running`, `sleeping`
or `ready`, and 1 for `crashed` or `failed`. `toft start` of an app that is
already running exits 0 and restarts nothing (`already_running`). Without `--wait`, exit 0 means only that the install
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
| `code` | A stable name to branch on, such as `key_expired`, `app_locked` or `not_found`. Present whenever the install refused, and on the exit-2 refusals `toft` makes itself that have a name, such as `manifest_invalid` or `no_such_directory`. Usage mistakes have one too: `unknown_command`, `no_command`, `unknown_flag`, `bad_flag`, `unexpected_argument`. |
| `retryable` | Always present. Whether trying again could work. |
| `hint` | The next step. The install sends one when there is a step worth naming; every refusal `toft` makes itself carries one, at worst the command's own `--help`. |

**Branch on `code` and `retryable`, not on the exit code alone.** `retryable`
is the install's decision: a `409 queue_full` is worth retrying, a `503` that
means the install is not configured for something is not. A refusal `toft` made
itself is retryable only when the install could not be reached, and not even
then when the host name does not resolve, because retrying will not fix a
misspelled address.

When the install sends a `hint`, `toft` prints it under the sentence on stderr
too.

A failed deploy writes its result object instead, with no second document; it
carries a `code` (the install's, otherwise its `reason`, otherwise
`deploy_failed`) and `retryable: false`. So does a failed `toft check` or `--verify`: the result already says
what went wrong. Three cases write both: a `toft fetch` the app answered with a
failing status (the result, then a refusal coded `unexpected_status` whose hint
names `toft logs`), a `toft fetch` the platform answered in
the app's place (the result, then a refusal coded with the state, such as
`stopped` or `batch`), and a `toft job run` that did not succeed (the run, then
a refusal coded with how it ended). Each of those refusals carries a `hint`
with the next command: `toft start` for a stopped app, `toft job logs <id>` or
`toft job rerun <id>` for a run.

The same fields are in the body of every refusal the API sends. `toft api`
prints that body on stdout as it is, with no second document, so a script
using `toft api`, or the [app SDK](../../sdk/errors/), reads them the same way.
`toft api` exits by the same rules as every other command.
