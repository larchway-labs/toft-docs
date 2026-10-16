---
title: The admin pages
description: Every page under Admin, and the question each one answers.
---

Admin is four groups, and **each names what you are doing rather than what the
page is about**. A new page joins the group whose question it answers.

`⌘K` reaches all of them by name, and every setting on them by its words in
any order. It offers what the sidebar shows and nothing else: where the install
has no storage, **neither lists Admin → Storage** — the item is absent until the
install answers that it has one, rather than leading to a page that explains
itself away. (The palette asks only for an administrator, whom the route would
otherwise refuse.)

## Overview — what is happening on this machine right now

| Page | Answers |
|---|---|
| **Home** | What needs attention, and everything else from here. |
| **System info** | Version, host, runtimes, how this install was deployed, and who uses it. |
| **[System checks](../../operate/checks/)** | What this install can and cannot do, checked rather than assumed. |
| **[Processes](../../operate/health-and-processes/)** | Host CPU, memory and disk, every workload running, and who is signed in. |

## Apps — what the estate is doing, and what it is given

| Page | Answers |
|---|---|
| **[Usage](../../operate/usage/)** | Which apps are used, what they cost, and which nobody has opened. |
| **[Languages](../../build/languages/)** | What the estate is written in, and which version each app runs. |
| **[Scan targets](../../security/scan-targets/)** | Every app as an address, for whoever is pointing a scanner at this install. |
| **[Queue](../../build/queue-and-limits/)** | Builds waiting, building, and what each one is doing. |
| **[Automation](../../operate/automation/)** | Every schedule on the install and every run it has made. |
| **[Tags](../../apps/tags/)** | The taxonomy apps are filed under, and who may add to it. |
| **[Storage](../../capabilities/storage/)** | Durable locations apps can be given, and which apps and people reach each one. |

## Platform — what this install offers, and how it speaks

| Page | Answers |
|---|---|
| **Settings** | Where apps run, what they may start, and how long their history is kept. |
| **[Features](../../operate/licensing/)** | Optional capabilities this build offers, and which are switched on. |
| **[License](../../operate/licensing/)** | What this install is entitled to, and until when. |
| **[Email](../../capabilities/email/)** | The relay this install sends through, and which notifications it sends. |
| **[Telemetry](../../capabilities/telemetry/)** | Where traces and metrics are exported, and whether that is working. |
| **[Integrations](../../capabilities/integrations/)** | What apps may send on their own behalf, and through which channel. |
| **[Messages](../../capabilities/announcements/)** | The banner everybody sees, what somebody is told when turned away, and the knowledge base. |

## Governance — who and what is allowed, and the record of both

| Page | Answers |
|---|---|
| **[Authentication](../../identity/providers/)** | How people sign in, and what happens to an account nobody uses. |
| **[Sources](../../security/sources/)** | Which repositories this install will deploy from at all. |
| **[Dependencies](../../security/dependencies/)** | Which third-party packages this install will run, and what it found — advisories as a table, one row each. |
| **[Publisher requests](../../identity/users-and-roles/)** | People asking to be allowed to deploy. |
| **[Reach](../../apps/reach/)** | What each app holds, and which apps hold each thing. |
| **[Compliance](../../security/compliance/)** | What this install tells an assessor, and the evidence behind it. |
| **[Credentials](../../capabilities/credentials/)** | Values an app needs and its owner never holds, and which apps hold each. |
| **[API keys](../../security/keys/)** | Every personal credential on the install, and how to stop one. |
| **[Deploy keys](../../security/keys/)** | Credentials a pipeline holds, which belong to nobody and outlive whoever made them. |
| **[Activity](../../security/audit/)** | What people did, and what broke without anyone doing it. |
| **[Integration log](../../capabilities/integrations/)** | Every message an app has sent, with its recipients in full. |

## Absent, not disabled

Where a control cannot work on this install, the page leaves it out rather than
showing it greyed with a reason beside it.

- **Admin → Storage** is not in the sidebar or in `⌘K` on an install with no
  storage.
- **Admin → Settings**, on an install that can never isolate an app (one machine,
  no cluster), drops **Background jobs, New apps are born, CPU reserved per app and
  CPU ceiling per app**. The Isolated execution row stays and gives the one
  explanation. Where isolation is possible, Background jobs says where runs
  execute — see [where a job runs](../../operate/automation/#where-a-job-runs).
- **An app's Settings** leaves out its Isolated execution block for a shared app on
  an install with no isolation, and for a reader who may not choose; an isolated
  app always shows it.
- **An app's Access tab** warns about install reachability for a **confirmed**
  failure only. An *unknown* verdict about the whole install is nothing an app owner
  can act on, and it used to show on every public app.

Sessions, Unused accounts and the integration log's retention each save one number
on their own, because the server's warning belongs to the field that caused it; their
Save button now appears once the number has been edited, instead of sitting disabled
beside every field.

## Three redirects

`/admin/metrics`, `/admin/job-runs` and `/admin/scheduled` redirect to their
current homes. Old bookmarks keep working.

## Outside Admin

| Page | |
|---|---|
| **People** | Everyone on the install. A person's page carries their apps, groups, keys, sign-in history and **everything they can reach**. |
| **Documentation** | Links to the guides for this install’s version, and the knowledge base. |
| **Gallery** | What can be installed from the catalog. |
