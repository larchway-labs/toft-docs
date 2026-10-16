---
title: Events
description: The failure feed, and why it is separate from the log.
---

An app's **events** are the things that went wrong without anybody doing them: a
build that failed, a health check that stopped answering, a scheduled run that
could not be made, a deploy refused by policy.

Newest first, on the app's page and from the terminal:

```bash
toft events
toft events --since 24h --severity error
toft events --kind deploy_failed --limit 50
```

## Why it is not just the log

A log is what your process said. An event is what **Toft** noticed. They
answer different questions, and a log is the wrong place to look for "why did
nothing run last night" — because nothing ran, so nothing printed.

Every event carries a severity, a kind and a time, and is filterable by all
three.

## Failures are recorded out of the request path

Two consequences worth knowing:

**Telling somebody never fails the thing that broke.** If a notification about a
failure cannot be delivered, the failure is still recorded. The notification is
how you find out sooner; the record is the record.

**An app that is gone is an outcome, not a failure.** Deleting an app while
something was about to tell you about it does not produce a spurious error.

## Retention

Events are kept for a period your administrator sets, and then pruned. If you
need a permanent record of something, it does not belong here.
