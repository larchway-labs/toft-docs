---
title: Sign-in providers
description: Adding OIDC and GitHub, and what a provider is and is not.
---

**Providers are database rows**, not configuration files. You add, edit and
disable them from Admin → Authentication, at runtime, and every change is
audited.

## OIDC

The general case: Okta, Entra ID, Google, Auth0, Keycloak, Dex. You supply the
issuer, a client id and a client secret; **endpoints are discovered from the
issuer**, so that is the whole configuration.

The form probes the issuer before the provider is saved, so a typo fails here
rather than at somebody's first sign-in.

Register `{BASE_URL}/api/v1/auth/{provider-id}/callback` as the redirect URI.
The provider id appears in that URI, so choose it before registering the client.

The flow is authorization code with PKCE. Replayed or mismatched state is
refused.

**The button's label is yours.** Name it what your people call it, not "OIDC".

## GitHub

OAuth against GitHub — it predates OIDC, so it has no issuer. Useful for
engineering-only installs and for evaluations.

## The provisioning policy

Four settings decide what happens when somebody authenticates and has no account
here.

| | |
|---|---|
| **`auto_provision`** | Off: an unknown identity is refused and **nothing is created**. |
| **`default_role`** | The role an account is created with. Applied at creation and **never re-applied**, so a later role change survives re-login. |
| **`allowed_domains`** | Comma-separated email domains. An outside address is refused with your message. |
| **`link_by_verified_email`** | Attach to an existing account, but only on a provider-asserted **verified** address matching **exactly one** user. |

`default_role: pending` is a policy of its own — see [Accounts that wait to be
activated](../activation/).

**There is no first-user-becomes-admin rule.** `default_role` never mints an
administrator.

## Groups

A provider's group claim can maintain the **membership** of a group you created
here. That is opt-in per group and off until you attach it — see [Directory
groups](../directory-groups/).

What a claim never does is create a group, or make one an owner of anything.

## Turning someone away is copy you control

Three messages, on Admin → Messages, and they are the difference between a
person filing a ticket and a person doing the right thing:

- **No account message** — authenticated, but no provider will create an account.
- **Locked account message** — their account is locked.
- **Awaiting-activation message** — the account exists and nobody has activated
  it yet.

## Environment-configured providers

The `OIDC_*` and `GITHUB_*` variables exist for one reason: **a fresh install has
no users, so nobody can reach the admin page to configure the way in.**

A provider that came from the environment is offered on the login page like any
other and is **read-only in the API** — PATCH and DELETE are refused. Move it
into the database when you have an administrator who can.

## Disabling and deleting

**Disabling is a switch in the provider's row**, beside the badge that says
whether it is on the login page, and it is immediate: the provider disappears
from the login page, its login route refuses, and so does its callback — a
sign-in already in flight through it does not complete. There is no cache to
wait out. Switching a provider off is its own row in the audit log, not an
update like any other.

**A provider's kind is fixed.** Edit its issuer, its client and its label; an
OIDC provider cannot be turned into a GitHub one, or into a second password
form.

**Deleting a provider keeps every account it provisioned.** Those people exist;
they just have no way in through that door.

**The last working way in cannot be switched off or deleted.** The server
refuses both, and says which provider it is — unless local sign-in is on,
because the [built-in administrator](../local-administrator/) is the way back
in and is re-created if deleted. That is what it is for.

## Every outcome is recorded

Every authentication outcome — success, failure, lockout, refusal, expiry — is
written to the audit log in its own `session.*` family, never folded in with
authorization events.

That matters when you are answering "who signed in, from where, and when": one
family, one question, and no filtering apart of two different things that share
a page.
