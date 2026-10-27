---
title: Checks reference
description: All 28 system checks in report order, with their category and what moves each one off pass.
---

Every check on **Admin → System checks**, in the order the report runs them.
There are **28**, in nine categories. A test walks this registry, so a check
cannot silently stop running. Some checks emit more than one row; each row keeps
its own id.

| Id | Name | Category | What it reads |
|---|---|---|---|
| `database` | Database | Platform | The connection and the schema. |
| `storage` | Storage | Storage | `apps_dir`, `logs_dir`, `cache_dir`, `artifact_store` and shared storage roots. A root `fail`s when it is no longer declared, is gone or has turned read-only, or a resource's directory under it is missing; it `warn`s when nothing is mounted there, which is what a file system that didn't come back after a reboot looks like. A `host_data_plane` row says whether people can reach host storage, and what is missing when they cannot. |
| `host` | Host | Platform | CPU, memory, disk. |
| `execution` | Execution backends | Execution | Two rows: `shared_backend` and `isolated_backend`. |
| `agent` | Shared-mode agent | Execution | Three rows. `shared_containment` states how this machine holds shared apps and jobs — process, cgroup or namespace — and why not the next level up; it never warns. `agent_cgroups` `warn`s for a running workload above the process level that fell back to the agent's memory watchdog. `agent_figures` `warn`s when finished runs still hold their logs or file descriptors at 80% of the agent's limit. `skip` where shared workloads are not run by the agent. |
| `toolchains` | Toolchains | Execution | Node, Python, Go and R. An absent family is re-probed; a present one shows the age of its reading. |
| `estate` | App health | Apps | App health. Locked, suspended and withheld apps are counted without raising the verdict. |
| `notifications` | Notifications | Notifications | Mail and channels. |
| `sign_in` | Sign-in | Sign-in | Providers, plus a `lockout_risk` row when one administrator remains and local sign-in is off. |
| `directory_groups` | Directory groups | Sign-in | `skip` with no mappings; `warn` when a provider has mappings and no membership has ever arrived. |
| `login_group_gate` | Permitted login groups | Sign-in | `skip` when no provider gates by group; otherwise `pass`, naming the gated providers. |
| `scim` | Directory feed | Sign-in | `skip` with no token; `warn` for a token never used. |
| `license` | License | Platform | Tier, term, last verdict. |
| `git_connections` | Clone credentials | Sources | `fail` past expiry, with the number of apps affected; `warn` within 14 days or after a failed mint. Disabled connections are excluded. |
| `security_txt` | security.txt | Security | `warn` when expired or within 30 days. Links to `security_txt_expires`. |
| `advisory_corpus` | Advisory corpus | Platform | `warn` past 7 days old, or when the policy is on and no feed has ever synced. Never blocks a deploy. |
| `reachability` | Public reachability | Platform | The stored verdict, certificate expiry (21 days), suspended apps. `warn`, never `fail`; `skip` when nothing is published. |
| `clock` | Clock | Platform | Skew against the database. `warn` past 2 s, `fail` past 30 s. Nothing contacts a time server. |
| `encryption` | At-rest encryption | Security | `pass` with the backend, current key id, number of keys held and KEK URI: the key that must be in your backup. |
| `stuck_work` | Stuck work | Automation | Job runs past their deadline and still claimed: a worker that died between claiming the work and finishing it. |
| `scheduled_jobs` | Scheduled jobs | Automation | `warn` when a job's schedule is more than 10 minutes past due and has not been dispatched, naming the app and job. That is the scheduler, not the app: a failed run is recorded on the app. `skip` when no app has an enabled schedule. |
| `telemetry` | Telemetry | Platform | Exporters, and whether they are working. |
| `db_pool` | Database pool | Platform | `warn` at 90% of connections in use, or when requests have waited more than a second in total over the last 15 minutes. A busy spell that has passed clears by itself. |
| `runner_images` | Runner images | Execution | `warn` for a language with no image, or an image on `latest` or no tag. |
| `dev_switches` | Development switches | Security | `warn` when `DEV_PASSWORD` or `DEV_INSECURE_COOKIES` is set. `skip` on a loopback-only install. |
| `trusted_proxy` | Trusted proxy | Security | `warn` when the request asking carried `X-Forwarded-For` from outside `TRUSTED_PROXY_CIDRS`. |
| `hsts` | HTTPS only (HSTS) | Security | `pass` when every address is https. `warn` when one origin is http, or when one host serves the platform and the apps under different schemes, where the header is withheld. `skip` on an http install. |
| `migrations` | Schema migrations | Platform | `warn` with a count when the schema moved under a running process. A pending migration at boot stops startup instead. |

## Statuses

| Status | Meaning |
|---|---|
| `pass` | Asked, and good. |
| `warn` | Asked, and worth attention. |
| `fail` | Asked, and bad. |
| `skip` | This install does not use that capability. |

## When a check cannot answer

| Situation | Row |
|---|---|
| The check takes longer than 5 seconds | `warn`: did not answer |
| The 20-second report budget runs out first | `warn`: ran out of time |
| The check panics | `fail`, contained; the rest of the report still renders |

A check that could not ask is not a bad answer. Checks only read, never contact
a third party, and never put a credential in a row. A row that is a finding links
to an admin page or a setting; a row that only states a fact links nowhere.

The build cache card above the checks is an action, not a check: see [the build
cache](../../build/cache/).
