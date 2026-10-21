---
title: Deploying with toft
description: The everyday commands, and the exit codes a pipeline relies on.
---

From your project folder:

```bash
toft link my-app     # once: record which app this folder deploys to
toft deploy          # bundle the folder, deploy it, wait for the build
```

What gets sent and how the app is chosen is on [From your machine](../../deploy/from-your-machine/). To make a new app, run `toft create`; add `--repo <url>` to build from a repository, and `--subdir <folder>` to build one folder of it.

## Everyday commands

| Command | What it does |
|---|---|
| `toft apps` | The apps you can see (`--mine` for your own) |
| `toft status` | What is serving, since when, from where, and which deployment |
| `toft logs` | The app's log; `--follow` to stream, `--deploy <id>` for a build |
| `toft events` | What has gone wrong with the app |
| `toft redeploy` | Rebuild from the app's repository |
| `toft rollback` | Make an earlier deployment current again; the previous one by default |
| `toft restart` · `start` · `stop` | Lifecycle; `--wait` waits until it is up |
| `toft deps` | Why the dependency policy refused a deploy, and what fixes it |
| `toft job` · `toft task` | Run [jobs](../../automation/jobs/) and [scheduled tasks](../../automation/scheduled-tasks/) |
| `toft store` | Files in a store: `ls`, `put`, `get`, `rm` |
| `toft sdk vendor` | Copy the [app SDK](../sdk/) into your project |
| `toft api GET apps` | Call any API route with your stored credential |

Every command takes `--help` and `--json`. Put flags before positional arguments. Full reference: [Commands](../../../cli/cli/commands/) in the CLI & SDK guide.

## In a pipeline

`toft deploy`, `toft job run` and `toft restart --wait` wait for the outcome and fail the step if it fails. `toft` never prompts without a terminal; a command that needs confirmation, such as `toft rollback`, needs `--yes`.

| Exit code | Meaning |
|---|---|
| `0` | It worked |
| `1` | The platform tried and it failed — a build, a job run, a skipped task run |
| `2` | Usage or configuration — no app linked, a bad flag, an unknown name, a locked app |
| `3` | Not authenticated, or refused |
| `4` | Could not reach the install |

With `--json`, output is one JSON document per line, and a refusal is a JSON object too. See [CI and automation](../../../cli/cli/ci/) and [Exit codes](../../../cli/cli/exit-codes/).
