---
title: Quiet apps
description: How long since anybody used your app, where Toft shows it, and what it does not mean.
---

Toft tracks how long it has been since anybody showed evidence of wanting your app. When the app has had no requests in 30 days, the **Usage** card in the **Activity** section on **Overview** says how long it has been quiet:

- **No visitor in 214 days**: the last visit was that long ago.
- **Never opened since it was deployed 90 days ago**: deployed, never visited.
- **Never opened, and no successful deploy**: created and never used.

## What counts

A visit, a successful deploy, or the app's creation, whichever is latest. A failed deploy doesn't count. Neither do [reachability probes](../../share/visibility/) or security scans that identify themselves.

## Quiet is not a verdict

Nothing happens to an app because it is quiet. Nothing is stopped, locked or deleted automatically. Your administrator can see a list of quiet apps across the install, and retiring one is a [lock](../locked/) a person applies.

## Quiet is not sleeping

[Sleeping](../status/) is measured in minutes and ends at the next request. Quiet is measured in days or months. An app can be awake and quiet, or asleep and busy.

## If you're asked about a quiet app

The usual answers:

- **It's finished.** Say so, and let it be retired.
- **It's seasonal.** A quarterly report is quiet most of the year.
