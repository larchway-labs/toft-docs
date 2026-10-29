---
title: The audit log
description: What is recorded, what never is, and how to read it during an incident.
---

**Admin → Activity** records what people did and what changed on the install.

## Guarantees

- **Same transaction.** An authorization-relevant change and its audit row commit
  together. A change without a record cannot exist.
- **No credential values.** Creating, renaming, disabling, enabling and revoking
  a key are recorded by name only. The license key is the exception: it is a customer
  lookup, not a secret, and is audited in full.
- **Kept until you choose otherwise.** **Keep the access record for** on
  Admin → Settings → Retention covers the audit log and the record of who opened
  each app. At 0, the default, nothing is ever removed. Otherwise it keeps at
  least a year. Every pass that removes records adds an entry saying what it
  removed and from what date nothing older remains. Shortening an old install's
  record can take a few hours. The per-request access lines are your log
  collector's to keep. Successful health checks from a load balancer or
  Kubernetes are left out of them unless the log level is `debug`.
- **Sign-ins are their own family**, `session.*` (`session.signin`,
  `session.signin_failed`, `session.signout`), never mixed with authorization
  events.

## What is always recorded

Settings changes (`platform_settings.update`), provider changes (including
disabling one), app create and delete, grants and transfers, activations, locks
and unlocks, keys and credentials, storage attachments, announcements,
knowledge-base picks, dependency waivers, storage presigns, build-cache reclaims,
and who started each deployment and how the code arrived (`app.deploy`). A
storage presign records the folder whose grant allowed it.

Every audited action belongs to exactly one of four chips — **Deploys**,
**Access**, **Sign-ins** and **Settings** — and **System** shows what failed on
its own, with nobody acting. **All** shows both.

## 404, not 403

Someone not allowed to know a thing exists gets **404**. The exception is the
[`list` rung](../../apps/listing/): a person deliberately shown an app gets a 403
that says so.

## During an incident

| Filter | Answers |
|---|---|
| **Sign-ins** | Who signed in, from where, and who failed |
| **Access** | Who was given what — grants, roles, keys, locks, credentials |
| **Settings** | What changed on the install or an app's configuration, and when |
| **Deploys** | What was deployed, started, stopped or removed |
| **App**, picked beside the search | Everything done to one app, including access requests about it and what the app did itself |
| Search for a person, an app, an IP or a request ID | Everything that happened to it — by whoever did it or whatever it was done to, a deleted app or storage resource included, by the name its deletion recorded |
| **How far back**, beside the search | Only the last hour, 24 hours, 7 days or 30 days; **All** for the whole retained record |

The filter is part of the address, so a narrowed feed can be sent as a link.
An app's history reaches back to when this version was installed. Older entries
appear only when the app was what they changed, and the page says from when.

## App output

What a shared app prints reaches the platform's own log as one `kind=app` record per line, with the app, its release, the stream and the time. Collect the platform's log with your log agent and app output is collected with it: Toft keeps no copy beyond a few megabytes of each app's file, rotated as it fills. Each app may send 100 lines a second, with bursts of up to 3,000. Lines over that are not sent, and a `kind=app_dropped` record says how many and when. **Copy every line of app output** on Admin → Settings removes the limit; the app's own **Logs** tab keeps every line either way.

An isolated app's output is its own pod's log. Only your cluster's log agent keeps it; without one it is gone at every redeploy. Pods carry `toft.dev/app-id` and `toft.dev/app-slug` labels to tag lines with.

Where apps run as accounts of their own, an app can't read or change its log files. **Admin → Info** says when that isn't so on this install.

Client addresses are only as good as your
[trusted proxy list](../../config/listeners-and-origins/). If every row shows the
load balancer's address, fix that first.
