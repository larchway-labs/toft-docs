---
title: Listing and access requests
description: The switch that decides whether people can discover apps, and what it discloses.
---

Two related things, on Admin → Authentication and on every app's Access tab.

## The install-wide switch

**Everyone signed in can see every app** — `apps_listable_to_authenticated`.

With it on, every app appears in everyone's list, **by name, slug, owner and
framework**, without being openable. Nothing becomes readable: every app still
refuses to open for anybody who was not granted it.

**It is on unless you turn it off.** This page is mostly read by somebody turning
it off, so it is written for them.

## What it discloses, stated plainly

On the first request after it is on, every account on the install can enumerate
every app's **name, slug, owner and framework**. Nobody consented to that.

Three things reduce it and none removes it:

- **It is one toggle**, and turning it off takes the whole install back at once,
  with nothing to restore by hand.
- **An owner can withdraw a single app** from the listing, on its Access tab.
  That withdrawal can only ever subtract.
- **The disclosure is the listing's row and not one field more.** Consumption,
  the estate census, events, logs, deploy history and the workload all narrow
  through *readable*.

## Why it defaults on

A discovery feature nobody discovers is not a feature. Shipped off, the `list`
rung is something nobody encounters, and the access-request flow has nothing to
attach to — somebody has to already know you want an app before they can grant
you the rung to ask for it.

There is **no grandfathering**: an install that upgrades gets the same default a
new one does. On-for-new and off-for-upgrades would buy that safety with a
permanent split in what the product is, and two installs on the same binary
answering "can I see the app list" differently for ever.

## Turn it off if

- App **names** say something. `project-nightingale-migration` is a disclosure
  before anybody opens anything.
- Your install is multi-tenant in a way that matters — different customers,
  different legal entities.
- You have a compliance position about who may enumerate what.

Turning it off leaves the `list` rung available per app, granted deliberately.

## The `list` rung, granted per app

On an app's Access tab, alongside viewer and editor. It puts the app in one
person's or one group's list without letting them open it.

Granted **per person** it is nearly the same work as granting viewer and earns
little. Granted **install-wide** it is the difference between an internal
platform whose apps you can ask for and one whose apps you have to already know
about.

## Access requests

Somebody who can see an app and not open it gets a refusal **with a door in it**:
they can ask, with a note in their own words.

The request lands on the app's **Access** tab, for the owner. Approve at a level,
deny, or let them withdraw it.

- **Nothing is automatic.** No timeout grants anything.
- **They can read their own requests back**, so they know it sent.
- **The rung and the request are one feature.** An install with the listing off
  and no `list` grants has an access-request flow nobody can start.

## The apps list has two halves

**Mine** is what you can open — apps you own plus anything shared with you, which
is where people land. **All apps** is everything you may see the name of.

"Mine" is deliberately about opening rather than owning: an app shared with you
that Mine excluded would be filed as a bug on the first day.

The two halves only appear when there is something to separate. On an install
where you can open everything you can see, there is one list.
