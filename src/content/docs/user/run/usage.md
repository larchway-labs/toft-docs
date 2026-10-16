---
title: Usage and resources
description: Who opens your app, how often, and what it consumes.
---

The **Usage** tab shows traffic and consumption over the last **7d**, **30d** or **90d**. Anyone who can open the app can see it.

| Figure | Meaning |
|---|---|
| **Requests** | Requests to the app in the window. |
| **Unique viewers** | Distinct people and keys that made them. |
| **Requests / day** | The average. |
| **CPU time** | CPU used, with the reservation if one is set. |
| **Peak memory** | The highest reading, against the memory the app is allowed. |

A daily chart sits below the figures. A batch app shows only CPU time and peak memory.

The list of individual viewers is shown only to people who manage the app's sharing.

## What doesn't count

- **Reachability probes.** The platform checking that a public app answers.
- **Security scans** that identify themselves.

Neither is somebody using the app, so neither makes it look busy or keeps it from looking [quiet](../quiet/).

## Missing is not zero

A dash means nobody could take the reading, not that the reading was zero. When part of the window wasn't observed, the tab says **These figures are a lower bound**.

:::note
Usage is not product analytics. There are no funnels, page breakdowns or custom events. If you need those, build them into your app.
:::
