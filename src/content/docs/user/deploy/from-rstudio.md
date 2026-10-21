---
title: From RStudio
description: Publish from RStudio or Posit Workbench with the Publish button and rsconnect, as you would to Posit Connect.
---

Toft answers the same calls as Posit Connect, so RStudio's **Publish** button
and `rsconnect::deployApp()` work unchanged. Add Toft as a server once, then
publish as usual. You do not need `toft`.

## Before you start

- You are a [publisher](../../account/becoming-a-publisher/).
- Personal API keys are switched on for your install — signing RStudio in
  creates one.
- `rsconnect` is version 1.0 or later.

## Add Toft as a server

1. In RStudio, open **Tools → Global Options → Publishing → Connect…** and
   choose **Posit Connect**.
2. Enter your Toft address, such as `https://toft.your-company.com`, with no
   path.
3. A browser page titled **Sign in RStudio** opens in Toft. Select
   **Approve**.
4. RStudio finishes adding the account.

:::caution[Approve only your own request]
Approving creates a personal API key that acts as you. If you did not just
start this sign-in, select **Deny**.
:::

From the R console instead:

```r
rsconnect::addServer("https://toft.your-company.com", name = "toft")
rsconnect::connectUser(server = "toft")
```

Or register an existing [personal key](../../cli/api-keys/) and skip the
browser:

```r
rsconnect::connectApiUser(server = "toft", apiKey = "toftu_…")
```

## Publish

Select **Publish**, or:

```r
rsconnect::deployApp(server = "toft")
```

The build log streams into RStudio's **Deploy** pane, and RStudio opens the
app in Toft when it finishes.

- The first publish **creates an app** named after the folder (or `appName`),
  at `/apps/<name>/`. It starts **Restricted** — [share it](../../share/visibility/)
  from the **Access** tab.
- **Packages come from the bundle's `manifest.json`.** No `renv.lock` needed.
  See [R](../../build/r/).
- **Publishing again** from the same folder updates the same app. The previous
  deployment serves until the new one is ready; see
  [Deployments and rollback](../releases/).

## Environment variables

```r
rsconnect::deployApp(server = "toft", envVars = c("DB_PASSWORD"))
```

Each value is read from your R session and stored as **sensitive** — never
shown back. Change it by publishing again or on
[Settings](../../run/settings/).

## Differences from Posit Connect

- Sharing and visibility are managed in Toft, on the **Access** tab.
- There are no custom URLs; the address is the app's name.
- A name already in use is refused, not renamed. Choose another `appName`.
- [Scheduled re-renders](../../build/reports/) are set up in Toft.

## Signing RStudio out

The key appears under **Your account → Credentials** as **RStudio (rsconnect)**.
**Revoke** it to sign RStudio out. It expires after 90 days; then remove the
account in RStudio and add it again.

Posit Workbench works the same way; the approval page opens in the browser you
use Workbench from.

## Troubleshooting

| Message | Fix |
|---|---|
| Adding the server fails before a browser opens | Personal API keys are off. Ask your administrator. |
| The approval page never appeared | Open the address RStudio prints in its console. |
| `unknown token — add the account again` | The key was revoked, expired or denied. Remove the account and add it again. |
| `the request's Date is … more than five minutes from this server's clock` | Fix the clock on the machine running RStudio. |
| `the name "…" is already in use` | Publish with a different `appName`. |
| `this key is read-scoped` | Register a full-scope key, or use the browser sign-in. |
| The deploy fails at `library()` | The package was not recorded in the bundle. Load it at the top of your app and publish again. |
