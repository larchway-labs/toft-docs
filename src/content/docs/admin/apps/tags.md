---
title: Tags
description: The taxonomy apps are filed under — administrators define it, owners choose from it.
---

**Admin → Tags.** You define tags and their allowed values; app owners choose
among them and cannot invent new ones. Expect "please add a value" requests, and
answer them quickly.

## A taxonomy that works

Four or five tags, each with a short closed list:

| Tag | Values |
|---|---|
| `team` | Your teams |
| `environment` | `prod`, `staging`, `sandbox` |
| `data` | `public`, `internal`, `confidential`, `regulated` |
| `criticality` | `tier-1`, `tier-2`, `tier-3` |

A good tag answers a question about every app at once — which touch regulated
data, which belong to a team that no longer exists.

Toft maintains a read-only `framework` tag from detection.

## Browsing

`/tags/<tag>` and `/tags/<tag>/<value>` are linkable pages — `/tags/team/payments`
belongs in a runbook. Value listings show counts, so unused values stand out.

## Getting apps tagged

Nothing forces an owner to choose. Keep the list short, tag the apps you already
know yourself, then use the counts to find the gaps.
