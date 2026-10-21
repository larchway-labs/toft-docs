---
title: Command reference
description: Every toft command and flag. Run toft <command> --help for the same text in your terminal.
---

`toft <command> [arguments]`. Run `toft <command> --help` for a command's own
flags.

## Global flags

Every command accepts these.

| Flag | Effect |
|---|---|
| `--app <slug>` | Which app. Otherwise `TOFT_APP`, `.toft.toml`, then `toft.toml`. |
| `--install <url>` | Which install, by URL or alias. Otherwise the default from `toft login`. |
| `--json` | Machine-readable output on stdout, **one JSON document per line**. |
| `-q`, `--quiet` | No narration. The answer still goes to stdout. |
| `--yes` | Answer confirmations. Required when nothing can be asked. |
| `--no-color` | No color. `NO_COLOR` and `TERM=dumb` do the same. |

## All commands

| Command | Does |
|---|---|
| [`login`](#toft-login) | Sign this machine in to an install. |
| [`link`](#toft-link) | Record which app this directory deploys to. |
| [`create`](#toft-create) | Create an app and deploy this tree into it. |
| [`deploy`](#toft-deploy) | Bundle this directory and deploy it. |
| [`check`](#toft-check) | What a deploy of this directory would decide, without deploying. |
| [`redeploy`](#toft-redeploy) | Build the app again from its own repository. |
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
| [`job`](#toft-job) | Jobs, which run as their own process. |
| [`task`](#toft-task) | Scheduled tasks, which are HTTP requests to your app. |
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
| `--token-stdin` | Read a personal or deploy key from stdin. Put flags before the URL. |
| `--no-browser` | Print the approval URL instead of opening it. |

## `toft link`

`toft link <slug>`. Writes an `[app]` table into `toft.toml` after checking the
slug exists.

| Flag | |
|---|---|
| `--local` | Write `.toft.toml` instead, and offer to add it to `.gitignore`. |
| `--install <url>` | Write the per-install table `[app.installs."<url>"]`. |

## `toft create`

`toft create [dir]`. Claims a slug, so it names it and asks first.

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
| `--logs` | Stream the build log. |
| `--no-watch` | Return after starting; print the deployment id. |
| `--watch <deployID>` | Rejoin a deploy started earlier. |
| `--dry-run` | Check instead of deploying. The same as [`toft check`](#toft-check). |
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

## `toft check`

`toft check [dir]` sends the bundle `toft deploy` would send, and the install
answers with the decisions a deploy makes before it builds anything. Nothing is
deployed and nothing is recorded. `toft deploy --dry-run` is the same command.

It reports:

- what the app is: the framework and entry point;
- the language version it would get, and where the pin came from;
- how it would run, and the jobs `toft.toml` declares;
- anything in `toft.toml` that nothing reads;
- what unpacking the bundle removed;
- each problem that would refuse the deploy, with the same `reason` a failed
  deploy would carry (`unsupported_framework`, `manifest_invalid`,
  `runtime_version`).

It exits 0 when a deploy would get past these decisions and 1 when it would be
refused. The dependency policy, the build and the start are not checked: only a
deploy answers those, and the result lists them under `not_checked`. `--json`
returns the install's answer as it sent it.

The app must exist already, and the check is refused exactly where an upload
would be: without edit access, on a locked app, or on an install that does not
take uploaded bundles.

## `toft redeploy`

Builds from the repository the app names. Reads and uploads nothing from your
disk. Refused on an app created from an upload. Flags: `--logs`, `--no-watch`,
`--verify <path>`, `--verify-timeout <d>`.

## `toft rollback`

`toft rollback [<deployID>]` makes an earlier deployment current again. With no
argument, it rolls back to the previous successful deployment, and names it
before acting. Nothing is rebuilt. Flags: `--yes`, `--no-watch`, `--json`,
`--verify <path>`, `--verify-timeout <d>`.

## `toft status`

What is serving, since when, and from which branch and commit, with the serving
deployment's id on its `deployment` line. Shows `folder` for an app built from a
repository folder. Warns while code pushed with
`toft deploy` is serving on a repository-backed app. `--json` includes the
app's `url`.

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

It exits 0 for a 2xx or 3xx answer and 1 otherwise, so it works as the check that
a deploy works. `--json` returns one document: `url`, `status`, a few useful
`headers`, `body`, `bytes`, `truncated` and `elapsed_ms`.

```bash
toft fetch /api/health --expect 200
toft fetch /submit --method POST --data @form.json --header 'Content-Type: application/json'
toft fetch / --anonymous      # a private app answers 401: that is the app working
```

Your key is sent only to the install's address for apps, and the install removes
it before the request reaches your app. You never need the key in your shell, or
to work out the app's URL yourself.

## `toft apps`

The apps you can see. `--mine` lists only the ones you own.

## `toft logs`

| Flag | |
|---|---|
| `-f`, `--follow` | Keep printing new lines. |
| `--lines <n>` | Lines of history to start with. Default 100. |
| `--source <app\|platform>` | Only one voice. |
| `--since <t>` | RFC 3339, or a duration such as `2h`. |
| `--deploy <id>` | One build's log instead. Not combinable with `--source` or `--since`. |

## `toft events`

What the platform noticed going wrong, newest first: crashes, failed builds,
refused deploys. Run it after a restart that did not take.

Flags: `--since <t>`, `--severity <s>`, `--kind <k>`, `--limit <n>`.

## `toft deps`

The packages a deployment installed, the advisories against them, and the
versions that fix a refused deploy. The **Refused** and **Serving** lines each
name their `deployment <id>`. Needs edit access to the app. `--json` returns the
install's answer unaltered.

```bash
toft deps --json | jq '.refused.findings[] | {package, version, fixed_in, path}'
```

## `toft restart`, `start`, `stop`

`restart` and `start` are the same call: the platform starts a stopped app or
restarts a running one.

| Flag | |
|---|---|
| `--wait` | Wait until the app settles. `running`, `sleeping` or `ready` exits 0; `crashed` or `failed` exits 1. |
| `--wait-timeout <d>` | How long to wait. Default `2m`. |

Without `--wait`, exit 0 means only that the install accepted the request. A
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
toft env set --sensitive --restart API_TOKEN=s3cr3t
toft env unset --restart LOG_LEVEL
toft env list
```

Flags go before the variables: `toft env set --restart KEY=VALUE`, not after
them. A value is taken as typed, split on the first `=`. The app reads its environment
when it starts, so a change applies at the next restart; `--restart` does that
for you, and no redeploy is needed. Without it, `--json` says
`"restart_needed": true`.

A variable stays sensitive once it is marked so, even when you set it again
without `--sensitive`. Setting a sensitive variable to an empty value keeps the
stored one.

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
| `prune` | Delete every deployment except the serving one. Asks first. |
| `delete <id>` | Delete one. Asks first. |

A deleted deployment can no longer be rolled back to. The serving deployment, a
build still running and the deployment a rollback is returning to are never
deleted; the install skips them. `prune` and `delete` print how many were
deleted and the space freed; `--yes` answers the confirmation.

## `toft delete`

`toft delete <slug> --yes` deletes an app: every deployment, its environment
variables, schedules, grants and data. There is no undo.

The slug must be typed out. It is never taken from `toft.toml`, `.toft.toml` or
`TOFT_APP`, because a directory being linked to an app is no reason to delete
it. Without a terminal, `--yes` is required.

## `toft job`

| Subcommand | |
|---|---|
| `list` | The jobs this app defines, with schedule, zone and alert window. |
| `run <name>` | Start one and wait. The run's outcome is the exit code. |
| `runs` | Recent runs, with the instant each was for. |
| `logs <runID>` | What one run printed. |
| `cancel <runID>` | Stop a run that is still going. |

| Flag | |
|---|---|
| `--param k=v` | A parameter. Repeatable. Values are strings, never parsed. |
| `--for <time>` | The instant the run is for, e.g. `2026-10-06T03:00:00+01:00`. No offset means UTC. |
| `--no-wait` | Start and return the run id. |
| `--logs` | Stream the run's log while waiting. |
| `--timeout <d>` | How long to wait. Default: no limit. |
| `--follow` | With `logs`: keep reading. |
| `--limit <n>` | With `runs`: how many. |

See [Jobs](../../sdk/jobs/).

## `toft task`

| Subcommand | |
|---|---|
| `list` | The tasks this app schedules. |
| `create <name>` | Create one. Needs `--path`. |
| `edit <name>` | Change only the flags you name. |
| `delete <name>` | Remove one and its run history. Asks first. |
| `run <name>` | Fire one now and wait. `skipped` exits 1. |
| `runs <name>` | Recent runs. |
| `logs <runID> --task <name>` | What one run pushed. |

| Flag | |
|---|---|
| `--path </p>` | Path on your app, from its root. |
| `--schedule <cron>` | Five fields, UTC. Omit for an on-demand task; `--schedule ''` on `edit` removes it. |
| `--timezone <zone>` | Read the schedule in this zone, e.g. `Europe/London`. Repeat it whenever you pass `--schedule`. |
| `--method <verb>` | `GET` or `POST`. Default `GET`. |
| `--overlap <policy>` | `skip` or `allow` when the previous run is still going. |
| `--enabled` | Whether the schedule fires. Default true. |
| `--no-wait`, `--timeout <d>` | As for `job run`. |

A disabled task is refused by `run` with `schedule_disabled`. A batch app cannot
have tasks. `toft task` needs a personal key; a deploy key cannot use it. See
[Scheduled tasks](../../sdk/tasks/).

## `toft store`

Files in a store an administrator granted you, from outside the platform.

| Subcommand | |
|---|---|
| `ls` | What you can reach, and at what level. |
| `ls [-r] <store>[/<folder>]` | One level: folders, then files. `-r` lists everything beneath. |
| `cp [-r] <from> <to>` | Copy a file, or with `-r` a folder's contents, up, down or between stores. The store side is `toft://<store>/<path>`. |
| `mv [-r] <from> <to>` | Move or rename: copy, then delete each source once its copy has landed. |
| `mkdir <store>/<folder>` | Create an empty folder. |
| `rm [-r] <store>/<name>` | Delete a file, or with `-r` a folder and everything in it. Needs full access. `rm <store> <name>` also works. |
| `put <store> <file>` | Upload one file. `--as <name>` stores it under another name. |
| `get <store> <name>` | Download one file. `-o`, `--out <file>` names the local file. |

```bash
toft store cp -r ./out toft://reports/2026/march/     # upload a folder's contents
toft store cp -r toft://reports/2026/ ./reports        # download a folder
toft store mv toft://reports/draft.csv toft://reports/final.csv
toft store rm -r --yes reports/2025/
```

Flags for the tree commands: `-j <n>` transfers at once (default 4), `--force`
to let a download replace local files (otherwise it refuses before transferring
anything), and `--yes` to answer the confirmation `rm` and a local-to-store `mv`
ask for. A folder exists while something is in it; `mkdir` writes an empty
marker so an empty folder stays. A move that fails partway leaves both copies of
what it had not finished, never neither. A copy between two store paths passes
through your machine.

| Access level | Allows |
|---|---|
| `read` | Download and list. |
| `write` | Upload new files; never replace. |
| `overwrite` | Also replace existing files. |
| `full` | Also delete. |

Transfers go straight to the object store: an unreachable bucket is exit 4
naming that host. Deploy keys cannot use `toft store`.

## `toft sdk`

`toft sdk vendor` writes the install's SDK into this directory. Flags:
`--lang <go|python|node>`, `--dir <path>` (default `.toft`). See
[Vendoring it](../../sdk/vendoring/).

## `toft api`

`toft api <method> <path>`, for anything without a verb. `GET`, `POST`, `PATCH`,
`PUT` or `DELETE`, with the stored credential, which is never printed.

```bash
toft api GET apps                                   # same as /api/v1/apps
toft api PATCH /api/v1/apps/<id> --data @patch.json
cat body.json | toft api POST /api/v1/apps/<id>/cron --data @-
```

`--data` takes inline JSON, `@file`, or `@-` for stdin. A path without a leading
slash is relative to `/api/v1/`. The response body goes to stdout as the install
sent it.

| Exit | Meaning |
|---|---|
| 2 | No route matches the path (`route_not_found`). |
| 3 | Credential or permission refused. |
| 4 | Install unreachable. |
| 1 | Anything else, including 400 and 422. Read the body. |

:::tip[Windows]
Git Bash rewrites arguments that start with `/` into Windows paths. Use the
relative form, `toft api GET apps`, or set `MSYS_NO_PATHCONV=1`. The same applies
to `toft task create --path`.
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
apps; whether the install takes uploaded bundles, allows public apps and can run
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
