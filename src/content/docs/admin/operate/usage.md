---
title: Usage, consumption and cost
description: Admin → Usage — which apps are used, what they consume, and what the numbers do not say.
---

**Admin → Usage** joins demand and cost per app over one window, so you can see
which apps matter and which only hold resources.

## Audience

The page opens with one line about the whole install, over 12 weeks, 6 months
or 12 months:

| Figure | Meaning |
|---|---|
| People signed in | Distinct people who opened any app while signed in |
| Anonymous browsers | Distinct browsers that opened any app without signing in. Shows **Off** until you turn on counting |
| Page loads | Pages opened, signed in or not. One page counts once, however many requests it makes |

The chart below shows people and anonymous browsers per week (per month over 12
months). People and browsers are counted once across the whole window, so the
figures above the chart are not the sum of its bars. A week with no bar for
browsers is a week when counting was off, not a week with no visitors.

The same figures are available from the API at
`GET /api/v1/system/audience?since=&until=&grain=day|week|month`
(administrators only). The window can go back as far as your install keeps
visits, or 400 days when it keeps them forever.

### Counting anonymous browsers

Counting is **off** until you turn on **Count anonymous browsers** under
**Admin → Authentication → Anonymous access**. While it is on:

- A browser that opens an app without signing in gets a cookie,
  `toft_visitor`, holding a random ID. It lasts 13 months and is never renewed.
- The browser is counted when the cookie comes back. A client that never
  returns cookies, such as a crawler or a monitoring probe, is never counted.
- The ID is stored only inside an estimate, which can say how many browsers
  came but not which. There is no list of IDs to look up.
- **No app ever receives the cookie.** It is removed before the request
  reaches the app.
- Signed-in people are not counted as browsers. They are already counted by
  name.
- Browsers that send the Global Privacy Control signal (`Sec-GPC: 1`) are not
  counted. Their page loads still are.
- None of these figures leave your install. They are not sent at license
  check-in or in telemetry.

Turning counting off stops it at once. A browser that comes back with the
cookie has it removed. The counts already recorded are kept until your
install's retention for visits removes them.

:::caution[Check your jurisdiction first]
Some jurisdictions allow a first-party cookie used only to measure your own
audience without asking for consent; others require consent for any cookie.
Toft cannot show a consent banner over an app. Where consent is required,
leave counting off.
:::

An app served on its own hostname keeps its own cookies. A browser that opens
an app there and another app on the shared apps address counts once in each
place, so the install-wide figure can count it twice.

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
