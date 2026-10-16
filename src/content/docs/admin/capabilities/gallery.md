---
title: The gallery
description: Extensions and examples, and the four rules that keep a catalog from becoming authority.
---

A catalog of things the Toft team publishes: **extensions** (cloned from a
repository at a pinned tag) and **examples** (fetched as an archive).

**Off by default.** `gallery_deploy_mode` offers: nothing, extensions only, or
extensions and examples.

## Four rules

**The catalog is data, never authority.** An entry names code and may *ask* for
environment variables. Nothing in it can grant a capability, change a setting, or
widen anybody's permissions. Everything an extension needs beyond its own code is
a separate, audited action by you, afterwards.

**Off means no outbound request.** Not "fetched and ignored". With the switch off,
nothing is requested from `GALLERY_CATALOG_URL` at all.

**The switch curates; it does not contain.** Restricting the gallery to extensions
hides examples from the list. It does not prevent anyone deploying the same code
by pasting the repository URL into New app — because that was always allowed, and
this is not a security control. [Source policy](../../security/sources/) is.

**Installed is derived, never stored.** Whether an item is installed is worked out
from your app rows. There is no second record to go stale.

## The state an item is born in

An entry may *ask* what visibility the installed app starts at, and the card
shows the answer before you deploy. Three values, and never `public`:

| | The app starts | For |
|---|---|---|
| **listable** | private, and listed | The default, and what every entry that says nothing gets |
| **viewable** | signed-in people may open it, and listed | An item whose whole purpose is to be used by the people on the install |
| **hidden** | private, and unlisted | An item that reads the estate, where its existence is itself a hint about the install |

The ceiling is **signed-in**. Anonymous reach is your install's decision, gated
on a transition and withdrawable install-wide, and a line in a document fetched
over the network must not be able to reach across all of that.

It is the catalog **asking**, not deciding: it moves two columns you can change a
minute later on the app's Sharing tab, and it grants nothing that was not already
yours to grant.

## Who can deploy what

- **Extensions are administrator-only.**
- **Examples** are available to anyone who can create an app, unless you have set
  extensions-only — in which case examples are not listed at all.

## Updating and detaching

An installed app remembers where it came from. You can **update** it from the
catalog — the address, the history, the variables and the access all stay — or
**detach** it, after which it keeps running and stops being told about updates.

## A URL from the catalog is server-side input

Validated as untrusted input like any other, because the catalog URL itself is
configurable and an internal mirror is a legitimate setup.

## Honest reporting

**"Not recorded" is not "unknown".** A field the catalog did not carry and a field
whose value could not be determined are different, and the UI says which.

**A dropped entry is counted and surfaced**, with its reason — not logged and
forgotten. A catalog that silently lists nine of ten items is a support call
nobody can answer.

**A catalog that is too new** tells you *"this catalog needs a newer Toft"* —
not "sync failed", and never an empty gallery.

## Mirroring it

`GALLERY_CATALOG_URL` is configuration, and pointing it at an internal mirror is
supported. That is the shape for an install with no egress: mirror the catalog,
mirror the repositories, and the gallery works.
