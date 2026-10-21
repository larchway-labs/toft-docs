---
title: What Toft is
description: Give Toft a repository and it builds, runs and serves your app at a URL. No Dockerfile, no web server config.
---

Toft runs your organization's own software — web apps, APIs, dashboards,
reports and scheduled work. You give it code; it detects the framework,
installs dependencies, builds, starts the app and serves it at a URL.

You do not write a Dockerfile, pick a base image or configure a web server.

## What you get

| | |
|---|---|
| **A URL** | `/apps/your-app`, on the address your administrator set up. |
| **Logs** | A build log per deploy and a live run log, so a failure tells you why. |
| **Access control** | Restricted to people you choose, anyone signed in, or public — plus a way for colleagues to ask for access. |
| **Configuration** | Environment variables, stored encrypted, read at startup. |
| **Deployments** | Every successful deploy is kept, so you can roll back. |
| **Scheduled work** | Tasks that call your app on a schedule, and jobs that run your code on their own. |

## What it is not

- **Not a general container platform.** It runs the frameworks listed in
  [How Toft reads your repository](../../build/how-detection-works/). A
  repository it does not recognize is refused with a reason.
- **Not a database.** An app gets a small [JSON document](../../data/app-data/)
  and, where configured, [file storage](../../data/app-storage/). Anything more
  is a database your administrator provides.
- **Not CI.** It builds what you give it. It does not run your tests or gate
  merges.

## Two addresses

The platform (where you sign in and manage apps) and your apps are served on
different addresses, so an app's JavaScript cannot act as you on the platform.

That is why your app lives under `/apps/your-app` and its links must keep that
prefix. It is the most common cause of a deploy that succeeds and a page that
looks broken — see [Base paths](../../build/base-paths/).

## Three words

**Deploy** — one attempt to turn source into a running app. Each is listed as a
**deployment**, with its own build log, and either succeeds or fails.

**Deployment** — what a deploy leaves. A successful one is the built app: one is
*serving*; the others are what you roll back to.

**Workload** — the running process that answers requests. It can be restarted,
slept and woken without the deployment changing.

:::note[Other guides]
Running the install itself is the **admin guide**; `toft` and the app SDKs are
the **CLI & SDK guide**. Both are linked from **Documentation** in Toft.
:::
