---
title: Publishing from RStudio
description: The Posit Connect publishing API — what RStudio and rsconnect can do here, what it depends on, and what it costs to leave on.
---

Toft answers the part of Posit Connect's API that the `rsconnect` R package
uses to publish. People who publish from RStudio or Posit Workbench keep using
the **Publish** button and `rsconnect::deployApp()`, and add your Toft as a
server the way they would add a Connect server. They do not need `toft`.

The developer's side is in the user guide, under **Deploying → From RStudio**.
This page is what you decide and what you can see.

## What it is, and what it is not

**A translation onto things Toft already does.** Nothing in it is a second
way of running an app:

| Connect's term | What it is here |
|---|---|
| Content | An app. Its `name` is the app's address, `/apps/<name>/`. |
| A bundle | An uploaded archive, unpacked by the same code as any other upload. |
| A deploy | An upload deploy: the same build, the same steps, the same history. |
| A task | The deployment, and its build log streamed back to RStudio. |
| Environment variables | The app's variables, stored **sensitive**. |

**What Connect has and Toft does not is not imitated.** Content settings,
access lists, vanity URLs and schedules set from `rsconnect` are refused; people
manage those on the app in Toft. An app published from RStudio is an
ordinary app from the moment it exists.

The API lives at **`/__api__`** on the platform's own address, because that is
the path `rsconnect` sends. If a reverse proxy sits in front of Toft and
forwards only selected paths, it must forward `/__api__` and `/cli`.

## What it depends on

There is no switch for this surface by itself. It follows the decisions you
have already made:

- **Personal API keys** (`api_keys_enabled`). Both ways RStudio signs in end in
  a personal key, so with keys off, publishing from RStudio is off — the
  sign-in is absent and every request is refused. See
  [Machine credentials](../../security/keys/).
- **Archive uploads** (`source_uploads_enabled`). What RStudio sends is an
  archive. With uploads off, creating an app from RStudio is refused, and so is
  publishing into an app that deploys from a git repository. See
  [Trusted app sources](../../security/sources/).
- **Roles.** Creating an app needs the publisher role; publishing into one needs
  the right to edit it. Exactly as in the web interface.
- **Everything else a deploy meets** — the license's app cap, app locks, the
  dependency policy, retention, the execution mode a new app is born in —
  applies unchanged, because it is the same deploy.

**Deploy keys cannot use it.** An app created from RStudio needs a person to own
it, and a pipeline has `toft`.

## How RStudio signs in

Two ways, and both end in an ordinary personal key.

**RStudio's own Add account dialog.** `rsconnect` generates a key pair on the
publisher's machine and registers the public half. RStudio opens a page in their
browser — the same approval page `toft login` uses, titled **Sign in RStudio** —
showing the address the request came from. When they approve, Toft creates
a personal key named **RStudio (rsconnect)** and binds it to that key pair.
From then on every request RStudio makes is **signed**; no secret travels with
it. The private key stays on the publisher's machine.

**A key pasted into the console.** `rsconnect::connectApiUser()` with a personal
key the person created themselves.

Either way, what you see is a personal key. It is on **Admin → API keys** with
its owner, scope and last use, and you revoke or disable it there like any
other. **Revoking an RStudio key signs that RStudio out** on its next request.
It expires on the personal-key default of 90 days, after which the person adds
the account again.

The approval page is the defence against somebody being sent a sign-in they did
not start. It names the requesting address, so if Toft sits behind a proxy,
`TRUSTED_PROXY_CIDRS` has to name it — otherwise every request appears to come
from the proxy. See [Listeners, origins and proxies](../../config/listeners-and-origins/).

### What the signature protocol fixes

`rsconnect` decides how requests are signed, and Toft cannot change it:

- **RSA with SHA-1.** An install running in a FIPS-only mode refuses SHA-1
  signatures, and RStudio's sign-in will not work there. A pasted key still does.
- **A five-minute clock window.** A signed request carries its time, and one
  more than five minutes from Toft's clock is refused. A publisher whose
  machine has a wrong clock is told so. Within the window, a captured request
  could be replayed — the same exposure Connect has. TLS is what stops it being
  captured.

## What you can see

- **Admin → API keys** — every RStudio key, by owner, with last use.
- **The audit log** — the approval, and the key's creation recorded as via
  `rsconnect`; then every deploy and change as the person, with the key beside
  it.
- **The app** — its deployments, marked as uploaded, with the build log RStudio
  showed.

## Turning it off

Switch off personal API keys, or archive uploads. There is nothing to configure
for this surface alone, which is deliberate: it is two capabilities you already
govern, reached by a different client.

`/__api__/server_settings` still answers when keys are off. It reports that
neither way in is available, and Toft's version — the same version the
login page already tells anyone who can reach it.
