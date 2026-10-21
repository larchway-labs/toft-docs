---
title: Browsing storage
description: List, upload, download and delete files in storage you hold a grant on, from Toft or the CLI.
---

If an administrator has granted you access to storage, or to a folder of it, you
can work with its files directly, without an app. There is no self-service: ask
your administrator for a grant.

Every object store can be granted. A volume can be granted only if your install
keeps it somewhere Toft can reach; the administrator will know.

## In Toft

**Your account → Storage** lists the storage you can reach, by the name you type
in commands. Open one to browse the folders you were granted, upload by dragging
files in, and download or delete files. Folders you hold no grant on are not
shown.

Uploads show in a tray while they run. A failed upload has **Retry**, which
sends the same file again without you finding it on disk, unless it failed
because something else wrote a file of that name first. Closing or reloading the
tab cancels uploads still running.

Each row has **Commands and code**, and each storage page ends with **From the
terminal or code**: the `toft store` commands for that storage and folder,
listing only what your level allows, plus the app code for it.

## From the terminal

```bash
toft store ls                                  # storage and folders you can reach, with your level
toft store ls reports                          # one level: folders, then files
toft store ls reports/2026-08                  # the level below
toft store put --as 2026-08/summary.csv reports ./summary.csv
toft store get -o summary.csv reports 2026-08/summary.csv
toft store rm  reports/2026-08/summary.csv     # needs full
toft store cp -r ./out toft://reports/2026-09/  # a whole folder up
toft store cp -r toft://reports/2026-08/ ./aug  # and down
toft store mv toft://reports/draft.csv toft://reports/final.csv
```

`toft store ls` prints each folder the way you type it back, so you can copy a
line into the next command.

## Access levels

| Level | You can | In the CLI |
|---|---|---|
| **Read only** | List and download | `read` |
| **Can add** | Also upload new files. Replacing an existing file is refused | `write` |
| **Can replace** | Also replace existing files | `overwrite` |
| **Can delete** | Also delete | `full` |

Two grants add up: a grant on `reports` and one on `reports/2026` give you the
wider of the two inside `reports/2026`.

## Where your files go

**For an object store**, Toft signs a short-lived link and the file moves
directly between you and the store. Large files never pass through Toft. A
single upload can be up to 5 GiB. Because two systems are involved, errors say
which one refused: Toft (no grant, wrong level) or the object store (for
example, an expired link). If an upload from the browser fails without
explanation, the bucket probably lacks CORS: tell your administrator.

**For a volume on the Toft host**, Toft carries the files itself. What you
upload belongs to the apps attached to that folder, so they can change and
delete it.

:::note
Toft's audit log records each upload and download link it issues. For an object
store, whether the file actually arrived is recorded only by the store.
:::
