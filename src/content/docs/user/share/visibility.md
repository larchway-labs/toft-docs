---
title: Who can see your app
description: Private, signed-in and public, and why a setting sometimes will not stick.
---

Every app has one of three visibilities, set on the **Access** tab.

| Visibility | Who can open it |
|---|---|
| **Private** | You, and anyone you or your group have shared it with. |
| **Authenticated** | Anyone who can sign in to this install. |
| **Public** | Anyone with the URL, signed in or not. |

New apps are private.

Visibility is enforced at the gateway, before your app is reached. A private app
does not get the request at all.

## Public may not be available

Your administrator can decline to publish anything from this install. When they
have, choosing **public** gives you **authenticated** instead — not private, and
not a silent failure. Your app is still as widely shared as this install allows.

If anonymous access is switched back on later, apps that were public go back to
being public. Nothing was rewritten, so nothing is lost by the switch.

The same shape applies to licensing: publishing is gated on the **change**, so
an app that is already public keeps serving whatever happens to the license.
There is no state in which your public app quietly goes dark.

## Reachability

If your install is reachable from outside, Toft checks that a public app
actually answers from out there before treating it as published.

- A verdict opens the gate only on an explicit success. Silence is not a
  verdict, and "unknown" is not a failure.
- A failing verdict **latches**, and only a change of visibility clears it.
- A sleeping app is never woken just to be probed, and a probe never counts as
  usage.

This is a check on **addresses**, not on your code. A failure is almost always
DNS, a firewall, a proxy or TLS — worth showing your administrator rather than
debugging in your app.

## Sharing without publishing

Most of the time the answer is not "make it public" but "share it with the
people who need it". See [Sharing with people and groups](../people/).

## Framing

Who may put your app in an `<iframe>` is the install's answer, with a per-app
override on the Access tab. The default is the install itself, and an empty list
means **nobody** — not "anyone".

If you are embedding a dashboard in an intranet page, that is the setting to
ask about.

## What visibility does not do

It controls who reaches your app. It does not authorize anything *inside* it. If
your app has an admin screen, your app has to protect it — see [What your app
learns about a viewer](../viewer/).
