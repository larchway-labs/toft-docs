---
title: Accounts that wait to be activated
description: Create accounts on first sign-in but admit nobody until an administrator activates them.
---

Set a provider's `default_role` to **`pending`** and its first sign-in creates
the account but refuses entry. An administrator then decides whether the person
gets in, and as what.

Use it when your directory holds more people than should have access, or to
prepare grants before somebody's first day.

## How it behaves

- **Pending is a state, not a role.** It is not in the role picker. A pending
  account is refused at every sign-in, not just the first.
- **Administrators are notified once**, by email and any connected channel, on
  the sign-in that created the account — not on retries.
- **The person sees the awaiting-activation message** from **Admin → Messages**
  (`pending_activation_message`). Say who to contact.

## Activating

**People → Pending**, then activate and choose a role. Activation is one audited
action.

| Refused | Why |
|---|---|
| Activating as administrator | Promote separately, after activation |
| Activating twice | The account is already active |

Activation does **not** unlock a locked account — pending and locked are separate.
The person is told by email only (`account_activated_message`); with no email
configured, tell them yourself.

## What never puts someone in the queue

- **Linking.** An existing account reached through `link_by_verified_email` stays
  active, whatever the new provider's policy.
- **The dormancy sweep.** It never locks a pending account.
