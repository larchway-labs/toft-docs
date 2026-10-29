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
| `dependency_policy` | `off`, `warn` or `block`. `warn` refuses only a malicious package; `block` also refuses vulnerabilities at the threshold. Run `warn` for a couple of weeks before `block`. |
| `dependency_scan_on_deploy` | Resolve packages as a build installs them. |
| `dependency_block_severity` | Minimum severity that refuses a deploy, or `off`. |
| `dependency_block_only_fixable` | Refuse only findings with a fix; record the rest. |
| `dependency_block_malware` | Refuse known-malicious packages — a separate switch, not a severity. |
| `dependency_watch_enabled` | Re-check serving apps in the background. |
| `dependency_scan_interval_hours` | How often that sweep runs. |
| `dependency_scan_history_kept` | Readings kept **per app** (a count, not days). |
| `dependency_waiver_max_days` | Longest a waiver may last. There are no permanent waivers. |
| `dependency_lock_on` | `off`, `malware` (default), `critical` or `high`. See below. |
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

An R app is checked twice: `renv.lock` before the build, then every package the
build actually installed, before the release goes live. Each R package is marked
**installed** (the app's), **platform** (Toft installs it into every R app: renv,
the Toft SDK and its dependencies) or **runtime**. A refusal over a platform
package says so; the way forward is a waiver or a Toft release, not a change to
the app.

**Runtime** packages are the ones an app installs itself while it runs
(`install.packages()`). On a shared install the sweep, and **Check again**, read
each running R app's library and add them, so a malicious one locks the app like
any other. Isolated apps are not read.

Node is read from `package-lock.json` only. An app locked with `pnpm-lock.yaml` or
`yarn.lock` still deploys, but its versions resolve fresh from `package.json`, and
the build log says so.

Python is listed without building any package, because building runs its code,
and for the Python version the app's release builds with. When a dependency
publishes no wheel for that version, the listing
would quietly settle on an older release than the build installs. Toft notices,
and judges nothing it cannot list truly: under `block` the deploy is refused,
naming the package without a wheel, and the way forward is to pin the version
the scan could list or wait for that package to publish a wheel; under `warn` it
deploys **not scanned**.

**Findings follow the release that is serving.** After a rollback, the
dependencies, the audit file and its SBOM name the release rolled back to.

## What it never does

- **A restart is not a deploy.** The verdict made for a deployment stands; a new
  advisory never stops an app coming back.
- **Policy gates deploys, not serving apps.** Only `dependency_lock_on` reaches a
  running app.
- **A stale feed never blocks.** Deploys continue and the checks page warns.

## What owners see

An app with a finding this install counts — malware, or anything at or above
the threshold — shows one glyph beside its name on the app list: **red** for
malware or a critical advisory, **amber** for anything else. Its label says the
most urgent thing: a malicious package serving, then a refused next deploy, then
the worst severity. The app's own page says what the policy will do about it.

## The automatic lock

With the policy on, a **scheduled** sweep [locks](../../apps/locking/) and stops an
app whose **serving** deployment has an **unwaived** finding at or above
`dependency_lock_on` — by default, a package reported as malicious. Set it to `off`
to never stop a running app.

- A manual re-check records a reading and never locks.
- It never overwrites an administrator's lock; locks are attributed `admin` or
  `dependency`.
- The owner is emailed, where mail is configured. The audit row names the
  advisory, package and threshold.
- Unlocking does not stick: if the finding still matches, the next sweep locks it
  again. **Grant a waiver** to mean "leave it alone".
- **The owner can deploy their way out.** A locked app still accepts a deploy
  (and an upload). If the new release no longer has the package, the lock lifts
  as it goes live, recorded in the audit log as `app.unlock_dependency`. If it
  still has it, the deploy fails and the lock stays. Rollback stays refused.
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
