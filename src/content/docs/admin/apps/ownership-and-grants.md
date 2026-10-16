---
title: Ownership, grants and the three rungs
description: Who may see what, and the rules the whole authorization model rests on.
---

## Ownership

**An app is owned by a user or a group — never both, never neither.** Who owns a
new one is decided from the principal that created it, by one function, on every
creation path.

A [mapped group](../../identity/directory-groups/) may hold grants and may never
own.

## The three rungs

A grant to a person or a group, on one app:

| Rung | Can |
|---|---|
| **list** | See that the app exists — name, slug, owner, framework — in a listing. Cannot open it. |
| **viewer** | Open the app. |
| **editor** | Deploy, configure, run automation. |

Ownership sits above them and is moved by transfer, not by grant.

**A viewer (the system role) cannot hold editor (the object role).** The grant is
refused naming the reason: editing means deploying, and deploying is what a
publisher is.

## Two definitions of "the apps you may see"

This is the distinction the whole model turns on, and it has two names on
purpose:

- **Listable** — what appears in a listing. Includes apps held at the `list`
  rung.
- **Readable** — what may actually be opened, and what every other read narrows
  through: consumption, events, logs, deploy history, the estate census, the
  workload.

**Nothing hand-rolls a third.** A listing asks *listable*; an object check asks
*readable*. That is what makes it safe for an app to appear in somebody's list
without a single other field leaking.

## 404 over 403

A resource somebody may not see **does not exist** as far as the answer goes.
A 403 tells them it is there, which is often the fact worth protecting.

Two scoped exceptions, and they are the same sentence twice: somebody holding an
app at the `list` rung gets a **403 that says so**, because they were told it
exists on purpose and a 404 there would be a lie in the other direction. A
stranger still gets 404.

## Every ID-taking route scopes by that ID

There is no route that reads an id from a URL and then trusts it. This is why a
guessed id does not cross a tenant boundary anywhere in the product.

## Everything is audited in the same transaction

Authorization-relevant mutations write their audit row **in the same transaction
as the change**. A change that happened and was not recorded is not a state the
database can reach.

## Answering "what can this person reach?"

Two pages, one list:

- **A person → Access**, for you.
- **Me → Access**, for them.

Plus effective permissions on one app, from that app's Access tab. Use these
rather than reasoning about grants by hand.

## Transfer

`POST` on the app, or bulk from a person's page before deleting them. A transfer
moves everything: the app is owned entirely by its new owner.
