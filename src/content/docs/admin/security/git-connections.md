---
title: Connected git hosts
description: Hold your git host's clone credential once, centrally, so developers never handle a token.
---

A **connection** attaches your organization's git host once, on **Admin →
Sources**. Apps then point at a repository instead of carrying their own token.

| Developers get | |
|---|---|
| A repository picker | Instead of a URL box, and no token prompt |
| Private repositories | Without a secret in the app's settings |
| Auto-deploy on push | By polling, and in seconds if you set up a webhook |
| One credential to rotate | Instead of personal access tokens scattered across apps |

## Auto-deploy

**Polling** is how a push deploys: on `AUTO_DEPLOY_POLL_INTERVAL` (seconds,
default `60`). `AUTO_DEPLOY_POLL_INTERVAL=0` turns auto-deploy off entirely. See
[operating dials](../../config/operating-dials/).

A **webhook** is optional, and off on a new connection. Most organizations don't
let a git host call in, and you need nothing from the network team to use
polling. If your host *can* reach this install, choose **Set up webhook…** from
the connection's menu. Toft shows a secret and a URL once; add both as a push
webhook at the host, and a push deploys in seconds instead of on the next poll.
**Replace webhook secret…** issues a new one if it's lost, and **Turn off
webhook** goes back to polling alone.

## Testing

Every connection has a **Test** button and a list of the apps using it. Run it
when you create or rotate the connection. A failed test reports which of four
things is wrong: refused credential, unreadable credential, wrong base URL, or
rate limit.

## Expiry

The **Clone credentials** row on **Admin → System checks**:

| Status | When |
|---|---|
| `fail` | A credential has expired — the row names how many apps it affects |
| `warn` | Expiry within 14 days, or the last mint failed |
| — | Disabled connections are excluded |

## Only a signed-in person attaches one

Pointing an app at a connection (`git_connection_id`) needs a browser session.
Personal and deploy keys get **403 `session_required`** before anything is
written. Any signed-in person may attach, but only to a repository the connection
covers — anything else is refused, naming both. See [keys](../keys/).

## Disable or remove

| Action | Effect |
|---|---|
| **Disable** | Immediate and always allowed. Running apps keep serving. |
| **Remove** | Refused (409) while apps depend on it, naming them. |

## Credentials stay hidden

No credential is shown to developers, other administrators, the API or a checks
report. Rotating means replacing it, never reading it. Developers are not told
which auth method a connection uses.
