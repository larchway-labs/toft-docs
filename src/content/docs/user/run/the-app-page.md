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

Opens on a **Summary** of the app — owner, who can see it, when it was created and, for editors, what is serving and whether it is the latest deployment. Under it, **Preview** shows the app inside the page; it stays closed until you open it, because loading the app wakes it and counts as a visit. Below that, an **Activity** section shows recent usage and failures. A [batch app](../../automation/jobs/#where-a-job-runs) has no address and no Open, Start or Stop.

The first button at the top of the page is what the app needs next: **Start app** when it is stopped, **Restart app** when it has crashed, **View build log** when its first deploy failed, and **Open** otherwise. **Open** is always there. Start, Restart and Stop are also in the **⋯** menu. An uploaded app has a **Deploy** menu with **Upload new version** and **Redeploy current version**; an app deployed from git has **Redeploy**.

Notices that need you sit above the tabs: an unapplied variable change, a refused deploy, a blocked source, a lock. Notices about an app that is down come first.

Your app's address is `/apps/<slug>` on the install's apps address, which may be a different port or hostname from Toft itself. Copy it from the page.

:::note
The deploy date is when the app was last deployed, not proof it matches your repository. Pushes deploy only with [auto-deploy](../../deploy/auto-deploy/) on.
:::

## Reach

One list of what the app has been given: who may open it, the credentials and variables it holds, the storage attached to it, what it may send, and the keys that act as it. It shows names, never secret values, and what the app *can* do rather than what it did. The line at the top says what Reach can't see, such as outbound network access.

## Deleting an app

**Settings → Danger zone**, type-to-confirm. It removes the app, its deployments and its logs, and detaches its storage. Data in a store or volume stays.
