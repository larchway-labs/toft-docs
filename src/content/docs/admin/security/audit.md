---
title: The audit log
description: What is recorded, who can read it, and the guarantees around it.
---

Admin → Activity. What people did, and what broke without anyone doing it.

## Written in the same transaction

**Authorization-relevant mutations write the audit row in the same transaction as
the change.** A change that happened and was not recorded is not a state the
database can reach.

Neither exists without the other. That is what makes the log usable as evidence
rather than as a best-effort feed.

## Two readers, and the second is bounded in code

The audit log has exactly two readers, and the second is bounded **by code, not
by a parameter**. There is no page size somebody can set to a million to
exfiltrate the lot.

## Authentication is its own family

Every authentication outcome is recorded as `session.*` — its own family, never
mixed into authorization events.

"Who signed in" and "who was allowed to do what" are different questions and do
not share a namespace. When you are answering the first, you are not filtering
apart two things that happen to look alike.

## What it does not contain

**No credential values, ever.** Five credential actions are recorded, and each
carries names and key names only.

**The license key is the deliberate exception**, and it is not a credential: it is
plain text, audited in the clear, and readable back in full. It names a customer,
not an install, and it is a lookup rather than a secret.

## What is always there

Every settings change (`platform_settings.update`), every provider change —
switching one off is its own row — every app created and deleted, every grant
and transfer, every activation, every lock and unlock, every announcement set
and cleared, every knowledge-base pick, every storage presign, every build cache
reclaim.

A storage presign records the folder whose grant authorized it, so a delete
allowed by a grant on `reports` reads as `reports`, never as the whole store.

Retention settings do not prune it. If your organization requires deleting it,
that is a deliberate database operation, not a knob.

## 404 over 403

Where somebody is not authorized to see that a thing exists, they get a **404**. A
403 tells them it exists, which is often the fact worth protecting.

The scoped exception is the [`list` rung](../../apps/listing/): somebody who was
deliberately shown that an app exists gets a 403 that says so. A stranger still
gets 404.

## Reading it during an incident

The filters that earn their keep:

- **`session`** — who got in, from where, and who did not.
- **`settings`** — what changed on the install, and when.
- **A target** — everything that has ever happened to one app or one person.

Client addresses are only as good as your [trusted proxy
list](../../config/listeners-and-origins/). If every row says your load
balancer's address, that is the thing to fix first.
