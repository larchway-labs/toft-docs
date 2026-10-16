---
title: Your account
description: The Me pages, and what each one answers.
---

Everything about you, rather than about an app, is under **Me**.

## Overview

Who you are on this install, your system role, and what that lets you do.

If you are wondering why there is no **New app** button, this is the page that
answers it: you are a **viewer**, and creating apps is what a **publisher**
does.

## Access

**Everything you can reach on this install, in one list** — apps you own, apps
shared with you, groups you are in, storage you hold a grant on.

This is the fastest answer to "do I actually have access to that?", and the
first place to look before asking somebody to grant you something you may
already have.

An administrator can see the same list for anybody, which is what makes an
offboarding conversation short.

## Credentials

Your [API keys](../../cli/api-keys/): create, name, see when each was last used,
revoke.

Revoking is immediate. There is no grace period.

## Security

Your **sign-in history** — when, from where, and whether it worked. Worth
checking if something looks odd, and the fastest way to confirm that an attempt
even reached the install.

And **revoke all sessions**: ends every session you have, everywhere,
immediately.

Two things about that button:

- It does **not** touch your API keys. Those are separate credentials and stay
  valid — revoke them on the Credentials tab if that is what you meant.
- It is denied to a key. A credential cannot end your sessions on your behalf.

## Storage

The [stores](../../data/browsing-a-store/) you hold a grant on, and a browser for
each. Absent on an install with no storage configured.
