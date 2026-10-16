---
title: Permitted login groups
description: Restricting a provider to members of named directory groups, and the lockout that makes it a gate.
---

A provider can be told **which directory groups it is allowed to admit**. Only
people whose sign-in asserts one of the listed groups get in; everybody else the
provider authenticates is turned away.

This is the gate for the install pointed at one corporate tenant, where the
email-domain check admits every employee. The alternative — turning account
creation off and approving each person by hand — is a queue, not a policy.

**OIDC only.** GitHub asserts no group claim at all, so a permitted-groups list
on a GitHub provider is refused at the form rather than silently ignored.

## Setting it up

On Admin → Authentication, open the provider and fill in **Permitted login
groups**: comma-separated **claim values** — the strings your IdP sends, usually
group names or object ids.

They are matched against **what the provider asserted**, before anything on this
install is consulted. They are not the names of [groups you created
here](../groups/), and not the claim values you may have attached to those
groups for [directory sync](../directory-groups/). Sync *grants*; this
*subtracts*, and the two deliberately do not share a table — so an
authentication decision never depends on an authorization one.

**An empty list admits everybody.** A provider that predates this field is
unaffected, and clearing the field turns the gate off.

## The lockout, stated plainly

**With a non-empty list and no group claim asserted, the sign-in is refused.**

That is what makes it a gate rather than a preference. Failing open would make
the setting decorative: a dropped scope, an Entra group overage, an Okta app
configured to omit the claim would each quietly reopen the install to the whole
tenant.

The cost is real and worth saying out loud: **a provider that stops asserting
groups locks out every one of its users at once, administrators included.**

That is an acceptable trade only because the [built-in
administrator](../local-administrator/) does not go through a provider and is
always the way back in. Check the claim is really arriving before you rely on
this — the form warns you the moment you type into the field, and so does the
checks page.

A claim that is **present and empty** is not the same as an absent one, and is
honoured: it matches nothing and refuses that person, not everybody.

## A claim sent as one string

Some providers deliver groups as a single delimited string rather than a list.
Set **Groups separator** on the provider and it is split on that; without it the
whole string reads as one group name, matching nothing.

Harmless while the only consumer was directory sync, which merely granted less.
Not harmless the moment a consumer refuses.

## What it does not decide

**Passing the gate grants nothing.** No group, no role, no account beyond what
the provisioning policy would have created anyway. It decides who may sign in,
never what they may then do.

Mapping IdP groups onto Toft roles is deliberately not part of this — that
collides with the rule that [activation](../activation/) is one audited act that
never mints an administrator.

## Nothing is created for a refused person

The gate runs **before identity resolution**, so somebody it turns away leaves
no account, no identity row and no pending activation. Otherwise the People page
would fill with everybody in the tenant who ever tried the wrong door.

It runs **after** the domain check, because that answer is cheaper and its
remedy is not "ask your directory administrator".

## Individual addresses are a union

**Allowed email addresses** sit beside allowed domains and **widen** them —
somebody matching either list may sign in. "The domain, plus two contractors" is
the request that arrives immediately after a domain gate goes on, and reading
the two fields as an intersection would make both unusable at once.

## Telling a working policy from a provider that has gone quiet

The audit log keeps the two refusals apart, because they have different
remedies:

| Reason | What happened | Where the fix is |
|---|---|---|
| `group_not_permitted` | A claim arrived and matched nothing on the list | The provider form here |
| `group_claim_absent` | No group claim arrived at all | Your IdP |

The person at the login page is told the same sentence either way. Saying which
half they tripped would tell somebody probing the door where the policy's edge
is.

## Checking it works

The checks page has a **Permitted login groups** row:

- `skip` — no provider restricts sign-in by group.
- `pass` — naming the gated providers, with what a vanished claim would cost and
  where the way back in is.

It **passes rather than warns**. A gate somebody configured on purpose and that
is working is not a fault, and a warning nobody can clear is how that page
decays into a wall nobody reads.

## What is certain, and what is only likely

Toft refuses the configuration it is sure could never work — a list on a
GitHub provider — and warns about the rest. It does **not** refuse a gated OIDC
provider whose scopes look as though they cannot deliver the claim: on Entra,
groups come from the app registration rather than a requested scope, and a false
refusal on a correct configuration is worse than a warning nobody had to act on.
