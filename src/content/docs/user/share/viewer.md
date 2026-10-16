---
title: What your app learns about a viewer
description: The signed role on every request, asking who the viewer is, and the rules for using either.
---

Every request Toft forwards tells your app **what the caller may do** to this app. Your app learns **who they are** only if an administrator turns on viewer identity for it.

## The role

Each forwarded request carries a signed `X-Toft-Role` header.

| Role | Meaning |
|---|---|
| `owner`, `editor`, `viewer` | A signed-in person, by their role on this app. An administrator with no grant reads as `viewer`. |
| `anonymous` | A visitor who is not signed in. Only a public app sees it. |
| `system` | Toft firing a scheduled task on its schedule. |
| `app` | The app's own credential, such as an app key. |
| `unknown` | The header is missing, unsigned, tampered with or expired. Treat it as no role. |

The signing key is per app and changes on every start, and one signed role is good for two minutes. Let the SDK verify it:

```python
import toft

c = toft.caller(request.headers)
if not c.at_least(toft.ROLE_EDITOR):
    return Response(status_code=403)
```

An [app key](../../cli/api-keys/) reaches your app as `app` unless it was given `viewer` or `editor`. A key's role can be narrowed later, never widened.

## Asking who the viewer is

When an administrator turns on viewer identity for your app, your app can ask who is looking:

```python
me = toft.who(request.headers)    # Identity, or None for nobody
if me and "finance" in me.group_names:
    render_ledger()
```

| Result | When |
|---|---|
| An identity | A signed-in person who can open the app: `id`, `name`, `email`, `role`, `is_admin` and `groups`. |
| `None` | An anonymous visitor, or someone whose access was revoked while their page stayed open. |
| An error | Viewer identity is not turned on for this app. Check `toft.app.can("viewer.identity")` at startup. |

On a public app, `email` is always empty. Viewer identity is not available to [static apps](../../build/static/), rendered [documents](../../build/notebooks/) or batch apps: they have no process serving requests.

## Rules for your app

- **Verify, never trust a raw header.** Anything that can reach your app can send any header. Use the SDK.
- **A role is not a person.** Two people with the same role look the same. Use `toft.who` when you need an identity.
- **A role is not domain authority.** "Owners may approve invoices" is a rule about invoices; put it on a group and check `group_names`.
- **Do not assume a viewer exists.** Scheduled tasks and health checks reach your app with nobody behind them.
- **Do not re-implement Toft's rules.** Visibility and grants are enforced before your app is reached. Your app enforces only its own rules on its own screens.
