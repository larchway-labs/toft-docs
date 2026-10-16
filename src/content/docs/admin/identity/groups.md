---
title: Groups
description: Local sets of people that can own apps and hold grants.
---

A group is a set of people **on this install**, managed on **People → Groups**.
Groups let a team own and share apps without depending on one person.

## Rules

- **A group is local.** A directory group of the same name is a different thing,
  though it can feed this group's membership — see
  [Directory groups](../directory-groups/).
- **A group is never an actor.** It holds no API keys; nothing runs as a group.
  Keys belong to people, apps, or nobody — see [Keys](../../security/keys/).
- **An app has exactly one owner**: a user or a group. Transferring to a group
  transfers it entirely.
- **A group can hold** app grants at any level, and storage access.
- **A group with any claim mapping can never own an app.** It may hold grants.
  Ownership is a commitment; a directory can change a mapped group's members with
  nothing recorded here.

## Who may change membership

An **administrator**, or a **publisher who is already a member**. A publisher who
creates a group becomes its first member. To a publisher outside the group, add
and remove answer *group not found*. Membership is read per request, so a removal
takes effect immediately.

## Recommendations

- **Own production apps with groups**, not people. You find out why when someone
  leaves.
- **Grant to groups** where a group exists — access reviews become readable.
- **Keep groups nameable.** For "everyone signed in", use
  [authenticated visibility](../../security/anonymous/) instead.
