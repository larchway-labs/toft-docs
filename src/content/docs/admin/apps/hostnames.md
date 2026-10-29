---
title: An app on its own hostname
description: Giving one app an address of its own — what it isolates, what your proxy must forward, and what happens to the old link.
---

An administrator can give an app a DNS name of its own — `reports.example.com`
instead of `https://apps.example.com/apps/reports/`. The app is then served at
that name's root, and its old address redirects there.

Set it on the app's **Settings → Identity → Hostname**, or with
`toft hostname reports.example.com --on --app reports`. Only administrators can
set or switch a hostname; owners see it.

## Before you switch it on

1. **Point the name at this install's apps address** — the same load balancer,
   proxy or tunnel that serves `APPS_BASE_URL`. The app's address takes its
   scheme and port from `APPS_BASE_URL`.
2. **Make your proxy forward it**, with its `Host` header intact. On the Helm
   chart, add it to `ingress.appHosts` (a wildcard such as `*.apps.example.org`
   covers many apps); with TLS on, the certificate must cover it too. Toft does
   not issue certificates.
3. **Record the name first, switch it on second.** The two are separate so a
   name can be saved before its DNS exists.

## What switching does

Switching a hostname on or off — or renaming the app — **rebuilds the code that
is already running** at its new address. It is a deployment of its own, marked
*move*, from the same commit; nothing new is pulled from the repository. Until
it finishes, the old address keeps serving and the new one shows *This app is
moving to this address*. Then the old address answers with a permanent redirect,
path and query kept. A stopped or sleeping app is rebuilt and stays stopped or
asleep.

Changing the name while it is on does not rebuild: the app is already at a
root, and the new name answers at once.

The app's owners are emailed when you switch it on or off. A bookmark or link
follows the redirect; a script on another site calling the old address does not,
and needs the new one.

## What it isolates

An app on its own hostname is its own browser origin. Pages of other apps can no
longer act on it as the viewer, and its pages cannot act on them. It is **not**
isolated in any other way: its process and network reach are exactly as before.

Signing in happens per hostname — a viewer is sent through a one-time handshake
the first time — and the session cookie there can only be set by that host.

## Names Toft refuses

A name that is this install's own address or apps address, sits under either of
them, or is a parent of either, is refused — such an app could set cookies the
platform reads. So is an IP address, a wildcard, anything with a scheme, port or
path, a name in `EXTRA_ORIGINS`, and a name another app already has.

If `BASE_URL` later changes so that a stored name collides, Toft switches that
hostname off at startup and moves the app back to its `/apps/` address.

Once any app has a hostname, browsers carry the platform's session in a cookie
only this install's host can set. Everyone signs in once more after the first
hostname is saved.
