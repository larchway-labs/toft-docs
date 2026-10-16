---
title: Accounts that wait to be activated
description: Provisioning somebody without letting them in.
---

A provider can be set to create an account and **not** let it in:
`default_role: pending`.

The account exists, stamped as awaiting activation and holding the floor role.
The sign-in is refused. An administrator decides whether they get in, and as
what.

## Why you would

Two situations, and they are the common ones:

- Your directory contains more people than should have accounts here — every
  contractor, every service desk account.
- You want the account to exist so grants can be prepared before somebody's
  first day.

## Pending is a provisioning policy, never a role

It is not a fourth system role, and it does not appear in the role picker. It is
a stamp on an account, and the refusal is **at every door** — a pending account
is refused on its second sign-in and its twentieth, not just the first.

## What happens when somebody lands in the queue

An administrator is **nudged once**, by mail and to a connected channel, on the
provisioning sign-in only. Not on every subsequent attempt: the queue is the
record, and one person retrying is not news.

The person sees the **awaiting-activation message** you wrote on Admin →
Messages. Write something that says who to contact.

## Activating

People → Pending. Activation is **one audited act** that admits the account and
chooses its role.

Three refusals:

- **It cannot mint an administrator.** That role is made deliberately, elsewhere.
- **A second activation is refused.**
- **It does not unlock.** An account that is both pending and locked stays
  locked; those are two different facts.

The activated person is told **by mail alone**, in your words — the
account-activated message. If mail is not configured, nobody is told, so tell
them yourself.

## Two things that do not put somebody in the queue

**Linking never does.** An account reached by `link_by_verified_email` under a
pending policy stays activated. Somebody who already has an account here does not
get sent back to the waiting room because they signed in through a new provider.

**The dormancy sweep never locks a pending account.** A pending account past the
dormancy threshold stays pending; locking somebody who has never been let in
would be a state nobody can read.
