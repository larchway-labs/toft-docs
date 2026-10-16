---
title: Logs
description: Two logs, two voices, and what Toft does and does not keep.
---

Anything your app writes to standard output or standard error is captured and
shown on the **Logs** tab, live.

## Two logs behind one switch

- **Build** — the log of one deploy. Where a failed build explains itself. It
  has its own address, so you can link somebody straight to it.
- **App** — what the running process is printing right now.

The tab opens on **Build** while a deploy is in flight or when the last one
failed, because that is where the answer is. Otherwise it opens on **App**.

A deploy that fails never produces run logs, because nothing started.

## Two voices in the app log

The app log carries **your app's lines** and **the platform's lines about your
app** — the release it fetched, the interpreter it resolved, the reason a start
was refused, the moment it stopped retrying.

The platform's lines are marked, and you can filter to one or the other:

```bash
toft logs                      # both
toft logs --source app         # only your app
toft logs --source platform    # only Toft's account of it
toft logs --follow             # live
toft logs --deploy <id>        # a build log instead
```

That second voice is why "my app printed nothing and it still will not start" is
usually answerable: the platform said why, in the same stream.

## What to print

Print to stdout and stderr. Do not write log files inside your app's directory
expecting to read them later — a start replaces the tree.

Structured or plain both work. ANSI colour is rendered rather than shown as
escape codes.

## What is not kept forever

Logs are bounded. Your install has retention settings for each class of log, and
old lines go.

If something has to be kept — an audit trail, a report, a metric — write it
somewhere meant to keep things, not to the log.
