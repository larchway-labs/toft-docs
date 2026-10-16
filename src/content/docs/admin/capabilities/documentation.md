---
title: Documentation
description: How an install links to the guides for its own version, and how to mirror or turn off those links.
---

The user, admin and CLI & SDK guides are one public site. Your install links to
it; it does not host the guides.

## What readers see

The **Documentation** page, in the header for everyone, lists the three guides
(opening in a new tab) and your [knowledge base](../announcements/), if you
set one.

Each link points at the folder for the minor version the install runs, such as
`/toft-docs/0.7/admin/`. Someone on 0.7 keeps reading the 0.7 guides after 0.8
ships. There is nothing to install, update or choose.

Toft never fetches, checks or caches the site. Only a reader's browser follows
the links, and they do not identify your install.

## Point the links elsewhere

`DOCS_URL` is configuration, set in the environment. There is no admin setting,
and the settings API refuses `docs_url`.

| `DOCS_URL` | Readers get |
|---|---|
| unset | The public site, at this install's version. |
| `https://docs.internal.example` | Your mirror, at this install's version. It needs the same `/<minor>/` folders. |
| `off` | No documentation links. The Documentation page says documentation is not available. |

A value that is not an `http(s)` URL, or that carries credentials, a query or a
fragment, stops startup.

## On a network with no way out

Readers cannot load the public site. Either:

- **Mirror it.** Copy the published version folders to any static host,
  including a Toft static app, and set `DOCS_URL` to it. How to build the site is
  in `larchway-labs/toft-docs`.
- **Turn it off.** Set `DOCS_URL=off` so nobody is offered links that fail at
  the firewall.

## Guides installed by an earlier version

Earlier versions installed the guides as apps at `_user-guide`, `_admin-guide`
and `_cli-guide`. Those are now ordinary apps: listed, and deletable by their
owner. Nothing removes them for you. The `_` slug prefix stays reserved, so no
new app can take those addresses.
