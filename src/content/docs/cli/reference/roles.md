---
title: The six roles
description: The role words a request carries, what each means, and how your app verifies them.
---

Every request Toft forwards to your app carries a signed role: **what the caller
may do**, not who they are.

| Role | Caller |
|---|---|
| `anonymous` | A visitor not signed in to Toft. Only public apps see it. |
| `viewer` | May look. |
| `editor` | May change. |
| `owner` | Owns this app. |
| `system` | Toft itself, such as a job's schedule starting it. A job reads it as its trigger role. |
| `app` | An app credential: an app key at the gateway, or a job the app started. |
| `unknown` | Not sent by the platform. The SDK's answer for a missing, invalid or expired role. |

## Comparing roles

```js
if (!toft.caller(req.headers).atLeast(toft.ROLE_EDITOR)) return res.status(403).end();
```

`at_least` compares on the ladder `anonymous < viewer < editor < owner`.
`system`, `app` and `unknown` are not on it, so every check against them is
false.

A rung doesn't guarantee a human. An app key can carry `viewer` or `editor`, and
satisfies checks exactly as a person with that role does.

## Things that surprise people

- **A job started by hand is not `system`.** Its trigger role is that of
  whoever pressed **Run now** or ran `toft job run`.
- **A Toft administrator with no grant reads as `viewer`.** The role has no admin
  bit; use [`who`](../../sdk/viewer/) and `is_admin`.
- **The role is always on.** Viewer identity (`who`) is off until an
  administrator enables it; the role is not, because an app that can't tell an
  editor from a visitor can't be written safely.

## How it is signed

The role header (`X-Toft-Role`) is signed per app and per start, and verified
locally against `TOFT_ROLE_KEY` with no network call. It is signed rather than
just stripped at the proxy because, in shared mode, another process on the same
machine could reach your port directly.

A signature format the SDK doesn't recognize is treated as `unknown`.
