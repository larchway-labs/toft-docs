---
title: Machine credentials
description: Three key classes, what each may do, and the one thing none of them can.
---

Three classes, never blurred, separated by **who they belong to**.

| Prefix | What it is | Belongs to | Where |
|---|---|---|---|
| `lpu_` | A **personal key** — an identity | A person | Me → Credentials |
| `lp_` | An **app key** — a grant on one app | An app | The app |
| `lpd_` | A **deploy key** | Nobody | Admin → Deploy keys |

## Personal keys

They act as their holder: anything that person can do, across every app they can
reach. Treat one like a password.

**Two scopes, chosen when the key is created and never edited**: `full`, which
is what a key is unless somebody chose otherwise, and `read`, which is refused
every write. The Scope column on Admin → API keys is how you answer "which of
these could delete an app".

Read is narrower, and it is **not** safe to leak: a read-scoped key cannot
change anything in Toft, but it can still read anything its owner can read
— source archives, logs, stored objects, the user directory, and for an
administrator's key the audit log — and it can still call that person's apps. A
scope bounds Toft's own routes; it says nothing about what a deployed app
does with a request, because Toft has no view into an app's routes.

You cannot widen or narrow somebody's key, and there is no install-wide setting
forcing narrow ones. The tool you have is the one you already had: disable it,
and say why.

`api_keys_enabled` switches them off install-wide. **Off means absent, and off
means now** — existing keys stop working immediately, with no cache to wait out.

Admin → API keys shows every personal key on the install and lets you revoke any
of them. A person's own page shows theirs.

The CLI's device flow creates one, with the browser session as the
authorization. Nobody pastes a token. RStudio's Add account dialog goes through
the same approval page and creates one named **RStudio (rsconnect)** — see
[Publishing from RStudio](../../capabilities/rstudio-publishing/).

## App keys

Scoped to one app. An app key can carry a stored role — one of two — **bounded by
what the app's own gate already allows and never widened**.

The natural use, beyond automation: an app key is the credential to hand to
whoever is running a security scan against one app.

## Deploy keys

For pipelines. **A deploy key belongs to no person**, so it does not stop working
when somebody leaves — which is the actual problem it solves.

Two scopes, and **the deploy scope's route list is a strict subset of a
full-scope personal key's**. Not a different set: a subset, verified by walking
the router.

Encourage them. A personal key in CI is a person's identity in a place nobody is
watching.

A deploy key's expiry is bounded the way a personal key's is: the same range of
days, and a value outside it is refused rather than read as *never*.

What a deploy key does — a deploy, a restart, a stop, a rollback, a promotion —
is recorded in the audit log as that key, by name.

## What no key can do

**No key manages credentials or authorization.** A key cannot mint another key,
change a permission, add a provider, connect a git host, or alter who can see
what.

**That includes pointing an app at a connected git host.** Choosing a connection
for an app is a credential decision, so a **personal key and a deploy key alike**
are refused with a 403 `session_required` — before anything is written, so no app
is created and none is re-pointed. Do it in the UI, as a person; a pipeline
deploys from a repository the connection already covers.

It **fails closed**, and a test walks the router: a route that forgot to declare
itself is not reachable by a key at all.

## The one `/admin` route a key reaches

**`GET /admin/estate/targets`** — the [scan-target](../scan-targets/) list — and
only for a **deploy** key. An `lp_` app key may not: an app key is a grant on one
app, and the estate is not one app.

That exception exists so a CI-driven scan does not need a person's credential.

## Usage

Per-key usage is recorded and readable by the key's owner and by you. It is the
fastest way to answer "is this key still in use?" before revoking it — and the
fastest way to notice one that is being used from somewhere unexpected.
