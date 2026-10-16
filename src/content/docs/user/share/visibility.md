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

## What visibility does not do

Visibility controls who reaches your app, not what they can do inside it. If your app has an admin screen, protect it yourself: see [What your app learns about a viewer](../viewer/).
