---
title: API keys
description: The three kinds of key, and which one you want.
---

There are three key classes. They are never blurred, and which one you want
depends on **who the key belongs to**.

| Prefix | What it is | Belongs to |
|---|---|---|
| `lpu_` | A **personal key** — an identity. It acts as you. | You |
| `lp_` | An **app key** — a grant on exactly one app. | An app |
| `lpd_` | A **deploy key** — for CI. | Nobody |

## Personal keys — `lpu_`

What `toft login` gives you, what signing RStudio in gives you (see
[From RStudio](../../deploy/from-rstudio/)), and what you create under
**Me → Credentials**.

It is *you*: anything you can do, it can do, across every app you can reach.
Treat it like your password. If a script only ever needs to touch one app, give
it an app key instead.

You can name, list, disable and revoke your own keys, and see when each was last
used.

### Full or read

Every key you create has a **scope**, and you pick it once:

| Scope | What it can do |
|---|---|
| **Full** | Everything you can do, except manage credentials or change who may do what. This is what you get if you do not choose. |
| **Read** | Reads only. Every write is refused. |

A read-scoped key cannot change anything in Toft. It can still read
anything you can read — including your apps' source archives and logs — and it
can still call your apps. So a read key is narrower, not safe to leave lying
around: whoever has it can see everything you can see.

Pick **Read** for anything that only ever looks: a dashboard that pulls figures,
a report, an inventory tool. Pick **Full** for anything that deploys or changes
something.

The scope cannot be changed afterwards. To move a key between scopes, create the
other one and revoke this. `toft login` always creates a full-scope key, since
`toft`'s main commands write; to use a read key with `toft`, create it in the
browser and pass it to `toft login --token-stdin`.

A read key that is refused answers `403` with `key_read_scope`, which means a
full-scope key would have worked. `session_required` means no key would.

## App keys — `lp_`

Created on an app, scoped to that app. Useful for a script or an integration
that only ever needs it — and for handing to whoever is running a security scan
against your app, since it authenticates without being anybody.

An app key can carry a stored role, but only one of two, and only within what
the app's own access already allows. It can narrow what the key may do; never
widen it.

## Deploy keys — `lpd_`

For CI, created by an administrator. A deploy key belongs to no person, so it
does not stop working when somebody leaves. What it can do is a **strict subset**
of what a personal key can do.

A deploy key cannot attach a git connection, as a personal key cannot.

Use one in a pipeline. A personal key in CI is a person's identity in a place
nobody is watching.

## What no key can do

**No key manages credentials or authorization.** A key cannot mint another key,
change a permission, add a provider, or alter who can see what. That is refused
for every key class, and it fails closed — a route that forgot to say so is not
reachable by a key at all.

## Turning one off

Off means **absent**, and off means **now**. A revoked key stops working on the
next request; there is no cache to wait out and no grace period.

Your administrator can see and revoke every key on the install, and can switch
personal keys off entirely — in which case existing ones stop working
immediately.
