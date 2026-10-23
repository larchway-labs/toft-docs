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
| `deploy` | Create, upload, deploy, roll back, restart, stop, read history |
| `read` | Those reads only: apps, groups, deploy history, dependency verdicts, deployment archives |

Neither scope deletes apps, deletes old deployments, or touches jobs, schedules, tags or
storage. Routes allowed to `deploy` are a strict subset of a full personal key's.
A deploy key must name an owning group when it creates an app. Each action is
audited as `deploy_key:{id}`. An install holds at most 30 unrevoked deploy keys.

## What no key can do

No key manages credentials or authorization: none can mint a key, change a
permission, add a sign-in provider, connect a git host, or point an app at a
connected host (`git_connection_id` is refused with **403 `session_required`**).
The route list is an allow-list checked by a test that walks the router, so a new
route is unreachable by keys until it is classified.

A refusal names its reason: `key_read_scope` or `deploy_key_read_scope` (a wider
scope would work), `session_required` or `deploy_key_not_permitted` (no key
would).

## The one `/admin` route a key reaches

`GET /api/v1/admin/estate/targets` — the [scan-target](../scan-targets/) list —
for **deploy** keys only, so a CI-driven scan needs no person's credential.

## Usage

Per-key usage is visible to the key's owner and to administrators. Check it before
revoking a key, and to spot one used from somewhere unexpected.
