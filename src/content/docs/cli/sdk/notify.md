---
title: Notifications
description: Send Slack messages, email and files as the app, through integrations an administrator attached.
---

```python
toft.notify.slack("Ingest finished: 1,204 rows")
toft.notify.slack_file("/tmp/recon.xlsx", title="Weekly reconciliation")
toft.notify.email(to=["finance@example.com"], subject="Weekly report", text=body)
toft.notify.send("teams", "Nightly load complete")
```
```js
await toft.notify.slack("Ingest finished: 1,204 rows");
await toft.notify.slackFile(file, { title: "Weekly reconciliation" });
await toft.notify.email({ to, subject, text });
await toft.notify.send("teams", "Nightly load complete");
```
```go
toft.Notify.Slack(ctx, "Ingest finished: 1,204 rows")
toft.Notify.SlackFile(ctx, file, toft.SlackFileOptions{Title: "Weekly reconciliation"})
toft.Notify.Email(ctx, toft.EmailMessage{To: to, Subject: subject, Text: body})
```
```r
notify("slack", text = "Ingest finished: 1,204 rows")
```

Your app supplies the message. The platform supplies the identity: the bot
token, the channel, the From address. Your app never holds or chooses them, and
sending a `channel`, `folder` or `url` field is refused.

## The calls

| Call (Python / Node) | Does |
|---|---|
| `send(kind, text, …)` | A message through any attached integration: `slack`, `teams`, `pagerduty`, … Options: `title`, `severity`, `dedup_key`. |
| `resolve(kind, dedup_key)` | Close an incident this app raised. |
| `deliver(kind, file, name=…)` | Put a file through an integration, such as SharePoint. A file is added, never replaced. |
| `slack(text)`, `slack_file(file)` | Slack shortcuts. |
| `email(to, subject, text, …)` | Email to any address. Also `html`, `cc`, `bcc`, `attachments`. |
| `status(send)` | Read back one send's record. |

Go has `Slack`, `SlackFile`, `Email` and `Status`. R has `notify(kind, ...)`,
whose named arguments become the message body.

## Ask first

```python
if not toft.app.can("slack"):
    show_setup_hint()
```

An app has no integration of a kind until an administrator attaches one.

## What a send promises

A send returns once the platform has **accepted and recorded** it. Delivery
happens afterwards. The returned `Send` names the record:

```js
const send = await toft.notify.slack("done");
const later = await toft.notify.status(send);   // .delivered, .blocked, .done
```

Every send passes the same checks, re-checked just before delivery. An
integration detached in between is refused, not sent. A destination that stops
working fails; it never falls back to somewhere else.

`blocked` means an administrator turned the capability off after the send was
accepted. Retrying won't help until it is re-attached.

## From a job

The same calls work inside a [job](../jobs/), in all four languages, using the
run's own credential. Send before your command exits: a finished run's
credential is refused.

## Limits

- **Outbound only.** No integration can read a channel or list files.
- **Records outlive the app.** A message or file already delivered stays where
  it landed. Detaching an integration deletes nothing.
