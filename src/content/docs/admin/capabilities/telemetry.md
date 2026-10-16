---
title: Telemetry
description: Metrics and traces out, and the rules that keep them from becoming a liability.
---

## Exported, never resident

Toft keeps no metrics database. It exports to a collector you run and holds
nothing itself.

**Never load-bearing.** Telemetry failing does not degrade the install and changes
no answer.

**Absent configuration means absent.** No collector, no telemetry — not a buffer
filling up in memory. `OTEL_EXPORTER_OTLP_ENDPOINT` is the master switch: no SDK,
no exporter goroutine, no instrumentation on the request path.

**A half-configured pipeline is refused at startup** rather than half-started.

## Why the names are somebody else's

The `OTEL_*` family keeps the OpenTelemetry standard names, in the environment,
because **every runbook already knows them**. That is a deliberate exception to
sorting knobs into settings.

There is also a settings document on Admin → Telemetry, with the environment as
its bootstrap, so a runtime change takes effect without a restart.

## The scrape endpoint is not on the platform's origin

`METRICS_ADDR` gets a **listener of its own**. It is never a path on `:8080`.

The reason is single-origin installs: a metrics path on the platform's origin
could be read by an app's JavaScript **as the viewer**. So it is a separate
listener, or nothing.

Loopback by convention, where the process boundary is the control. Off loopback,
set `METRICS_TOKEN`.

It is independent of the OTLP switch: an install with Prometheus and no collector
is a normal install.

## The collector credential never reaches a workload

`OTEL_EXPORTER_OTLP_HEADERS` is never logged, never returned by an API, and never
inherited by a child process. An app cannot read your collector credential.

## Names and attributes are a contract

Metric and span names are stable, and the inventory is asserted. Dashboards built
against them keep working.

**Cardinality is budgeted, and the budget is code.** `TOFT_METRIC_APP_CARDINALITY_CAP`
bounds the per-app dimension. Where a label would be unbounded, it is not there —
which is what stops a label carrying an app id, a user id or a URL from turning
your metrics bill into an incident.

**`kind` is a metric label. A connection id never is.**

Redaction happens before export: no secret reaches the collector.

## Three opt-ins, all off by default

| | |
|---|---|
| `OTEL_RECORD_ENDUSER_ID` | The signed-in user's id on **spans** — never on a metric, at any setting. |
| `OTEL_DB_TRACE` | A span per database query. A debugging tool, not production instrumentation. |
| `PROPAGATE_TRACE_TO_APPS` | Sends `traceparent` upstream into a deployed app. |

## What to watch

The things worth alerting on are the ones a health check does not see:

- Builds queued and not starting.
- Workloads restarting repeatedly, and workloads killed for memory.
- Notification sends failing.
- Reachability verdicts changing.
- Database pool saturation.

The [checks page](../../operate/checks/) answers most of those on demand. Alerts
are for the ones you want to know about at 3am.
