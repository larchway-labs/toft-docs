---
title: Sessions
description: The two clocks, and the fact that you set both.
---

A session has **two clocks**, and an install sets both.

| Clock | Setting | What it bounds |
|---|---|---|
| **Idle** | `session_idle_minutes` | How long somebody can do nothing before being signed out. |
| **Absolute** | `session_absolute_hours` | How long a session may live at all, however active. |

An eight-hour absolute ceiling means a person who has been working all day is
signed out at hour eight. That is the point of it — the two clocks answer
different questions and you want both.

`session_idle_minutes: 0` collapses to a flat lifetime with no sliding renewal.

## Nothing is written down

Sessions are not rows in a table you can browse. There is no session list to
prune, and no "sign everybody out" button that works by deleting records.

The two numbers are the whole mechanism, enforced against a signed cookie.

## A renewal is the same session

A session that renews is still the same session. **`auth_time` does not move**, so
the absolute ceiling still applies — renewal extends the idle clock, never the
absolute one. Activity cannot be used to live forever.

**The ceiling is not the token's expiry.** They are different numbers, and the
ceiling is the one that ends a session.

## Revoking

A person can end **every session they hold, everywhere**, from Me → Security.
That bumps a token version, and the audit row is written in the same transaction.

Two properties worth knowing:

- **It does not touch personal API keys.** Those are separate credentials and stay
  valid. Somebody who meant to revoke a key has to revoke the key.
- **It is denied to a key principal.** A credential cannot end its holder's
  sessions.

You can also lock an account, which stops sessions and keys together — see
[Offboarding](../offboarding/).

## Where sign-in lands

The page you were sent from is validated **on the server**, by one rule for
password sign-in and every provider's callback, and the browser is only ever sent
to the validated destination — never to the value it supplied. Accepted: a path on
this install, or an address on an origin it already trusts (its own, and the apps
address, so signing in from a protected app lands back on it). Refused, and the
person lands on `/` instead:

- anything that leaves the site, including `//host` and `/\host`;
- **a control character anywhere in the value**. A tab or newline inside the
  leading slashes is removed by a browser's URL parser, which turned `/<tab>/host`
  into `//host`; refusing the character is what closes that.

Password sign-in and password change now return the destination they validated
and the login page navigates to that.

## What to set

There is no universally right answer, and the defaults are reasonable. Two
questions:

- **How long should a laptop left open in a meeting room stay signed in?** That
  is your idle clock.
- **How long should a stolen session cookie be useful?** That is your absolute
  one.

If people complain about being signed out constantly, the idle clock is the one
to look at first — and be aware that "constantly" often means the absolute
ceiling landing mid-afternoon, which is a different fix.
