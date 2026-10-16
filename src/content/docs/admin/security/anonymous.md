---
title: Anonymous access
description: The switch that decides whether this install publishes anything at all.
---

An install may decline to publish anything. One switch —
`public_apps_enabled` — and it is **on by default**, meaning anonymous access is
permitted unless you turn it off.

## It takes a capability away

This is the mental model to keep. The switch does not *offer* publishing; it
**removes** it. Off means no app on this install can be reached without signing
in, whatever its own setting says.

## What happens to apps set to public

They become **`authenticated`** — not private.

The platform **never rewrites an app's stored visibility**. What changes is the
answer the authorizer gives, and the substitution is deliberately the *nearest*
thing rather than the strictest: an app whose owner shared it as widely as
possible stays shared as widely as this install allows.

Turn the switch back on and everything that was public is public again. Nothing
was lost, because nothing was written.

## What it gates

**The transition, not the state.** It is not a lock, and it does not stop
anything already running.

## Off means no outbound request

An install with anonymous access off makes no outbound request related to it — no
[reachability probe](../reachability/), nothing. Off is genuinely off, not "on
but ignored".

## There is no per-app exemption

You cannot except one app. That is on purpose: an exemption list is a thing that
grows, and the value of this switch is being able to say "nothing on this install
is reachable anonymously" without qualification.

## The other suppressor

[Reachability](../reachability/) can also subtract anonymity, independently.

Both reach the authorizer as **one fact carried on the app row**, through the same
two seams — so there is one place where the effective answer is decided, not two
that can disagree. The [scan-target](../scan-targets/) list reports the effective
value, not the stored one.

## Not to be confused with listing

`public_apps_enabled` is about **people who are not signed in**.
[`apps_listable_to_authenticated`](../../apps/listing/) is about people who are.

They sit beside each other on Admin → Authentication because they are the same
question about two audiences, and they are otherwise unrelated: one decides who
may open an app, the other whether its name appears in a list.
