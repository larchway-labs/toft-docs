---
title: Environment variables
description: The variables Toft sets for your app and its jobs, and what never reaches an app.
---

## Every app

| Variable | |
|---|---|
| `PORT` | The port to listen on. Never pick your own. |
| `HOST` | The address to bind. `app.listen(port)` alone binds `0.0.0.0`, which bypasses the platform. |
| `BASE_PATH` | Where the app is mounted, e.g. `/apps/reports`. |
| `TMPDIR` | Points at the app's scratch directory. |

These, `VIRTUAL_ENV`, `R_LIBS_SITE` and the `TOFT_*` variables named below are the
platform's to set, so a value of your own would never reach the app. `toft env
set`, the app's Settings tab and the API all refuse them (`reserved_env_name`),
and a name that isn't letters, digits and underscores (`invalid_env_name`).

### Base paths

The proxy strips `BASE_PATH` before your handler sees the request and adds it
back on the way out.

- **Links and form actions carry it.** `href="/apps/reports/new"`, or build them
  from `toft.app.base_path`. A root-absolute `/styles.css` asks the platform, not
  your app, and 404s.
- **Redirects must not.** Send `Location: /done`; the proxy prefixes it.
  Relative redirects (`new/`, `?page=2`) pass through untouched.

## Read by the SDK

You rarely read these yourself.

| Variable | |
|---|---|
| `TOFT_API_URL` | Where to call the platform. |
| `TOFT_APP_ID`, `TOFT_APP_SLUG` | This app. |
| `TOFT_APP_TOKEN` | The app's own credential (`tofta_`). Not set inside a job. |
| `TOFT_ROLE_KEY` | Verifies the signed role header. |
| `TOFT_SCRATCH_DIR` | The scratch directory. |
| `TOFT_STORAGE` | The storage attached to this app. |

## Inside a job

| Variable | |
|---|---|
| `TOFT_RUN_ID`, `TOFT_JOB_NAME` | This run, and its job. |
| `TOFT_JOB_TOKEN` | The run's credential. Also used to send notifications; it opens nothing else. |
| `TOFT_PARAMS` | Parameters as JSON. Each is also `TOFT_PARAM_<NAME>`, for shell jobs. |
| `TOFT_SCHEDULED_FOR` | The instant the run is for, RFC 3339 in the schedule's zone. Absent when none was given. |
| `TOFT_TRIGGER`, `TOFT_TRIGGER_ROLE` | What started the run, and with which role. |
| `TOFT_INPUT_URI`, `TOFT_OUTPUT_URI` | Where the run reads its payload and writes its output. Input is absent when no payload was given. |

## Your own variables

Set them on the app's **Settings** tab. They are encrypted at rest and applied
at the next start: a restart is enough, no redeploy needed.

:::caution
Your app does not inherit the platform's environment. It gets the variables
above, a few basics such as `PATH` and `HOME`, and the ones you set. A variable that works on your laptop
because it was in your shell will not be there.
:::

Never set `NODE_ENV=production` as an app variable. It reaches the build, where
npm skips dev dependencies and the build fails. The platform sets it for the
running process.

## Never given to an app

- The platform's encryption key.
- The telemetry collector's credentials.
- Git host credentials.

## Rendered documents

A notebook, R Markdown or Quarto document runs at build time with your app's
environment, and its output is published. If a chunk prints a connection string,
the page shows it.
