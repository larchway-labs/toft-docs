---
title: Reachability
description: Checking that a public app is actually reachable, and what happens when it is not.
---

If your install is public, Toft asks an outside service whether your public
apps actually answer from out there — before treating them as published.

Configured by `PRESENCE_ENDPOINT`. Absent means absent.

## Why

An app marked public that nobody outside can reach is a false statement in your
own records. Worse, it is one people act on: "it is published" is taken to mean
"it is serving".

## The rules

**Silence is not a verdict, and `unknown` is not `not_ok`.** A gate opens only on
an explicit `ok`. A probe that timed out tells you nothing and is not treated as
failure.

**The payload is a closed list, and every entry is already published.** Nothing
new leaves. The endpoint is compiled in with nothing that overrides it.

**A probe is never usage.** It does not count toward [quiet](../../apps/quiet/),
and **a sleeping app is never woken to be probed**. A round happens because the
install is public, not because an app is awake.

**Recognition may only subtract.** The check can withhold a verdict; it can never
decide a response on the app's behalf.

**A round happens because the license has not said not to** — and only an explicit
refusal counts.

## The latch

A failing verdict **latches**, and only a *change of visibility* clears it. The
platform never rewrites `apps.visibility`, so clearing the latch is the owner's
action, not a background process's.

You can re-arm it from the admin side when you have fixed the infrastructure.

## Two verdicts, and the stricter wins

The **origin** has a verdict and the **app** has one. The origin's is durable and
is the stricter of the two.

A failing origin is told to you **once, on the transition** — not repeatedly — and
it **suspends nothing**. A reachability problem is an information problem; it does
not take your install down.

## When it fires

Almost always infrastructure, not code: DNS, a firewall, a proxy that does not
forward, TLS. Check from outside yourself before asking a developer to look at
their app.

The checks page carries a **reachability** row — the stored verdict, the
certificate expiry, and suspended apps. It reads `warn`, never `fail`, and `skip`
when nothing is published or no verdict has arrived.

## Turning it off

Leave `PRESENCE_ENDPOINT` unset. **Unreachable is inert** — an install that cannot
reach the checking service is not degraded by it.
