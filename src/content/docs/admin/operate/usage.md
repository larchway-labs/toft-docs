---
title: Usage, consumption and cost
description: Admin → Usage — which apps are used, what they consume, and what the numbers do not say.
---

**Admin → Usage** joins demand and cost per app over one window, so you can see
which apps matter and which only hold resources.

## The usage table

| Column | Meaning |
|---|---|
| Requests | Requests in the window, with a daily sparkline |
| Viewers | Distinct people who opened the app |
| Last visit | Most recent request |
| CPU time | CPU consumed in the window |
| Peak memory | Highest sampled memory |

- Apps with no traffic are listed too.
- Days are cut at midnight **UTC**, whatever your browser's zone.
- Counts only — who visited an app is on that app's own **Usage** tab, for people
  who can manage its access.
- [Reachability probes](../../security/reachability/) and requests marked as scans
  do not count as usage.
- A metric a backend does not measure is **blank, never `0`**. CPU reservation and
  ceiling do not apply to shared-mode apps and are omitted.

Below the table, **Quiet apps** lists apps nobody has used in a long time — see
[Quiet apps](../../apps/quiet/).

## Active users

**Admin → System info** shows distinct people who opened an app today, in the last
7, 30 and 365 days (`GET /api/v1/system/active-users`). It is usually far smaller
than the account count.

Host CPU, memory and disk are on [Processes](../health-and-processes/).

## What this is not

- **Not chargeback.** No rate card or currency — consumption only.
- **Not product analytics.** No funnels or per-page breakdowns; that belongs in the app.

The counts sent to the vendor at license check-in contain no names; see
[Licensing](../licensing/#outbound-traffic).
