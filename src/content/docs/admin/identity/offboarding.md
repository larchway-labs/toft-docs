---
title: Offboarding and dormancy
description: Removing someone, and the sweep that catches the ones nobody removed.
---

## Offboarding

Locking or deleting an account takes effect **immediately**. Their sessions stop
working and their keys stop working — off means **absent**, and off means **now**.

What does not disappear is their apps. An app owned by a person who is gone is
still there and still serving. That is correct — deleting somebody's account
should not take down a service — but it is a thing to go and deal with.

## The order

1. **Open their access page.** Everything they can reach, in one list.
2. **Transfer their apps**, to a [group](../groups/) if at all possible. There is
   a bulk transfer on their own page.
3. **Revoke their keys**, or confirm they had none.
4. **Lock the account.** Deleting is optional and later.

**Reassign before, not after.** Do it while you can still ask them which apps
matter.

## If you are automating it

A [directory feed](../directory-feed/) can lock accounts for you when your IdP
deactivates them. It cannot transfer apps — that is a judgement.

## Dormancy

Toft can sweep accounts that have not been used in a long time and lock
them: `dormant_lock_enabled` and `dormant_lock_days`. It is the backstop for the
offboarding nobody did.

Three things about it:

**"Last used" is four facts, not the sign-in alone.** A person who has not signed
in for six months but whose API key deploys nightly is not dormant, and treating
a sign-in date as the whole answer would lock out exactly the people whose
automation is working.

**The sweep never locks an administrator.** The account that recovers the install
is not eligible to be locked by an automatic process.

**It never locks an account awaiting activation.** A pending account past the
threshold stays pending.

The sweep runs whatever the setting says and is **inert when off** — no rows
written, not a sweep that runs and decides not to act.

## What a lock does here

A locked account cannot sign in, and its keys do not work. Unlocking is your
action, and both directions are audited. Unlocking stamps the account, which
restarts the dormancy clock.

Locking a person does not lock their apps. Those keep serving, which is why the
transfer step above comes first.
