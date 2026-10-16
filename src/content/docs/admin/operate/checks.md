---
title: System checks
description: What this install can and cannot do, checked rather than assumed.
---

Admin → Checks. Close to forty rows, each carrying **the reading that produced
it**, grouped into nine categories.

It is the fastest orientation there is on an unfamiliar install, and it is the
first thing to open when something is wrong.

## Four statuses

| | Means |
|---|---|
| **pass** | Asked, and the answer was good. |
| **warn** | Asked, and the answer deserves attention. |
| **fail** | Asked, and the answer is bad. |
| **skip** | **This install does not offer that capability.** Not a problem. |

**An unconfigured capability reads `skip` with a reason, never `fail`.** On a bare
install every optional subsystem is a skip, and that is a healthy report.

## What a check may be

Five rules hold this page, because it is the one place the absent-not-dormant
rule has to bend:

- **Only reads.** It configures nothing and fixes nothing.
- **Never a third party.** It does not dial out to test somebody else's service.
- **`skip` over `warn`.**
- **A check the platform could not ask is not a bad answer.** One that overruns
  five seconds is a `warn` reading "did not answer"; one the twenty-second budget
  never reached is "ran out of time"; one that panics is a **contained** `fail`
  and **the rest of the report still renders**.
- **No detail carries a credential.** A git connection with all three ciphertexts
  set renders a report containing none of them.

## Findings link to the fix

A **finding** carries either an admin route or a settings key — never both — and
the settings key resolves through the same index the settings page and the
command palette use. So the link cannot rot when an anchor is renamed.

**A fact links nowhere.** Every `pass` and every `skip` carries neither, which is
the quiet second signal of which rows are actually findings.

Many findings have no page that owns the fix — a full disk, an unreachable
backend, a missing interpreter are all fixed on the host — and those carry no
link at all.

## The nine categories

**Platform** · database, host, license, advisory corpus, public reachability,
clock, telemetry, database pool, schema migrations

**Storage** · the data directories, the artifact store, the build cache
directory, shared storage roots

**Execution** · execution backends, toolchains, runner images

**Apps** · app health

**Sign-in** · sign-in, directory groups, permitted login groups, directory feed

**Notifications** · notifications

**Sources** · clone credentials

**Security** · security.txt, at-rest encryption, development switches, trusted
proxy

**Automation** · stuck work, scheduled tasks

## The rows worth understanding before you need them

**Toolchains.** A family reported **absent is probed again** when you press Run
checks, so installing an interpreter and confirming it does not need a restart.
One reported present carries the **age of its reading**.

**Clone credentials.** `fail` past expiry, **naming the app count**; `warn` inside
14 days or after a failed mint; a disabled connection excluded. This is the row
that stops a token expiring quietly on a Monday.

**Clock.** Skew against the database, in both directions. `warn` past 2s, `fail`
past 30s. **Nothing dials a time server** — it is the database's clock, which is
the one that matters.

**Development switches.** `warn` for `DEV_PASSWORD` or `DEV_INSECURE_COOKIES`,
`skip` on a loopback install. Said out loud off loopback, which is the point.

**Trusted proxy.** Caught **from the request that asked**: a forwarded header
arriving from outside `TRUSTED_PROXY_CIDRS` is a warning. If your audit log is
full of your load balancer's address, this row is why.

**Lockout risk.** On the sign-in check, and **absent while local sign-in is on**.
One administrator plus local sign-in off is the state this exists to catch.

**Schema migrations.** `warn` with a count when the database moved underneath a
running process — a restore from an older backup. A *pending* migration at boot is
a startup refusal, not a row here.

**At-rest encryption.** Always `pass`, and it carries the backend, the encrypt key
id, the ring size and the KEK URI. It is a `pass` that exists to be **read**: it
is the answer to "which key must be in the backup".

**App health.** Counts locked, suspended and withheld apps **without raising the
verdict**. A locked app is a decision you made, not a fault.

**Advisory corpus.** `warn` past 7 days, and `warn` when the policy is on and no
feed has ever synced. It never blocks a deploy — this row is how you find out
anyway.

**Public reachability.** `warn`, never `fail`. `skip` when nothing is published or
no verdict has arrived.

**Stuck work** and **scheduled tasks.** Job runs past their deadline, cron runs
past the sweeper's cutoff, and a schedule more than ten minutes overdue, naming
app and task.

## The build cache

Above the checks, in a card of its own, because **it is an action rather than a
check**: the cache's size, and a Reclaim button. See [The build
cache](../../build/cache/).

## Copying the report

**Copy report** puts a header and one line per row on the clipboard, as plain
text. It is meant to be pasted into a ticket or a chat during an incident, which
is the moment when a screenshot is the wrong artifact.

## Using it

**On a new install**, before configuring anything — it tells you what this box
can do.

**After an upgrade** — a new check may light up about something that was always
true and was not being looked at.

**When something is wrong**, first. It is faster than the logs and it is where the
five failures that used to report themselves nowhere now report themselves.
