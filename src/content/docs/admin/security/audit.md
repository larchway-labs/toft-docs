---
title: The audit log
description: What is recorded, what never is, and how to read it during an incident.
---

**Admin → Activity** records what people did and what changed on the install.

## Guarantees

- **Same transaction.** An authorization-relevant change and its audit row commit
  together. A change without a record cannot exist.
- **No credential values.** Creating, renaming, disabling, enabling and revoking
  a key are recorded by name only. The license key is the exception: it is a customer
  lookup, not a secret, and is audited in full.
- **Never pruned.** Retention settings do not touch it. Deleting audit rows is a
  deliberate database operation.
- **Sign-ins are their own family**, `session.*` (`session.signin`,
  `session.signin_failed`, `session.signout`), never mixed with authorization
  events.

## What is always recorded

Settings changes (`platform_settings.update`), provider changes (including
disabling one), app create and delete, grants and transfers, activations, locks
and unlocks, keys and credentials, storage attachments, announcements,
knowledge-base picks, dependency waivers, storage presigns and build-cache
reclaims. A storage presign records the folder whose grant allowed it.

Every audited action belongs to exactly one of four chips — **Deploys**,
**Access**, **Sign-ins** and **Settings** — and **System** shows what failed on
its own, with nobody acting. **All** shows both.

## 404, not 403

Someone not allowed to know a thing exists gets **404**. The exception is the
[`list` rung](../../apps/listing/): a person deliberately shown an app gets a 403
that says so.

## During an incident

| Filter | Answers |
|---|---|
| **Sign-ins** | Who signed in, from where, and who failed |
| **Access** | Who was given what — grants, roles, keys, locks, credentials |
| **Settings** | What changed on the install or an app's configuration, and when |
| **Deploys** | What was deployed, started, stopped or removed |
| Search for an app, a person, an IP or a request ID | Everything that happened to it |

The filter is part of the address, so a narrowed feed can be sent as a link.

Client addresses are only as good as your
[trusted proxy list](../../config/listeners-and-origins/). If every row shows the
load balancer's address, fix that first.
