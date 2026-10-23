---
title: The admin pages
description: Every page under Admin, its address, and the question it answers.
---

Admin has four groups in the sidebar. `⌘K` reaches every page by name and every
setting by its words, and offers only what the sidebar shows.

## Overview

| Page | Address | Answers |
|---|---|---|
| **Home** | `/admin` | What needs attention. |
| **System info** | `/admin/info` | Version, host, runtimes and which apps use each, how this install was deployed, who uses it. |
| **[System checks](../../operate/checks/)** | `/admin/checks` | What this install can and cannot do, checked live. |
| **[Processes](../../operate/health-and-processes/)** | `/admin/processes` | Host CPU, memory and disk, every running workload, the build queue, who is signed in. |

## Apps

| Page | Address | Answers |
|---|---|---|
| **[Usage](../../operate/usage/)** | `/admin/usage` | Which apps are used, what they cost, which nobody opens. |
| **[Scan targets](../../security/scan-targets/)** | `/admin/estate/targets` | Every app as an address, for a scanner. |
| **[Automation](../../operate/automation/)** | `/admin/automation` | Every schedule and every run. |
| **[Tags](../../apps/tags/)** | `/admin/tags` | The tags apps are filed under, and who may add them. |
| **[Storage](../../capabilities/storage/)** | `/admin/storage` | Storage locations, and which apps and people reach each. |

## Platform

| Page | Address | Answers |
|---|---|---|
| **[Settings](../settings/)** | `/admin/settings` | Where apps run, what they may use, how long history is kept. |
| **[Features](../../capabilities/optional/)** | `/admin/features` | Optional capabilities this build offers, and which are on. |
| **[License](../../operate/licensing/)** | `/admin/license` | What this install is entitled to, and until when. |
| **[Email](../../capabilities/email/)** | `/admin/email` | The mail relay, and which notifications are sent. |
| **[Telemetry](../../capabilities/telemetry/)** | `/admin/telemetry` | Where traces and metrics go, and whether that works. |
| **[Integrations](../../capabilities/integrations/)** | `/admin/integrations` | What apps may send, and through which channel. |
| **[Messages](../../capabilities/announcements/)** | `/admin/messages` | The banner, the messages shown to people turned away, the knowledge base. |

## Governance

| Page | Address | Answers |
|---|---|---|
| **[Authentication](../../identity/providers/)** | `/admin/authentication` | How people sign in; sessions; unused accounts. |
| **[Sources](../../security/sources/)** | `/admin/sources` | Which repositories this install deploys from. |
| **[Dependencies](../../security/dependencies/)** | `/admin/dependencies` | Which third-party packages may run, and what was found. |
| **[Publisher requests](../../identity/users-and-roles/)** | `/admin/publisher-requests` | People asking to be allowed to deploy. |
| **[Reach](../../apps/reach/)** | `/admin/reach` | What each app holds, and which apps hold each thing. |
| **[Compliance](../../security/compliance/)** | `/admin/compliance` | What this install tells an assessor, with evidence. |
| **[Credentials](../../capabilities/credentials/)** | `/admin/credentials` | Values an app uses but its owner never sees. |
| **[API keys](../../security/keys/)** | `/admin/api-keys` | Every personal key, and how to stop one. |
| **[Deploy keys](../../security/keys/)** | `/admin/deploy-keys` | Keys that pipelines hold, owned by nobody. |
| **[Activity](../../security/audit/)** | `/admin/audit` | What people did, and what broke on its own. |
| **[Integration log](../../capabilities/integrations/)** | `/admin/integration-log` | Every message an app sent, with recipients. Linked from Integrations; not in the sidebar. |

## What is hidden, not disabled

A control that cannot work on this install is left out, not greyed.

| Where | Hidden when |
|---|---|
| **Admin → Storage** (sidebar and `⌘K`) | The install has no storage. |
| **New apps are born**, **CPU reserved per app**, **CPU ceiling per app** on Admin → Settings | The install cannot isolate an app. The **Isolated execution** row stays and explains why. |
| **Background jobs** on Admin → Settings | There is nowhere to run a job: no cluster and no way to run one on this machine. |
| The job limits and job retention rows on Admin → Settings | Background jobs are switched off. |
| An app's **Isolated execution** block | The app is shared and the install has no isolation, or the reader may not choose. |

`/admin/metrics` redirects to Usage; `/admin/job-runs` and `/admin/scheduled`
redirect to Automation.

## Outside Admin

| Page | What it is |
|---|---|
| **People** | Everyone on the install. A person's page shows their apps, groups, keys, sign-in history and everything they can reach. |
| **[Documentation](../../capabilities/documentation/)** | Links to the guides for this install's version, and the knowledge base. |
| **[Gallery](../../capabilities/gallery/)** | What can be installed from the catalog. |
