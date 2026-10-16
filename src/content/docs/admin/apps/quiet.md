---
title: Quiet apps
description: Finding apps nobody uses — reported as a fact, never acted on automatically.
---

**Admin → Usage** lists apps by how long since anyone showed evidence of wanting
them: the latest visit, deploy, edit or configuration change. Owners see the same
fact on their own app.

Two things do not count: the platform's own reachability probe, and a scan that
sends the `X-Toft-Scan` header (which grants nothing).

## Quiet is never a verdict

Nothing is stopped, locked or deleted for being quiet. An app quiet for a year
may be abandoned — or seasonal, or a machine-to-machine API nobody "visits". If
it is finished, [lock it](../locking/) with a message saying who to ask.

## Quiet is not sleeping

| | Measured in | Reversed by |
|---|---|---|
| **Sleeping** (`idle_sleep_minutes`) | Minutes | The next request |
| **Quiet** | Months | Someone wanting it |

An app can be awake and quiet, or asleep and busy.
