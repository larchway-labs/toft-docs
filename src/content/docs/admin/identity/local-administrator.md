---
title: The built-in administrator
description: The account that is always there, and why.
---

One local administrator, `admin`, exists on every install. It cannot be removed.

## Why it exists

Two jobs:

- **Bootstrap.** A fresh install has no providers, so something has to let you in
  to configure the first one.
- **Recovery.** Your identity provider will one day be misconfigured, expired, or
  down. This account is how you fix it.

An install that deletes its way out of local sign-in is an install one
certificate rotation away from nobody being able to get in.

## No shipped password

There is no default. Either you set `BOOTSTRAP_ADMIN_PASSWORD` where the
deployment has somewhere safe to keep one, or the server generates one and prints
it once at first boot.

Either way it carries *must change*: it authorizes nothing except setting a real
password. **A first password mints no session** — setting one and signing in are
separate steps, so the request that sets a credential never also hands out
access.

## Switching local sign-in off

You can, and the route then **404s rather than 403s** — absent, not refused.

Two protections:

- **It is refused while no administrator could sign in another way.** The refusal
  names the reason.
- The [checks page](../../operate/checks/) raises a **lockout risk** row when
  there is one administrator and local sign-in is off.

Do not switch it off with one administrator. The second one is the whole point.

## Getting back in

```bash
toft local-admin
```

A subcommand of the binary that **talks to Postgres and exits** — it does not
need the server it is repairing. It re-enables local sign-in and resets the
password.

That is the entire recovery model: **proof you have the machine**, not proof you
control an email address. There is no reset link, and there is no vendor who can
let you in.

## Keeping it safe

- Long, unique password, in the place your team keeps break-glass credentials —
  not in one person's password manager.
- It is an administrator. Everything it does is audited like everything else.
- **The dormancy sweep never locks an administrator**, so it will not quietly
  disable itself while you are not looking.

## Do not use it day to day

Give your administrators their own accounts through a provider, so the audit log
names people rather than a shared account. `admin` should appear in the audit log
twice a year, and both times you should remember why.
