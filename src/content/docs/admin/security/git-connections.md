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
| Auto-deploy on push | Through the connection's webhook |
| One credential to rotate | Instead of personal access tokens scattered across apps |

## Auto-deploy

A **webhook** speeds things up when the host can reach this install; **polling**
on `AUTO_DEPLOY_POLL_INTERVAL` (seconds, default `60`) is the mechanism underneath.
`AUTO_DEPLOY_POLL_INTERVAL=0` turns auto-deploy off entirely. See
[operating dials](../../config/operating-dials/).

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
