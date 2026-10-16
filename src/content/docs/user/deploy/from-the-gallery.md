---
title: From the gallery
description: Deploying something Toft publishes, and what an installed app keeps.
---

The **Gallery** is a catalog of apps the Toft team publishes: worked
examples in every supported framework, and extensions that add a capability to
your install.

It is off unless your administrator turned it on. An empty gallery page usually
means exactly that.

## Two kinds of entry

| | What it is | Who can deploy it |
|---|---|---|
| **Example** | A working app in one framework, fetched as an archive. Yours to change. | Anyone who can create an app |
| **Extension** | A tool that plugs into the install, cloned from a repository at a pinned tag. | Administrators only |

Your administrator can also set the gallery to offer extensions only, in which
case examples are not listed at all.

## Deploying one

Pick it, give it a name, deploy. From that point it is an ordinary app: your
app, on your install, with your slug — you can edit it, redeploy it, and share
it like anything else.

Examples are the fastest way to see what a working repository for a given
framework looks like. Deploy the one closest to what you are building and read
its source.

## Staying in step with the catalog

An app deployed from the gallery remembers where it came from, so:

- Its page tells you when the catalog names a newer version.
- **Update** on the Settings tab redeploys it from the catalog. The address, the
  history, the variables and the access all stay.
- **Detach** breaks the link. The app keeps running; it just stops being told
  about updates.

Whether an entry is "installed" is worked out from your apps, never stored
separately, so it cannot go stale.

## What a catalog entry cannot do

Nothing in the catalog grants anything. An entry names code and may *ask* for
environment variables; it cannot give itself a permission, change a setting, or
reach anything you could not reach yourself. Everything an app needs beyond its
own code is a separate action somebody takes afterwards.
