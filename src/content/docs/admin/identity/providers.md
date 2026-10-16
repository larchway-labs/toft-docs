---
title: Sign-in providers
description: Add OIDC and GitHub providers on Admin → Authentication, and control who gets an account.
---

Providers are database rows, managed on **Admin → Authentication** at runtime.
Every change is audited.

## OIDC

Okta, Entra ID, Google, Auth0, Keycloak, Dex and any other OpenID Connect
provider. Enter the **Issuer URL**, **Client ID** and **Client secret**; endpoints
are discovered from the issuer, which the form probes so a typo fails there.

Register the redirect URI the form shows:

```text
{BASE_URL}/api/v1/auth/{provider-id}/callback
```

The provider **Id** is part of that URI, so choose it before you register the
client. Sign-in uses the authorization code flow with PKCE. **Display name** is
the button label people see.

## GitHub

OAuth against GitHub. It has no issuer and asserts no groups. Good for
engineering-only installs and evaluations.

## Who gets an account

| Form field | API field | Effect |
|---|---|---|
| **Create accounts on first sign-in** | `auto_provision` | Off: an unknown identity is refused and nothing is created |
| **Role for new accounts** | `default_role` | `viewer`, `publisher` or `pending`. Applied once at creation; never an administrator |
| **Allowed email domains** | `allowed_domains` | Comma-separated. Other addresses are refused |
| **Allowed email addresses** | `allowed_emails` | Individual addresses, **in addition** to the domains |
| **Permitted login groups** | `permitted_login_groups` | OIDC only — see [Permitted login groups](../permitted-groups/) |
| **Link to existing accounts by verified email** | `link_by_verified_email` | Attaches to an existing account only on a verified address matching exactly one user |

`pending` holds new accounts for approval — see
[Accounts that wait to be activated](../activation/). A provider's group claim can
also maintain group membership — see [Directory groups](../directory-groups/).

## Refusal messages

Set on **Admin → Messages**:

| Setting | Shown when |
|---|---|
| `no_account_message` | Authenticated, but no account may be created |
| `locked_account_message` | The account is locked |
| `pending_activation_message` | The account awaits activation |

## Environment-configured providers

`OIDC_*` and `GITHUB_*` variables exist to bootstrap an install nobody can sign in
to yet. Such a provider appears on the login page but is **read-only** — `PATCH`
and `DELETE` are refused. Recreate it in the database once you have an
administrator.

## Disabling and deleting

- **Disabling is immediate.** The provider leaves the login page, and its login
  and callback routes refuse — including sign-ins already in flight. Audited as
  its own event.
- **A provider's kind is fixed.** You can edit its issuer, client and label, not
  turn OIDC into GitHub.
- **Deleting keeps the accounts** it provisioned; they just lose that way in.
- **The last working way in cannot be disabled or deleted** — unless local
  sign-in is on, since the [built-in administrator](../local-administrator/) is
  then the way back.

Every sign-in outcome — success, failure, lockout, refusal, expiry — is audited
in the `session.*` family, separate from authorization events.
