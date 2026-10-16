---
title: Integrations
description: Connecting apps to the outside, and the boundary that keeps them honest.
---

An integration lets an app send something outward — a message, a file — using an
identity **the install holds** rather than one the app does.

Ten kinds: Slack, email, a signed webhook, SharePoint, OneDrive, Teams, Google
Drive, Google Chat, Discord and PagerDuty.

## The app supplies the message; the platform supplies the identity

That is the whole design. **An app never speaks in the platform's voice**, and an
app never holds the credential.

## A connection is the install switch

**An app has none of a kind until you attach one. Absent, not off.**

**A connection that exists and offers itself to apps *is* the install switch.**
There is no second toggle: creating a connection and making it available is the
act of turning the capability on.

## Scope is welded

**A connection is welded to its scope, and a new scope is a new connection.** You
do not re-point an existing connection at a different channel or folder — you make
another one. Anything already using the first keeps meaning what it meant.

**One attachment per (app, kind).** A second is **refused rather than swapped**, so
an app cannot silently start posting somewhere else.

## Destinations

**Whether a kind enumerates destinations is a property of the kind.** A welded one
**404s rather than answering an empty list** — "I have no such question" is a
different answer from "there are none".

**A chosen destination that stops working fails. It never falls back.** Routing
resolves in one place, and a broken destination is an error somebody sees rather
than a message that quietly went somewhere else.

## The far side's membership is the boundary

What an integration can reach is decided by the far side — the channel it was
invited to, the folder it was given. Toft does not re-implement that.

**Teams is the exception, and its copy has to say so.** Do not paper over it when
somebody asks.

## URLs are input

**A URL somebody typed is server-side input, refused at save *and* at dial.** The
second check is not redundant: what resolved safely when it was saved may resolve
somewhere else later. A private address is refused both times.

## What an app can and cannot do

- **Four gates**, the same four for every kind, with distinct codes, re-checked
  before the transport.
- **No status is ever a lie.** If the ledger says it sent, it sent.
- **Nothing here reads.** Integrations are outbound. An app cannot use one to read
  your Slack or list a folder. No read route exists.
- A file is **added and never replaced**. The folder is the attachment's, the name
  is the app's, and a name that is really a path is **refused rather than
  sanitised**.
- **An app can resolve the sends it triggered, and only those.**

## The ledger

Per app, and install-wide on Admin → Integration log: every message an app has
sent, with its recipients in full.

**Message bodies are not kept by default** — `integrations_retain_bodies` — and the
log always records a checksum either way. Retention is at least 30 days.

**Three kinds leave residue**, and its record outlives both the ledger's retention
and the app itself. **Detach reaches nothing already written.** Detach is not
deletion, and it is worth saying that to whoever asks you to "remove the files".

## Testing

You can test a connection, and you can test one app's integration. Do the second
before telling a developer their integration works: a connection that
authenticates is not the same as an app that can post to the channel.

A file-kind connection — SharePoint, OneDrive, Google Drive — is tested by
uploading a one-line `toft-test.txt` to its default destination, because
those refuse a plain text message; the button says so. Expect to find the file.
