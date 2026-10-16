---
title: Sending messages and files
description: Send messages and files from your app through integrations an administrator attaches, without holding a credential.
---

An integration lets your app send a message or a file outward, using a connection the install holds. Your app supplies the message; Toft supplies the credential, and the message is attributed to your app.

| Integration | Kind name |
|---|---|
| Slack | `slack` |
| Email | `email` |
| Signed webhook | `webhook` |
| Microsoft Teams | `teams` |
| SharePoint, OneDrive | `sharepoint`, `onedrive` |
| Google Chat, Google Drive | `gchat`, `gdrive` |
| Discord | `discord` |
| PagerDuty | `pagerduty` |

## Before you can send

1. An administrator connects the service for the whole install.
2. An administrator attaches it to your app on the app's **Integrations** tab. Until then, your app has no integration of that kind.
3. Your app's people choose where it goes, such as the channel or folder, from what the connection can reach.

Apart from email recipients, your code never names the destination. Check what is attached at startup, so you can show a message instead of failing later:

```python
import toft

if toft.app.can("email"):
    ...
```

## Send

```python
toft.notify.send("slack", "Nightly load finished: 12,400 rows")
toft.notify.send("pagerduty", "Ingest is 40 minutes late",
                 severity="error", dedup_key="ingest-late")
toft.notify.resolve("pagerduty", "ingest-late")
toft.notify.email(to=["finance@example.com"], subject="Weekly report", text=body)

toft.notify.deliver("sharepoint", "/tmp/recon.xlsx", name="Reconciliation W32.xlsx")
```

A send returns once Toft has accepted and recorded it; delivery happens after. `toft.notify.status(send)` reads the outcome back. Sends work from [jobs](../../automation/from-your-app/) too.

If the chosen channel or folder stops working, the send fails; it never falls back to somewhere else.

## Files

- **Files are added, never replaced.** A file with an existing name is kept alongside the old one.
- **The name is a name, not a path.** A name with a separator, a leading dot or `..` is refused, not cleaned up.
- **The folder is chosen on the Integrations tab**, not by your code.

## What integrations cannot do

Integrations only send. Your app cannot use one to read Slack, list a SharePoint folder or fetch anything.

## The send record

Every send is recorded under **Integrations → Recent sends** on the app. File sends to SharePoint, OneDrive and Google Drive leave files on the far side; detaching the integration or deleting the app does not remove them.
