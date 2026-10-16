---
title: The credentials broker
description: Values an app needs and its owner never holds.
---

Admin → Credentials. You hold a value centrally and **attach** it to apps; the
keys arrive in the workload's environment at start, and nobody sees the value.

## When you want one

- **Several apps need the same value** — a warehouse connection string, a shared
  API key. One place to rotate.
- **The app's owner should not be able to read it.** A developer can deploy an app
  that talks to the warehouse without holding the warehouse password.

For anything an owner may legitimately hold, an ordinary environment variable on
the app is simpler and is theirs.

## What is visible

A credential shows as **its name and its key names**. Never its values.

**No route returns a credential's values, to anybody** — not to the app's owner,
not to another administrator, not to you. And **no audit row for any credential
act carries a value**: five actions, names and key names only.

## What the app sees

At start, the keys are in the workload's environment exactly like the app's own
variables. The app's code cannot tell the difference and does not have to.

They do **not** appear in the app's own variable list. Two lists, two owners.

## One source per key

**A key two sources would both supply is refused** — at the attach, and at the
owner's write. `409`, naming the key and what already supplies it.

So an owner who already set `DATABASE_URL` blocks your attach until one of you
removes theirs, and an attach that landed first blocks their write. Neither
silently wins.

## Detach restarts; edit does not

**Detaching restarts the app** onto its current release, because the key has to
stop being in the environment and an environment is set at start.

**Editing the values does not.** It raises the same unapplied-change banner an
ordinary variable edit does, and the app picks it up at its next start. That is
deliberate: rotating a credential should not restart nine apps at once unless you
choose to.

## Deleting is refused while attached

`409`, **naming the apps**. Detach them, or accept that you are about to break
them and do it deliberately.

## Rotating

1. Edit the values.
2. Restart the apps when you want them to pick it up — or let them, at their next
   start.

If the old value must stop working immediately, restart them immediately. The
banner tells each app's owner what state they are in meanwhile.
