---
title: Email and notifications
description: Configure the mail relay, who gets notified, and where links point — a dead relay never fails anything.
---

Configure mail in **Admin → Email**, which has a test send. Changes apply at
runtime.

:::note[Never load-bearing]
No send can fail or block the action that triggered it. Notifications tell people
sooner; the record is the [audit log](../../security/audit/).
:::

## Transport

SMTP, or an HTTPS sending API (Resend) where outbound 587 is blocked and 443 is not.

| Setting | Use |
|---|---|
| `email_enabled` | Send email at all |
| `email_transport` | SMTP or sending API |
| `email_host`, `email_port` | 587 for STARTTLS, 465 for implicit TLS |
| `email_security` | STARTTLS, implicit TLS, or none |
| `email_username`, `email_password` | Leave blank for a relay that needs no login |
| `email_api_provider`, `email_api_key` | For the sending API; a separate field from the SMTP password |
| `email_skip_verify` | Accept a self-signed certificate on an internal relay (a workaround) |
| `email_from_address`, `email_from_name`, `email_reply_to` | Sender identity |

Passwords and API keys are write-only: never read back and never in a settings export.

## Who is notified

| Setting | Sends |
|---|---|
| `email_notify_admin` | Mail to system administrators about the install |
| `email_admin_group_address` | Sends administrator mail to one distribution list instead of each administrator — recommended |
| `email_notify_app` | Mail to people about their own apps and access |

A notification's audience is set on its template, not its channel. Template copy
must read correctly on any channel — don't write "this email".

## Links in mail

`public_base_url` (**Address**) is the address links in mail use. Leave it blank to
use the address the install was started with.

## Channels and replies

- The platform can also post notifications to a connected Slack or PagerDuty
  [integration](../integrations/) where an audience allows it. File kinds carry none.
- Replies to mail **an app** sends go to the app's owner. A group-owned app has no
  owner address, so replies go to the install's reply-to; the app's
  **Integrations** tab says which applies.
