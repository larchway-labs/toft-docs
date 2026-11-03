---
title: Users and roles
description: The three system roles, the People pages, locking, deleting and publisher requests.
---

## Roles

| Role | Can |
|---|---|
| **Viewer** | Open apps they are granted |
| **Publisher** | Also create, deploy and own apps |
| **Admin** (`system_admin`) | Run the install |

Set a role on **People** or on the person's page; every change is audited.
Making somebody an administrator asks you to confirm with **Make administrator**
first. Other role changes apply as soon as you pick them. A viewer cannot be
granted **editor** on an app — promote to publisher first.

## The pages

| Page | Shows |
|---|---|
| **People** | Everyone, filterable by role and by state: active, pending, locked, dormant |
| **People → the person** | Their apps, groups, sign-in identities, API keys, an **access** table — everything they can reach — and **Apps used**: the apps they actually opened in the last 30, 90 or 365 days, most recent first |
| **Me → Access** | The same access list, for yourself |

Open a person's access before an offboarding, an access review or a "do they
already have this?" question. **Apps used** answers the next one — what they
have been relying on — and lists only apps that still exist, counting their own
visits and not their API keys' traffic.

## Locking

Locking is **immediate**: sessions and personal API keys stop working. The person
sees `locked_account_message` from **Admin → Messages**. Lock and unlock are both
audited.

**The last unlocked administrator is protected.** Locking, demoting or deleting
them is refused — from the pages, the API and a
[directory feed](../directory-feed/).

## Deleting

Deletion is **refused while the person owns apps**. Transfer them first — the
person's page has a bulk transfer. Deleting removes their identities, group
memberships, grants and keys; the audit log keeps their name. Usually locking is
enough — see [Offboarding](../offboarding/).

## Publisher requests

A viewer can ask to become a publisher. Approve or deny on **Admin → Publisher
requests**; both are audited. Only viewers can ask, and service accounts cannot.
Answer every request — a denial tells them something, silence does not.
