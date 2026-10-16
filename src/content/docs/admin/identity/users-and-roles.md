---
title: Users and roles
description: Three roles, what each one may do, and the pages that answer questions about a person.
---

## Three system roles

| Role | May |
|---|---|
| **Viewer** | Open apps they have been granted. Nothing else. |
| **Publisher** | Everything a viewer may, plus create, deploy and own apps. |
| **System admin** | Run the install. |

That is the whole ladder. A role is set on People → a person, and every change is
audited.

**A viewer cannot hold *editor* on an app.** Editing means deploying, and
deploying is what a publisher is — so the grant is refused with that reason
rather than creating an account that can deploy without being allowed to. The
order is: promote, then grant.

## The pages

| Page | Answers |
|---|---|
| **People** | Everyone on the install, their role, their state. |
| **A person** | Their apps, their groups, their keys, their sign-in history. |
| **Their access** | **Everything they can reach**, in one list. |

That last one is the page to open before an offboarding conversation, an access
review, or a "does she already have this?" question. People can see the same
list for themselves under Me → Access.

## Locking

Locking an account takes effect **immediately**: sessions stop working, keys stop
working. Unlocking is your action, and both directions are audited.

A locked person is turned away with the **locked account message** you wrote on
Admin → Messages.

**The last administrator who can sign in is protected.** Locking, demoting or
deleting the one unlocked administrator is refused — from the pages, from the
API, and by a [directory feed](../directory-feed/) deactivating them — because
the alternative is an install nobody can unlock.

## Deleting

Deleting a user is available and is usually the wrong first step. **Their apps do
not go away** — an app owned by a person who is gone is still there and still
serving, which is correct, but it is a thing to deal with rather than assume
away.

Transfer their apps first. There is a bulk transfer on a person's own page for
exactly this.

## Promotion requests

A viewer can ask to become a publisher. The queue is Admin → Publisher requests;
you approve or deny, and both are audited.

Deny rather than leaving one open. A denial is a conversation; an unanswered
request is the only outcome with no information in it.

Service accounts cannot request promotion, and only viewers can — asking is not
deciding, and the route says so rather than pretending.
