---
title: The directory feed (SCIM)
description: What a directory may tell this install about its people, and the subset that is supported.
---

A SCIM 2.0 endpoint, so your identity provider can push user and group changes
here rather than waiting for somebody to sign in.

**Absent until you mint a token**, and then scoped to the one provider it was
minted for.

## Turning it on

On the provider, mint a SCIM token. It is shown once; minting again rotates it.
Point your IdP at `/scim/v2/` with that token as a bearer credential.

Without a token, `/scim/v2/*` answers **401** — not 404. Every other absent
capability here answers 404, and this is the deliberate exception: an IdP's
diagnostics distinguish "not authorized" from "wrong URL", and a 404 sends the
administrator off to re-check a base URL they pasted correctly.

## What it does

| | |
|---|---|
| **Deactivate** | `active: false` **locks** the account. `active: true` unlocks it and restarts the dormancy clock. |
| **Find a user** | `userName eq` filter, and read by id. |
| **Group membership** | `PATCH /Groups/{id}` writes the same rows the claim reconciler writes, stamped `directory` with the calling provider. |
| **Groups themselves** | `GET /Groups`, `GET /Groups/{id}` and `PUT /Groups/{id}` answer `501` with a reason, deliberately: a group is created by a claim mapping, never pushed. Okta's group-push pre-check reads that answer and reports it, rather than a bare error. |

A group is addressed by **the directory's own name for it** — `/Groups/{id}`
resolves through the same claim mappings a sign-in resolves through. So you map a
directory group once and both paths find it.

## What it deliberately does not do

**Creating and deleting users are `501` with a reason**, not 404 and not a silent
no-op. An IdP that receives a clear "unsupported" configures around it; one that
receives a 404 concludes the base URL is wrong and stops trying.

**The subset is the specification.** Anything outside it is 501.

## The refusals worth knowing

- **A token cannot reach a provider it was not issued for.** A filter and a read
  both find nothing.
- **The last unlocked administrator is refused**, in SCIM's own error shape —
  `409` with `scimType: mutability` — and recorded as `scim.refused`.
- **A repeated deactivation writes nothing.** Two identical PATCHes, one write, no
  second audit row and no second token-version bump.
- **A filter matching nothing is `totalResults: 0`; an unknown id is 404.** Two
  different answers to two different questions.

## Interop, which is most of why this exists

Real IdPs do surprising things, and each of these got wrong is a feed that reads
fine and silently never does what it exists for:

- Entra sends `active` as a capitalised **string**.
- Okta carries the subject of a member removal inside the **path**, as a filter
  with no value.
- A JSON `null` unmarshals into a Go bool as `false`, so it is **refused
  explicitly** rather than read as "deactivate".

## Checking it works

The checks page has a **Directory feed** row: `skip` with no token, `warn` on a
token that has never been used. That second state is the one that catches a feed
your IdP thinks it is sending and is not.
