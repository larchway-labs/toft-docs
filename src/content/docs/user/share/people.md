---
title: Sharing with people and groups
description: The three rungs, what each one buys, and how to give somebody the smallest useful one.
---

The **Access** tab is where you share an app. You can grant to a **person** or to
a **group**, at one of three levels.

| Rung | Can |
|---|---|
| **List only** | See that the app exists — its name, slug and owner — in their list. Cannot open it. |
| **Can view** | Open the app and see its page. |
| **Can edit** | Everything a viewer can, plus deploy, change settings, and run automation. |

Ownership is not on this list. Moving it is a [transfer](../ownership/).

## List only, and why it exists

A grant that lets somebody see an app without opening it sounds useless until
you have needed it. It is what makes **asking possible**: somebody who can see
your app in a list can [request access](../requesting-access/) instead of asking
around the office for a URL.

Opening an app you hold at this rung is refused — clearly, with a way to ask —
rather than pretending the app does not exist.

Your install may already grant this rung to everyone signed in, install-wide. If
it does, every app is in everybody's list by name and owner, and nothing about
who may *open* one has changed.

## Withdrawing your app from the list

If your app should not be discoverable that way — its very name says something —
you can withdraw it on the **Access** tab. It then behaves as it did before:
visible only to people you have granted something to.

That withdrawal only ever subtracts. It cannot make an app more visible than the
install allows.

## Groups

A group is a set of people on this install, managed here rather than in your
directory. Granting to a group is how a team keeps access when one person
leaves.

Group membership may be maintained by hand or fed from your identity provider,
depending on how your administrator set it up. Either way, from your side it is
one grant.

## A viewer cannot be given edit

Somebody whose account role is **viewer** cannot hold **can edit** on an app —
editing means deploying, and deploying is what a publisher is. The grant is
refused with that reason, and the fix is for them to [ask to become a
publisher](../../account/becoming-a-publisher/).

## Checking what you actually granted

The Access tab shows effective permissions for the app. Under **Me → Access**
you can see the other direction: everything *you* can reach on this install, in
one list.

## The rule that is not yours to enforce

Every share you make is enforced by the platform, before your app is reached.
Your app does not have to check it, and it must not try to enforce anything on
the platform's behalf.
