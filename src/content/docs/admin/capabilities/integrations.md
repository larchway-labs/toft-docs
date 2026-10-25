---
title: Integrations
description: Let apps send messages and files outward using an identity the install holds, never one the app holds.
---

An integration lets an app send something outward — a message or a file — with
credentials **the install holds**. The app supplies the content; the platform
supplies the identity. Manage them in **Admin → Integrations**.

| Kind | Sends |
|---|---|
| Slack, Teams, Google Chat, Discord | Messages |
| Email | Mail |
| Webhook | Signed HTTP requests |
| PagerDuty | Alerts |
| SharePoint, OneDrive, Google Drive | Files |

## Connections and attachments

| Rule | Effect |
|---|---|
| A connection offered to apps **is** the switch | No separate toggle; an app has no integration of a kind until you attach one |
| A connection is welded to its scope | To use a different channel or folder, create another connection — existing users keep their meaning |
| One attachment per (app, kind) | A second is refused, not swapped |
| Destinations | A kind either lists destinations or (when welded) answers 404 — not an empty list |
| Broken destination | The send fails; it never falls back somewhere else |
| URLs you type | Checked at save **and** at every send; private addresses refused both times |
| Description | Optional, and editable at any time. Use it for what the connection is for and who to ask about it |

What a connection can reach is decided on the far side — the channel it was
invited to, the folder it was given. **Teams is the exception**, and its form says so.

### Teams

A Teams connection is a Workflows webhook, not a bot. In the channel, open
**Workflows** and add the template **Send webhook alerts to a channel**, then paste
its URL into the connection. Don't use the *from specific people* or *from people
in an org* templates: they expect a sign-in that Toft does not send, so every post
is refused.

Anyone who has the URL can post to that channel. Toft stores the part that grants
this encrypted and never shows it again; the connection is listed by its workflow
ID, the one Power Automate shows. Posts go through as long as the workflow exists
and is on, so write in the **description** which team and channel it posts to and
who owns the workflow. Until you do, the connection says that nobody is named.

Teams takes messages only, not files. To put a file where a channel can see it,
use SharePoint: each channel's Files tab is a SharePoint folder.

### Teams bot

The bot is the governed way into Teams. It can post only to teams and group chats
where your organization installed the Toft app, and Teams admins can see and remove
those installations. It also carries Toft's own notices, such as a failed deploy.

1. **Register a bot.** In the Teams Developer Portal (dev.teams.microsoft.com), open
   **Tools › Bot management**, create a bot and add a client secret. No Azure
   subscription is needed. The bot must be single-tenant.
2. **Connect it.** In Toft, connect **Microsoft Teams (bot)** with the bot's
   application ID, your directory (tenant) ID and the secret.
3. **Install the Toft app.** On the connection, click **Download Teams app**. Upload
   the file in the Teams admin center (**Teams apps › Manage apps › Upload**), then
   add the app to the teams and chats Toft may post to.
4. **Add the places.** Paste a team's link (on the team, **⋯ › Get link to team**) or
   a chat's link (**⋯ › Copy link**). Toft saves it only if the app is installed
   there. A channel's link won't work; once the team is added, all of its channels
   are offered.
5. **Choose channels.** Pick a default channel on the connection, which Toft's
   notices for administrators need, and give each app its own channel on the app's
   Integrations tab. An app posts only to the channel it was given.

If someone removes the app from a team, the team shows **Not installed** and sends
to it fail. Toft never sends them somewhere else. Download the app again whenever
you need to: it is the same app every time.

## What apps can do

