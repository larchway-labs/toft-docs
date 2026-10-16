---
title: Limits and caps
description: The numbers that are fixed, the ones your administrator sets, and the things that are simply absent.
---

## Fixed

| | |
|---|---|
| App data document | 256 KiB, one document per app |
| Slug characters | lowercase letters, digits and hyphens |
| Reserved slugs | anything starting with `_` |
| Version pins | comparators only, never a patch version |
| Role words | exactly six, and no seventh |
| Integration attachments | one per (app, kind) |

## Set by your administrator

These vary per install. The app page, the build log and the refusal message all
name the one that applies when you hit it.

**Building**

- Build timeout, and how many builds may run at once
- Upload size for an archive
- Which language versions exist

**Running**

- Memory ceiling per app, with a per-app override an administrator can grant
- CPU reservation and ceiling, in isolated mode
- How long an app may be idle before it sleeps

**Automation**

- Job memory, CPU, timeout and the ceiling on retries
- How many of one app's job runs may be in flight
- How many scheduled tasks one app may have
- Scheduled task timeout, and how much of the response is kept

**History**

- How many releases one app keeps
- Retention for run logs, task logs, failure events and the platform's own log

**Access**

- Whether apps may be public at all
- How long a session lasts, idle and total
- Whether personal API keys are offered
- How strict the dependency policy is, and how long a waiver may run

## Things that are absent rather than limited

If your install has not configured a capability, it is **not there** — no
disabled buttons, no tabs that explain themselves.

- File storage
- Jobs
- Integrations
- The artifact store
- Isolated execution
- Telemetry
- The gallery
- Mail, and everything that depends on it

Ask your administrator before designing around any of them.

The one exception is the opposite: a capability withheld by **license tier** is
shown, and shown as locked. You are entitled to see what your install does not
have.
