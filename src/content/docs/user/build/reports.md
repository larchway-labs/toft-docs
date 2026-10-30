---
title: Scheduled re-renders and report delivery
description: Refresh a published document on a schedule, and email a link to the people who read it.
---

A [document app](../notebooks/) shows the numbers from its last render. A
**render schedule** re-renders it on a cron expression.

## Set a schedule

Add a `[render]` table to the app's [`toft.toml`](../toft-toml/) and deploy:

```toml
[render]
schedule = "0 6 * * 1-5"       # 06:00 on weekdays
timezone = "Europe/London"     # optional; UTC without it
```

The schedule versions with your code: change it in a commit, and remove the
table to remove it. `toft check` shows the schedule and its next run before you
deploy. A schedule may fire at most once an hour.

The app's **Settings** tab shows it under **Re-render on a schedule**, with its
next run. **Pause** stops it until the next deploy; **Resume** starts it again.

A re-render is a full deploy of the app's branch: the code is fetched again,
dependencies are reinstalled, and the document runs from the top. It appears
in the app's deployment history. If it fails, the published version stays up.

## Send it to people

Once `toft.toml` declares `[render]`, add recipients under **Send it to** on
the Settings tab. The list is kept when you change the schedule or its time
zone. Removing `[render]` removes the list with it, and the deploy that removed
it says how many people were on it. After each
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

## Render schedule vs. a scheduled job

A render schedule rebuilds and republishes a document. A
[job](../../automation/jobs/) with a schedule runs a command from your
deployment and leaves the published document as it is. Use a render schedule
to refresh what readers see; use a job for work alongside it.