- Send only. No integration route reads — an app cannot read Slack or list a folder
  through Toft. To let an app read and write a folder, see
  [Reading and writing a folder](#reading-and-writing-a-folder).
- Every send passes the same four gates, each with its own error code, re-checked
  before transport.
- Files are added, never replaced. A file name that is really a path is refused.
- An app can look up only the sends it triggered.
- Jobs can send through their app's attachments; see [Automation](../../operate/automation/#sending-from-a-job).

### Google Drive

Put the folder in a **shared drive**, and add the service account's address
(`…@….iam.gserviceaccount.com`) to that shared drive as **Contributor** or above.
A folder in someone's My Drive won't work: a service account owns no storage, so
Google refuses every file it tries to add there. Use the service account for this
connection only, because Toft can reach anything that is shared with it.

### SharePoint with a folder grant

A SharePoint connection is normally granted the whole site (`Sites.Selected`). If
apps only need one folder, grant the Entra app `Files.SelectedOperations.Selected`
on that folder instead, with the `write` role. Connect it with the site's address
as usual. Microsoft then refuses anything outside the folder, and the folder is
the only destination offered.

## Reading and writing a folder

Toft's integrations only send. When an app has to **read** files people keep in
SharePoint, OneDrive or Google Drive, or replace a file there, it uses the
provider's own SDK with a credential you hold for it. Microsoft or Google enforces
the folder boundary, and you can remove the access without touching the app.

### SharePoint or OneDrive

1. **Register an app.** In Entra, create an app registration and give it the
   application permission **`Files.SelectedOperations.Selected`**, then grant admin
   consent. On its own, this permission reaches nothing.
2. **Grant it one folder.** Use [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer),
   signed in as a SharePoint administrator with `Sites.FullControl.All` consented.
   Find the folder, then grant the app a role on it:

   ```http
   GET https://graph.microsoft.com/v1.0/sites/contoso.sharepoint.com:/sites/finance:/drive
   GET https://graph.microsoft.com/v1.0/drives/{drive-id}/root:/Month-end
   POST https://graph.microsoft.com/v1.0/drives/{drive-id}/items/{folder-id}/permissions
   { "roles": ["read"], "grantedToV2": { "application": { "id": "{app's client id}" } } }
   ```

   Use `read` to let the app list and read files, or `write` to also add, replace and
   delete them. The role covers everything below the folder. Sibling folders stay
   invisible to the app, and so does the rest of the site. To remove the access,
   `DELETE` the same permission.
3. **Hold the secret in Toft.** In **Admin → Credentials**, create a credential with
   the keys `AZURE_TENANT_ID`, `AZURE_CLIENT_ID` and `AZURE_CLIENT_SECRET`, and
   attach it to the app. Those are the names Microsoft's `azure-identity` library
   reads, so the app needs no extra configuration. The app's owner never sees the
   values.
4. **Call Graph from the app.** In Python, for example:

   ```python
   import requests
   from azure.identity import EnvironmentCredential

   GRAPH = "https://graph.microsoft.com/v1.0"
   token = EnvironmentCredential().get_token("https://graph.microsoft.com/.default").token
   h = {"Authorization": f"Bearer {token}"}

   drive = requests.get(f"{GRAPH}/sites/contoso.sharepoint.com:/sites/finance:/drive",
                        headers=h).json()["id"]
   folder = f"{GRAPH}/drives/{drive}/root:/Month-end"

   for item in requests.get(f"{folder}:/children", headers=h).json()["value"]:
       print(item["name"], item.get("size"))

   r = requests.get(f"{folder}/input.csv:/content", headers=h)
   r.raise_for_status()
   data = r.content

   # Replaces output.csv if it exists. SharePoint keeps the previous version.
   requests.put(f"{folder}/output.csv:/content", headers=h, data=b"a,b\n1,2\n").raise_for_status()
   ```

   R, Node and Go have Microsoft libraries that read the same three variables.

### Google Drive

Create a service account and add its address to the **shared drive** that holds
the folder: as **Viewer** to read, or **Content manager** to also replace and
delete files. Put its JSON key in a Toft credential (for example
`GOOGLE_SERVICE_ACCOUNT_JSON`) and attach it to the app. The app calls the Drive
API with the `https://www.googleapis.com/auth/drive` scope. Use one service account
per folder, because the key reaches everything that is shared with that account.

### What you give up

What Toft's integrations record, this route doesn't:

- Reads and writes don't appear in Toft's integration log. Microsoft 365's audit
  log and Google's Drive audit log record them under the app's or service
  account's name.
- The secret is in the app's environment, so a compromised app can copy it.
  Removing the folder grant, or rotating the credential, stops that copy working.
  Detaching the credential alone does not.

## The integration log

Every send, with recipients in full, per app and install-wide in **Admin →
Integration log**.

| Setting | Default |
|---|---|
| `integrations_retain_bodies` | Off — the log keeps a checksum, not the text |
| `integrations_retention_days` | At least 30 days |

:::caution[Detach is not deletion]
Sends that placed a file are kept regardless of retention and outlive the app.
Detaching an integration removes nothing already written on the far side.
:::

## Testing

Test the connection, then test **the app's** integration before telling a
developer it works — authenticating is not the same as being able to post.
File kinds (SharePoint, OneDrive, Google Drive) are tested by uploading a
one-line `toft-test.txt` to the default destination; expect to find it there.
