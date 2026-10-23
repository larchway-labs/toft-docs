---
title: API keys
description: Personal and deploy keys — what each one is, and which to use.
---

Pick a key by **who it belongs to**. The prefix tells you which kind you hold.

| Prefix | Kind | Belongs to | Use it for |
|---|---|---|---|
| `toftu_` | Personal key | You | `toft`, and scripts that act as you |
| `toftd_` | Deploy key | Nobody | CI pipelines |

## Personal keys

`toft login` and [RStudio](../../deploy/from-rstudio/) create one for you. To make one yourself, open **Your account → Credentials** and choose a name, scope and expiry (30 days to never). You can hold 10, and see when each was last used.

A personal key acts as you, on every app you can reach — treat it like a password.

| Scope | What it can do |
|---|---|
| **Full** (default) | Anything you can do, except manage keys or permissions |
| **Read** | Reads only. It still sees everything you can, logs and source included |

Scope is fixed at creation; to change it, create a new key and revoke the old one. `toft login` always creates a full key — a read key used with `toft` fails every deploy with exit 3.

## A script or integration that calls one app

Give it an account of its own from your identity provider, ask the app's owner to grant that account on the app, and use that account's personal key. It reaches only what the account is granted, and it stops when the account is removed. App keys (`toft_`) no longer exist; one still in use is refused with a message saying so.

## Deploy keys

An administrator creates these. A deploy key belongs to nobody, so it keeps working when people leave. It can create, deploy, roll back and restart apps, but cannot delete apps or change who can see them. Use one in CI instead of someone's personal key.

## Limits on every key

No key can create keys, change permissions or change who can see what — that needs a browser session. A revoked key stops working on the next request.

You can hold ten personal keys. An expired key still counts until you revoke it, and `toft login` does not revoke the key it replaces — so if creating one is refused with `key_limit_reached`, revoke old ones on **Credentials** first.

Your administrator can revoke any key, or turn personal keys off; existing ones then stop working.
