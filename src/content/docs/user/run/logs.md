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

Each line carries the time it was written, and the two voices are interleaved in
time order. Output your app wrote before it was last started on an older version
of Toft has no time; the platform's lines are then shown above it.

```bash
toft logs                      # both voices
toft logs --source app         # only your app
toft logs --source platform    # only Toft's lines
toft logs --follow             # keep streaming
toft logs --lines 500          # the last 500 lines in all
toft logs --deploy <id>        # a build log, whole
toft logs --deploy <id> --lines 50   # its last 50 lines
```

The number of lines is a total across your app and the platform, not per
source.

## What to print

Write to stdout and stderr. Don't write log files into your app's directory to read later: a deploy replaces it. Your administrator's log collector receives the same lines, so a line that matters can be found there after the tab has moved on. The **Logs** tab hides Toft's own credentials if your app prints them (`tofta_`, `toftu_`, `toftd_` tokens and signed storage links), and so does the copy; anything else you print is shown as printed. ANSI color is rendered on the Logs tab and in a terminal; `toft logs` removes it when its output is piped or saved to a file.

:::caution
Logs are not kept forever. Anything you need to keep, such as an audit trail or a report, belongs in storage, not the log.
:::

Below the log, **Recent failures** lists what Toft recorded going wrong. See [Events](../events/).
