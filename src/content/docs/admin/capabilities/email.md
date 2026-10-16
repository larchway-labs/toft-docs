---
title: Email and notifications
description: The relay, the audiences, and the rule that keeps a dead relay from becoming an outage.
---

Admin → Email. Runtime settings, with a test send.

## Optional and never load-bearing

**No send may fail or block the request that triggered it.** A notification that
cannot go out does not fail the thing it was about. An app that crashed still
crashed, whether or not anyone could be told.

Design around that: **notifications are how people find out sooner, not the record
that something happened.** The record is the [audit log](../../security/audit/).

A dead relay does not fail an action anywhere in the product.

## Transports

**SMTP**, or an **HTTPS sending API** for the install where outbound 587 is closed
and 443 is not.

| | |
|---|---|
| `email_host`, `email_port` | 587 for STARTTLS, 465 for implicit TLS |
| `email_security` | STARTTLS, implicit TLS, or none |
| `email_username`, `email_password` | Blank for a relay that needs no credential |
| `email_api_provider`, `email_api_key` | When the transport is a sending API |
| `email_skip_verify` | For an internal relay with an unverifiable certificate. A workaround, not a fix |

**The API key is a field of its own**, not a second use of the password: a
transport switch must never offer an SMTP password as a bearer token.

## Credentials are not settings

Passwords and API keys are **credentials, not setting values**. Write-only, never
read back, and they do not appear in a settings export.

## Audiences

**A notification's audience lives on its template**, not on the channel it goes out
on. Change who gets something in one place.

Two switches:

- **`email_notify_admin`** — mail to system administrators about this install.
- **`email_notify_app`** — mail to the people who use Toft, about their own
  apps and access.

**`email_admin_group_address`** sends administrator notifications to a distribution
list instead of to each administrator's own address. Use it: a list outlives the
people on it.

## Copy may not promise mail

A template whose words assume email is wrong the moment somebody routes it to a
channel. Write copy that is true on any transport.

That rule matters because **a notification renders once and each channel turns
that one rendering into its own format** — one poster interface and a slice of
posters, with mail outside it. That design cost the mail-only rule its structural
enforcement, which is said out loud rather than hidden: mail is no longer
prevented *by construction* from receiving something written for a channel. It is
prevented by the copy rule.

## Where links point

**The install's own address.** `public_base_url` is what a link in an email says;
leave it blank to use the address the install was started with.

This is the one place an install is told about itself, and it exists because a
link in an email has no request to derive an address from.

## Channels

The platform can post to a connected channel where an audience allows it. Slack
and PagerDuty carry platform audiences; the file kinds carry none.

That is separate from [what apps send](../integrations/) — same connections,
different sender.

Replies to mail an app sends go to the app's **owner**. A group-owned app has no
address to reply to, so those go to the install's reply-to instead, and the
app's Integrations tab says which of the two applies to it.
