---
title: Dependency policy
description: What the scanner reads, what it can decide, and what it must never do.
---

Toft reads the names and versions your apps declare and checks them against
a vulnerability feed. Admin → Dependencies.

## Do not oversell it

**It reads names and versions, not your app's code.** It is a manifest check. It
will not find a bug somebody wrote, a secret they committed, or a vulnerability
in code that has no package name.

**This install's package list never leaves.** What your apps depend on is not
published as a side effect of scanning them.

## Three rungs, and they are not the same

| | Means |
|---|---|
| **Recorded** | An inventory was taken for this release. |
| **Matched** | The inventory was compared to the corpus. |
| **Covered** | The ecosystem is one the corpus actually covers. |

**Recorded is not scanned, and matched is not covered.** R sits on the middle
rung: matched against CRAN and still reported as *not scanned*, with any findings
shown and enforced. Its absence of findings is not a verdict.

The inventory is written **before** any of the questions is asked, so an app's
packages are known even where the answers are not.

## A lockfile Toft does not read is named

Every Node path here — the scan, the shared-mode install and the runner's — reads
`package-lock.json`. An app that locks with **`pnpm-lock.yaml`** or **`yarn.lock`**
is therefore scanned and built from versions resolved fresh out of `package.json`,
which can differ from the ones its own lockfile pins, and on a later build.

The deploy is **not refused**. Its build log names the file that was passed over
and says the installed versions can differ from the pinned ones. The inventory is
not wrong — it is read from the same file the install reads — but a developer
looking at a lockfile in their repository should not be told there is none.
Whether to read those lockfiles properly is still open.

## Malware is not a severity

It is not "critical plus a bit". A package identified as malicious is a different
kind of finding from one with a CVE, and it gets its own switch. A severity
threshold that let malware through because it scored medium would be the wrong
shape entirely.

## The settings

| | |
|---|---|
| `dependency_policy` | Whether any of this happens. |
| `dependency_scan_on_deploy` | Resolve packages as a build installs them. |
| `dependency_block_severity` | The threshold a vulnerability must meet to refuse a deploy. |
| `dependency_block_only_fixable` | Refuse only findings somebody can act on; record the rest. |
| `dependency_block_malware` | Its own switch. |
| `dependency_watch_enabled` | Re-check serving apps in the background. |
| `dependency_waiver_max_days` | The ceiling on a temporary waiver. |
| `dependency_scan_interval_hours` | How often the background sweep runs — its own dial, not the feed's. |
| `dependency_scan_history_kept` | How many readings to keep **per app**. A count, not a number of days. |
| `dependency_lock_on` | The one automatic consequence. `off` by default — see below. |

**Preview a policy change before you save it.** The preview tells you which apps
would be refused, which is the number that decides whether you turn it on today
or after a conversation.

## The rules that keep it from taking you down

**A restart is not a deploy.** The verdict that applies is the one made about that
**release**, not today's feed. An app serving for a month does not fail to come
back because an advisory landed overnight.

**A serving app is never stopped by the policy itself.** Policy gates deploys.
The one thing that does reach in is `dependency_lock_on`, which is off until you
set it, and is described below.

**A stale feed never blocks.** If the data cannot be refreshed, deploys continue.
A scanner that cannot reach its feed must not become an outage — the checks page
warns instead.

## There is no permanent waiver

Waivers expire. A permanent one is a decision nobody revisits, which after a year
is indistinguishable from having no policy.

A waiver is also the **only** way to mean "leave this app alone" — see the lock,
below.

## Every pass leaves a reading

The background sweep writes **one row per app per pass, whether or not anything
changed**, and a deploy leaves one too. A finding is derived against a corpus
that gets swapped wholesale, so "nothing changed" is not a thing this can know
without writing the reading down.

Each reading carries the counts, the coverage, the corpus age and the notable
advisory ids — never a copy of the findings themselves. Three triggers, and they
mean different things:

| | |
|---|---|
| `deploy` | Written by the builder, beside the verdict |
| `scheduled` | The sweep, on `dependency_scan_interval_hours` |
| `manual` | A re-check somebody asked for. **Records, and never locks** |

**The history is yours; the owner gets the latest reading.** An app's own tab
shows its most recent scan; the list of every reading is an admin-only read.

Retention is `dependency_scan_history_kept` — a count per app, pruned oldest-first
on the next write.

## The one automatic lock

`dependency_lock_on` is `off`, `malware`, `critical` or `high`, and it ships
`off`. Set it, and on a **scheduled** pass an app whose *serving* release carries
an **unwaived** finding at or above that level is [locked](../../apps/locking/)
and stopped. The proxy then refuses it.

This is the only place in the product where a policy takes a running app off the
air, so it is worth being precise about:

- **Scheduled passes only.** A manual re-check records and never locks.
- **The serving release**, not the newest build.
- **Unwaived findings only.** A waived finding never locks.
- **It never overwrites an administrator's lock.** The lock is attributed —
  `admin` or `dependency` — because an app locked by a person and an app locked
  by the sweep need different answers.
- **The owner is emailed** when it happens, where mail is configured.
- **Unlocking is not a decision that sticks.** An app you unlock whose finding
  still matches is locked again on the next pass. **A waiver is how to mean it.**

The audit row is written by the system and names the advisory, the package and
the threshold that caught it.

You cannot set `dependency_lock_on` while `dependency_watch_enabled` is off —
nothing would ever run the pass. Turning the watch off afterwards is allowed, and
warned about instead.

## The feed

`dependency_feed_endpoint`, an interval, a staleness threshold, and a credential
for a mirror that needs one. Point it at an internal mirror if egress is closed.

**For an air-gapped install:**

```bash
toft advisory-import /path/to/corpus
```

A subcommand that talks to Postgres and exits.

## The governance view

Admin → Dependencies is the estate's: what this install runs, searchable, with
findings. The advisories are a **table**, one row per advisory — its ID linking to
the advisory with the summary under it, then severity, the apps it touches, the
fixed-in version and how many serving apps carry it. It is **admin-only, never answers less than it knows, and carries its
own coverage** — so a report drawn from it says what it did not cover rather than
implying it covered everything.

An app's own tab and this one use **one vocabulary**. The same words mean the same
thing in both places, which is what makes a developer's question and your answer
about the same fact.
