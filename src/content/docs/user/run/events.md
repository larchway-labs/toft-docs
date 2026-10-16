---
title: Events
description: The failures Toft recorded for your app, and how to filter them.
---

Events are the things Toft noticed going wrong with your app: a failed deploy, a crash, a restart loop, a job or scheduled run that failed or was skipped, a deploy refused by policy.

They appear under **Recent failures** on the **Logs** tab, newest first, and from the CLI:

```bash
toft events
toft events --since 24h --severity error
toft events --kind deploy_failed --limit 50
```

## Why not just the log

The log is what your process printed; an event is what Toft observed. If a scheduled run never started, only the events say so.

Every event has a time, a kind and a severity, and you can filter on each. An event is recorded whether or not anybody was emailed about it, and a resolved one stays in the list.

| Common kinds | Meaning |
|---|---|
| **Deploy failed** | The build or start of a deploy failed. |
| **Crashed** | The workload went down. |
| **Restart loop** | It restarted repeatedly in a short period. |
| **Memory limit** / **Out of memory** | It was killed for memory, or stopped after repeated kills. |
| **Not restarting** | Toft stopped trying to restart it. |
| **Job run failed** / **Scheduled job failed** | A run exited with an error. |

Events are pruned after a period your administrator sets.
