---
title: Directory groups
description: Letting a sign-in claim maintain a group's membership, and the six things the sync will not do.
---

A group here is a local row. Its **membership** can be maintained by a sign-in
provider's group claim, one group at a time, by your explicit action.

**Absent until you attach one.** No section on the group, no meaningful column in
any response, and the checks page reads `skip`.

## Setting it up

1. Create the group here.
2. On the group, open **Directory** and attach a **claim value** for a provider —
   the string your IdP sends, which is usually a group name or an object id.
3. Sign in as somebody in that directory group. Their membership appears,
   marked as coming from the directory.

The claim name defaults to `groups` and is per provider. Both the id token and
userinfo are read, because providers disagree — Entra does not return groups from
userinfo; Okta and Keycloak often do. Userinfo wins where both carry it.

The id token is parsed **for claims and never for identity**. The subject still
comes from userinfo.

## Provenance, and why it matters

Every membership carries where it came from: `manual` or `directory`, and which
provider.

- **A manual membership survives every sync.** Somebody you added by hand stays
  added.
- **A directory membership is offered no Remove button** — removing it in the
  member list would be undone at the next sign-in, so the list says where it came
  from instead of lying about who is in control.

## What the sync will not do

Six things, and each of them is a bug somebody else has shipped:

- **Touch a manual row.**
- **Touch another provider's row.**
- **Write anything when nothing changed** — a sign-in that changes no membership
  writes no row and does not bump a token version.
- **Exceed the cap.** Ten directory groups per person. The eleventh is refused
  and recorded as `group.sync_capped`, and the sign-in still succeeds.
- **Fail a sign-in.** A reconcile that cannot run does not lock somebody out.
- **Treat an absent claim as an empty one.**

That last one is the important one.

## Absent is not empty

**A claim that is missing reconciles nothing. A claim that is present and empty
removes.**

Two sign-ins, two outcomes, no error either way. Collapsing this distinction is
how an install strips every directory membership it has the first time a provider
changes what it returns — so a claim of an unexpected shape reads as *absent*,
deliberately.

## Unmapping

Removing a claim mapping removes the memberships it wrote, **immediately**, and
they are gone on the response. Manual rows survive.

## Checking it works

The checks page has a **Directory groups** row:

- `skip` — no mappings on this install.
- `warn` — a provider has mappings and **no membership has ever arrived**.

That warning is the one that catches a claim name that is wrong, a scope that was
not requested, or an IdP that needs the groups claim explicitly enabled.
