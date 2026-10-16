---
title: Troubleshooting
description: The failures people actually hit, and where the answer is.
---

## The deploy failed

**Read the build log**, on the Logs tab. It is the reason; the status word on the
app page is only the summary.

| Message | What it means |
|---|---|
| Unsupported framework | Nothing recognisable. See [How detection works](../../build/how-detection-works/). |
| Matched two shapes | Ambiguous repository. It names what it matched; remove one. |
| No entry point | A Python project with none of `app.py`, `main.py`, `streamlit_app.py`, `server.py`, `wsgi.py`. |
| Version not available | You pinned a version this install does not have. Refused, never approximated. |
| A dependency finding | Your install's [policy](../../run/dependencies/) stopped it. Upgrade, or ask for a time-bounded waiver. |
| Source not allowed | Your install restricts which repositories it will deploy from. |
| Reserved slug | Names starting with `_` are reserved by Toft and cannot be used. |
| Build timed out | Past the install's build ceiling. The serving release stayed up. |

## It deployed but the page is blank or unstyled

Links. Your app is at `/apps/your-slug`, and `/styles.css` asks the platform.
[Base paths](../../build/base-paths/) is the page for this, and it is worth
reading once properly.

The short version:

- Relative URLs, or prefix with `BASE_PATH`.
- Redirect to `/dashboard`, **not** `/apps/your-slug/dashboard` — the proxy
  re-adds the prefix, so a prefixed redirect gets it twice.
- Static site generator? Set its base option to `/apps/your-slug`.

## It crashes on start

The Logs tab, and look at both voices — Toft's lines about your app are in
the same stream. Usually:

- Not binding to `PORT`, or binding to a hard-coded port.
- A missing environment variable. Your app gets *only* what you set, never your
  shell's environment.
- The process ran to completion and exited. That is a crash to the supervisor;
  you want a [job](../../automation/jobs/).
- Out of memory. See [Status](../../run/status/).

## It keeps restarting and then stops

Restarts are bounded. An app that keeps crashing is told it has stopped being
restarted, and one the platform keeps killing for its memory is stopped rather
than restarted forever. The reason is in the log.

## The first request is slow, then it is fine

It was [sleeping](../../run/status/). Normal. Nothing is broken.

## My environment variable change did nothing

It takes effect on the next start. Restart the app. The app page has a banner
saying exactly this while a saved value has not reached the process.

## I cannot set a variable — it says something else supplies it

An administrator has [attached a credential](../../run/credentials/) that
supplies that key. One key, one source.

## I cannot start it, and it says an administrator locked it

You cannot lift a [lock](../../run/locked/). The refusal carries the
administrator's own words — reply to them.

## Public is not available

Your install may have anonymous access off, in which case public resolves to
**authenticated**. See [Who can see your app](../../share/visibility/).

## It is public and nobody outside can reach it

Almost never your app. DNS, a firewall, a proxy or TLS. Show your administrator
the reachability verdict rather than debugging your code.

## I can see an app and cannot open it

That is the [list rung](../../share/people/) working. Open it and ask — the
refusal has a way through it.

## A browser upload to storage fails silently

Almost always missing CORS on the bucket. Toft never saw the request, so it
cannot report it as a failed upload. Your administrator configures this.

## My scheduled task never fires

- Is the app running, stopped or locked? A stopped app records a skipped run.
- Is the path right? It is relative to your app.
- Look at the run history — a skipped run is recorded, with the reason.

## `toft` says exit 3

Your credential was refused. That is different from exit 1, which means the
platform did the thing and it failed. Re-run `toft login`, or check that
`TOFT_TOKEN` and `TOFT_URL` name the same install.

## Something is missing entirely — a tab, a button, a page

That is probably the rule working. An optional capability your install has not
configured is **absent**, not greyed out. Jobs, storage, integrations,
telemetry, the gallery: any of them can simply not be there.

Ask your administrator whether it is configured before designing around it.
