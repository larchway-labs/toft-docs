---
title: First run
description: Getting in the first time, and the order to do things in.
---

On first start Toft migrates its own schema and comes up with **no identity
providers configured**. That is deliberate, and so is how you get in.

## There is always exactly one way in that needs no provider

A built-in local administrator, `admin`, exists to bootstrap the install and to
recover it later. It is not removable, and it is not a fallback that disappears
once you configure SSO — if your identity provider breaks at 3am, that account
is how you get back in.

## No install ships a password the internet already knows

There is no default password.

- Set `BOOTSTRAP_ADMIN_PASSWORD` where your deployment has somewhere safe to
  keep one (a Helm secret, a mounted file).
- Leave it empty and the server **generates one and prints it once**, at first
  boot, in the log.

Either way the credential carries *must change*: it authorizes nothing except
setting a real password.

**Setting a first password mints no session.** You set it, then you sign in. The
two are separate on purpose, so a request that sets a credential cannot also be
a request that hands out access.

## There is no first-user-becomes-admin rule

A common shortcut in other products, and not one here. The first person to sign
in through a newly configured provider gets that provider's `default_role` —
usually viewer. Administrators are made deliberately, by an administrator.

## The order to do things in

1. **Sign in as `admin`** and set a real password.
2. **Run the [checks](../../operate/checks/).** Before configuring anything, see
   what this install thinks it can and cannot do. It is the fastest orientation
   there is.
3. **Configure a [sign-in provider](../../identity/providers/)** and confirm
   somebody can actually get in through it.
4. **Make at least one of those people an administrator** — *before* you rely on
   SSO for anything.
5. **Decide what is [optional and off](../../capabilities/optional/)**, and turn
   on only what you will use.
6. **Decide whether apps may be [public](../../security/anonymous/)**, and
   whether every app should be [listable](../../apps/listing/) to everyone signed
   in.
7. **Set the [operating dials](../../config/operating-dials/)** if the defaults
   do not suit your machine.
8. **Configure [mail](../../capabilities/email/)** if you want anybody to be
   told anything.

Step 4 is the one people skip. An install with SSO configured and no
administrator behind it works fine, right up until it does not.

## Two things worth doing on day one

**Put the `admin` password where break-glass credentials live.** Not in
somebody's password manager; in the place your team looks during an incident.

**Check the lockout risk row.** If you switch local sign-in off, and there is one
administrator, the checks page says so by name. Do not switch it off with one
administrator.
