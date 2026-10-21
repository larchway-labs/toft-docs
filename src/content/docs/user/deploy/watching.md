---
title: Watching a deploy
description: The deploy console, its three phases, the build log, and what each failure reason tells you to do.
---

While a deploy runs, a console sits above the app's tabs: the current step, a
phase bar and the live build log. Leave and come back — it is still there.

## The three phases

| Phase | Steps |
|---|---|
| **Source** (**Upload** for an archive) | Receive or clone the code; drop dependency folders. |
| **Scan** | Check dependencies against your install's [dependency policy](../../run/dependencies/). |
| **Deploy** | Detect, configure, build, package, start, health-check, go live. |

The serving deployment keeps serving throughout. A deploy that fails, times out or
is refused changes nothing for your users.

## The build log

- Opened mid-build, the pane shows lines from when you arrived and says so.
  The full log is stored and offered when the build ends.
- Afterwards, the **Logs** tab has **Build log** (one deploy, with its own
  link to share) and **Run log** (what the app prints). It opens on the build
  log while a deploy runs or after one fails.

## Failure reasons

A failed deploy carries a reason and a sentence, on the app page and in the
terminal.

| Reason | What to do |
|---|---|
| `setup_failed` | The deploy could not find anywhere to run. Ask an administrator. |
| `source_unavailable` | The code could not be fetched. Check the URL, branch and token. |
| `source_blocked` | Your install's source policy refused it. Ask an administrator — editing code will not help. |
| `dependency_blocked` | Packages were refused. The [Dependencies tab](../../run/dependencies/) names them and the fixed versions. |
| `unsupported_framework` | Toft does not recognize the repository. See [How Toft reads your repository](../../build/how-detection-works/). |
| `manifest_invalid` | [`toft.toml`](../../build/toft-toml/) was refused. |
| `runtime_version` | A pinned [language version](../../build/versions/) this install does not have. |
| `build_failed` | Your build or dependency install failed. **Read the build log.** |
| `publish_failed` | The built app could not be stored. Retry. |
| `start_failed` | The app did not start. |
| `not_ready` | It started but never answered, or crashed while starting. **Read the run log**, not the build log. A crash fails the deploy within seconds, and the message includes your app's last 20 log lines. |
| `internal_error` | A platform fault. Retry, then tell your administrator. |

Warnings — for example a `toft.toml` section that was ignored — are shown
alongside, and included in `--json` output.

## From the terminal

```bash
toft deploy --watch <deployID>   # rejoin a running deploy
toft logs --deploy <deployID>    # print one build's log
```

Rejoining a deploy that already failed still prints the reason, so `--watch` is
safe in scripts.
