---
title: Announcements and messages
description: The banner, the one send whose arrival is the point, and the copy that turns people away.
---

Admin → Messages holds everything the install says in your voice.

## The banner

A line across the top of every page, in an administrator's voice. Set it, clear
it; both are audited and both show up under the `settings` filter on Activity.

Good for: a maintenance window, a deprecation date, a "we know, we are on it".

Bad for: anything that has to be *read*. A banner is seen by whoever happens to
open Toft.

## The announcement email

**The announcement is the one send whose arrival is the point.** Everything else
in [notifications](../email/) is something you can afford to lose. This is not.

So it has stricter rules, and they are worth knowing before you send one.

**Write, test, send.** You compose it, send yourself a test, and then send it. The
composer shows an **estimate of the audience before you send**, including who
would be skipped and why.

**The freeze is one guarded transition, and both refusals come before it.**
Concurrent sends yield one acceptance and the rest are refused. No relay
configured is refused as `relay_not_configured`; an empty audience is refused as
`empty_audience` — and in both cases the announcement is **still a draft**, not a
half-sent record.

**Every resolved person gets a row with an outcome**, and the counts are those
rows: delivered, failed, skipped, abandoned. **One message per recipient**, never
one message with N addresses in it.

**A count that cannot distinguish outcomes is not a record.** Sent, failed and
skipped are different numbers, not a percentage.

**A failure is a count, not a fourth status.** An announcement that partly failed
is not in a new state; it has failures.

**A restart abandons and never resumes.** A half-sent announcement is not silently
continued after a restart — that would double-send. The abandoned rows say so.

**Two skip reasons, named back to you.** A locked account is `skipped/locked`; one
with no address is `skipped/no_address`. Both appear in the estimate before you
send, which is usually the moment you discover that a third of your directory has
no address here.

**One audience no switch silences.** There is a set of people who will be told, and
no notification preference removes them from it.

## A sent announcement is a record

**No edit and no un-send.** Those are `409` on a sent row: it is too late to
change what went out.

**You may delete one, and the record of it survives.** A draft has reached
nobody; a sent row is your install's own history, and a mistaken subject line, a
test send that went to the whole directory, or a record naming people who have
since left are all reasonable things to be rid of. The per-recipient rows go
with it.

What the deletion cannot do is happen silently. The audit row it writes carries
the subject, the audience, when it went, who sent it and all five counts — so
*"on the 3rd of March this install told 214 people the queue was down"* outlives
the thing that said so. That row keeps the audit log's retention, and no route
here can remove it.

**A send in flight is refused** with its own code, because the runner is still
writing recipient rows into that id. It is deletable the moment the run
finishes, and the button comes back.

A sent announcement has its own retention —
`announcement_recipient_retention_days` — which prunes the per-recipient rows
and **never the counts**.

## The copy that turns people away

Four messages, and they are the difference between a person doing the right thing
and a person filing a ticket:

| Message | Shown when |
|---|---|
| **No account** | They authenticated and no provider will create an account. |
| **Locked account** | Their account is locked. |
| **Awaiting activation** | Their account exists and nobody has activated it. |
| **Account activated** | Emailed when you activate them. |

Each should name **who to contact**. "Access denied" is a message that generates
work for you; "Ask #it-help to request a Toft account" is one that does not.

There is a fifth, for apps: **the locked app message**, the install's default copy
for what a visitor sees at a [locked](../../apps/locking/) app's URL.

## The knowledge base

One app on this install that everybody is pointed at — your runbook, your
handbook.

- **The label and description are yours**, not derived from the app. Renaming the
  app does not rename a word in everybody's chrome.
- **Setting it grants nothing.** The link is absent for anybody who could not
  already read that app. The pick is not a share.
- **Anonymous visitors never see it**, even if the picked app is public.
- **Nothing reads the app's framework.** Any app can be it.

Three negatives are one answer: nothing picked, the app was deleted, and the app
is not for you all return the same bytes. Whoever cannot see it cannot tell which.

It appears as a link at the end of the header, and on the Documentation page.
