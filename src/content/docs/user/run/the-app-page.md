---
title: The app page
description: The tabs on an app's page, who sees each one, and where to find your app's address.
---

Everything about one app lives on its page. You see only the tabs your role and this install allow; the rest are absent, not grayed out.

| Tab | Shows | Who sees it |
|---|---|---|
| **Overview** | Address, status, last deploy, preview, notices | Anyone who can open the app |
| **Usage** | Requests, viewers, CPU, memory | Anyone who can open the app |
| **Automation** | The app's jobs and their runs | Editors |
| **Logs** | Run log, build log, recent failures | Editors |
| **Deployments** | Every deploy, rollback | Editors |
| **Dependencies** | Packages and policy findings, when the install has a policy | Editors |
| **Integrations** | What the app may send, and where | Editors |
| **Reach** | Everything the app has been given | Editors |
| **Access** | Visibility, sharing, access requests | Whoever may share |
| **Settings** | Name, source, runtime, variables, deletion | Editors |

## Overview

Shows the app's address, status, last deploy, and an **Activity** section with recent usage and failures. A [batch app](../../automation/jobs/#where-a-job-runs) has no address and no Open, Start or Stop.

Notices that need you sit above the tabs: an unapplied variable change, a refused deploy, a blocked source, a lock. Notices about an app that is down come first.

Your app's address is `/apps/<slug>` on the install's apps address, which may be a different port or hostname from Toft itself. Copy it from the page.

:::note
The deploy date is when the app was last deployed, not proof it matches your repository. Pushes deploy only with [auto-deploy](../../deploy/auto-deploy/) on.
:::

## Reach

One list of what the app has been given: who may open it, the credentials and variables it holds, the storage attached to it, what it may send, and the keys that act as it. It shows names, never secret values, and what the app *can* do rather than what it did. The line at the top says what Reach can't see, such as outbound network access.

## Deleting an app

**Settings → Danger zone**, type-to-confirm. It removes the app, its deployments and its logs, and detaches its storage. Data in a store or volume stays.
