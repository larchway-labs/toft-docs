---
title: Ownership, grants and the three rungs
description: Who owns an app, the list, viewer and editor rungs, and the rules authorization rests on.
---

## Ownership

**An app is owned by one user or one group** — never both, never neither. The
creator's principal decides it, on every creation path. A
[mapped directory group](../../identity/directory-groups/) may hold grants but
never own.

**Transfer** moves ownership entirely: `POST /api/v1/apps/{id}/transfer`, or in
bulk from a person's page before deleting them
(`POST /api/v1/users/{id}/transfer-apps`).

An owner Toft will not accept — at create, transfer or bulk transfer — is
refused with 422, a code of its own and a hint:

| Code | The owner named |
|---|---|
| `owner_not_found` | No such user or group. |
| `owner_is_viewer` | A user whose account role is viewer. Raise their role first, or name someone else. |
| `owner_user_locked` | A locked user. Unlock the account first, or name someone else. |
| `owner_group_mapped` | A group whose membership comes from a directory. Grant it access instead. |
| `owner_group_empty` | A group with no members, so nobody could administer the app. |
| `owner_group_no_eligible_member` | A group whose every member is locked or a viewer. |
| `invalid_owner_type` | An owner type other than `user` or `group`. |

## The three rungs

Granted to a person or a group, per app, on its **Access** tab.

| Rung | Can |
|---|---|
| **list** | See the app's name, slug, owner and framework in a listing. Cannot open it. |
| **viewer** | Open the app. |
| **editor** | Deploy, configure, run automation. |

A person whose system role is viewer cannot be granted editor: editing means
deploying, which is what a publisher does. The grant is refused with that reason.

## Listable and readable

| | Means | Used by |
|---|---|---|
| **Listable** | Appears in a listing (includes the `list` rung) | Listings |
| **Readable** | May be opened | Every other read: consumption, events, logs, deploy history, the workload |

Nothing defines a third set, which is why an app can appear in a list without
any other field leaking.

## Rules the model keeps

- **404 over 403.** Something you may not see does not exist. The exception: a
  holder of the `list` rung gets a `403` that says so, because they were told it
  exists.
- **Every route that takes an id scopes by it.** A guessed id never crosses a
  boundary.
- **Audited in the same transaction.** Authorization changes write their audit
  row atomically with the change.

## What can this person reach?

- **People → (a person)**, its access section, for you.
- **Me → Access**, for them.
- An app's **Access** tab, for effective permissions on that app.
