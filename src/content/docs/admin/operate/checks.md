---
title: System checks
description: Admin → Checks — what this install can and cannot do, read live, with a link to the fix.
---

**Admin → Checks** asks the install what it can do and shows each answer with the
reading behind it. Open it first on a new install, after an upgrade, and whenever
something is wrong. Every row is listed in the [checks reference](../../reference/checks-reference/).

## Statuses

| Status | Means |
|---|---|
| **pass** | The answer was good |
| **warn** | The answer deserves attention |
| **fail** | The answer is bad |
| **skip** | This install does not offer the capability — not a problem |

An unconfigured capability reads `skip` with a reason, never `fail`. On a bare
install every optional subsystem is a skip, and that is healthy.

## How checks behave

- **Read-only.** A check configures and fixes nothing, and never dials a third party.
- **Bounded.** A check that overruns 5 seconds is a `warn` ("did not answer"); one
  the 20-second report budget never reached reads "ran out of time"; one that
  panics is a contained `fail`, and the rest of the report still renders.
- **No secrets.** No detail carries a credential.
- **Findings link to the fix** — an admin page or a setting. A `pass` or `skip`
  links nowhere, and a fix that lives on the host (a full disk, a missing
  interpreter) has no link.

## Categories

| Category | Checks |
|---|---|
| Platform | Database, Host, License, Advisory corpus, Public reachability, Clock, Telemetry, Database pool, Schema migrations |
| Storage | Data directories, artifact store, build cache, shared storage |
| Execution | Execution backends, Toolchains, Runner images |
| Apps | App health |
| Sign-in | Sign-in, Directory groups, Permitted login groups, Directory feed |
| Notifications | Notifications |
| Sources | Clone credentials |
| Security | security.txt, At-rest encryption, Development switches, Trusted proxy |
| Automation | Stuck work, Scheduled jobs |

## Rows worth knowing

| Row | Behavior |
|---|---|
| Toolchains | A family reported absent is probed again on **Run checks** — no restart after installing an interpreter |
| Clone credentials | `fail` past expiry (with the app count); `warn` within 14 days or after a failed mint |
| Clock | Skew against the database: `warn` past 2 s, `fail` past 30 s. No time server is dialed |
| Development switches | `warn` for `DEV_PASSWORD` or `DEV_INSECURE_COOKIES`; `skip` on a loopback install |
| Trusted proxy | `warn` when a forwarded header arrives from outside `TRUSTED_PROXY_CIDRS` |
| Sign-in | Flags lockout risk (one administrator, local sign-in off); absent while local sign-in is on |
| Schema migrations | `warn` with a count when the database moved under a running process, e.g. a restore |
| At-rest encryption | Always `pass`; shows the backend, key id, ring size and KEK URI — the key your backup needs |
| App health | Counts locked, suspended and withheld apps without raising the verdict |
| Advisory corpus | `warn` past 7 days, or when the policy is on and no feed has synced |
| Public reachability | `warn`, never `fail`; `skip` when nothing is published or no verdict has arrived |
| Stuck work, Scheduled jobs | Job runs past their deadline and still claimed; a job schedule more than 10 minutes past due and never dispatched — the scheduler, not the app |

## Build cache and report

- The **build cache** card above the checks shows its size and a **Reclaim**
  button. See [The build cache](../../build/cache/).
- **Copy report** puts a plain-text header and one line per row on the clipboard,
  for pasting into a ticket.
