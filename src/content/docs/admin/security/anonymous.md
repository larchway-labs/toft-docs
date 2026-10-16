---
title: Anonymous access
description: One switch that decides whether any app on this install can be opened without signing in.
---

`public_apps_enabled` on **Admin → Authentication** decides whether anything on
this install is reachable without signing in. It is **on by default**.

## What off does

| | |
|---|---|
| Apps set to **Public** | Behave as **Authenticated** — every signed-in person keeps access. Never narrowed to private. |
| Stored visibility | Untouched. Turn the switch back on and every public app is public again. |
| Making an app public | Refused. Narrowing visibility is always allowed. |
| Running apps | Keep running. The switch gates the transition, not the app. |
| [Reachability](../reachability/) | No round runs — with no public app there is no outbound request. |

There is no per-app exemption. The point of the switch is to say "nothing here is
anonymous" without a list of exceptions.

## Related

- [Reachability](../reachability/) can also withdraw anonymous access, per app.
  Both feed one effective visibility, which is what
  [scan targets](../scan-targets/) reports.
- [`apps_listable_to_authenticated`](../../apps/listing/), beside it on the same
  page, is about signed-in people seeing an app's *name* in a list — a separate
  question.
