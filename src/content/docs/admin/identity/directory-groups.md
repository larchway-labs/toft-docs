---
title: Directory groups
description: Let a provider's group claim maintain a local group's membership.
---

A group's **membership** can be kept in sync from a sign-in provider's group
claim. It is opt-in, per group, and absent until you attach a mapping.

## Setting it up

1. Create the group (**People → Groups**).
2. On the group, open **Directory** and attach a **claim value** for a provider —
   the string your IdP sends, usually a group name or object id.
3. Sign in as somebody in that directory group. Their membership appears, marked
   as from the directory.

The claim name is per provider (**Groups claim**, default `groups`). Toft reads it
from both the ID token and userinfo, preferring userinfo where both carry it
(Entra sends groups only in the ID token). Identity still comes from userinfo.

## Manual and directory memberships

Every membership is either `manual` or `directory` (with its provider).

- Manual memberships survive every sync.
- Directory memberships have no Remove button — a removal would be undone at the
  next sign-in. Detach the claim mapping instead.

## What sync will not do

- Touch a manual membership, or another provider's.
- Write anything when nothing changed.
- Exceed **10 directory groups per person** — extras are skipped and audited as
  `group.sync_capped`; the sign-in still succeeds.
- Fail a sign-in because sync could not run.
- Treat a missing claim as an empty one.

:::caution[Absent is not empty]
A **missing** claim changes nothing. A claim that is **present and empty** removes
every directory membership from that provider. A claim of an unexpected shape is
read as missing.
:::

## Unmapping

Removing a mapping removes the memberships it created, immediately. Manual
memberships stay.

## Checking it works

**Admin → System checks → Directory groups**: `skip` with no mappings, `warn`
when a provider has mappings but no membership has ever arrived — usually a wrong
claim name, a missing scope, or a groups claim not enabled at the IdP.
