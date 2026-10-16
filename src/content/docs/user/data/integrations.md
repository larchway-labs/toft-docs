---
title: Sending messages and files
description: What your app may send outward, and the four gates in front of it.
---

An **integration** lets your app send something outward — a message, a file —
using an identity the install holds rather than one you do.

Slack, email, a signed webhook, SharePoint, OneDrive, Teams, Google Drive,
Google Chat, Discord and PagerDuty.

## The shape of it

**Your app supplies the message. The platform supplies the identity.**

Your app never holds a credential, and never speaks in the platform's voice — a
message from your app is attributed to your app.

```python
from toft import notify

notify("slack", "Nightly load finished: 12,400 rows")
```

## An app has none of a kind until one is attached

**Absent, not off.** Until an administrator attaches a connection of a kind to
your app, your app has no integration of that kind — and the refusal says so.

One attachment per (app, kind). A second is **refused rather than swapped**, so
your app cannot silently start posting somewhere else.

## The four gates

Every send passes the same four checks, with distinct refusal codes, re-checked
immediately before the transport:

1. The install has a connection of this kind.
2. Your app has it attached.
3. The destination resolves.
4. The far side still accepts it.

**No status is ever a lie.** If it says it sent, it sent.

## Destinations

Some kinds enumerate destinations — the channels a Slack connection can reach —
and some are welded to exactly one. A welded kind does not answer an empty list;
it says it has no such question.

**A chosen destination that stops working fails. It never falls back.** A
message does not quietly go somewhere else because a channel was archived.

## Sending a file

```python
from toft import deliver

deliver("sharepoint", "august-summary.csv", data)
```

- **Added, never replaced.** A second file with the same name does not overwrite
  the first.
- **The folder is the attachment's; the name is yours.**
- **A name that is really a path is refused rather than sanitised.**
  `../../secrets.csv` is an error, not a cleaned-up filename.

## What integrations cannot do

**Nothing here reads.** An integration is outbound. Your app cannot use one to
read your Slack, list a SharePoint folder, or fetch anything.

**The far side's membership is the boundary.** What your app can reach is decided
by the channel the connection was invited to and the folder it was given.
Toft does not re-implement that — and Teams is a stated exception, which the
refusal copy names.

## What is recorded

Every send is in a ledger — per app, and install-wide for your administrator.
Your app can resolve the sends **it** triggered, and only those.

Three kinds leave residue on the far side, and that record outlives both the
ledger's retention and the app itself. **Detaching reaches nothing already
sent** — detach is not deletion.
