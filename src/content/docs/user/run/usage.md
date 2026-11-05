---
title: Usage and resources
description: Who opens your app, how often, and what it consumes.
---

The **Usage** tab shows traffic and consumption over the last **7d**, **30d** or **90d**. Anyone who can open the app can see it.

| Figure | Meaning |
|---|---|
| **Page loads** | Pages people opened, signed in or not. One page counts once, however many requests it makes. The total number of requests is shown beneath it. |
| **People signed in** | Distinct people who opened the app while signed in. |
| **Anonymous browsers** | Distinct browsers that opened the app without signing in. Shown only when your administrator has turned on counting. It is an estimate, accurate to about 1%. |
| **Requests / day** | The average. Shown in place of anonymous browsers when counting is off. |
| **CPU time** | CPU used, with the reservation if one is set. |
| **Peak memory** | The highest reading, against the memory the app is allowed. |

A daily chart sits below the figures. A batch app shows only CPU time and peak memory.

The list of individual viewers is shown only to people who manage the app's sharing. They can also download it, one line per person per day, over any range of dates: choose **From** and **To** and select **Download CSV**. A year is the default. If your install keeps visits for a shorter time, the file starts at the oldest day it keeps.

## What doesn't count

- **Reachability probes.** The platform checking that a public app answers.
- **Security scans** that identify themselves.
- **The Preview on the app's own page.** It shows the app in a frame, and a framed page is not a page load.

Neither is somebody using the app, so neither makes it look busy or keeps it from looking [quiet](../quiet/).

## Missing is not zero

A dash means nobody could take the reading, not that the reading was zero. When part of the window wasn't observed, the tab says **These figures are a lower bound**.

:::note
Usage is not product analytics. There are no funnels, page breakdowns or custom events. If you need those, build them into your app.
:::
