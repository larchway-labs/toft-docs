---
title: Watching a deploy
description: The console, the phases, and the three lifetimes of a build log.
---

While a deploy is in flight, a console appears at the top of the app's page —
above the tabs, where you already are. One line saying what is happening, a bar
showing which phase it is in, and the build's own output underneath.

You do not have to go anywhere to watch a deploy. If you navigate away and come
back while it is still running, the console is still there.

## The three phases

Every deploy is **upload → scan → deploy**, in that order, and every step
belongs to exactly one of them.

| Phase | What is happening |
|---|---|
| **Upload** | Getting the code — a clone, or unpacking what you sent. Dependency directories are stripped here. |
| **Scan** | Resolving what your app installs and comparing it to your install's [dependency policy](../../run/dependencies/). |
| **Deploy** | Installing dependencies, running the build, starting the workload. |

Progress is a stream of snapshots. It is there so you can see movement; it is
never the thing that decides whether your deploy worked. The deployment's own
record is.

## The build log

The output of the build, live. Three things about it are worth knowing, because
they explain everything odd you might see:

- **A pane that joined mid-build says so.** If you opened the page after the
  build started, you get the lines from the moment you arrived and a note that
  earlier output is not in this pane. It is not lost — it is stored.
- **The stored log is offered, never substituted.** When a build finishes, the
  complete log is available to read. Toft will not quietly swap the stored
  copy in underneath a live pane and leave you unsure which you were reading.
- **One stream per build, per page.** Opening the same build in two tabs does
  not double anything up.

## Afterwards

The **Logs** tab holds both of an app's logs behind one switch:

- **Build** — the log of one deploy. It has its own address, so you can link
  somebody straight to it.
- **App** — what the running process is printing.

While a deploy is in flight, or when the last one failed, the tab opens on
**Build**. That is where the answer is.

## When it fails, it says why

A failed deploy carries **a reason and a sentence**, on the row and in the
terminal frame, not only somewhere in the log:

| Reason | What to do about it |
|---|---|
| `source_unavailable` | The code could not be fetched. Check the URL, the branch, the credential. |
| `source_blocked` | Your install's source policy refused it. Ask an administrator — editing code will not help. |
| `dependency_blocked` | Named packages were refused. The [Dependencies tab](../../run/dependencies/) lists them with the versions that fix them. |
| `unsupported_framework` | Nothing here knows how to serve this tree. |
| `manifest_invalid` | `toft.toml` was refused. A one-file fix. |
| `runtime_version` | A pinned language version this install does not have. |
| `build_failed` | The ordinary red — your build or your dependency install. **The detail is in the build log.** |
| `publish_failed` | The built release could not be stored. |
| `start_failed` | The workload did not start. |
| `not_ready` | It started and never answered. The reason is in the **app** log, not the build log. |
| `internal_error` | The platform itself. Retry, then tell somebody. |

`build_failed` and `not_ready` are deliberately different words, because the
next thing to read is a different log.

## Rejoining from the terminal

```bash
toft deploy --watch <deployID>
toft logs --deploy <deployID>
```

The first rejoins a build already running. The second prints a finished build's
log.

**Arriving late at a failed build still tells you why.** Rejoining a deploy that
has already finished and failed gets you the reason and the message, not just
"it is over" — which is what makes `--watch` safe to run from a script that
might be a few seconds behind.

A deploy also reports **what it ignored** — a `[tasks]` table in
`toft.toml`, say — as warnings, printed on the channel you are watching and
carried in the `--json` result.

## What a deploy does not disturb

**The release that is serving keeps serving until a new one replaces it.** A
build that fails, times out or is refused changes nothing about what your users
are getting. There is no window where a failed deploy leaves you with nothing.
