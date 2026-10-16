---
title: Reachability
description: How Toft confirms public apps answer from outside, and withdraws anonymous access when they do not.
---

When an install has public apps, Toft asks an outside service whether those apps
actually answer from the internet. An app marked public that nobody outside can
reach loses anonymous access until its owner acts.

The service's address is compiled into the binary. There is no environment
variable, setting or off switch. The check is absent when no app is public
(including when [anonymous access](../anonymous/) is off), and inert when the
service cannot be reached.

## What is sent

Only things already public: an install ID that authenticates nothing, the
platform version, the homepage URL, and the URLs of public apps. No names. A
sleeping app is never woken to be probed, and a probe never counts as
[usage](../../apps/quiet/). Your license can switch probing off.

## Verdicts

- Only an explicit `not_ok` counts against an app. A timeout, error or `unknown`
  changes nothing.
- Apps are judged only while the install's own homepage (and, on a two-origin
  install, the apps origin) answers `ok`.
- A failing **origin** is reported once — one audit row and one administrator
  notification — and suspends no app.

## The latch

A failing app is suspended: it behaves as **Authenticated** (signed-in people keep
access). Its stored visibility is never changed. The suspension clears only when
the owner **changes the app's visibility** or renames its slug — no later verdict
restores it.

After fixing the infrastructure, an administrator can clear every suspension on
the install with `POST /api/v1/admin/reachability/rearm`, from a signed-in session
(no key can call it, and there is no button). It re-arms rather than re-checks: an
app whose cause is not fixed is suspended again within a couple of rounds.

## When it fires

Almost always infrastructure: DNS, a firewall, a proxy that does not forward, TLS.
Check from outside yourself before asking a developer.

The **Public reachability** row on **Admin → System checks** shows the stored
verdict, certificate expiry and suspended apps. It reads `warn`, never `fail`, and
`skip` when nothing is published or no verdict has arrived.

:::note
The check knows only what is reachable from where it runs. An app behind a WAF,
geo-routing or an IP allowlist is better set to **Authenticated**.
:::
