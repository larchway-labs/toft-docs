---
title: What an app can reach
description: Everything an app has been given, the estate-wide view of it, and what the page cannot see.
---

**Admin → Reach** answers the first two questions of an incident: **what has
this app been given**, and **which apps hold this thing**. Each app also has a
**Reach** tab. Everything shown was already stored; nothing new is collected.

## What it lists

| | |
|---|---|
| Who may open it | Visibility and grants, by name |
| Who may frame it | Embedding |
| Whether it is told who is looking | [Viewer identity](../../capabilities/optional/) |
| Values its owner never holds | [Broker credentials](../../capabilities/credentials/) |
| Values its owner set | Environment variables |
| Durable storage attached to it | [App storage](../../capabilities/storage/), and where |
| What it may send, and where | [Integrations](../../capabilities/integrations/) |
| A document it keeps | App data |
| People it emails on a timer | Report recipients |
| Credentials that act as it | Its app API keys |

The list is a closed specification: a new table keyed by app must be either read
here or explicitly excluded, or Toft's own build fails.

## How it reads

- **Names, never values.** Credential names, environment keys, storage names and
  mount paths, integration kinds and destinations, grant principals. No value,
  under any key.
- **What it can touch, never what it did.** Send history, usage and the audit log
  have their own pages.
- **Nothing is skipped.** An app holding nothing is still a row. A capability the
  install does not offer is **absent**, not zero. An attachment switched off
  install-wide reads as present but not effective.
- **Effective visibility.** An app whose public visibility is withheld reads
  `authenticated`.
- **By credential** and **by storage** are the same list transposed, so they
  always agree with it.
- **No score.** The page reports what an app holds; you decide what it means.

:::caution[Outbound network is not on this page]
Egress is unrestricted unless your install sets blocked ranges, and shared mode
has no network policy. The page says so above the list.
:::

## Who can read it

| Read | Who |
|---|---|
| An app's **Reach** tab (`GET /api/v1/apps/{id}/reach`) | Anyone who can edit the app. A viewer gets `403`. |
| **Admin → Reach** (`GET /api/v1/admin/estate/reach`) | Administrators only; `404` to everyone else. Refused to every API key, deploy keys included. |
