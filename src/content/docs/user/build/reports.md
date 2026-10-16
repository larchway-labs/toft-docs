---
title: Scheduled re-renders and report delivery
description: Refresh a published document on a schedule, and email a link to the people who read it.
---

A [document app](../notebooks/) shows the numbers from its last render. A
**render schedule** re-renders it on a cron expression.

## Set a schedule

1. Open the app's **Settings** tab.
2. Under **Re-render on a schedule**, enter a five-field cron expression, in
   UTC. `0 6 * * 1-5` is 06:00 UTC on weekdays.
3. Select **Schedule**. The **On** switch pauses it; **Remove** deletes it.

A re-render is a full deploy of the app's branch: the code is fetched again,
dependencies are reinstalled, and the document runs from the top. It appears
in the app's deployment history. If it fails, the published version stays up.

## Send it to people

Once a schedule exists, add recipients under **Send it to**. After each
successful scheduled render, each recipient gets an email with a link to the
app.

- **A link, never the file.** Recipients sign in as usual, so a private report
  stays private, and everyone on the list needs access to the app.
- **Only a scheduled render sends.** A failed render or a manual redeploy
  mails nobody.
- **Access is re-checked on every send.** Someone who has lost access, or has
  no email address, is skipped with a reason and stays on the list.
- **Sends are rate-limited.** A render that comes too soon after the last
  delivery is recorded as skipped.
- **Mail must be configured.** Without a mail relay on the install, every
  recipient is skipped with that reason.

The latest delivery result is shown beside the recipient list.

## Render schedule vs. scheduled task

A render schedule rebuilds and republishes a document. A
[scheduled task](../../automation/scheduled-tasks/) calls an HTTP path on a
running app. Documents have no running app, so they use render schedules.
