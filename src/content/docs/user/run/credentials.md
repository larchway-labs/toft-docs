---
title: Credentials an administrator attaches
description: Values your app needs and you never hold.
---

Some values your app needs are not yours to hold: the password to the corporate
warehouse, a shared API key, a service account. An administrator can hold those
centrally and **attach** them to your app.

## What you see

On your app's Settings tab, an attached credential shows as **the key names it
supplies** — `DATABASE_URL`, `WAREHOUSE_PASSWORD` — and nothing else.

**The values are returned by no route, to anybody.** Not to you, not to an
administrator, not through the API. You find out what a credential supplies, not
what it contains.

## What your app sees

At start, the keys are in your app's environment exactly like your own
variables. Your code cannot tell the difference and does not have to.

They do **not** appear in the app's own variable list — the list is what you
set. Two lists, two owners.

## The rules that will affect you

**One source per key.** If a credential supplies `DATABASE_URL`, you cannot set
`DATABASE_URL` yourself. The write is refused, naming the key and what already
supplies it.

**Detaching restarts your app.** Removing a credential takes effect immediately,
which means the workload is restarted onto its current release. Editing the
*values* inside a credential does not restart anything — it raises the same
unapplied-change banner an ordinary variable edit does.

**A credential in use cannot be deleted.** An administrator trying to delete one
attached to apps is refused, and told which apps.

## When you want one

Ask. The conversation is short: which app, which key names, and why it should
not simply be a variable you set. The usual answers are "several apps need the
same value" and "I should not be able to read it".
