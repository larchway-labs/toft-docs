---
title: The audit log
description: What is recorded, what never is, and how to read it during an incident.
---

**Admin → Activity** records what people did and what changed on the install.

## Guarantees

- **Same transaction.** An authorization-relevant change and its audit row commit
  together. A change without a record cannot exist.
- **No credential values.** Key mint, rename, disable, enable and revoke are
  recorded by name only. The license key is the exception: it is a customer
  lookup, not a secret, and is audited in full.
- **Never pruned.** Retention settings do not touch it. Deleting audit rows is a
  deliberate database operation.
- **Sign-ins are their own family**, `session.*` (`session.signin`,
  `session.signin_failed`, `session.signout`), never mixed with authorization
  events.

## What is always recorded

Settings changes (`platform_settings.update`), provider changes (including
disabling one), app create and delete, grants and transfers, activations, locks
and unlocks, announcements, knowledge-base picks, storage presigns and build-cache
reclaims. A storage presign records the folder whose grant allowed it.

## 404, not 403

Someone not allowed to know a thing exists gets **404**. The exception is the
[`list` rung](../../apps/listing/): a person deliberately shown an app gets a 403
that says so.

## During an incident

| Filter | Answers |
|---|---|
| `session` | Who signed in, from where, and who failed |
| `settings` | What changed on the install, and when |
| A target | Everything that happened to one app or one person |

Client addresses are only as good as your
[trusted proxy list](../../config/listeners-and-origins/). If every row shows the
load balancer's address, fix that first.
