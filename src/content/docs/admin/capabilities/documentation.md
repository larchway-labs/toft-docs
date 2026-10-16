---
title: Documentation
description: Where the guides live, how an install links to them, and what to do on a network with no way out.
---

Toft's manuals — the user guide, this admin guide, and the CLI and SDK
guide — are one public site, published by the people who make Toft. Your
install does not host them. It **links** to them.

## Every install links to its own version

The site keeps one folder per minor version: `/0.7/`, `/0.8/`, and `latest/`.
An install links to the folder for the version it runs, so somebody on 0.7
reads the 0.7 documentation even after 0.8 ships. Nobody has to install,
update or choose anything: the link is worked out from the running version.

The **Documentation** page lists the three guides, opening in a new tab, beside
your install's own knowledge base if you have configured one
([announcements](../announcements/)). It is in the header for everybody.

## Your install makes no request to the site

A link is only ever followed by a reader's browser. Toft does not fetch the
documentation, check that it is there, or cache a copy, and the links do not
tell the site which install they came from.

## Where the links point is configuration

`DOCS_URL` sets the site the links point at; Toft adds the version. Unset, it is
the public site. Like `GALLERY_CATALOG_URL`, it is part of how the install was
stood up — there is no setting for it in the admin panel, and the settings API
refuses one by name.

| `DOCS_URL` | What readers get |
|---|---|
| unset | The public site, at this install's version |
| `https://docs.internal.example` | Your mirror, at this install's version — it needs the same `/<minor>/` folders |
| `off` | No documentation links anywhere; the Documentation page says documentation is not available on this install |

## On a network with no way out

The public site will not load for your readers. Either mirror it — copy the
published folders onto any static host, including an ordinary Toft static app,
and set `DOCS_URL` to it — or set `DOCS_URL=off` so nobody is offered links that
fail at the firewall. How to build a mirror is in the site's own repository,
`larchway-labs/toft-docs`.

## Guides installed by an earlier version

Earlier versions installed the guides as apps on `_user-guide`, `_admin-guide`
and `_cli-guide`. Those copies are now ordinary apps: they appear in the app
list, the gallery no longer lists them, and you can delete them. Nothing deletes
them for you.
