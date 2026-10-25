---
title: Settings reference
description: All 96 install-wide settings by API name, grouped by the admin page that renders them.
---

Every install-wide setting, by the name the API uses, grouped by the page that
renders it. There are **96**. Settings for one app are on that app's own pages
and are not listed here.

| | |
|---|---|
| Stored in | The database. Changed at runtime, no restart. |
| Audited | Every change. |
| Find one fast | `⌘K` with the words in any order (`idle sleep`) jumps to the control. |
| Conflicting saves | A save from a page loaded before someone else's save is refused with `settings_changed`. Reload and save again. |

For what comes from the environment, see the [environment
reference](../environment/). The seven settings that also have an environment
variable underneath are the [operating dials](../../config/operating-dials/).

## Admin → Settings

| Setting | Label | What it does | Range |
|---|---|---|---|
| `public_base_url` | Address | Where links in email point. Leave blank to use the address the install started with. | — |
| `security_txt_contact` | Security contact | Where to report a security problem. Filling this in publishes /.well-known/security.txt. | — |
| `security_txt_expires` | Good until | When the published contact expires. Required when there is a contact. | — |
| `security_txt_policy` | Disclosure policy | An https:// page on how you want problems reported. Optional. | — |
| `security_txt_languages` | Preferred languages | Languages a report can be written in, separated by commas. Optional. | — |
| `app_security_headers` | Baseline headers on apps | Adds nosniff and a referrer policy to an app's pages where the app sends neither. On by default. An app's own header is kept, and HTTPS-only (HSTS) is sent over https whatever this says. | — |
| `isolated_execution_enabled` | Isolated execution | Lets an app run as its own workload, with its own network and resource limits. | — |
| `default_execution_mode` | New apps are born | The mode a new app starts in when its creator doesn’t choose. | — |
| `background_jobs_enabled` | Background jobs | Lets apps run scheduled and on-demand work as a process of its own. | — |
| `app_memory_limit_mb` | Memory limit per app | Memory one app may use before it is restarted, in MB or GB. 0 uses the install default. | 64–1,048,576 MB, or 0 |
| `app_cpu_request_millicores` | CPU reserved per app | CPU each isolated app reserves, in millicores. 0 uses the install default. | 1–64,000 m, or 0 |
| `app_cpu_limit_millicores` | CPU ceiling per app | The most CPU one isolated app may use, in millicores. 0 uses the install default. | 1–64,000 m, or 0 |
| `max_concurrent_builds` | Builds at once | How many deploys may build at the same time. 0 uses the install default. | 1–64 builds, or 0 |
| `auto_deploy_poll_seconds` | Auto-deploy check interval | How often tracked branches are checked for new commits. 0 uses the install default. | 10–86,400 seconds, or 0 |
| `r_package_repository` | R package repository | Where R builds install packages from. Leave blank to use the install default. | — |
| `log_level` | Platform log level | How much the platform logs about itself. | — |
| `notebook_render_timeout_seconds` | Let a notebook render for | How long a notebook may take to render during a deploy. Past this, the deploy fails. | 60–3,600 seconds |
| `build_timeout_seconds` | Let a build command run for | How long one build step may take. Past this, the deploy fails. | 60–3,600 seconds |
| `idle_sleep_minutes` | Sleep idle apps after | Minutes without a request before a shared app is stopped to free memory. 0 turns this off. | 5–10,080 minutes, or 0 |
| `job_concurrency_per_app` | Concurrent runs per app | How many of one app’s runs may be in flight at once. | 1–100 |
| `max_queued_runs_per_app` | Runs waiting per app | How many of one app’s runs may wait. A start past this is refused until one finishes. | 1–10,000 runs |
| `default_job_timeout_seconds` | Stop a job after | The timeout for a job whose toft.toml declares none. | 60–604,800 seconds |
| `max_job_timeout_seconds` | Longest a job may run | The ceiling on any job’s timeout. | 60–604,800 seconds |
| `max_job_memory_mb` | Most memory a job may have | The ceiling on any job’s memory. | 128–262,144 MB |
| `gallery_deploy_mode` | Gallery | What the gallery offers: nothing, extensions only, or extensions and examples. | — |
| `job_log_retention_days` | Keep job logs for | A background job’s log lines. | 1–365 days |
| `job_run_retention_days` | Keep job runs for | Job runs and their output files. | 1–3,650 days |
| `app_event_retention_days` | Keep failure events for | Failures nobody caused: failed builds, failed health checks, runs that couldn’t start. | 7–3,650 days |
| `platform_log_retention_days` | Keep the platform’s own log for | What Toft logged about each app: fetches, starts, repairs and refusals. | 7–3,650 days |
| `announcement_recipient_retention_days` | Keep announcement recipients for | Who each announcement was mailed to, and what happened to each send. | 30–3,650 days |
| `access_record_retention_days` | Keep the access record for | The audit trail and who opened each app. 0 keeps everything, and is the default. | 365–3,650 days, or 0 |
| `max_versions_per_app` | Most deployments an app may keep | The most successful deployments one app keeps, the serving one included. Failed builds don’t count. 0 means no limit. | 2–100 deployments, or 0 |
| `environment_tag` | Environment name | This install’s environment, such as stage or prod. Leave blank to turn this off. | — |

