---
title: From RStudio
description: Publishing from RStudio or Posit Workbench with the Publish button and rsconnect, as you would to Posit Connect.
---

If you publish from RStudio today, you can keep doing it. Toft answers the
same calls Posit Connect does, so the **Publish** button and
`rsconnect::deployApp()` work unchanged — you add Toft as a server once,
and from then on you publish to it like any Connect server.

You do not need `toft` for any of this. RStudio talks to Toft through the
`rsconnect` package it already uses.

## Before you start

- **You need to be a publisher.** A viewer can sign in but cannot create
  content. See [Becoming a publisher](../../account/becoming-a-publisher/).
- **Personal API keys must be switched on for your install.** Signing RStudio in
  creates one for you. If adding the account fails before a browser opens, this
  is the usual reason — ask your administrator.
- **A recent `rsconnect`.** Version 1.0 or later; RStudio updates it with your
  other packages.

## Add Toft as a server

In RStudio:

1. **Tools → Global Options → Publishing**, then **Connect…**, and choose
   **Posit Connect**.
2. Enter your Toft address — the one you sign in to, such as
   `https://toft.your-company.com`. Leave off any path.
3. RStudio opens a Toft page in your browser titled **Sign in RStudio**.
4. Check it, and select **Approve**.
5. Back in RStudio, the account finishes adding itself.

### What the approval page is asking

Approving creates a **personal API key** that acts as you — it can deploy, roll
back and read anything you can. The page shows the address the request came
from and the `rsconnect` version that asked.

**Approve only if you just added the account yourself.** Anyone can start a
sign-in and send you the link; approving somebody else's gives them a key that
is you. If you did not just do this, select **Deny** — nothing is created, and
the request cannot be reused.

### From the R console instead

The same sign-in, without the dialog:

```r
rsconnect::addServer("https://toft.your-company.com", name = "toft")
rsconnect::connectUser(server = "toft")
```

`connectUser()` opens the same approval page. If you already have a
[personal key](../../cli/api-keys/), you can register it directly and skip the
browser:

```r
rsconnect::connectApiUser(server = "toft", apiKey = "toftu_…")
```

## Publish

Use the **Publish** button in RStudio, or from the console:

```r
rsconnect::deployApp(server = "toft")
```

The build log streams into RStudio's **Deploy** pane while Toft builds the
app. When it finishes, RStudio opens the app's page in Toft.

What happens on Toft's side:

- **A new app is created** the first time, named after the folder — or after
  `appName` if you pass one. That name becomes its address:
  `/apps/<name>/`.
- **It starts private.** Only you can open it until you share it. See
  [Who can see your app](../../share/visibility/).
- **Your packages come from the bundle.** `rsconnect` records the packages your
  app uses in a `manifest.json`, and Toft installs exactly those. You do
  not need an `renv.lock` for a publish from RStudio. See [R](../../build/r/).
- **It is an ordinary Toft app.** Logs, settings, sharing, schedules and
  rollback all work the way the rest of this guide describes.

## Publish again

Publish from the same folder and `rsconnect` updates the same app — it
remembers which app it published to. Each publish is a new release, and the
previous one keeps serving until the new one is ready. See
[Releases and rollback](../releases/).

If the deploy fails, the app keeps serving its last good release, and the
build log in the Deploy pane says where it stopped.

## Environment variables

Variables you pass to `deployApp()` are stored on the app:

```r
rsconnect::deployApp(server = "toft", envVars = c("DB_PASSWORD"))
```

`rsconnect` reads each value from your own R session and sends it. Toft
stores every variable set this way as **sensitive**: it is never shown back,
on the app's Settings tab or anywhere else. To change one, publish again with a
new value, or edit it on the app's [Settings](../../run/settings/).

## What is different from Posit Connect

Publishing works the same. Managing the app afterwards happens in Toft
rather than through `rsconnect`:

- **Sharing, access and visibility** are on the app's **Access** tab — not set
  from RStudio.
- **Custom URLs** do not exist. An app's address is its name.
- **A name already in use is refused**, rather than renamed. Pick a different
  `appName`.
- **Scheduled re-renders** are set up in Toft. See
  [Scheduled re-renders](../../build/reports/).

## Signing RStudio out

The key RStudio uses is listed under **Me → Credentials** as
**RStudio (rsconnect)**, with when it was last used. **Revoke** it there to sign
RStudio out; the next publish fails, and RStudio asks you to add the account
again.

Like other personal keys it **expires after 90 days**. When it does, remove the
account in RStudio's Publishing options and add it again.

## Posit Workbench

Everything above works the same in RStudio on Posit Workbench. The approval
page opens in the browser you are using Workbench from.

## When it goes wrong

| What you see | What it means |
|---|---|
| Adding the server fails before a browser opens | Personal API keys are switched off for your install. Ask your administrator. |
| RStudio waits and the approval page never appeared | Open the address RStudio prints in its console. |
| `unknown token — add the account again` | The key behind the account was revoked, expired, or the sign-in was denied. Remove the account and add it again. |
| `the request's Date is … more than five minutes from this server's clock` | The clock on the machine running RStudio is wrong. Fix it and try again. |
| `the name "…" is already in use` | Another app has that name. Publish with a different `appName`. |
| `this key is read-scoped` | The key you registered with `connectApiUser()` is read-only. Create a full-scope key, or use the sign-in above instead. |
| The deploy fails at `library()` | A package your app loads was not recorded in the bundle. Load it at the top of your app and publish again. |
