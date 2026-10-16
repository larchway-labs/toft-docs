---
title: Groups
description: Local sets of humans, and the three rules about them.
---

A group is a set of people **on this install**. Apps can be owned by one, which
is how a team shares an app without one person being a single point of failure.

## Three rules

**A group is a local row.** You create it here, and it exists here. A directory
group with the same name is a different object — though its *membership* can feed
this one, see [Directory groups](../directory-groups/).

**A group is a set of humans, never an actor.** Nothing runs as a group. A group
holds no API keys and owns no credential. When something has to act, that is a
[key](../../security/keys/), and keys belong to people, apps, or nobody.

**An app is owned by a user or a group — never both, never neither.** There is no
unowned app and no co-ownership. Transferring to a group transfers it entirely.

## Who may change a roster

Membership is authorization — a group can hold grants and own apps — so changing
it needs at least the authority it confers. **An administrator, or a publisher who
is already a member of that group.** Membership is read from the database, not the
session, so removing someone takes effect on their next request. A publisher
outside the group is answered *group not found* on add and remove, whatever the
group's name.

A publisher who **creates** a group is made its first member, so they are not
locked out of the group they just made.

## What a group can hold

Grants on apps, at any of the three rungs, and storage access. Everything a
person can be granted.

## What a mapped group cannot do

A group with **any** claim mapping may hold grants and may **never own an app**.
Attaching it as an owner is refused, naming it, on all four ownership paths —
create, transfer, and both of the other create paths.

The reason: ownership is a responsibility somebody accepted, and a directory can
change who is in a group at 2am with nothing on this install recording that a
permission moved.

If a team wants to own apps as a team, give them a locally-managed group.

## Practical advice

**Own production apps with groups, not people.** The cost of the extra step is
one click; the cost of not doing it is discovered when somebody leaves.

**Grant to groups, not to people, wherever the group already exists.** An access
review that reads "the payments team" is a review somebody can actually do.

**Keep them small enough to name.** A group called "everyone" is a visibility
setting wearing a costume — use [authenticated
visibility](../../security/anonymous/) for that.

## Pickers

There is a directory of users and groups behind every picker in the product, so
sharing does not require anybody to know an email address exactly.
