---
title: Permitted login groups
description: Restrict an OIDC provider to members of named directory groups — and the lockout risk that comes with it.
---

A provider can admit **only people whose sign-in asserts one of a list of
directory groups**. Everyone else it authenticates is refused. Use it when an
email-domain check would admit your whole tenant.

**OIDC only.** GitHub asserts no groups, so a list on a GitHub provider is
refused.

## Setting it up

On **Admin → Authentication**, open the provider and fill in **Permitted login
groups**: comma-separated **claim values** exactly as your IdP sends them (group
names or object ids).

- They are matched against the provider's claim, not against
  [groups on this install](../groups/) or [directory sync](../directory-groups/)
  mappings.
- **An empty list admits everybody.** Clearing it turns the gate off.
- If your IdP sends groups as one delimited string, set **Groups separator**.
  Without it the whole string is one group name and matches nothing.

## The lockout risk

**With a non-empty list, a sign-in with no group claim is refused.** The gate
fails closed: a dropped scope, an Entra group overage or a claim omitted by
configuration would otherwise reopen the install to the whole tenant.

:::danger
If the provider stops sending groups, **every** user of that provider is locked
out, administrators included. The [built-in administrator](../local-administrator/)
is the way back in. Confirm the claim arrives before relying on the gate.
:::

A claim that is present but **empty** refuses only that person.

## What it does and does not do

- **It runs before account lookup.** A refused person leaves no account, identity
  or pending activation behind.
- **It runs after the domain check.** **Allowed email addresses** widen
  **Allowed email domains**: matching either passes.
- **Passing grants nothing.** It decides who may sign in, not what they may do.
  It never maps IdP groups to roles.

## Diagnosing refusals

The person sees the same message either way. The audit log separates them:

| Reason | Meaning | Fix in |
|---|---|---|
| `group_not_permitted` | A claim arrived and matched nothing on the list | The provider form |
| `group_claim_absent` | No group claim arrived | Your IdP |

**Admin → System checks → Permitted login groups**: `skip` when no provider is
gated; `pass` naming the gated providers and the way back in if their claim
disappears. Toft warns but does not refuse a gated provider whose scopes look
unable to deliver the claim — on Entra, groups come from the app registration,
not a scope.
