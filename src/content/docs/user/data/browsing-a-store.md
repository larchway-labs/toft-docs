---
title: Browsing a store
description: Looking at the files yourself, from the SPA or the CLI.
---

Where a storage resource is an **object store** and you hold a **grant** on a
folder in it, you can browse it: list, upload, download, delete.

Two doors: the store browser in the SPA, and `toft store` from a terminal.

## In the SPA

**Me → Storage** lists the stores you can reach. Opening one gives you a file
browser scoped to the folders you were granted.

A folder nobody granted you is not shown. Not greyed out — absent.

## From the terminal

```bash
toft store ls                                     # what you can reach, at what level
toft store ls reports                             # one level: folders, then objects
toft store ls reports/2026-08                     # the level below
toft store put reports 2026-08/summary.csv ./summary.csv
toft store get reports 2026-08/summary.csv
toft store rm  reports 2026-08/summary.csv
```

**`toft store ls` shows folders, and takes one.** A bare `toft store ls` lists what
you hold: a store you were granted outright by its name alone, and a store you
were granted one folder of as `reports/2026-08/`. That is the same spelling
`ls` takes as an argument, so the line you read off one command is the line you
paste into the next.

Listing a level prints its folders first and then its objects, which is what
makes an object filed under a generated name reachable with `toft` alone — you no
longer have to know the name to find it.

## The transfer does not go through Toft

Uploads and downloads go **direct to the object store**, using a URL Toft
signs for you. Two consequences:

- **A large file does not load the install.** It never passes through it.
- **Two hosts can fail, and they fail differently.** The CLI's exit codes
  distinguish "the install refused" from "the object store refused", because the
  fixes are not the same.

If a browser upload fails silently, it is almost always CORS on the bucket — see
[App storage](../app-storage/).

## Levels

The rung you hold decides what you can do, and on some backings a rung means
something specific:

- **read** — list and download.
- **write** — add a new object. On some backings this is genuinely *create only*:
  writing over something that already exists is refused by the store itself,
  not by Toft.
- **full** — including overwrite and delete, where the backing supports it.

## What is recorded

The **mint** of a signed URL is recorded in the install's audit log — that access
was granted. Whether the file actually arrived is the object store's record, not
Toft's.

So "Toft shows I was given an upload URL" and "the file is there" are two
different questions, and only the second is answered by looking in the store.
