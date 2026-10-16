---
title: Quiet apps
description: Finding what nobody uses, without the platform deciding for you.
---

Toft tracks how long it has been since anybody showed evidence of wanting
an app. Admin → Usage carries the list.

## Quiet is measured from evidence, not from traffic alone

Visits, deploys, edits, configuration changes — the last of any of them. An app
nobody has visited but which somebody redeployed last week is not quiet.

Two things deliberately do not count:

- **A reachability probe.** The platform checking that a public app answers is not
  somebody wanting it.
- **A scan** that identifies itself with the scan header. A sweep of the estate
  does not make every app look busy — and that header grants nothing.

## Quiet is never a verdict

Toft reports the fact; it does not act on it.

- **There is no sweep.** Nothing is stopped, locked or deleted for being quiet.
- The **fact is the owner's** — they see it on their app.
- The **enumeration is yours** — you get the list across the estate.
- **Retirement is a [lock](../locking/)**, and it is an action you take.

## Using it

The list is a prompt for a conversation, not a work queue to execute. An app that
has been quiet for a year might be:

- **Genuinely abandoned.** Lock it, with a message naming who to ask.
- **Seasonal.** The quarterly report that runs four times a year is quiet 361 days
  a year.
- **Load-bearing and boring.** A machine-to-machine API nobody "visits" can still
  be in the critical path.

The last two are why this never became automatic.

## Quiet is not sleeping

| | Measured in | Reversed by |
|---|---|---|
| **Sleeping** | minutes | the next request |
| **Quiet** | months | somebody wanting it |

An app can be awake and quiet, or asleep and busy. Sleeping is
`idle_sleep_minutes` reclaiming memory; quiet is a fact about demand.
