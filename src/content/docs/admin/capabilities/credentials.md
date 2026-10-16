---
title: The credentials broker
description: Hold a secret centrally and attach it to apps — the app gets the keys, nobody gets the values.
---

In **Admin → Credentials** you store a set of key–value pairs and **attach** it to
apps. The keys arrive in the app's environment at start; no person, owner or
administrator can read the values back.

Use it when several apps share a value (one place to rotate), or when an app's
owner must not hold the secret. For anything the owner may know, an ordinary app
environment variable is simpler.

## Behavior

| | |
|---|---|
| Visible | The credential's name and key names — never values, on any route or in any audit row |
| In the app | Ordinary environment variables at start, but not shown in the app's own variable list |
| Key collisions | A key two sources would both supply is refused with `409`, at the attach or at the owner's write, naming the key |
| Edit values | **No restart.** Attached apps show an unapplied-change banner and pick it up at their next start |
| Detach | **Restarts the app** onto its current release |
| Delete | Refused with `409` while attached, naming the apps |

## Rotate a credential

1. Edit the values in **Admin → Credentials**.
2. Restart the attached apps when you want the new value live — immediately, if the
   old value must stop working now. Otherwise each picks it up at its next start.
