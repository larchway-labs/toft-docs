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
| `TOFT_JOB_TOKEN` | The run's credential. Also used to send notifications and reach the app's stores; it opens nothing else. |
| `TOFT_PARAMS` | Parameters as JSON, typed as `toft.toml` declares them. Each is also `TOFT_PARAM_<NAME>`, for shell jobs. |
| `TOFT_SCHEDULED_FOR` | The instant the run is for, RFC 3339 in the schedule's zone. Absent when none was given. |
| `TOFT_TRIGGER`, `TOFT_TRIGGER_ROLE` | How the run started (`app`, `viewer`, `cli`, `schedule` or `ui`), and with which role (`system` for a schedule). |
| `TOFT_RERUN_OF` | The run this one repeats, when someone ran it again. Absent on a first run. |
| `TOFT_DEADLINE` | When the run will be stopped, RFC 3339. |
| `TOFT_OUTPUT_URI` | Where the run writes its output. |

## Your own variables

Set them on the app's **Settings** tab or with
[`toft env set`](../../cli/commands/#toft-env). They are encrypted at rest and
applied at the next start: a restart is enough, no redeploy needed. Declare the
variables your app needs under [`[env]` in `toft.toml`](../../../user/build/toft-toml/#env),
marking the secrets, and every deploy adds the missing ones with the file's
default and flag; a secret arrives empty for someone to fill in. A `.env` file is never uploaded and never read on the install; send
its values with `toft env set --from-file .env`.

:::caution
Your app does not inherit the platform's environment. It gets the variables
above, a few basics such as `PATH` and `HOME`, and the ones you set. A variable that works on your laptop
because it was in your shell will not be there.
:::

Never set `NODE_ENV=production` as an app variable. It reaches the build, where
npm skips dev dependencies and the build fails. The platform sets it for the
running process.

### Through the API

`PATCH /api/v1/apps/{id}/env` changes an existing app's variables. It names only
the variables it changes; anything not mentioned is left alone, so there is
nothing to read first.

```json
{
  "set": {
    "DB_PASSWORD": {"value": "s3cr3t", "sensitive": true},
    "DB_HOST":     {"value": "db.internal", "sensitive": false},
    "OLD_TOKEN":   {"value": ""}
  },
  "unset": ["LEGACY_FLAG"],
  "only_missing": false
}
```

| Field | |
|---|---|
| `set` | Variables to write. `"value": ""` clears one in place. |
| `sensitive` | Optional per variable. Left out, an existing variable keeps its flag and a new one is **visible**. `false` on a sensitive variable is accepted only with a new value. |
| `unset` | Variables to remove. |
| `only_missing` | `true` writes only the variables that are empty, sensitive or not, and keeps one that has a value. |

The answer names variables, never values:

```json
{"set": ["DB_PASSWORD", "DB_HOST"], "unchanged": [], "kept": [], "cleared": ["OLD_TOKEN"],
 "unset": ["LEGACY_FLAG"], "not_present": []}
```

`unchanged` lists variables sent with the value they already had, `kept` what
`only_missing` left alone, and `not_present` what `unset` named that wasn't
there. The route never restarts the app: a change reaches it at its next start,
so follow with `POST /api/v1/apps/{id}/restart` (`toft restart`) when you want it
now. The whole request lands or none of it does: a bad or
reserved name (`invalid_env_name`, `reserved_env_name`), a variable an attached
credential supplies (`key_from_credential`), or a name both set and unset
(`set_and_unset`) refuses it all. It needs edit access to the app, or a deploy
key with the `deploy` scope. `env_vars` on `PATCH /api/v1/apps/{id}` is refused
with `use_env_route`; creating an app still takes `env_vars`.

## Never given to an app

- The platform's encryption key.
- The telemetry collector's credentials.
- Git host credentials.

## Rendered documents

A notebook, R Markdown or Quarto document runs at build time with your app's
environment, and its output is published. If a chunk prints a connection string,
the page shows it.
