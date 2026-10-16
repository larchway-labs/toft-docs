---
title: Browsing a store
description: List, upload, download and delete files in a store you hold a grant on, from Toft or the CLI.
---

If an administrator has granted you access to a store, or to a folder of one, you can work with its files directly, without an app. There is no self-service: ask your administrator for a grant.

## In Toft

**Your account → Storage** lists the stores you can reach. Open one to browse the folders you were granted, upload by dragging files in, and download or delete files. Folders you hold no grant on are not shown.

## From the terminal

```bash
toft store ls                                  # stores and folders you can reach, with your level
toft store ls reports                          # one level: folders, then files
toft store ls reports/2026-08                  # the level below
toft store put reports ./summary.csv --as 2026-08/summary.csv
toft store get reports 2026-08/summary.csv -o summary.csv
toft store rm  reports 2026-08/summary.csv     # needs full
```

`toft store ls` prints each folder the way you type it back, so you can copy a line into the next command.

## Access levels

| Level | You can |
|---|---|
| `read` | List and download. |
| `write` | Also upload new files. Replacing an existing file is refused. |
| `overwrite` | Also replace existing files. |
| `full` | Also delete. |

## Transfers go straight to the store

Toft signs a short-lived URL, and the file moves directly between you and the object store. Large files never pass through the install. A single upload can be up to 5 GiB.

Because two systems are involved, errors say which one refused: Toft (no grant, wrong level) or the object store (for example, an expired URL). If an upload from the browser fails without explanation, the bucket probably lacks CORS: see [App storage](../app-storage/).

:::note
Toft's audit log records that an upload or download URL was issued. Whether the file actually arrived is recorded only by the object store.
:::
