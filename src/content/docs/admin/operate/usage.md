---
title: Usage, consumption and cost
description: Who uses this install, what it costs, and what the numbers do not say.
---

Admin → Usage. Three questions on one page.

## Which apps are used

Requests and distinct viewers per app, over a window. Plus the **quiet** list —
apps nobody has shown any sign of wanting. See [Quiet apps](../../apps/quiet/).

Two things deliberately do not count as usage: a [reachability
probe](../../security/reachability/), and a request marked as a scan. Both exist
so quiet means something.

Traffic through a personal key is listed under the person who holds it, by
name, so an owner can tell who is hitting their app from a script.

Days are cut at midnight **UTC**, whatever the browser's zone, so a window is
the same window on every page and for every reader.

## What it costs

CPU and memory, sampled per app, plus the estate's totals.

**A metric a backend does not measure is absent, never zero.** Blank and `0` are
different facts. A comparison between two apps that treats them as the same is a
comparison that is wrong.

**CPU reservation and ceiling are absent from a shared workload's payload
entirely** — they are cluster concepts, and reporting a zero would imply a limit
of none rather than a question that does not apply.

## Active users

How many people actually use this install, over a window.

This is the number people mean when they ask "how many users do we have", and it
is usually much smaller than the account count. Both are worth knowing; only one
of them is a fact about demand.

## What this is not

**It is not chargeback.** There is no billing model, no rate card, and no
per-app cost in currency. What you get is consumption, and turning that into
money is your finance team's arithmetic, not the platform's.

**It is not product analytics.** No funnels, no per-page breakdown, no events an
app can send. That belongs inside an app.

## Presence

Where `PRESENCE_ENDPOINT` is configured, you can see who is *currently* in an app.
A live fact, not history, and absent on installs that have not set it up.

## The license counts

Separately, and only where licensing is on, the install sends counts to the
vendor at check-in. **Nothing in that payload is a name** — no app names, no user
names, no hostnames — the install renders it before sending, and the counts can be
switched off with one stated exception a paid license cannot suppress.

**The install count refuses nothing and never will**, and neither does the seat
count beside it. See [Licensing](../licensing/).
