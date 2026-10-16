---
title: Checks reference
description: Every system check, its category, and what each status means.
---

The registry, in the order the report produces it. **The list is the
specification**: a test walks it, so a check cannot silently stop running.

Twenty-six checks, in nine categories. Several of these emit more than one row; the rows keep their own ids.

| Check | Category | What it reads |
|---|---|---|
| `database` | Platform | The connection and the schema. |
| `storage` | Storage | The data directories — `apps_dir`, `logs_dir`, `artifact_store`, `cache_dir` — and shared storage roots. `fail` when a mount is gone or read-only. |
| `host` | Platform | CPU, memory, disk. |
| `execution` | Execution | Both backends, reported separately: `shared_backend` and `isolated_backend`. |
| `toolchains` | Execution | Node, Python, Go and R, discovered. **An absent family is re-probed on this path**; a present one carries the age of its reading. |
| `estate` | Apps | App health. Counts locked, suspended and withheld **without raising the verdict**. |
| `notifications` | Notifications | Mail and channels. |
| `sign_in` | Sign-in | Providers, and `lockout_risk` — one administrator with local sign-in off. Absent while local sign-in is on. |
| `directory_groups` | Sign-in | `skip` with no mappings; `warn` when a provider has mappings and no membership has ever arrived. |
| `login_group_gate` | Sign-in | `skip` when no provider restricts sign-in by group; **`pass`** naming the gated providers, with what a vanished claim would cost. |
| `scim` | Sign-in | `skip` with no token; `warn` on a token never used. |
| `license` | Platform | Tier, term, last verdict. |
| `git_connections` | Sources | `fail` past expiry **naming the app count**; `warn` inside 14 days or after a failed mint. Disabled connections excluded. |
| `security_txt` | Security | `warn` when expired or inside 30 days. Links to the setting. |
| `advisory_corpus` | Platform | `warn` past 7 days, and when the policy is on and no feed ever synced. Never blocks a deploy. |
| `reachability` | Platform | The stored verdict, the certificate expiry, suspended apps. **`warn`, never `fail`**; `skip` when nothing is published. |
| `clock` | Platform | Skew against the database, both directions. `warn` past 2s, `fail` past 30s. **Nothing dials a time server.** |
| `encryption` | Security | **Always `pass`.** Carries backend, encrypt key id, ring size and KEK URI — the answer to "which key must be in the backup". |
| `stuck_work` | Automation | Job runs past their deadline, cron runs past the sweeper's cutoff. |
| `scheduled_tasks` | Automation | `warn` past 10 minutes overdue, **naming app and task**. |
| `telemetry` | Platform | Exporters, and whether they are working. |
| `db_pool` | Platform | `warn` at 90% in use, or on accumulated wait. |
| `runner_images` | Execution | `warn` for a family with no image, or one on `latest` or no tag. |
| `dev_switches` | Security | `warn` for `DEV_PASSWORD` or `DEV_INSECURE_COOKIES`. `skip` on a loopback install. |
| `trusted_proxy` | Security | `warn` when `X-Forwarded-For` arrives from outside `TRUSTED_PROXY_CIDRS`. Caught from the request that asked. |
| `migrations` | Platform | `warn` with a count when the database moved underneath a running process. A pending migration at boot is a **startup refusal**, not a row. |

## The four statuses

**pass** asked and good · **warn** asked and worth attention · **fail** asked and
bad · **skip** this install does not offer that capability.

## The three ways a check can not answer

| | Reads |
|---|---|
| Overran 5 seconds | `warn` — "did not answer" |
| The 20-second budget never reached it | `warn` — "ran out of time" |
| It panicked | a **contained** `fail`, and the rest of the report still renders |

## Rules the whole page keeps

- Only reads. Never a third party. `skip` over `warn`.
- **A check the platform could not ask is not a bad answer.**
- **No detail carries a credential.**
- A **finding** carries an admin route or a settings key, never both. A **fact**
  links nowhere — which is the quiet signal of which rows are findings.
- Every check has a unique lower-snake id, and a category from the closed list of
  nine.

## Above the checks

The [build cache](../../build/cache/): its size, and Reclaim. **An action, not a
check**, which is why it has a card of its own.
