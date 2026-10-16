---
title: Deploying with toft
description: The commands you will use daily, and the exit codes that matter in CI.
---

```bash
toft deploy
```

From inside your project. Sends what is on your disk right now. What gets sent,
and how the app is chosen, is on [From your machine](../../deploy/from-your-machine/).

## The commands

| Command | What it does |
|---|---|
| `toft apps` | List the apps you can reach |
| `toft create` | Create an app, naming the slug before claiming it |
| `toft link` | Write the `[app]` table, validating the slug first |
| `toft deploy` | Push the working tree |
| `toft redeploy` | Rebuild from the repository the app names |
| `toft status` | Is it up, what is it serving, since when |
| `toft logs` | Run log; `--follow` to stream, `--deploy <id>` for a build log |
| `toft events` | The failure feed |
| `toft restart` · `toft start` · `toft stop` | Lifecycle |
| `toft rollback` | Back to a previous release |
| `toft job` | `list` · `run` · `runs` · `logs` · `cancel` |
| `toft task` | `list` · `create` · `edit` · `delete` · `run` · `runs` · `logs` |
| `toft store` | `ls` · `put` · `get` · `rm` |
| `toft deps` | The packages, advisories and fixed versions behind a refused deploy |
| `toft sdk vendor` | Vendor the install's own app SDK into your project |
| `toft api` | Call any route with the stored credential |

`--json` on **every** command, for anything you are parsing.

Flags come before positionals.

## Two commands worth knowing about

**`toft task create` and its verbs.** A task is a schedule you can now make from
the client, in the same place as the code that answers it:

```bash
toft task create refresh --path /internal/refresh    # no schedule: on demand
toft task edit refresh --schedule "0 2 * * *"
```

`--path` is required by `create`; `--schedule` is optional, and a task without
one runs only when something asks.

**`toft api`** calls any route on the install with the credential you have already
stored, so you never handle a token to try something:

```bash
toft api GET /api/v1/apps
toft api PATCH /api/v1/apps/<id> --data '{"description":"…"}'
```

The response goes to stdout verbatim. `--data` takes JSON inline, `@file`, or
`@-` for stdin. Nothing prints the credential.

A path matching no route on the install is **exit 2 and names the path** — a
typo is a typo, not an authentication problem, which is the one guess that used
to send people to check their credentials.

## Exit codes are a contract

```
0  it worked
1  the platform did the thing and it failed
2  usage or configuration
3  not authenticated, or refused
4  could not reach the install
```

Worth internalising for CI: **1 and 3 are different failures.** A build that ran
and failed is 1. A credential the install rejected is 3. An install you could
not reach at all is 4.

`toft job run` and `toft task run` wait by default, and **the run's outcome is the
exit code** — so a failing nightly job fails your pipeline without you parsing
anything. A task that was *skipped* is exit 1: a firing that did not happen is
not a success. That holds under `--json` too: the document prints *and* the exit
code is the run's.

**A locked app is exit 2, not exit 1.** Nothing was attempted and failed — you
were refused — and the message names who locked it.

**A name that does not resolve is exit 2** in every verb that takes one:
`toft job run <unknown>`, `toft task run <unknown>`, `toft link` in a directory
already linked.

## Every refusal is a document too

Under `--json`, a refusal is a document on stdout — `error`, `kind`, `code`,
`exit` — as well as a sentence on stderr. So a script never has to parse English
to find out what happened, and a person watching still gets a sentence.

Output is **one JSON document per line**, not one document per invocation: a
failed firing prints the run and then the refusal. Read it a line at a time.

A failed deploy carries why in full — the reason key, the whole message, and
whatever the reason points at: a tail of the build log, or the dependency
findings.

## Unattended mode

`toft` detects a non-interactive terminal rather than remembering a flag you set
once. It will not prompt, and anything that needed a confirmation is refused
with exit 2 instead of hanging.

That is why `toft rollback` in a pipeline needs `--yes`.

## The install's address is the install's answer

`toft` asks the install where its apps are served, once per invocation, rather than
deriving a URL from the one you typed. So a split-origin install, a custom
hostname and a reverse proxy all work without configuration on your side.
