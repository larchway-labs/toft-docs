---
title: Connected git hosts
description: Holding the clone credential centrally, so developers never do.
---

A **connection** is your organization's git host, attached once by you. Apps then
point at a repository instead of carrying a credential of their own.

Admin → Sources.

## What it buys

- **Developers get a repository picker** instead of a URL box, and are never asked
  for a token.
- **Private repositories work** without a secret in an app's settings.
- **Auto-deploy on push**, via a webhook the connection owns.
- **One credential to rotate**, rather than however many people pasted a PAT
  somewhere.

## Auto-deploy

Two mechanisms, and an install rarely chooses:

- **A webhook** the connection owns, when the host can reach this install.
- **Polling**, on `AUTO_DEPLOY_POLL_INTERVAL`, when a hook cannot reach in.

The interval is a [dial](../../config/operating-dials/). Whether a poller exists
at all is the environment's answer — `AUTO_DEPLOY_POLL_INTERVAL=0` constructs
none — because "is auto-deploy offered" is a capability question rather than a
pace.

## Testing it

Every connection has a **test**, and a list of the apps using it. Run the test
when you make it and when you rotate it; a connection that authenticates and
cannot see the repositories you expect is a specific, fixable state.

## Expiry is watched

The checks page has a **clone credentials** row:

- `fail` past expiry, **naming the app count** it affects.
- `warn` inside 14 days, or after a failed mint.
- A disabled connection is excluded.

That is the row that stops a token expiring quietly and taking every deploy with
it on a Monday morning.

## Only a person attaches one

Pointing an app at a connection is done from a signed-in session, never with a
key. A **personal key** and a **deploy key** are both refused (403
`session_required`) before anything is written, so a CI pipeline cannot create an
app on your credential or re-point one at it. Any signed-in person may attach — no
role gates it — because the boundary is the one you drew: the connection has to
cover the repository, and a request for one it does not cover is refused naming
both. See [keys](../keys/).

## Disable versus remove

**Disable is immediate and unrefusable.** You can always stop using a source right
now.

**Remove is refused, naming the apps** that depend on it. You cannot delete one
out from under running apps without being told what you would break.

Those are two different actions on purpose, and the pair is the shape you want
during an incident: stop it now, clean it up when you know what it touched.

## No credential is ever shown

Not to a developer, not to another administrator, not through the API — and **not
in a checks report**. A connection with all three of its ciphertexts set renders a
report containing none of them.

Rotation is replacing the credential, not reading it.
