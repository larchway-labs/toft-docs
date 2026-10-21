---
title: Announcements and messages
description: The banner, announcement email, the messages people see when turned away, and the knowledge base.
---

**Admin → Messages** holds everything the install says in your voice.

## The banner

A line across the top of every page — for a maintenance window, a deprecation
date, an incident acknowledgment. Setting and clearing it are audited (the
`settings` filter on Activity). Don't use it for anything people *must* read;
only those who open Toft see it.

## Announcement email

Unlike other [notifications](../email/), an announcement exists to arrive, so it
is recorded per recipient.

1. **Write** it. The composer estimates the audience, including who will be skipped and why.
2. **Test** it to yourself.
3. **Send.** One message per recipient, never one message with many addresses.

| Situation | Result |
|---|---|
| No relay configured | Refused `relay_not_configured`; stays a draft |
| Empty audience | Refused `empty_audience`; stays a draft |
| Two sends at once | One accepted, the rest refused |
| Recipient locked | Skipped (`locked`) |
| Recipient has no address | Skipped (`no_address`) |
| Platform restarts mid-send | Remaining recipients are `abandoned`, never resumed (no double send) |

Each recipient's row records **delivered**, **failed**, **skipped** or
**abandoned**, and the counts come from those rows.

### After sending

- A sent announcement cannot be edited or un-sent (`409`).
- **Copy to a new draft** starts a new draft with the same subject, body, link and audience.
  Nothing is sent until you send that draft, which mails everybody again.
- You can **delete** it with its recipient rows; the audit entry keeps the
  subject, audience, time, sender and counts. Deleting while it is still sending
  is refused (`send_in_flight`).
- `announcement_recipient_retention_days` prunes recipient rows, never the counts.

## Messages that turn people away

Each should say **who to contact** — "Ask #it-help for a Toft account", not
"Access denied".

| Setting | Shown when |
|---|---|
| `no_account_message` | They authenticated but no provider will create an account |
| `locked_account_message` | Their account is locked |
| `pending_activation_message` | Their account awaits [activation](../../identity/activation/) |
| `account_activated_message` | Emailed when you activate them |
| `app_locked_message` | Default text at a [locked](../../apps/locking/) app's URL |

## The knowledge base

`knowledge_base` points everyone at one app on this install — your runbook or
handbook. It appears at the end of the header and on the **Documentation** page.

- The label and description are yours; renaming the app changes neither.
- It grants nothing: the link only appears for people who can already open the app.
- Anonymous visitors never see it, even if the app is public.
- Any app can be the knowledge base.
