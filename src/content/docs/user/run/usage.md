---
title: Usage and resources
description: Who has opened your app, how often, and what it is consuming.
---

The **Usage** tab answers two different questions.

## Who used it

Requests and distinct viewers over a window. Useful for the ordinary questions:
is anyone actually opening this, did the announcement land, has traffic changed
since the release.

Two things do not count as usage:

- **A reachability probe.** The platform checking that a public app answers is
  not somebody wanting it.
- **A security scan** that identifies itself. A scanner sweeping the estate does
  not make every app look busy.

Both of those exist so [quiet](../quiet/) means something.

## What it costs

CPU and memory, sampled per app.

**A metric that was not measured is absent, never zero.** If a number is
missing, it means nobody could take the reading — not that the reading was
nought. That distinction is worth respecting when you are comparing two apps:
blank and `0` are different facts.

Uptime is zero for anything that is not up. A stopped app does not accumulate.

## Presence

Where your install has it configured, you can see who is *currently* in an app.
It is a live fact, not history, and it is absent on installs that have not set
it up.

## What this is not

It is not analytics. There is no funnel, no session recording, no per-page
breakdown, and no event you can send from your own code. If you need product
analytics, that belongs in your app.
