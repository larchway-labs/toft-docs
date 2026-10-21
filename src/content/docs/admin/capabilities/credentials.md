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
| Detach | **Restarts the app** onto its current deployment |
| Delete | Not offered while any app holds it: the dialog says how many apps still hold it, and to detach them first. The API refuses with `409`, naming the apps |

## Rotate a credential

1. Open the credential in **Admin → Credentials** and select **Replace values**.
   Every stored name is listed. Type a new value only for the names you are
   rotating: a value left blank keeps the stored one. A name is removed only
   with the **×** on its row, and the dialog lists what will be removed from
   every attached app before you save. **Add another** adds a new name.
2. Restart the attached apps when you want the new value live — immediately, if the
   old value must stop working now. Otherwise each picks it up at its next start.

From the API, `PATCH /api/v1/admin/credentials/{id}` takes `values` (the names
whose values you are setting) and `keep` (the stored names to leave as they
are). A stored name in neither is removed, and a `keep` naming something not
stored is refused. Like every credentials route, it needs a signed-in
administrator; API keys are refused.
