---
title: Credentials an administrator attaches
description: Shared secrets an administrator gives your app without you ever holding them.
---

Some values your app needs aren't yours to hold: a warehouse password, a shared API key, a service account. An administrator stores them centrally and **attaches** them to your app.

## What you see

Under **Settings → Runtime → Credentials**, each attached credential shows its name and the keys it supplies, such as `DATABASE_URL` or `WAREHOUSE_PASSWORD`. Never the values: no route returns them, to anybody.

## What your app sees

At start, the keys are in your app's environment like any other variable. They don't appear in your own variable list.

## Rules that affect you

- **One source per key.** You can't set a variable a credential already supplies. The save is refused and names the credential.
- **Detaching restarts your app** onto its current release.
- **Changing a credential's values doesn't restart anything.** Your app shows the **Saved, but not running yet** notice until it restarts.
- **A credential attached to apps can't be deleted** until it is detached.

## Asking for one

Tell your administrator which app, which key names, and why it shouldn't be a variable you set. The usual reasons: several apps need the same value, or you shouldn't be able to read it.
