---
title: Offboarding and dormancy
description: Remove someone's access cleanly, and let the dormancy sweep catch the accounts nobody removed.
---

## Offboarding

Locking an account takes effect **immediately**: sessions and personal API keys
stop working. Their apps keep serving — which is why you transfer them first.

1. **Open the person** (**People → the person**) and review their access —
   everything they can reach.
2. **Transfer their apps**, to a [group](../groups/) where possible. The person's
   page has a bulk transfer.
3. **Revoke their keys**, or confirm they have none.
4. **Lock the account.**
5. **Delete it later**, if at all. Deletion is refused while they still own apps.

Do it while you can still ask them which apps matter. A
[directory feed](../directory-feed/) can lock accounts when your IdP deactivates
them; it cannot transfer apps.

## Dormancy

The dormancy sweep locks accounts unused for a set time — the backstop for the
offboarding nobody did. Settings on **Admin → Settings**:

| Setting | Default | Range |
|---|---|---|
| `dormant_lock_enabled` | off | — |
| `dormant_lock_days` | 90 | 30–730 |

"Last used" is the latest of four dates: account creation, last sign-in, last use
of any personal API key, and last unlock. Someone whose personal key deploys
nightly is not dormant.

The sweep never locks:

- an **administrator**;
- an account **awaiting activation**.

When off, it does nothing at all.

## Unlocking

Unlocking is an audited administrator action and restarts the dormancy clock.
Locking a person never locks their apps.
