---
title: The gallery
description: Extensions and examples from the Toft gallery repository, who can deploy them, and how to mirror the catalog.
---

The gallery is a catalog of apps the Toft team publishes. It is off until you
turn it on.

## Turn it on

**Admin → Settings → Gallery** sets `gallery_deploy_mode`:

| Value | Gallery offers | Who can deploy |
|---|---|---|
| `off` (default) | Nothing. No request is made to the catalog. | — |
| `extensions_only` | Extensions | Administrators |
| `all` | Extensions and examples | Extensions: administrators. Examples: anyone who can create an app. |

`extensions_only` curates the list; it does not contain anything. Anyone may
still deploy the same code by pasting its repository URL into **New app**. To
restrict what can be deployed, use [source policy](../../security/sources/).

## Where items come from

Everything lives in one repository, `larchway-labs/toft-gallery`:

| Path | Holds |
|---|---|
| `catalog.json` | The catalog the install fetches. |
| `extensions/<name>/` | Extensions: cloned from the repository at a pinned ref, built from their folder. |
| `examples/<name>/` | Examples: fetched as an archive, and only their folder is staged. |

Each catalog item names its `path`. The install refreshes the catalog every six
hours. Current items require Toft 0.7.0; an item that needs a newer Toft stays
listed but cannot be deployed.

## What an item can and cannot do

The catalog is data, never authority. An item names code and may ask for
environment variables. It cannot grant a capability, change a setting or widen
anyone's permissions; anything more an extension needs is a separate, audited
action by you.

An item may ask what visibility its app starts with. The card shows it before
you deploy, and you can change it afterwards on the app's **Sharing** tab.

| Value | The app starts | For |
|---|---|---|
| `listable` (default) | Private, listed | Most items. |
| `viewable` | Open to signed-in people, listed | Tools meant for everyone on the install. |
| `hidden` | Private, unlisted | Items that read the estate. |

No item can start `public`: anonymous access stays your decision.

## Update and detach

An installed app remembers its catalog item. Whether it is installed is worked
out from the app itself, not stored separately.

| Action | Effect |
|---|---|
| **Update** | Deploys the new version onto the same app. Repository, ref and folder move together; address, history, variables and access stay. The installed version advances only when the deploy succeeds. |
| **Detach** | The app keeps running and stops being offered updates. Audited. |
| Change the app's branch or repository | Detaches it automatically, so an update never overwrites code you chose. |

Auto-deploy is refused on an attached extension: it updates through the gallery.

## Status messages

| You see | Means |
|---|---|
| Dropped entries, with reasons | Items the install could not read. They are counted, not hidden. |
| "This catalog needs a newer Toft" | The catalog's format is newer than this binary. The previous catalog stays. |
| "Not recorded" | The catalog did not carry that field. This differs from "unknown". |

## Mirror it

`GALLERY_CATALOG_URL` is configuration; the settings API refuses it. Point it at
an internal copy of `catalog.json` and mirror the gallery repository, and the
gallery works without internet access. URLs from a catalog are validated like any
other untrusted input.
