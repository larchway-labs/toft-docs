---
title: Machine credentials
description: Personal and deploy keys, the app token, what each may do, and what no key can do.
---

Two key classes, told apart by **who they belong to**, plus one token an app uses
to call out.

| Prefix | Class | Belongs to | Managed on |
|---|---|---|---|
| `toftu_` | **Personal key** — acts as a person | That person | **Me → Credentials**; all on **Admin → API keys** |
| `toftd_` | **Deploy key** — for pipelines | Nobody | **Admin → Deploy keys** |
| `tofta_` | **App token** — the app calling Toft | One running workload | Injected as `TOFT_APP_TOKEN`; nobody handles it |

All keys store only a SHA-256, show the secret once, can be disabled or revoked,
and take an optional expiry (`expires_in_days`: default 90, `0` for never, at most
3650; anything else is refused). Every mint, rename, disable, enable and revoke is
audited.

## Personal keys

A personal key **is** its holder: their live role, groups and grants, re-read on
every call. Locking the person stops the key. Treat one like a password.

| Scope | Allows |
|---|---|
| `full` (default) | Everything the person can do |
| `read` | Every `GET`; refused every write |

:::caution[Read is not safe to leak]
A `read` key still reads everything its owner can — source archives, logs, stored
objects, the user directory, and for an administrator the audit log — and still
calls their apps with any method. Scope bounds Toft's own routes, not what a
deployed app does with a request.
:::

The scope is fixed at mint. To change it, mint another and revoke this one.

`api_keys_enabled` (**Admin → API keys**) switches personal keys on install-wide.
It is **off by default**, and turning it off stops existing keys immediately.
**Admin → API keys** stays usable while it is off, so you can find a leaked key.

`toft login` and RStudio's **Add account** both mint an ordinary personal key
through a browser approval page — nobody pastes a token. See
[Publishing from RStudio](../../capabilities/rstudio-publishing/).

## Machines that call one app

There are no app keys. A script, integration or assistant calling an app is an
account of its own from your identity provider, granted on that app, using its
own personal key — so your provider owns its lifecycle, and the app's Access tab
is the one list of who can reach it. Give each integration its own account and
grant it on the one app it serves: a personal key reaches every app its account
can read.

A key starting `toft_` (a removed app key) is refused at the gateway and the API
with a message saying what replaced it. Security scanners use a
[scanner account](../scan-targets/).

## Deploy keys

An administrator mints them for CI. A deploy key belongs to nobody, so it keeps
working when people leave — prefer it to a personal key in a pipeline.

| Scope | Allows |
|---|---|
| `deploy` | Create, upload, deploy, roll back, restart, stop, set and remove environment variables, read history |
| `read` | Those reads only: apps, groups, deploy history, dependency verdicts, deployment archives |

A `deploy` key also starts, reruns and lists an app's jobs and reads their runs,
so a pipeline can run a migration it just shipped. It does not pause schedules
or touch tags or storage. Neither scope deletes apps or old deployments.

**A deploy key deploys an app but cannot open it.** Requests to the app itself
take a personal key or a browser session, so a health check through the app
needs a public app or a personal key of an account granted on it. A `deploy` key can set an app's environment variables so a pipeline can
rotate a secret with the key it already deploys with; it cannot change a
variable an attached credential supplies, and it never reads a sensitive value.
Routes allowed to `deploy` are a strict subset of a full personal key's.
A deploy key must name an owning group when it creates an app. Each action is
audited as `deploy_key:{id}`. An install holds at most 30 unrevoked deploy keys.

## What no key can do

No key manages credentials or authorization: none can mint a key, change a
grant, add a sign-in provider, connect a git host, or point an app at a
connected host (`git_connection_id` is refused with **403 `session_required`**).
Visibility is not a grant: a personal key changes it as its owner may, and a
deploy key only along with code — `"visibility"` on `POST /api/v1/apps`, or the
`visibility` form field on an upload (`POST /api/v1/apps/upload`, or
`POST /api/v1/apps/{id}/upload` for an existing app, which is how an app is
promoted between installs). `PATCH /api/v1/apps/{id}`, which `toft visibility`
uses, is refused to it.
The route list is an allow-list checked by a test that walks the router, so a new
route is unreachable by keys until it is classified.

A refusal names its reason: `key_read_scope` or `deploy_key_read_scope` (a wider
scope would work), `session_required` or `deploy_key_not_permitted` (no key
would).

A credential the install cannot read at all — a bearer token that is no key or
session, an `X-API-Key` that is neither `toftu_` nor `toftd_` — is refused
**401 `invalid_key`**. It is never treated as no credential, so a mistyped key
cannot quietly see only what an anonymous visitor would. A request with no
credential at all is still anonymous. A method a route does not take is
**405 `method_not_allowed`**, with or without a key.

## The one `/admin` route a key reaches

`GET /api/v1/admin/estate/targets` — the [scan-target](../scan-targets/) list —
for **deploy** keys only, so a CI-driven scan needs no person's credential.

## Usage

Per-key usage is visible to the key's owner and to administrators. Check it before
revoking a key, and to spot one used from somewhere unexpected.
