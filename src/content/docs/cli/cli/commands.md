---
title: Command reference
description: Every toft command and flag. Run toft <command> --help for the same text in your terminal.
---

`toft <command> [arguments]`. Run `toft <command> --help` for a command's own
flags.

Flags can go before or after the positional arguments, in every command:
`toft link my-app --local` and `toft login <url> --token-stdin` both read the
flag. After `--`, every word is an argument, whatever it looks like. A word a
command does not read is refused with exit 2, not ignored. A switch takes its value after `=`: write
`--enabled=false`, never `--enabled false`, which is refused.

## Global flags

Every command accepts these.

| Flag | Effect |
|---|---|
| `--app <slug>` | Which app. Otherwise `TOFT_APP`, `.toft.toml`, then `toft.toml`. |
| `--install <url>` | Which install, by URL or alias. Otherwise the default from `toft login`. |
| `--json` | Machine-readable output on stdout, **one JSON document per line**. |
| `-q`, `--quiet` | No narration. The answer still goes to stdout, and the reason an item of a `store` copy failed still goes to stderr. |
| `--yes` | Answer confirmations. Required when nothing can be asked. |
| `--no-color` | No color. `NO_COLOR` and `TERM=dumb` do the same, and so does output that is not a terminal. |
| `--session` | Act through the administrator session `toft login --password-stdin` stored, instead of the key. Never falls back to the key. See [The administrator's session](../signing-in/#the-administrators-session). |

In a terminal, `toft` draws its output for a person: tables have a header row,
statuses are colored badges (`● running`, `○ sleeping`, `✕ failed`), a deploy
ends in a summary box and an error starts with `✗`. Piped, redirected or in CI,
the same commands print plain lines with no color codes and errors start with
`toft:`. Scripts should read `--json` rather than either.

## All commands

| Command | Does |
|---|---|
| [`login`](#toft-login) | Sign this machine in to an install. |
| [`link`](#toft-link) | Record which app this directory deploys to. |
| [`create`](#toft-create) | Create an app and deploy this tree into it. |
| [`deploy`](#toft-deploy) | Bundle this directory and deploy it. |
| [`check`](#toft-check) | What a deploy of this directory would decide, without deploying. |
| [`redeploy`](#toft-redeploy) | Build the app again from its own source. |
| [`rollback`](#toft-rollback) | Make an earlier deployment current again. |
| [`status`](#toft-status) | What is serving, since when, and from what. |
| [`fetch`](#toft-fetch) | Request a path on the deployed app, as you. |
| [`apps`](#toft-apps) | The apps you can see. |
| [`logs`](#toft-logs) | The app's runtime log, or one build's. |
| [`events`](#toft-events) | What has gone wrong with this app. |
| [`deps`](#toft-deps) | What the dependency policy says about the app. |
| [`restart`, `start`, `stop`](#toft-restart-start-stop) | Lifecycle. |
| [`env`](#toft-env) | The app's environment variables. |
| [`visibility`](#toft-visibility) | Who may open the app. |
| [`deployments`](#toft-deployments) | The app's deployment history, and pruning it. |
| [`delete`](#toft-delete) | Delete an app. |
| [`job`](#toft-job) | Jobs: run, rerun, wait for and read the work your app declares in `toft.toml`. |
| [`store`](#toft-store) | Files in a durable store. |
| [`sdk`](#toft-sdk) | Write the install's app SDK into this directory. |
| [`api`](#toft-api) | Call the install's HTTP API with your stored credential. |
| [`whoami`](#toft-whoami) | Who you are on this install, and what it will let you do. |
| [`skill`](#toft-skill) | Print an agent skill written for this binary. |

## `toft login`

`toft login [<install-url>]`. See [Signing in](../signing-in/).

| Flag | |
|---|---|
| `--status` | Who this machine is signed in as, and where. |
| `--forget <install>` | Drop one stored credential. Does not revoke the key. |
| `--forget-all` | Drop every stored credential. |
| `--token-stdin` | Read a personal or deploy key from stdin. |
| `--password-stdin` | Sign in as the built-in administrator with a password from stdin; stores a session beside the key, used only with `--session`. |
| `--user <name>` | With `--password-stdin`. Default `admin`. |
| `--no-browser` | Print the approval URL instead of opening it. |

## `toft link`

`toft link <slug>`. Writes an `[app]` table into `toft.toml` after checking the
slug exists. If `toft.toml` already has an `[app]` table with no `slug`, the slug
is added to it. A table that already names a slug is refused (exit 2): edit it,
or use `--install`. A slug together with a different `--app` is refused (exit 2).

| Flag | |
|---|---|
| `--local` | Write `.toft.toml` instead, and offer to add it to `.gitignore`. |
| `--install <url>` | Write the per-install table `[app.installs."<url>"]`. |

## `toft create`

`toft create [dir]`. Claims a slug, so it names it and asks first.

The argument is a directory, not a name. `toft create my-app` with no `my-app/`
folder here exits 2 (`no_such_directory`) before anything happens, and suggests
`--app my-app`, which is how you set the slug.

**A slug you name is never renamed.** If the slug from `--app` or `toft.toml` is
taken, `create` exits 2 with `name_taken` and suggests `toft link <slug>` then
`toft deploy` if the app is yours. Only a slug taken from a folder or directory
name is made unique (`my-app-2`), and that is said.

With `--repo`, the repository and branch are checked before anything is created:
one that does not exist, or is private with no credential set, is refused with
`source_unavailable` and no app is left behind. A missing `--subdir` folder is
still found by the first build.

`--json` waits for the first build like `deploy --json`: progress lines, then one
result object with the deploy's exit code. With `--no-watch` it prints the app
document and returns.

| Flag | |
|---|---|
| `--app <slug>` | The slug. Otherwise `toft.toml`, then the folder or directory name. |
| `--name <name>` | Display name. Otherwise the slug. |
| `--repo <url>` | Create from a repository; bundles nothing. Not combinable with `[dir]`. |
| `--branch <branch>` | With `--repo`. Otherwise the default branch. |
| `--subdir <folder>` | With `--repo`: build this folder of the repository. The slug defaults to the folder's name. |
| `--execution-mode <m>` | `shared` or `isolated`, if the install lets you choose. |
| `--link` | Write the slug into `toft.toml` on success. |
| `--logs` | Stream the first build's log. |
| `--no-watch` | Return after starting; print the deployment id. |
| `--verify <path>` | Once the first deploy succeeds, request this path as you. See [`--verify`](#--verify). |
| `--verify-timeout <d>` | How long `--verify` retries a 5xx. Default `30s`. |

## `toft deploy`

`toft deploy [dir]`. Sends the working tree, uncommitted edits included. See
[Deploying](../deploying/).

| Flag | |
|---|---|
| `--logs` | Stream the build log. A step's build lines print before its ✓. |
| `--no-watch` | Return after starting; print the deployment id. With `--json`, one `{app, url, deployment_id}` object. |
| `--watch <deployID>` | Rejoin a deploy started earlier. The result reports the deploy's real duration. An id that names nothing exits 2. |
| `--dry-run` | Check instead of deploying. The same as [`toft check`](#toft-check), including in a directory with no app linked. |
| `--verify <path>` | Once it succeeds, request this path as you. See [`--verify`](#--verify). |
| `--verify-timeout <d>` | How long `--verify` retries a 5xx. Default `30s`. |

### `--verify`

`toft deploy`, `redeploy`, `rollback` and `create` take `--verify <path>`. Once
the platform says the deploy succeeded, `toft` requests that path on the app with
your credential, as [`toft fetch`](#toft-fetch) does, and exits 1 unless it
answers 2xx or 3xx.

```bash
toft deploy --verify /healthz
```

The platform's own readiness check only waits until the app answers something.
`--verify` asks whether the page you care about works. A 5xx or a refused
connection is retried for `--verify-timeout` (default `30s`), because a new
release can still be warming up. Any other answer, a 404 included, is final.

With `--json`, the result object gains a `verify` field: `path`, `status`, `ok`,
and the `body` when it failed. `--verify` cannot be combined with `--no-watch`.

A failed check does not undo the deploy: the new release is serving. The message
names `toft rollback --yes --app <slug>`, and under `--json` the `verify` object
carries it as `next`.

## `toft check`

`toft check [dir]` sends the bundle `toft deploy` would send, and the install
answers with the decisions a deploy makes before it builds anything. Nothing is
deployed and nothing is recorded. `toft deploy --dry-run` is the same command.

It reports:

- what the app is: the framework and entry point;
- the language version it would get, and where the pin came from;
- how it would run, and the jobs `toft.toml` declares, each with the timeout
  and memory a run of it will get and where each came from (`declared`,
  `install default`, `app limit` or `clamped`);
- anything in `toft.toml` that nothing reads;
- files that look like secrets, such as `.env`, which the bundle would carry,
  as a deploy warns about them;
- a `[jobs]` table on a static site, which has nothing to run a job in, as a
  refusal;
- a warning when `toft.toml` declares jobs and this install does not run jobs;
- what unpacking the bundle removed;
- each problem that would refuse the deploy, with the same `reason` a failed
  deploy would carry (`unsupported_framework`, `manifest_invalid`,
  `runtime_version`), and a `code` and `hint` where there is one: a job asking
  for more than the install allows is `limit_exceeds_ceiling`, and a key Toft
  no longer reads (`retries`, `viewer_runnable`, `enabled`, `[tasks]`) is
  `removed_key`.

It exits 0 when a deploy would get past these decisions and 1 when it would be
refused. `toft deploy` and `toft create` refuse the same tree at the upload,
with the same code, before anything is built — and a refused `toft create`
leaves no app and claims no name. (A tree Toft does not recognize at all is the
exception: the build's detect step reports it.) The dependency policy, the build and the start are not checked: only a
deploy answers those, and the result lists them under `not_checked`. `--json`
returns the install's answer as it sent it.

Warnings are full sentences, the same ones a deploy prints. Under `--json`,
`warnings` holds the sentences and `warning_details` holds one object per
warning: a `code` (`manifest_unread` for a `toft.toml` table nothing reads,
`limit_clamped` for a job an administrator's lowered ceiling caps), the
`table` for a `toft.toml` key, and the `message`. When `requires-python` chose
the Python version, `runtime.requires_python` says so. `job_limits` lists each job
with its `limits`: `timeout` and `memory`, each a `value`, its `source` and, when
clamped, what was `declared`.

It works before the app exists. With no app linked, or a slug nobody has
claimed yet, it checks the directory as a new app, as `toft create` would build
it, and says `a new app` where it would name the slug. So the usual order is
`toft check`, then `toft create`.

The check is refused exactly where the deploy would be. For an existing app:
without edit access, on a locked app, or on an install that does not take
uploaded bundles. For a new app: without the publisher role, with uploads off,
or at the license's app limit. A deploy key can run it.

## `toft redeploy`

Builds the app again from its own source: the repository it names, or, for an
app created from an upload, the source last uploaded to it. Reads and uploads
nothing from your disk. Refused on an uploaded app that has never deployed
successfully. Flags: `--logs`, `--no-watch`, `--verify <path>`,
`--verify-timeout <d>`.

## `toft rollback`

`toft rollback [<deployID>]` makes an earlier deployment current again. With no
argument, it rolls back to the newest successful deployment older than the one
serving, and names it before acting. Run it again and it goes further back; it
never goes forward. When nothing older exists, it exits 2 (`nothing_older`) and
names the newer deployment you could switch to. Naming a newer deployment
yourself works, and says `Switching … forward`. Nothing is rebuilt. When it succeeds it names the deployment now
serving, the one it restored, and `--json` returns it as `deployment_id`. The id
can be a [unique prefix](#deployment-ids). Flags: `--yes`, `--no-watch`, `--json`,
`--verify <path>`, `--verify-timeout <d>`.

## `toft status`

What is serving, since when, and from which branch and commit, with the serving
deployment's id on its `deployment` line. The `status` line says how long the app
has been in that state (`stopped for 3 minutes`). `since` is when this release
went live, and `built` is when it was built — after a rollback the two differ.
When the app is not running, the release line reads `release` rather than
`serving`. Shows `folder` for an app built from a repository folder. Warns while
code pushed with `toft deploy` is serving on a repository-backed app. A locked
app gets a `locked` line: who locked it, when, and their message. `--json`
includes the app's `url`, `serving_since`, `status_changed_at` and `lock`
(`null` unless locked).

## `toft fetch`

`toft fetch [path]` makes one request to the deployed app with your credential
and prints the status line, then the body. The path is from the app's root:
`toft fetch /healthz`. With no path it requests `/`.

| Flag | |
|---|---|
| `--method <verb>` | The request method. Default `GET`. |
| `--data <body>` | A request body. `@file` reads a file, `@-` reads stdin. |
| `--header 'K: V'` | A request header. Repeat for more. |
| `--max-body <n>` | Print at most `n` bytes of the body. Default `8192`; `0` prints all of it. |
| `--expect <code>` | Exit 1 unless the status is exactly this. |
| `--anonymous` | Send no credential, to see what a stranger sees. |
| `--timeout <d>` | How long to wait for the app's answer. Default `60s`. |

It exits 0 for a 2xx or 3xx answer and 1 otherwise, so it works as the check that
a deploy works. A path with a `.` or `..` segment (or `%2e`) is refused before
anything is sent, exit 2 `invalid_path`: a fetch stays inside the app. So is an
absolute URL (`https://…` or `//host/…`): `fetch` takes a path of the app, never
an address. The same goes for `--verify`. `--json` returns one document: `url`, `status`, a few useful
`headers`, `body`, `bytes`, `truncated` and `elapsed_ms`.

When the platform answers in the app's place, for an app that is stopped,
locked or crashed, `--json` names that state as `platform_page`, using the
key from the page's `X-Toft-Interstitial` header (such as `stopped` or
`deploy_failed`). A stopped app
exits 1 with `app is stopped — toft start --app <slug>` instead of the page.

```bash
toft fetch /api/health --expect 200
toft fetch /submit --method POST --data @form.json --header 'Content-Type: application/json'
toft fetch / --anonymous      # a private app answers 401: that is the app working
```

Your key is sent only to the install's address for apps, and the install removes
it before the request reaches your app. You never need the key in your shell, or
to work out the app's URL yourself.

Over a key, the app is told your role but not **who** you are: code that asks the
SDK who is looking answers nobody. `toft fetch --session` (after
[`--password-stdin`](../signing-in/#the-administrators-session)) sends the
request as a signed-in browser, so that code sees a name.

## `toft apps`

The apps you can see. `--mine` lists only the ones you own.

## `toft logs`

| Flag | |
|---|---|
| `-f`, `--follow` | Keep printing new lines, each one once, as it arrives. |
| `--lines <n>` | Lines of history to start with, in total across your app and the platform. Default 100. With `--deploy`, the last `n` lines of the build log, which is otherwise printed whole. Below 1 exits 2 (`invalid_lines`). |
| `--source <app\|platform>` | Only one voice. Applied before `--lines`, so `--lines 20 --source platform` is the last 20 platform lines. |
| `--since <t>` | RFC 3339, or a duration such as `2h`. |
| `--deploy <id>` | One build's log instead. Not combinable with `--source` or `--since`. The id can be a [unique prefix](#deployment-ids); one that names nothing exits 2. |

Color codes your app writes are kept on a terminal and removed when the output
is piped or redirected, or with `--no-color`, `NO_COLOR` or `TERM=dumb`.
`--json` lines are never altered.

## `toft events`

What the platform noticed going wrong, newest first: crashes, failed builds,
refused deploys. Run it after a restart that did not take.

Every time the app's process exits and is restarted, there is a **Restarted**
event (`app_restarted`) with the exit code when it is known, and the same line
in `toft logs --source platform`. A deploy or rollback you started that did not
finish is recorded too, without notifying anyone.

Flags: `--since <t>`, `--severity <s>`, `--kind <k>`, `--limit <n>`.

## `toft deps`

The packages a deployment installed, the advisories against them, and the
versions that fix a refused deploy. The **Refused** and **Serving** lines each
name their `deployment <id>`. Needs edit access to the app. `--json` returns the
install's answer unaltered. When the dependency policy is off on the install,
it says so and lists nothing: the install lists an app's packages only while the
policy is on.

```bash
toft deps --json | jq '.refused.findings[] | {package, version, fixed_in, path}'
```

## `toft restart`, `start`, `stop`

`restart` and `start` are the same call: the platform starts a stopped app or
restarts a running one, and the answer says which — `started` or `restarted`
(`action` under `--json`). A notebook, Quarto or R Markdown app serves the same
rendered pages after a restart, and the answer carries a note saying so: a
changed variable reaches the page at the next deploy.

| Flag | |
|---|---|
| `--wait` | Wait until the app settles. `running`, `sleeping` or `ready` exits 0; `crashed` or `failed` exits 1. |
| `--wait-timeout <d>` | How long to wait. Default `2m`. |

Without `--wait`, exit 0 means only that the install accepted the request.
`stop` on an app that is already stopped says `already stopped`, and `--json`
carries `"changed": false`. A
batch app has no service, so all three are refused with `no_service`.

## `toft env`

The app's environment variables.

| Subcommand | |
|---|---|
| `list` | Names, and the values that are not sensitive. |
| `set KEY=VALUE [...]` | Set one or more. Other variables are kept. |
| `unset KEY [...]` | Remove one or more. |

| Flag | |
|---|---|
| `--sensitive` | With `set`: store the values write-only. They are never shown again, here or on the Settings page. |
| `--restart` | With `set` or `unset`: restart the app afterwards. |

```bash
toft env set DATABASE_URL=postgres://db/app LOG_LEVEL=info
toft env set API_TOKEN=s3cr3t --sensitive --restart
toft env unset LOG_LEVEL --restart
toft env list
```

A value is taken as typed, split on the first `=`. Flags may go before or after
the variables.

A name is letters, digits and underscores, and does not start with a digit.
Names the platform sets itself — `PORT`, `HOST`, `BASE_PATH`, `TMPDIR`,
`VIRTUAL_ENV`, `R_LIBS_SITE` and its `TOFT_*` variables — cannot be set here.
Both refusals exit 2 before anything is sent (`invalid_env_name`,
`reserved_env_name`).

The app reads its environment when it starts, so a change applies at the next restart; `--restart` does that
for you, and no redeploy is needed. Without it, `--json` says
`"restart_needed": true`. A notebook, Quarto or R Markdown app is the
exception: it reads its environment when it is rendered, at deploy, so `toft
env set` says the next deploy (`toft redeploy`) applies the change to the page,
`--json` says `"redeploy_needed": true`, and a job sees it at its next start.

A variable stays sensitive once it is marked so, even when you set it again
without `--sensitive`. Setting a sensitive variable to an empty value keeps the
stored one, and `toft env set` says it was kept rather than set (`"kept"` under
`--json`); `toft env unset` removes it. A command that changed nothing says so
and promises no restart.

Under `--json`, `list` gives each row's `value` whenever it is shown, `""` for
an empty one, and `"sensitive": true` with no value for a sensitive one.

Changing variables needs edit access to the app. Without it, `list` shows names
but not values, and `set` and `unset` are refused with exit 3. A variable an
administrator attached through a credential cannot be set here; the refusal
(`key_from_credential`) names the credential that supplies it.

## `toft visibility`

```bash
toft visibility                    # print it
toft visibility authenticated      # change it
```

| Level | Who may open the app |
|---|---|
| `private` | Only people granted access. A new app starts here. |
| `authenticated` | Anybody signed in to this install. |
| `public` | Anybody, signed in or not. |

An install can refuse public apps, and so can its license; the refusal says
which. `--json` returns `app`, `visibility` and `changed`.

## `toft deployments`

| Subcommand | |
|---|---|
| `list` | Newest first. `*` marks the one serving. |
| `prune` | Delete every deployment except the serving one and those still needed. Asks first, and names each one it kept with the reason. |
| `delete <id>` | Delete one. Asks first. |

```bash
toft deployments delete 4f1a2b --yes   # a unique prefix is enough
```

A deleted deployment can no longer be rolled back to. The serving deployment, a
build still running, the deployment a rollback is returning to and one a job run
that has not finished will start from are never deleted: `prune` skips them and
prints a `kept <id>: <reason> — <remedy>` line for each (`kept` under `--json`),
and `delete <id>` on one of them is refused with the reason and what to do about
it — for a job's release, wait for the run or cancel it (`toft job wait`, `toft
job cancel`); the serving one is exit 3 (`deployment_protected`). An id that names
nothing exits 2. `list --json` returns the install's answer, with
`step_timings` as an object rather than a string holding one. `prune` and `delete` print how many were
deleted and the space freed; `--yes` answers the confirmation.

### Deployment ids

Wherever a command takes a deployment id (`toft deployments delete`,
`toft rollback` and `toft logs --deploy`), a unique prefix of six or more
characters is enough. Each of these exits 2 with a code:

| Code | |
|---|---|
| `invalid_id` | Fewer than six characters. |
| `not_found` | No deployment of this app starts with it. |
| `ambiguous_id` | It starts several deployments; the message lists them. |

## `toft delete`

`toft delete <slug> --yes` deletes an app: every deployment, its environment
variables, schedules, grants and data. There is no undo.

The slug must be typed out, as `toft delete <slug>` or with `--app <slug>`. It
is never taken from `toft.toml`, `.toft.toml` or `TOFT_APP`, because a directory
being linked to an app is no reason to delete it. Without a terminal, `--yes` is
required.

## `toft job`

Jobs are declared in `toft.toml`; `toft job` operates them. A run id may be the
eight characters `toft job runs` prints.

| Subcommand | |
|---|---|
| `list` | The jobs this app declares: schedule and zone, parameters, effective limits with their source, whether the schedule is paused, and where runs go. While the app is locked, each schedule reads *held by the app's lock* instead of a next firing (`held_by_lock` under `--json`). On a static app it says a static app runs no jobs. |
| `run` | With no job named: the jobs and their parameters, and how to run one. |
| `run <job>` | Start one and wait. The run's outcome is the exit code. |
| `rerun <runID>` | Run a finished run again, with the same parameters and the same instant it was for. Waits like `run`. A run still queued or running is refused with `run_still_open`. |
| `wait <runID>` | Wait for a run that has already started (by its schedule, the app, or an earlier `--no-wait`), with the same exit code as `run`. |
| `runs [job]` | Recent runs, of one job when named: status, who started it, when, and why it did not succeed, with the command to try next. |
| `runs <runID>` | One run in full: parameters, limits, peak memory, reason, and what to try next. |
| `logs <runID>` | What one run printed. |
| `cancel <runID>` | Stop a run that is still going. A run that already finished prints `already finished (<status>)` and exits 0; `--json` has `"changed": false`. |

| Flag | |
|---|---|
| `--param k=v` | A parameter. Repeatable. The install holds it to the job's declared type and choices and converts it, so `--param rows=500` arrives as a number. A required one left out is asked for when a terminal is attached. |
| `--for <time>` | The instant the run is for, e.g. `2026-10-06T03:00:00+01:00`; `2026-10-06` or `2026-10-06T03:00` are read as UTC. The run sees it as `TOFT_SCHEDULED_FOR`. |
| `--idempotency-key <k>` | Starts carrying the same key within 24 hours are one run. |
| `--no-wait` | Start and return the run id. |
| `--follow` | Stream the run's log while waiting; with `logs`, keep reading until the run ends. `--logs` is the same. |
| `--timeout <d>` | How long to wait. Default: as long as it takes. Running out exits 1 and the run carries on; the message names the `toft job wait` command that picks it up. |
| `--limit <n>` | With `runs`: how many. |
| `--json` | One document per line. A run that did not succeed prints the run, then the refusal. |

`run`, `rerun` and `wait` exit with the run's outcome: 0 for `succeeded`; 1 for
`failed`, `timed_out`, `out_of_memory`, `cancelled` or `skipped`, with the
state and its reason on the last line. A full queue (`queue_full`) is 1 too:
try again later. A parameter the job refuses (`param_required`, `param_type`,
`param_choice`) or a job the app does not declare (`no_such_job`) is 2, with a
hint naming the command to fix it.

Nothing is retried for you; `toft job rerun` is how you try again, and the new
run records which one it repeats (`rerun_of`).

`toft task` is gone. It exits 2 with `removed_command` and points at
`[jobs.<name>]` in `toft.toml`. See [Jobs](../../sdk/jobs/).

## `toft store`

Files in a store an administrator granted you, from outside the platform.

| Subcommand | |
|---|---|
| `ls` | What you can reach, and at what level. |
| `ls [-r] <store>[/<folder>]` | One level: folders, then files. `-r` lists everything beneath. |
| `cp [-r] <from> <to>` | Copy a file, or with `-r` a folder's contents, up, down or between stores. The store side is `toft://<store>/<path>`. |
| `mv [-r] <from> <to>` | Move or rename: copy, then delete each source once its copy has landed. Needs `full` at the source and `write` at the destination; without them it is refused before anything is copied (exit 3). |
| `mkdir <store>/<folder>` | Create an empty folder. |
| `rm [-r] <store>/<name>` | Delete a file, or with `-r` a folder and everything in it. Needs full access. `rm <store> <name>` also works. |
| `put <store> <file>` | Upload one file. `--as <name>` stores it under another name. |
| `get <store>/<name>` | Download one file. `get <store> <name>` also works. `-o`, `--out <file>` names the local file (`-o -` writes the file to stdout); `--force` replaces one that exists. |

```bash
toft store cp -r ./out toft://reports/2026/march/     # upload a folder's contents
toft store cp -r toft://reports/2026/ ./reports        # download a folder
toft store mv toft://reports/draft.csv toft://reports/final.csv
toft store rm -r --yes reports/2025/
```

Flags for the tree commands: `-j <n>` transfers at once (default 4; below 1 exits 2 `invalid_jobs`), `--force`
to let a download replace local files (otherwise it refuses before transferring
anything), and `--yes` to answer the confirmation `rm` and a local-to-store `mv`
ask for. A folder exists while something is in it; `mkdir` writes an empty
marker so an empty folder stays. A move that fails partway leaves both copies of
what it had not finished, never neither. A copy between two store paths passes
through your machine.

Every path `toft store` prints is written `toft://<store>/<path>`, and every
subcommand takes that form back, so you can copy any line into the next command.
Flags can go before or after the arguments. `ls --json` returns
`{"folders": [...], "objects": [...]}`, with `-r` too.

A **partitioned** store takes uploads only inside the folders that apps are
attached to. `toft store ls` lists those folders under the store, or says none
is attached yet; an upload anywhere else is refused (exit 3).

| Access level | Allows |
|---|---|
| `read` | Download and list. |
| `write` | Upload new files; never replace. |
| `full` | Also replace and delete. |

`rm` looks the store and the file up before it asks for confirmation, so a store
you cannot reach or a file that isn't there exits 2 (`not_found`), and a folder
without `-r` exits 2 (`is_a_folder`), rather than asking for `--yes`. The same
goes for `ls`, `get` and `put` on a store that names nothing you can reach, and
`get` of a file that isn't there. A refusal — your access level, or a
partitioned store's folders — exits 3. That includes `put` onto a name that
already exists when your access is `write`.

Transfers go straight to the object store: an unreachable bucket is exit 4
naming that host. Deploy keys cannot use `toft store`.

## `toft sdk`

`toft sdk vendor` writes the install's SDK into this directory. Flags:
`--lang <go|python|node|r>`, `--dir <path>` (default `.toft`). Under `--json`,
`sdk_version` is the version the SDK declares and `install_version` the
install's. See [Vendoring it](../../sdk/vendoring/).

## `toft api`

`toft api <method> <path>`, for anything without a verb. `GET`, `POST`, `PATCH`,
`PUT` or `DELETE`, with the stored credential, which is never printed.

```bash
toft api GET apps                                   # same as /api/v1/apps
toft api PATCH /api/v1/apps/<id> --data @patch.json
cat body.json | toft api POST /api/v1/apps/<id>/job-runs --data @-
```

`--data` takes inline JSON, `@file`, or `@-` for stdin. A path without a leading
slash is relative to `/api/v1/`. The response body goes to stdout as the install
sent it, a refusal's included: the exit code is still non-zero, and no second
`--json` document is added, so the install's `code` and `hint` are on stdout
either way.

It exits by the same rules as every other command:

| Exit | Meaning |
|---|---|
| 2 | No route matches the path (`route_not_found`), the route does not take that method (`method_not_allowed`), a 404, a 400, or a 409 `name_taken`. |
| 3 | Credential or permission refused, or any other 409: the app's state refused. |
| 4 | Install unreachable, including a proxy's 502, 503 or 504 page while the install restarts. |
| 1 | Anything else: a 5xx, a 422, or a 409 that means "wait", such as `deploy_queued` or `already_running`. Read the body's `code`. |

:::tip[Windows]
Git Bash rewrites arguments that start with `/` into Windows paths. Use the
relative form, `toft api GET apps`, or set `MSYS_NO_PATHCONV=1`.
:::

Prefer a real verb where one exists: it validates, confirms and explains.
Environment variables, visibility and old deployments have their own commands
now: [`env`](#toft-env), [`visibility`](#toft-visibility) and
[`deployments`](#toft-deployments). Tags are still reached through `toft api`.

A refusal's body always carries `error`, `code` and `retryable`, and `hint` when
there is a next step worth naming. See
[Errors as JSON](../exit-codes/#errors-as-json).

## `toft whoami`

Who this credential is and what the install will let it do, in one call. Run it
before the first deploy instead of learning each limit from a refusal.

```
$ toft whoami
ana@example.com  publisher  on https://toft.example.com
  credential    api_key laptop · full scope · does not expire
  create apps   yes
  uploads       allowed
  public apps   not allowed
  jobs          allowed
  new apps run  shared
  node          22, 20, 18
  python        3.13, 3.12, 3.11
Install 0.9.6.
```

It shows the credential's kind (`api_key` for a personal key, `deploy_key`, or
`session`), its name, scope and expiry; whether you can create
apps (a read-scoped key never can, and says `create apps no`); whether the install takes uploaded bundles, allows public apps and can run
jobs; and the language versions a new app is checked against. A deploy key can
run it. `--json` returns the install's answer under `capabilities`, beside
`install_url` and, for a person's credential, `user`.

## `toft skill`

Prints an [agent skill](../agents/) built into this `toft` binary, so the
instructions always match the commands it has. Needs no install and no
credential.

```bash
toft skill                                                # list them
toft skill toft-cli > ~/.claude/skills/toft-cli/SKILL.md
toft skill toft-sdk > ~/.claude/skills/toft-sdk/SKILL.md
```

`--json` returns the names, or `{name, content}` for one skill.
