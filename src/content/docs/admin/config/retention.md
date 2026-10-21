---
title: Retention
description: How long Toft keeps logs, events, runs and deployments, and what it never prunes.
---

Retention settings are on **Admin → Settings** (the integration log's is on
**Admin → Integrations**). Values are days unless noted.

| Setting | Prunes | Default |
|---|---|---|
| `platform_log_retention_days` | What Toft logged about each app: fetches, interpreter choice, refused starts | 90 |
| `app_event_retention_days` | Failure events: failed builds, failed health checks, runs that could not start | 90 |
| `job_run_retention_days` | Job run rows and their output files | 90 |
| `job_log_retention_days` | Background job log lines | 14 |
| `scheduled_run_retention_days` | Scheduled task run history (by age, not count) | 30 |
| `scheduled_log_retention_days` | Lines an app pushes while a task runs | 14 |
| `announcement_recipient_retention_days` | Per-person announcement delivery rows | 180 |
| `integrations_retention_days` | The integration log; minimum 30 | 365 |
| `max_versions_per_app` | A **count**: successful deployments one app may keep, the serving one included; `0` = no limit | 0 |

`max_versions_per_app` caps every app, whatever its owner asked for; the oldest
deployment that isn't serving goes first. Failed builds don't count: their files
are removed when they fail, and their entry and build log are kept. Owners see the policy on their app's Deployments tab.

## Never pruned

- **The audit log.** It does not expire on a setting. Deleting it is a deliberate
  database operation.
- **Announcement totals.** Delivered, failed and skipped counts survive the
  per-person rows.
- **Integration residue records** — what an integration left on the far side
  outlives the log and the app.

## Choosing values

- **Failure events and the platform log** are what you read during an incident
  and its post-mortem. A week is short; a quarter is generous.
- **Job and task logs** are the first to shorten when disk is tight.

Pruning runs on a periodic sweep; lowering a value does not free disk at once.