## Admin → Authentication

| Setting | Label | What it does | Range |
|---|---|---|---|
| `dormant_lock_enabled` | Lock unused accounts | Locks an account nobody has used for the period below. Administrators are never locked. | — |
| `dormant_lock_days` | Lock after | How long an account may go unused before it is locked. At least 30 days. | 30–730 days |
| `session_absolute_hours` | Sign in again after | How long a session lasts from sign-in, however much it is used. | 1–24 hours |
| `session_idle_minutes` | End an unused session after | How long an unused session lasts. 0 turns this off. | 5–480 minutes, or 0 |
| `public_apps_enabled` | Apps open to anyone | Whether an app may be opened by someone who isn’t signed in. | — |
| `apps_listable_to_authenticated` | Everyone signed in can see every app | Every app appears in everyone’s list by name and owner, without being openable. | — |
| `sign_in_providers` | Sign-in providers | Your identity provider, who it lets in, and which social logins are offered. | — |
| `local_admin_enabled` | Built-in administrator | A local username and password for setup, and for recovery when sign-in breaks. | — |

## Admin → API keys

| Setting | Label | What it does |
|---|---|---|
| `api_keys_enabled` | Personal API keys | Lets people hold long-lived keys so a script can act as them. |

## Admin → Dependencies

| Setting | Label | What it does |
|---|---|---|
| `dependency_policy` | Dependency policy | Checks the packages each app installs against published advisories. |
| `dependency_block_malware` | Refuse malicious packages | Refuses a deploy that installs a known malicious package, whatever its score. |
| `dependency_block_severity` | Refuse vulnerabilities at or above | A deploy is refused when a vulnerability is at or above this severity. |
| `dependency_block_only_fixable` | Only refuse when a fix has been published | Refuses only findings with a published fix. The rest are recorded. |
| `dependency_scan_on_deploy` | Resolve dependencies at deploy | Records the package names and versions each build installs. |
| `dependency_watch_enabled` | Re-check serving apps in the background | Re-checks serving apps against new advisories and reports what it finds. |
| `dependency_scan_interval_hours` | Re-check every | How often serving apps are re-checked against the advisory data already here. |
| `dependency_scan_history_kept` | Keep the last | How many readings each app keeps. A count, not days. |
| `dependency_lock_on` | Lock a serving app when it installs | Takes a serving app offline by itself when a match is found. Off by default. |
| `dependency_feed_endpoint` | Feed address | Where advisory data comes from. Use an internal mirror if outbound access is closed. |
| `dependency_feed_interval_hours` | Refresh every | How often the advisory data is refreshed. |
| `dependency_feed_max_age_hours` | Call it stale after | Past this the data is marked stale. Stale data never blocks a deploy. |
| `dependency_feed_credential` | Mirror credential | For a mirror that needs one. Write-only. |
| `dependency_waiver_max_days` | Waivers may run for | The longest a waiver may last. There are no permanent waivers. |

## Admin → Sources

| Setting | Label | What it does |
|---|---|---|
| `source_policy` | Source policy | Which repositories this install deploys from, and whether uploads may become apps. |
| `source_uploads_enabled` | Archive uploads | Whether a folder uploaded from a browser may become an app. |
| `git_connections` | Connected git hosts | Connect your git host once, so apps don’t each need their own token. |

## Admin → Messages

| Setting | Label | What it does |
|---|---|---|
| `announcement` | Announcement banner | A line across the top of every page. |
| `announcement_emails` | Announcements | Email a message to the people on this install. |
| `knowledge_base` | Knowledge base | One app linked from the header on every page. |
| `locked_account_message` | Locked account message | What someone sees when their account is locked. |
| `no_account_message` | No account message | What someone sees when they sign in but no account can be created. |
| `pending_activation_message` | Awaiting-activation message | What someone sees while their account waits to be activated. |
| `account_activated_message` | Account-activated message | The email someone gets when you activate their account. |
| `app_locked_message` | Locked app message | What a visitor sees when an app is locked. Each app can override it. |

## Admin → Email

