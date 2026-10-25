---
title: Who can see your app
description: The three visibilities on the Access tab, and what can keep an app from being public.
---

Every app has one visibility, set under **Access → Who can view this app**. New apps are **Restricted**.

| Visibility | Who can open it |
|---|---|
| **Restricted** | You, and the people and groups you [share it with](../people/). |
| **Anyone signed in** | Anyone who can sign in to this install. |
| **Public** | Anyone with the link, no sign-in. |

Toft enforces visibility before the request reaches your app. Your app never sees a request from someone who may not open it.

## When Public is not available

An administrator can turn off public access for every app.

The **Public** option is then greyed out, and an app that is already public is served to signed-in people only, with the notice **This install doesn't publish apps**. It becomes public again when public access returns.

## When a public app is not reachable from outside

If your install checks reachability from outside and two checks in a row fail, the app is served to signed-in people only, and the Access tab shows **This app isn't public at the moment**. The cause is nearly always DNS, a firewall, a proxy or TLS; show it to your administrator. To publish again, choose another visibility and then **Public**.

## Embedding

**Access → Embedding** lists the other sites that may show your app in an `<iframe>`. An empty list means no other site can embed it. Add an origin as scheme and host, for example `https://intranet.example.com`; a leading wildcard is allowed.

## Headers Toft adds to your app's pages

Over https, every response from your app carries Toft's `Strict-Transport-Security` header, and any of your own is replaced. Unless your administrator has turned it off, Toft also adds `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin` where your app sends neither. If your app sends either header itself, with any value, Toft leaves yours as it is. Toft adds no `Content-Security-Policy` beyond the embedding rule above.

With `nosniff`, a browser refuses a script or stylesheet served under the wrong `Content-Type`. If a page goes blank after an upgrade, fix the type your app serves, or send `X-Content-Type-Options` yourself.

## What visibility does not do

Visibility controls who reaches your app, not what they can do inside it. If your app has an admin screen, protect it yourself: see [What your app learns about a viewer](../viewer/).
