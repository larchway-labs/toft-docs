---
title: Dependency policy
description: Check every app's declared packages against an advisory feed, refuse risky deploys, and lock on malware.
---

**Admin → Dependencies** checks the package names and versions your apps declare
against a vulnerability feed (OSV).

It is a manifest check. It does not read your code, and it will not find a bug, a
committed secret, or a vulnerability in code with no package name. Your package
list is never sent anywhere.

## Settings

| Setting | What it does |
|---|---|
| `dependency_policy` | `off`, `warn` or `block`. Run `warn` for a couple of weeks before `block`. |
| `dependency_scan_on_deploy` | Resolve packages as a build installs them. |
| `dependency_block_severity` | Minimum severity that refuses a deploy, or `off`. |
| `dependency_block_only_fixable` | Refuse only findings with a fix; record the rest. |
| `dependency_block_malware` | Refuse known-malicious packages — a separate switch, not a severity. |
| `dependency_watch_enabled` | Re-check serving apps in the background. |
| `dependency_scan_interval_hours` | How often that sweep runs. |
| `dependency_scan_history_kept` | Readings kept **per app** (a count, not days). |
| `dependency_waiver_max_days` | Longest a waiver may last. There are no permanent waivers. |
| `dependency_lock_on` | `off` (default), `malware`, `critical` or `high`. See below. |
| `dependency_feed_endpoint`, `_interval_hours`, `_max_age_hours`, `_credential` | The feed: where, how often, when it counts as stale, and a mirror's credential. |

**Preview a policy change before saving.** It lists the apps that would be refused.

## Coverage

| Rung | Means |
|---|---|
| **Recorded** | An inventory was taken for this deployment |
| **Matched** | It was compared to the advisory corpus |
| **Covered** | The corpus actually covers that ecosystem |

R is matched against CRAN but reported **not scanned**: findings are shown and
enforced, but no findings is not a clean bill.

Node is read from `package-lock.json` only. An app locked with `pnpm-lock.yaml` or
`yarn.lock` still deploys, but its versions resolve fresh from `package.json`, and
the build log says so.

## What it never does

- **A restart is not a deploy.** The verdict made for a deployment stands; a new
  advisory never stops an app coming back.
- **Policy gates deploys, not serving apps.** Only `dependency_lock_on` reaches a
  running app.
- **A stale feed never blocks.** Deploys continue and the checks page warns.

## The automatic lock

With `dependency_lock_on` set, a **scheduled** sweep [locks](../../apps/locking/)
and stops an app whose **serving** deployment has an **unwaived** finding at or above
that level.

- A manual re-check records a reading and never locks.
- It never overwrites an administrator's lock; locks are attributed `admin` or
  `dependency`.
- The owner is emailed, where mail is configured. The audit row names the
  advisory, package and threshold.
- Unlocking does not stick: if the finding still matches, the next sweep locks it
  again. **Grant a waiver** to mean "leave it alone".
- You cannot set it while `dependency_watch_enabled` is off.

## Readings

Every deploy (`deploy`), scheduled pass (`scheduled`) and manual re-check (`manual`) writes
one reading per app — counts, coverage, corpus age and notable advisory IDs —
whether or not anything changed. Owners see the latest on the app's tab; the full
history is admin-only.

## Air-gapped installs

Point `dependency_feed_endpoint` at an internal mirror, or load OSV's per-ecosystem
`all.zip` with the platform binary:

```bash
toft advisory-import --ecosystem pypi --as-of 2026-10-01 all.zip
```

`--ecosystem` is `npm`, `pypi`, `go` or `cran`. `--as-of` is the snapshot's date, not today's, so its age reads correctly. It reads
`DATABASE_URL` like the server and replaces that ecosystem's corpus in one
transaction.
