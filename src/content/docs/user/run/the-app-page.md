---
title: The app page
description: What each tab is for, and which ones you will not see.
---

Everything about one app lives on its page. Which tabs you get depends on what
you may do with the app and what this install has configured — a tab for a
capability your install does not have is **absent**, not greyed out.

| Tab | What it answers | Who sees it |
|---|---|---|
| **Overview** | Is it running, what is its URL, what did the last deploy do, what needs attention. | Anyone who can open the app |
| **Logs** | What the process is printing, and any deploy's build log. | Editors |
| **Deployments** | Every deploy, the release that is serving, rollback, retention. | Editors |
| **Usage** | Who has opened it, how often, what it is consuming. | Editors |
| **Dependencies** | What it installs, and what policy thinks of it. | Editors |
| **Automation** | Scheduled tasks, jobs, render schedules. | Editors |
| **Integrations** | What this app may send outward, and where. | Editors |
| **Reach** | Everything this app has been given — credentials, variables, storage, integrations, keys — by name. | Editors |
| **Access** | Visibility, who it is shared with, who is asking. | Owner, and whoever may share |
| **Settings** | Name, slug, source, variables, runtime, tags, deletion. | Editors |

## Overview

The page you land on. It carries the app's address, its current status, what the
last deploy did, and any banner that needs your attention — an unapplied
variable change, a blocked deploy, a source that is no longer allowed, a lock.

A [batch app](../../automation/jobs/#batch-apps) shows **Runs jobs** where the
address would be, and no Open, Start or Stop.

**A platform decision about your app appears on your app.** You do not have to
go and find out from somewhere else that a deploy was refused.

More than one thing can need your attention at once, and they stack rather than
compete: a lock, a blocked deploy and an unapplied variable change are three
separate notices, and none of them hides the others.

Two details worth knowing when you read the header:

- **The deploy date is the date of a deploy**, not a claim that the app is up to
  date with your repository. Nothing here watches your default branch on your
  behalf unless you turned [auto-deploy](../../deploy/auto-deploy/) on.
- **A reading that failed and a reading that has not arrived yet are not
  "empty".** A count you cannot open is a count this page will not assert; where
  the answer is not known, it says so instead of showing a zero.

## The URL

Your app is at `/apps/your-slug` on this install's apps address. That address may
be a different port or a different hostname from the platform you are reading
this on; both are normal, and your administrator chose which.

Copy it from the app page rather than typing it. If the app is private, that URL
works for you and for nobody else.

## The header

The app's status is a pill in the header, and it reports whatever a start or
stop from anywhere on the page did — the Settings button, the banner on
Overview, the CLI, a schedule. There is one answer about whether your app is up.

## Reach

One tab answering *what has this app been given* — everything, in one place:
who may open it, whether it is told who is looking, the credentials it holds,
the variables its owner set, the storage it mounts and where, what it may send
and to whom, the documents it keeps, the people it emails, and the keys that can
act as it.

**Names, never values.** It tells you *which* credential the app holds and the
names of the values inside it, never a value — for the obvious reason.

It reports what the app **can** touch, not what it has done. An app that has
sent nothing this month still may, so there are no counts of activity here;
those live on Usage and in the integration log.

The line above the list names what it cannot see. Outbound network is the big
one: nothing here restricts where your app connects to unless your
administrator has configured that at the network level.

## Deleting an app

On **Settings**, and it is type-to-confirm because it is not reversible.
Deleting an app removes its releases, stops and removes its workload, and
detaches its storage.

**Detaching storage does not delete the data.** Objects and files in a store
survive the app that was mapped to them.
