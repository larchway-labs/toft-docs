---
title: What Toft is
description: Where your organization's own software lives, and what Toft does with a repository you give it.
---

Toft is where your organization's own software lives — web apps, APIs,
dashboards, reports and scheduled work, built in-house.

:::note
This guide is for people who build and run apps on Toft. If you administer
the install itself — identity providers, storage, licensing, what may be
published — that is the **admin guide**, a separate app your administrator can
install from the gallery. For `toft` and the app SDK, that is the **CLI and SDK
guide**.
:::

You give it a repository. It clones the code, works out what language and
framework it is, installs the dependencies, builds it, starts it, and serves it
at a URL. You do not write a Dockerfile, pick a base image, or configure a web
server.

## What you get

- **A URL** of the form `/apps/your-app`, on the address your administrator set
  up for this install.
- **Build logs and run logs**, kept per app, so a failed deploy tells you what
  happened.
- **Control over who can see it** — private, anyone signed in, or public — and
  a way for colleagues to ask for access.
- **Environment variables**, stored encrypted, that your app reads at startup.
- **Releases**, so you can roll back to the one that worked.
- **Scheduled work** — a schedule that calls your app, or a job that runs your
  code in a container of its own.

## What Toft is not

It is not a general container platform. It runs the languages and frameworks
listed under [How Toft reads your repository](../../build/how-detection-works/),
and a repository it cannot recognize is refused with a reason rather than
deployed and left to crash.

It is not a place to store data. An app gets a small
[JSON document](../../data/app-data/) of its own, and — where an administrator
has set one up — [file storage](../../data/app-storage/). Anything more is a
database your administrator provides.

It is not a CI system. It builds what you give it; it does not run your tests,
gate your merges, or hold your pipeline.

## The two halves of a Toft install

| | Who it is for |
|---|---|
| **The platform** | Everyone. The pages you sign in to, the app list, your app's page. |
| **Your apps** | Whoever you share them with. Served on a different address from the platform, on purpose, so an app's JavaScript cannot read the platform as you. |

That separation is why an app's links have to keep the `/apps/your-app` prefix.
It is the single most common cause of a deploy that succeeds and a page that
looks broken — see [Base paths](../../build/base-paths/).

## Three words worth learning now

**Deploy.** One attempt to turn source into a running app. It has three phases
and its own log, and it either produces a release or fails.

**Release.** The built output of a successful deploy, kept on the install. One
of them is *serving*; the others are what you roll back to.

**Workload.** The running process (or container) that answers requests. It can
be replaced, restarted, slept and woken without your release changing.
