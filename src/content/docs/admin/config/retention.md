---
title: Retention
description: What Toft keeps, for how long, and what it never prunes.
---

Everything Toft accumulates has a retention setting, on Admin → Settings.
All of them are in days.

| Setting | What it prunes |
|---|---|
| `platform_log_retention_days` | What Toft said about each app — the release it fetched, the interpreter it resolved, the reason a start was refused. |
| `app_event_retention_days` | Failure events: a build that failed, a health check that stopped answering, a run that could not be made. |
| `job_run_retention_days` | Job run rows, and the output files attached to them. |
| `job_log_retention_days` | A background job's log lines. |
| `scheduled_run_retention_days` | Scheduled task run history. By age rather than by count, so it means the same for an hourly task and a nightly one. |
| `scheduled_log_retention_days` | Lines an app pushes while a task runs. |
| `announcement_recipient_retention_days` | Who each announcement was mailed to, person by person. |
| `integrations_retention_days` | The integration log. Floored at 30 days. |
| `max_versions_per_app` | Not days — a **count** of releases one app may keep. |

## Version retention is a cap, not a schedule

`max_versions_per_app` caps what any one app keeps, however many its owner asked
for. When a new release pushes the count over it, the oldest goes.

It resolves in one place, and the owner can see the policy that applies to their
app on its Deployments tab — so "why did my old release disappear" is answerable
without asking you.

Zero means no limit.

## What is never pruned by retention

**The audit log.** Authorization-relevant mutations are the record, and the
record does not expire on a setting. If your organization has a retention
obligation that requires deleting it, that is a database operation you perform
deliberately, not a knob here.

**Announcement counts.** The per-recipient rows are pruned; the counts of what
was delivered, failed and skipped survive. A frozen announcement stays a record.

**Integration residue.** Three integration kinds leave something on the far side,
and the record of that outlives both the ledger's retention and the app itself.

## Setting them

The trade is disk against the ability to answer a question about last month.
Two rules of thumb:

- **Failure events and the platform log** are what you read during an incident
  and during the post-mortem. A week is short; a quarter is generous.
- **Job and task logs** are usually only interesting until somebody has looked.
  These are the ones to shorten first when disk is the problem.

Pruning happens on a sweep. Lowering a number does not free disk instantly.
