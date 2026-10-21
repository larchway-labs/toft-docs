---
title: Logs
description: The run log, the build log, and the platform's own lines about your app.
---

Anything your app writes to stdout or stderr appears on the **Logs** tab, live.

## Run log and build log

| | Shows |
|---|---|
| **Run log** | What the serving deployment is printing. |
| **Build log** | The output of one deploy. Pick the build from the list; the address links straight to it. |

The tab opens on the build log while a deploy is running or when the last one failed. Otherwise it opens on the run log. A deploy that fails has no run log, because nothing started.

## Your lines and the platform's

The run log carries your app's output and the platform's lines about your app: the deployment it fetched, the interpreter it resolved, why a start was refused, when it was put to sleep. Filter with **All**, **App** or **Platform**.

```bash
toft logs                      # both voices
toft logs --source app         # only your app
toft logs --source platform    # only Toft's lines
toft logs --follow             # keep streaming
toft logs --lines 500          # more history
toft logs --deploy <id>        # a build log
```

## What to print

Write to stdout and stderr. Don't write log files into your app's directory to read later: a deploy replaces it. ANSI color is rendered.

:::caution
Logs are not kept forever. Anything you need to keep, such as an audit trail or a report, belongs in storage, not the log.
:::

Below the log, **Recent failures** lists what Toft recorded going wrong. See [Events](../events/).
