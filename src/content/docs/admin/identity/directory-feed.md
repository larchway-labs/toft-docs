---
title: The directory feed (SCIM)
description: Let your IdP lock accounts and push group membership over SCIM 2.0 — the supported subset.
---

A SCIM 2.0 endpoint at **`/scim/v2/`** lets your IdP push deactivations and group
membership instead of waiting for a sign-in.

## Turning it on

1. On **Admin → Authentication**, open the provider and mint a **SCIM token**.
   It is shown once; minting again rotates it.
2. Point the IdP at `{BASE_URL}/scim/v2/` with the token as a bearer credential.

The token is scoped to that one provider. Without a valid token every SCIM route
answers **401** (not 404), so IdP diagnostics report an auth problem rather than
a wrong URL.

## Supported

| Operation | Effect |
|---|---|
| User `active: false` | **Locks** the account |
| User `active: true` | Unlocks it and restarts the dormancy clock |
| Find user | `userName eq` filter, or read by id |
| `PATCH /Groups/{id}` | Writes memberships, marked `directory` with the calling provider |

`{id}` for a group is **the directory's own name for it**, resolved through the
same claim mappings as sign-in — map a group once in
[Directory groups](../directory-groups/) and both paths find it.

## Not supported

Create user, delete user, `GET /Groups`, `GET /Groups/{id}`, `PUT /Groups/{id}`
and anything else outside the subset answer **501** with a reason. Groups are
created by claim mappings, never pushed.

## Behavior worth knowing

- A token cannot see users of another provider — filters and reads find nothing.
- Deactivating the **last unlocked administrator** is refused: `409`,
  `scimType: mutability`, audited as `scim.refused`.
- A repeated deactivation writes nothing and audits nothing.
- A filter matching nothing returns `totalResults: 0`; an unknown id returns 404.
- Entra's string `"True"`/`"False"` and Okta's member removals carried in the
  `path` are both handled. A JSON `null` for `active` is refused, not read as
  false.

## Checking it works

**Admin → System checks → Directory feed**: `skip` with no token, `warn` when a
token has never been used — the sign of a feed your IdP thinks it is sending.
