---
title: Scheduled re-renders and report delivery
description: Refreshing a published document on a schedule, and mailing the people who read it.
---

A [document app](../notebooks/) — a notebook, an R Markdown document, or a
Quarto document — shows the numbers from the moment it was rendered. A **render
schedule** re-runs it on a cron expression, so the page is never older than you
decided it could be.

Set it on the app's **Settings** tab, under **Re-render on a schedule**. The
expression is five fields and runs in **UTC**: `0 6 * * 1-5` is 06:00 UTC on
weekdays. An app with no schedule reports that it has none — it is not an error.

A scheduled render uses the document's **default parameters**. There is no way
to pass different `params` per schedule; a report you need for each region is
one app per region, each with its own default.

## What a render is

A deploy whose only job is to run your document again against the current
release and publish the new output. Same renderer, same environment, same
timeout, same build log.

If the render fails, the deploy fails, and **the document that was already
published stays up**. A broken refresh does not blank the page.

## Telling people it landed

A render schedule can carry a list of people to notify when a render succeeds.
Four rules are worth knowing before you rely on it:

- **What arrives is a link to the app, never the rendered file.** Nothing is
  attached and nothing is inlined. Whoever opens the link is authorized the
  ordinary way, so a private report stays private.
- **A failed render sends nothing.** No delivery, no "your report failed" mail
  to the readers. The failure shows up on your app, where it belongs.
- **A manual redeploy sends nothing.** Only the schedule announces. Deploying by
  hand to check something does not mail your whole distribution list.
- **Recipients are re-checked on every send.** Somebody whose account has been
  locked, or who no longer has access to the app, is **skipped with a reason**
  rather than mailed a link they cannot open. They stay on your list — the skip
  is about this send, not a removal.

There is a floor on how often a delivery may go out. A run inside it is recorded
as one skip with the reason, rather than being silently dropped.

The outcome of the last delivery is readable on the app by anyone who can edit
it, so "did that go out?" is answerable without asking anyone.

## Mail has to be configured

Delivery needs your administrator to have set up mail on this install. Where it
is not configured, the recipient list is not offered — absent rather than a
control that quietly does nothing.

## The difference from a scheduled task

A **render schedule** re-runs a document and republishes it. A [scheduled
task](../../automation/scheduled-tasks/) makes an HTTP request to a path your
running app publishes. Documents have no running app, which is why they get a
mechanism of their own.
