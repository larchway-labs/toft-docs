---
title: The built-in administrator
description: The local admin account every install has, switching password sign-in off, and recovery.
---

Every install has one local administrator, **`admin`**. It cannot be deleted —
if it goes missing it is re-created at the next start. It exists to:

- **bootstrap** an install that has no providers yet, and
- **recover** one whose identity provider is misconfigured, expired or down.

## Its password

There is no default. The first password comes from `BOOTSTRAP_ADMIN_PASSWORD` or
is generated and printed once — see [First run](../../start/first-run/). It is
**must-change**: it signs nobody in and only lets you replace it.

Ten wrong passwords lock the account for 15 minutes; a successful sign-in clears
the count.

## Switching local sign-in off

On **Admin → Authentication** you can disable local sign-in. Its routes then
**404** and the login page shows no password form.

- **Refused** unless another provider is ready **and** an unlocked administrator
  can sign in through it.
- **Admin → System checks** shows **Lockout risk** when local sign-in is off and
  there is only one administrator.
- **It cannot be switched back on from the web or API.** Only the command below
  can.

## Getting back in

On the host, with the server binary (not the `toft` CLI):

```bash
toft local-admin enable          # one box: docker compose exec toft toft local-admin enable
```

It talks to Postgres directly — the server need not be running — switches local
sign-in on, unlocks `admin` and prints a new password. `toft local-admin status`
reports the state; `--password` sets your own instead of a generated one.

Recovery requires a shell on the machine. There is no reset email.

## Keeping it safe

- Store the password where your team keeps break-glass credentials.
- Do not use it day to day. Give administrators their own accounts so the audit
  log names people.
- The dormancy sweep never locks an administrator, so `admin` will not disable
  itself.
