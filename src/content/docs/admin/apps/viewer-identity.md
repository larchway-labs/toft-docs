---
title: Viewer identity
description: Where an administrator lets an app learn who is viewing it, and what changes when they do.
---

Every request Toft forwards tells an app **what the caller may do** to it. An app
learns **who the caller is** — their name, email and groups — only when an
administrator turns on viewer identity for that app. It is off for every app
until then.

## Turning it on

- **In the app:** the app's **Settings** tab, **Can see who is viewing**. Editors
  see the switch; only an administrator can change it.
- **From the API:** `PATCH /api/v1/apps/{id}` with `{"viewer_identity": true}`,
  as an administrator. Anyone else is refused with a hint to ask an
  administrator.

Each change is recorded on Admin → Activity as `app.viewer_identity.change`.

## What it does not cover

- **Static sites, rendered documents and batch apps** can't have it: there is no
  process serving requests to tell. Turning it on is refused (`static_app`,
  `document_app` or `batch_app`).
- **On a public app, `email` is always empty**, whatever the setting.
- A request with nobody on it — anonymous, or an API key — carries no identity
  either way.

What an app's code sees, in each language, is in
[What your app learns about a viewer](../../../user/share/viewer/).
