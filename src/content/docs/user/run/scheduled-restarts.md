---
title: Scheduled restarts
description: Restart a serving app on a timetable declared in toft.toml, and what a scheduled restart leaves alone.
---

Some apps slowly get worse the longer they run: memory that creeps up, a
connection pool that goes stale, a cache that never expires. Until the code is
fixed, a nightly restart keeps them healthy. Declare it in the app's
[`toft.toml`](../../build/toft-toml/) and deploy:

```toml
[restart]
schedule = "0 4 * * *"         # 04:00 every day
timezone = "Europe/London"     # optional; UTC without it
```

The schedule versions with your code, so the release that fixes the leak can
drop it. `toft check` shows it and its next run before you deploy. It may fire
at most once an hour, and it is refused on an app with nothing to restart: a
batch app, a static site, or a document (use a
[re-render](../../build/reports/) for those).

## What a scheduled restart does

It restarts the app **only if it is running**. If the app is asleep, stopped by
someone, crashed, locked, or in the middle of a deploy, the restart is skipped,
and the reason is shown. A scheduled restart never starts an app someone
stopped, never wakes a sleeping one, and never clears what Toft decided about
an app that keeps crashing — only a person's restart or a deploy does that.

Each scheduled restart is recorded in the app's audit trail as done by the
system.

## On the Settings tab

**Settings → Runtime → Restart on a schedule** shows the schedule, its next run
and what the last one did: restarted, skipped (and why), or failed (and the
error). **Pause** stops it until the next deploy; **Resume** starts it again.
To change or remove the schedule, edit `[restart]` in `toft.toml` and deploy —
removing it is reported as a warning on that deploy.

:::note
On an install that runs apps in shared mode, visitors see the app as not
responding for the time it takes to start, at each restart.
:::
