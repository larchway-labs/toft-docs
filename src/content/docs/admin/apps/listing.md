---
title: Listing and access requests
description: Whether signed-in people can discover apps they cannot open, the list rung, and access requests.
---

## The install-wide switch

**Admin → Authentication → Everyone signed in can see every app**
(`apps_listable_to_authenticated`). **On by default**, including on upgraded
installs.

When on, every signed-in account can see every app's **name, slug, owner and
framework** in the apps list. Nothing else is disclosed and nothing becomes
openable: consumption, events, logs, deploy history and the workload all still
require read access.

- Turning it off withdraws the whole install at once.
- An owner can withdraw one app on its **Access** tab; that can only subtract.

**Turn it off if** app names are themselves sensitive
(`project-nightingale-migration`), the install serves separate customers or legal
entities, or a compliance position limits who may enumerate what.

## The `list` rung

On an app's **Access** tab, beside viewer and editor. It puts the app in one
person's or group's list without letting them open it — useful when the switch is
off and you want a deliberate few to be able to find an app and ask for it.

## Access requests

Someone who can see an app but not open it gets a refusal with a **Request
access** option and a note in their own words.

- The request lands on the app's **Access** tab. The owner approves at a level or
  denies; the requester can withdraw it.
- Nothing is automatic; no timeout grants anything.
- Requesters can read their own requests back.
- With the switch off and no `list` grants, nobody can start a request.

## The two halves of the apps list

| Tab | Shows |
|---|---|
| **Mine** | What you can open — owned plus shared with you. Where people land. |
| **All apps** | Everything whose name you may see |

On an install where you can open everything you can see, there is one list.
