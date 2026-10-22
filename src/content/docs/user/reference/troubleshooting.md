---
title: Troubleshooting
description: Common failures, what they mean, and where to look first.
---

## The deploy failed

Read the build log on the **Logs** tab.

| Message | What to do |
|---|---|
| Unsupported framework | Toft found nothing it can run. See [How Toft reads your repository](../../build/how-detection-works/). |
| No entry point | Add one of `app.py`, `main.py`, `streamlit_app.py`, `server.py`, `wsgi.py`. |
| Several R Markdown documents | Name one in `toft.toml` under `[notebook] file`. |
| Version not available | Pin a version this install has. See [Language versions](../../build/versions/). |
| Dependency finding | Upgrade the package or ask for a waiver. See [Dependencies](../../run/dependencies/). |
| Source not allowed | Your install restricts which repositories it deploys from. |
| Build timed out | Past the install's limit. The serving deployment stays up. |

## The page is blank or unstyled

Your app is served under `/apps/your-slug`, so `/styles.css` asks the platform. Use relative URLs or prefix with `BASE_PATH`; redirect to `/dashboard`, not `/apps/your-slug/dashboard`. See [Base paths](../../build/base-paths/).

## It crashes on start

Check **Logs**. Usually the app does not listen on `PORT`, misses an environment variable (it gets only what you set), ran out of memory, or finished and exited — use a [job](../../automation/jobs/) for run-once work. An app that keeps crashing is stopped; the log says why.

## Quick answers

| Symptom | Answer |
|---|---|
| First request is slow | The app was [sleeping](../../run/status/). |
| A variable change did nothing | Restart the app. |
| A variable is supplied elsewhere | An administrator [attached a credential](../../run/credentials/) that sets it. |
| An administrator locked the app | Only they can lift the [lock](../../run/locked/). |
| Public is not available | Public access is off; public apps act as authenticated. See [Who can see your app](../../share/visibility/). |
| Public, but unreachable outside | Usually DNS, firewall, proxy or TLS. Ask your administrator. |
| You see an app but cannot open it | Open it and request access. See [Sharing](../../share/people/). |
| A storage upload fails silently | Usually missing CORS on the bucket — an administrator fix. |
| A scheduled job never runs | Check the schedule on the **Automation** tab: is it paused, and when is the next run? Skipped runs show a reason. |
| `toft` exits with 3 | Run `toft login` again, or check `TOFT_TOKEN` and `TOFT_URL` match. |
| A tab or button is missing | Your install has not configured that feature. Ask your administrator. |