| Setting | Label | What it does |
|---|---|---|
| `email_enabled` | Send email | When off, no notification is sent and nothing fails. |
| `email_transport` | Transport | SMTP, or an HTTPS sending API where outbound port 587 is blocked. |
| `email_api_provider` | Sending API provider | Which sending API, when the transport is one. |
| `email_host` | SMTP host | The mail server this install hands messages to. |
| `email_port` | SMTP port | 587 for STARTTLS, 465 for implicit TLS. |
| `email_security` | Transport security | STARTTLS, implicit TLS, or none. |
| `email_username` | SMTP username | The account this install authenticates as. Blank for a relay that needs no credential. |
| `email_password` | SMTP password | Write-only. Leaving it blank keeps the stored password. |
| `email_api_key` | Sending API key | The sending service’s API key. Kept apart from the SMTP password. |
| `email_skip_verify` | Accept a self-signed certificate | For an internal relay whose certificate can’t be verified. A workaround, not a fix. |
| `email_from_address` | From address | Who mail from this install appears to be from. |
| `email_from_name` | From name | The display name beside the address. |
| `email_reply_to` | Reply-to | Where replies go, if not the from address. |
| `email_notify_admin` | Administrator notifications | Mail to system administrators about this install. |
| `email_admin_group_address` | Administrator notification address | Send administrator notifications to one list instead of each administrator. |
| `email_notify_app` | App and access notifications | Mail to people about their own apps and access. |

## Admin → Telemetry

| Setting | Label | What it does |
|---|---|---|
| `telemetry_enabled` | Export telemetry | When off, nothing is exported and nothing fails. |
| `telemetry_endpoint` | Collector endpoint | The collector’s base URL. |
| `telemetry_headers` | Credential | Write-only headers for a collector that needs authentication. |
| `telemetry_traces` | Traces | Whether spans are exported. |
| `telemetry_metrics` | Metrics | Whether metric batches are exported. |
| `telemetry_sample_ratio` | Trace sampling | Share of traces to keep, from 0 to 1. |
| `telemetry_temporality` | Metric temporality | Cumulative or delta, whichever your collector expects. |

## Admin → Integrations

| Setting | Label | What it does |
|---|---|---|
| `integration_connections` | Connections | One credential for one place. Each connection is attached to apps separately. |
| `integration_catalog` | What you can connect | Everything this version can send to. |
| `integrations_retain_bodies` | Keep message bodies | When off, the log keeps a checksum of each message, not its text. |
| `integrations_retention_days` | Keep the integration log for | At least 30 days. |

## Admin → Features

| Setting | Label | What it does |
|---|---|---|
| `feature_switches` | Optional features | What this build offers, what the license covers, and what is switched on. |

## Admin → License

| Setting | Label | What it does |
|---|---|---|
| `license_key` | License key | The key this install was issued. Its term and entitlements come from the license service. |

Ranges are the bounds the Settings page accepts. "or 0" means 0 is also
accepted; what 0 means is in the row.

## Rules worth knowing

| Rule | Applies to |
|---|---|
| **0 or blank means "use the environment's value"**, never "off". The memory and CPU values can be sent in either unit (`app_memory_limit_gb`, `app_cpu_request_cores`, `app_cpu_limit_cores`), but not both in one save. | The operating dials: `app_memory_limit_mb`, `app_cpu_request_millicores`, `app_cpu_limit_millicores`, `max_concurrent_builds`, `auto_deploy_poll_seconds`, `r_package_repository`, `log_level` |
| **Default on, and an absent row reads as on.** Turning one off takes a capability away. | `public_apps_enabled`, `apps_listable_to_authenticated`, `background_jobs_enabled` |
| **Write-only.** Never returned to a browser; leaving the field blank keeps the stored value. | `email_password`, `email_api_key`, `telemetry_headers`, `dependency_feed_credential` |
| **Required together.** An expiry is required whenever there is a contact; a date in the past is refused. | `security_txt_contact`, `security_txt_expires` |
| **Floored at 30 days.** | `integrations_retention_days` |
| **A ceiling refuses new declarations and caps old ones.** A job whose `toft.toml` asks for more is refused at `toft check` and deploy with `limit_exceeds_ceiling`; a job already deployed above a ceiling you lower is capped and marked `clamped`. | `max_job_timeout_seconds`, `max_job_memory_mb` |
| **Blank turns `.env.<tag>` defaults off.** 1–32 lowercase letters, digits, dashes or underscores. | `environment_tag` |

:::note[Not settings]
`log_format` is reported read-only beside `effective_log_level`. `job_placement` (`cluster` or `this machine`) and `job_memory_enforcement` (`cgroup` or `watchdog`) are reported read-only under **Jobs**, as **Where runs go** and **Memory limits**. The settings API
refuses `docs_url`, `gallery_catalog_url`, `gallery_catalog_source` and
`gallery_sync`: set `DOCS_URL` and `GALLERY_CATALOG_URL` in the
[environment](../environment/) instead.
:::
