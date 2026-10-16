---
title: Licensing
description: What a license gates, what it cannot do, and why it is not a security boundary.
---

## Bookkeeping and friction, never a security boundary

Say that out loud before designing anything around it. The license is not access
control. It does not protect data and it does not stop anyone doing anything that
matters to security.

## The key is a lookup, not a credential

It is **plain text**, audited in the clear, and readable back in full. It **names a
customer, never an install**.

There is nothing to rotate and nothing to protect. One normaliser reads it, and
the `LP<n>` prefix manages the drift between what this build expects and what the
vendor issues.

## A license gates configuration, never operation

This is the guarantee that matters when a license lapses.

**Publishing is gated on the transition**, so an app that is already public
**keeps serving**. Nothing goes dark because a check came back unfavourably.

**No verdict withdraws anything.** Every failure resolves to the tier you already
hold. The only thing that can fall is the tier itself, on an **explicit adverse
verdict, after weeks of warning**.

**Switching a licensed thing off is never gated either.** Handing telemetry back
to the environment, switching an exporter off, narrowing the source policy to
none, turning uploads off — all of them pass on an install whose trial has
ended. A lapse cannot trap a collector in place.

A dead license server changes nothing.

## Off means no outbound request at all

An install with licensing off makes no outbound call. The endpoint is **compiled
in with nothing that overrides it**, and **a private address is refused** — you
cannot point it at an internal server.

## There is no seat cap on any tier

**Nothing licensed refuses anything on a count.** The demo and free tiers refuse
*creation* on one — three enforcement points, and that list is the specification —
and that is all.

**The install count refuses nothing and never will**, and neither does the seat
count beside it.

## Plans and tiers are different words

A **plan** is the vendor's word; a **tier** is this build's. The two lists do not
line up, the mapping is the vendor's, and **nothing infers a tier from a plan**.

Four tiers — demo, free, trial, paid — **derived and never stored**.

## What is entitlement-gated

Dependency policy, identity providers, groups, app storage, telemetry, trusted
sources, integrations, Slack, public apps.

Admin → Features shows what this build offers, what the license covers, and what
you have switched on. **The names are data, not code.**

## Not licensed is visible

Unlike every other [optional capability](../../capabilities/optional/), a
capability withheld by tier is **shown, and shown as locked**.

That is the inverse of the absent-not-dormant rule, deliberately: unconfigured is
a decision you made and should not be nagged about; unlicensed is a decision
somebody else made, and you are entitled to see what you do not have.

## What is in the check-in payload

**Nothing in it is a name.** No app names, no user names, no hostnames. The install
renders the payload before sending and asserts the type of every value.

The counts ship on and can be switched off — `license.send_usage` — with one
exception a paid license cannot suppress. No screen renders the body, and there is
no switch in front of it beyond that one.

`install.id` has no writer: it is set once and never updated.
