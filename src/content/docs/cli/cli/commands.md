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
| [`redeploy`](#toft-redeploy) | Build the app again from its own repository. |
| [`rollback`](#toft-rollback) | Make an earlier release current again. |
| [`status`](#toft-status) | What is serving, since when, and from what. |
| [`apps`](#toft-apps) | The apps you can see. |
| [`logs`](#toft-logs) | The app's runtime log, or one build's. |
| [`events`](#toft-events) | What has gone wrong with this app. |
| [`deps`](#toft-deps) | What the dependency policy says about the app. |
| [`restart`, `start`, `stop`](#toft-restart-start-stop) | Lifecycle. |
| [`job`](#toft-job) | Jobs, which run as their own process. |
| [`task`](#toft-task) | Scheduled tasks, which are HTTP requests to your app. |
| [`store`](#toft-store) | Files in a durable store. |
| [`sdk`](#toft-sdk) | Write the install's app SDK into this directory. |
| [`api`](#toft-api) | Call the install's HTTP API with your stored credential. |

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

## `toft deploy`

`toft deploy [dir]`. Sends the working tree, uncommitted edits included. See
[Deploying](../deploying/).

| Flag | |
|---|---|
| `--logs` | Stream the build log. |
| `--no-watch` | Return after starting; print the deployment id. |
| `--watch <deployID>` | Rejoin a deploy started earlier. |

## `toft redeploy`

Builds from the repository the app names. Reads and uploads nothing from your
disk. Refused on an app created from an upload. Flags: `--logs`, `--no-watch`.

## `toft rollback`

`toft rollback [<deployID>]`. With no argument, rolls back to the previous
successful release, and names it before acting. Nothing is rebuilt. Flags:
`--yes`, `--no-watch`.

## `toft status`

What is serving, since when, and from which branch and commit. Shows `folder`
for an app built from a repository folder. Warns while code pushed with
`toft deploy` is serving on a repository-backed app. `--json` includes the
app's `url`.

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

The packages a release installed, the advisories against them, and the versions
that fix a refused deploy. Needs edit access to the app. `--json` returns the
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
| `ls [-r] <store>[/<folder>]` | One level: folders, then objects. `-r` lists everything beneath. |
| `cp [-r] <from> <to>` | Copy a file, or with `-r` a folder's contents, up, down or between stores. The store side is `toft://<store>/<path>`. |
| `mv [-r] <from> <to>` | Move or rename: copy, then delete each source once its copy has landed. |
| `mkdir <store>/<folder>` | Create an empty folder. |
| `rm [-r] <store>/<name>` | Delete an object, or with `-r` a folder and everything in it. Needs full access. `rm <store> <name>` also works. |
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
| `write` | Upload new objects; never replace. |
| `overwrite` | Also replace existing objects. |
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
Things only `toft api` reaches include app environment variables and visibility
(`PATCH /api/v1/apps/{id}`), tags, and pruning old releases.
