---
title: Sessions
description: Idle and absolute session lifetimes, sign-out everywhere, and where sign-in lands.
---

A session has two clocks, both set on **Admin → Settings**:

| Setting | Bounds | Default | Range |
|---|---|---|---|
| `session_idle_minutes` | Inactivity before sign-out | 30 | 5–480, or `0` |
| `session_absolute_hours` | Total session lifetime, however active | 8 | 1–24 |

`session_idle_minutes: 0` turns off sliding renewal: the session simply lasts the
absolute lifetime.

Renewal extends only the idle clock. The original sign-in time (`auth_time`)
never moves, so activity cannot keep a session alive past the absolute limit.

Sessions are signed cookies, not database rows; there is no session list to
browse or prune.

## Ending sessions

| Action | Where | Effect |
|---|---|---|
| **Sign out everywhere** | **Me → Security** | Ends every session the person holds. Personal API keys keep working. Not available to an API key. |
| **Lock the account** | **People → the person** | Ends sessions and stops personal keys — see [Offboarding](../offboarding/) |

## Where sign-in lands

The return destination is validated on the server for password sign-in and every
provider callback. Accepted: a path on this install, or an address on an origin
it trusts (its own, or the apps origin). Anything else — `//host`, `/\host`, or
any value containing a control character — lands on `/`.

## Choosing values

- **Idle**: how long should a laptop left open in a meeting room stay signed in?
- **Absolute**: how long should a stolen cookie be useful?

If people complain about frequent sign-outs, check whether it is the absolute
limit arriving mid-afternoon rather than the idle clock.
