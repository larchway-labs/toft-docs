---
title: Telemetry
description: Export metrics and traces to your OpenTelemetry collector, and expose a Prometheus scrape endpoint.
---

Toft keeps no metrics database: it exports to a collector you run. Telemetry is
never load-bearing — if it fails, nothing else degrades.

## Turning it on

| Variable | Does |
|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | The master switch. Unset: no exporter, no instrumentation, nothing buffered |
| `OTEL_EXPORTER_OTLP_HEADERS` | Collector credential — never logged, returned by an API, or passed to an app |
| `OTEL_*` (standard names) | Protocol, service name, resource attributes, sampler, export interval and the rest, as in any OpenTelemetry runbook |
| `METRICS_ADDR` | A separate Prometheus scrape listener. Independent of OTLP |
| `METRICS_TOKEN` | Required in practice when `METRICS_ADDR` is not loopback |

A half-configured pipeline is refused at startup. **Admin → Telemetry** holds the
runtime settings, seeded from the environment, so changes apply without a restart.

:::caution[Scrape endpoint is its own listener]
`METRICS_ADDR` is never a path on `:8080`. On a single-origin install, an app's
JavaScript could read such a path as the viewer.
:::

## Names and cardinality

- Metric and span names are a stable contract; dashboards keep working across upgrades.
- `TOFT_METRIC_APP_CARDINALITY_CAP` bounds the per-app dimension. No label carries
  an unbounded value such as a user id or URL — `kind` is a label, a connection id never is.
- Secrets are redacted before export.

## Opt-ins (all off)

| Variable | Adds |
|---|---|
| `OTEL_RECORD_ENDUSER_ID` | The signed-in user's id on spans — never on metrics |
| `OTEL_DB_TRACE` | A span per database query; for debugging |
| `PROPAGATE_TRACE_TO_APPS` | Sends `traceparent` into deployed apps |

## What to alert on

What a health check does not see: builds queued and not starting, workloads
restarting or killed for memory, failing notification sends, changing
reachability verdicts, and database pool saturation. [Checks](../../operate/checks/)
answers most of these on demand.
