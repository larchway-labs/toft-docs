---
title: The estate views
description: The admin pages that answer questions about every app at once.
---

| View | Answers | Where |
|---|---|---|
| **Usage** | Which apps are used, what they consume, which are [quiet](../quiet/) | Admin → Usage |
| **Languages** | Which interpreter each app is serving on | Admin → Languages |
| **Scan targets** | Which addresses a scanner should be pointed at | Admin → Scan targets |
| **Processes** | What is running now, and where | Admin → Processes |
| **Queue** | What is building and waiting | Admin → Queue |
| **Automation** | Every schedule and every run | Admin → Automation |
| **Dependencies** | What the estate installs, and what policy says | Admin → Dependencies |
| **Reach** | What each app has been [given](../reach/) | Admin → Reach |

All of them are **admin-only** and **never omit an app**: a view that silently
dropped a row would mislead every decision made from it.

## What each one is careful about

- **Scan targets** — incomplete coverage means an app has no resolvable address,
  never a skipped row, and the page names which. See
  [scan targets](../../security/scan-targets/).
- **Languages** — counts the release that is **serving**, not the latest build,
  and folds the patch away. An app's own Runtime section shows the patch.
- **Usage** — requests and distinct viewers per app, sampled consumption, active
  users, and the quiet list. A metric a backend does not measure is **blank, not
  zero**. Uptime is zero for anything not up.
- **Processes** — every workload on both backends, sortable, and it accounts for
  what is not listed. Status comes from the backend's own word, so a stopped
  entry is never shown as running.
