---
title: CI and automation
description: Run toft unattended — credentials, a deploy pipeline, and parsing --json output.
---

## Credentials

Use a **deploy key** (`toftd_`) from **Admin → Deploy keys**. It belongs to no
person, so it keeps working when people leave, and it can do less than a
personal key.

```yaml
env:
  TOFT_URL:   https://toft.corp
  TOFT_TOKEN: ${{ secrets.TOFT_DEPLOY_KEY }}
```

Set both or neither. If the runner mounts secrets as files, use
`TOFT_TOKEN_FILE=<path>` instead of `TOFT_TOKEN`: a path is not sensitive, while
an environment variable is visible in `/proc` and inherited by child processes.

A deploy key can create apps, deploy, roll back, restart, stop, run jobs, and
read logs, events and dependencies. It cannot use `toft store`, or manage
keys and grants. For those, use a full personal key
(`toftu_`).

## No prompts

`toft` treats a run as unattended when `--yes` is passed, `CI` is set, or stdin
is not a terminal. It then never prompts: anything that needs a confirmation
(`create`, `rollback`, `delete`) is refused with exit 2 unless you pass
`--yes`.

## A deploy pipeline

```bash
set -euo pipefail

toft whoami --app my-app                 # exits 3 if the key cannot be used
toft check --app my-app                  # exits 1 if the deploy would be refused (works before the app exists)
toft deploy --logs --app my-app          # exits 1 if the build fails
toft job run migrate --app my-app        # exits 1 if the migration fails
toft restart --wait --app my-app         # exits 1 if the app does not come up
toft fetch /healthz --app my-app         # exits 1 unless it answers 2xx or 3xx
```

Each step fails the pipeline on its own; no output parsing is needed. If a step
fails, `toft events` says what the platform noticed. For a batch app, drop the
`restart` line.

## Re-running a day

```bash
toft job run nightly-extract --app my-app --for 2026-10-06T03:00:00+01:00
```

`--for` names the instant the run is for; the job reads it as
`TOFT_SCHEDULED_FOR`. A value without an offset is read as UTC.

## Parsing `--json`

- **One JSON document per line.** A watched deploy streams a frame per phase,
  then a result object. A failed job run prints the run, then the error. Read
  line by line, as `jq` does.
- **Errors are JSON too**: `{"error", "kind", "code", "exit", "retryable"}` on
  stdout, plus `hint` when the install named a next step, with the sentence on
  stderr. Retry only when `retryable` is true. See
  [Errors as JSON](../exit-codes/#errors-as-json).
- **A failed deploy carries `reason`**, the message, and its detail (a log tail
  or dependency findings). Branch on `reason`, not the message.
- **Warnings are sentences, with codes beside them.** A deploy's or a check's
  `warnings` are for a person to read; `warning_details` gives each a `code` to
  branch on. A deploy that carried a `.env` file says so in `warnings`.
- **Piped output has no color codes**, the app's own included, so a captured
  `toft logs` is plain text.
- **The human output may change.** Script against `--json`.

```bash
toft status --json | jq -r .url
```

## Reaching a private app

A new app is private, so an anonymous request answers `authentication
required`. `toft fetch` sends your key for you; the install checks it and
removes it before the app sees the request:

```bash
toft fetch /api/report --expect 200
toft fetch / --anonymous --expect 401     # confirm it is still private
```

From another tool, send the key as a bearer token to the app's URL:

```bash
URL=$(toft status --json | jq -r .url)
curl -fsS -H "Authorization: Bearer $TOFT_TOKEN" "$URL/"
```

## Scanning the estate

A deploy key can read the scan-target list at `GET /api/v1/admin/estate/targets`.
Send `X-Toft-Scan: 1` on scan traffic. It grants nothing; it stops the scan from
counting as use of the app.

## Don't

- Don't retry exit 1 unless `retryable` is true. A failed build fails the same
  way on the same commit; a queued deployment (`deploy_queued`) is worth waiting
  for.
- Don't retry a refusal whose `retryable` is false. It will refuse again.
- Don't read the key out of `credentials.toml`. Use `toft api`.
- Don't re-point a published git tag. Anything resolved by ref picks up the move
  at its next deploy.
