---
title: Settings reference
description: Every runtime setting, what it does, and where it is rendered.
---

Every setting an administrator can change, by the name the API uses for it,
grouped by the page that renders it.

Ninety-six of them. **A setting missing from this index is a test failure** —
the same index feeds the settings page, its filter, and the command palette, so a
setting cannot be findable by one and invisible to another.

Everything here is a **database row**, changed at runtime, **audited**, and needs
no restart. For the environment side, see the [environment
reference](../environment/). For the seven that are both, see [operating
dials](../../config/operating-dials/).

:::note
`⌘K` finds any of these by name — the words in any order, so `idle sleep` finds
**Sleep idle apps after** — and takes you to the control. That is usually faster
than this page.
:::

**Two administrators saving at once do not overwrite each other.** A save from
a page that loaded before somebody else's save landed is refused as *settings
changed* rather than applied over theirs. Reload, and save again.

## Admin → Settings

| Setting | Name | What it does |
|---|---|---|
| `public_base_url` | Address | Where links in email point. Leave blank to use the address the install started with. |
| `security_txt_contact` | Security contact | Where to report a security problem. Filling this in publishes /.well-known/security.txt. |
| `security_txt_expires` | Good until | When the published contact expires. Required when there is a contact. |
| `security_txt_policy` | Disclosure policy | An https:// page on how you want problems reported. Optional. |
| `security_txt_languages` | Preferred languages | Languages a report can be written in, separated by commas. Optional. |
| `isolated_execution_enabled` | Isolated execution | Lets an app run as its own workload, with its own network and resource limits. |
| `default_execution_mode` | New apps are born | The mode a new app starts in when its creator doesn’t choose. |
| `background_jobs_enabled` | Background jobs | Lets apps run scheduled and on-demand work as a process of its own. |
| `app_memory_limit_mb` | Memory limit per app | Memory one app may use before it is restarted, in MB or GB. 0 uses the install default. |
| `app_cpu_request_millicores` | CPU reserved per app | CPU each isolated app reserves, in millicores. 0 uses the install default. |
| `app_cpu_limit_millicores` | CPU ceiling per app | The most CPU one isolated app may use, in millicores. 0 uses the install default. |
| `max_concurrent_builds` | Builds at once | How many deploys may build at the same time. 0 uses the install default. |
| `auto_deploy_poll_seconds` | Auto-deploy check interval | How often tracked branches are checked for new commits. 0 uses the install default. |
| `r_package_repository` | R package repository | Where R builds install packages from. Leave blank to use the install default. |
| `log_level` | Platform log level | How much the platform logs about itself. |
| `job_concurrency_per_app` | Concurrent runs per app | How many of one app’s runs may be in flight at once. |
| `max_run_retries` | Most automatic retries | The most extra attempts an automation may ask for. 0 turns retries off everywhere. |
| `notebook_render_timeout_seconds` | Let a notebook render for | How long a notebook may take to render during a deploy. Past this, the deploy fails. |
| `build_timeout_seconds` | Let a build command run for | How long one build step may take. Past this, the deploy fails. |
| `idle_sleep_minutes` | Sleep idle apps after | Minutes without a request before a shared app is stopped to free memory. 0 turns this off. |
| `max_scheduled_tasks_per_app` | Most scheduled tasks an app may have | Counted per schedule. |
| `scheduled_task_timeout_seconds` | Give up waiting for the app after | Past this, the run is recorded as failed. |
| `scheduled_run_result_bytes` | Keep of each response | How much of the app’s answer is stored as the run’s result. 0 stores none. |
| `gallery_deploy_mode` | Gallery | What the gallery offers: nothing, extensions only, or extensions and examples. |
| `job_log_retention_days` | Keep job logs for | A background job’s log lines. |
| `job_run_retention_days` | Keep job runs for | Job runs and their output files. |
| `scheduled_run_retention_days` | Keep run history for | Scheduled task runs, by age. |
| `scheduled_log_retention_days` | Keep task logs for | Lines an app logs while a task runs. |
| `app_event_retention_days` | Keep failure events for | Failures nobody caused: failed builds, failed health checks, runs that couldn’t start. |
| `platform_log_retention_days` | Keep the platform’s own log for | What Toft logged about each app: fetches, starts, repairs and refusals. |
| `announcement_recipient_retention_days` | Keep announcement recipients for | Who each announcement was mailed to, and what happened to each send. |
| `max_versions_per_app` | Most versions an app may keep | The most releases one app keeps. 0 means no limit. |
| `environment_tag` | Environment name | This install’s environment, such as stage or prod. Leave blank to turn this off. |

## Admin → Authentication

| Setting | Name | What it does |
|---|---|---|
| `dormant_lock_enabled` | Lock unused accounts | Locks an account nobody has used for the period below. Administrators are never locked. |
| `dormant_lock_days` | Lock after | How long an account may go unused before it is locked. At least 30 days. |
| `session_absolute_hours` | Sign in again after | How long a session lasts from sign-in, however much it is used. |
| `session_idle_minutes` | End an unused session after | How long an unused session lasts. 0 turns this off. |
| `public_apps_enabled` | Apps open to anyone | Whether an app may be opened by someone who isn’t signed in. |
| `apps_listable_to_authenticated` | Everyone signed in can see every app | Every app appears in everyone’s list by name and owner, without being openable. |
| `sign_in_providers` | Sign-in providers | Your identity provider, who it lets in, and which social logins are offered. |
| `local_admin_enabled` | Built-in administrator | A local username and password for setup, and for recovery when sign-in breaks. |

## Admin → API keys

| Setting | Name | What it does |
|---|---|---|
| `api_keys_enabled` | Personal API keys | Lets people hold long-lived keys so a script can act as them. |

## Admin → Dependencies

| Setting | Name | What it does |
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

| Setting | Name | What it does |
|---|---|---|
| `source_policy` | Source policy | Which repositories this install deploys from, and whether uploads may become apps. |
| `source_uploads_enabled` | Archive uploads | Whether a folder uploaded from a browser may become an app. |
| `git_connections` | Connected git hosts | Connect your git host once, so apps don’t each need their own token. |

## Admin → Messages

| Setting | Name | What it does |
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

| Setting | Name | What it does |
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

| Setting | Name | What it does |
|---|---|---|
| `telemetry_enabled` | Export telemetry | When off, nothing is exported and nothing fails. |
| `telemetry_endpoint` | Collector endpoint | The collector’s base URL. |
| `telemetry_headers` | Credential | Write-only headers for a collector that needs authentication. |
| `telemetry_traces` | Traces | Whether spans are exported. |
| `telemetry_metrics` | Metrics | Whether metric batches are exported. |
| `telemetry_sample_ratio` | Trace sampling | Share of traces to keep, from 0 to 1. |
| `telemetry_temporality` | Metric temporality | Cumulative or delta, whichever your collector expects. |

## Admin → Integrations

| Setting | Name | What it does |
|---|---|---|
| `integration_connections` | Connections | One credential for one place. Each connection is attached to apps separately. |
| `integration_catalog` | What you can connect | Everything this version can send to. |
| `integrations_retain_bodies` | Keep message bodies | When off, the log keeps a checksum of each message, not its text. |
| `integrations_retention_days` | Keep the integration log for | At least 30 days. |

## Admin → Features

| Setting | Name | What it does |
|---|---|---|
| `feature_switches` | Optional features | What this build offers, what the license covers, and what is switched on. |

## Admin → License

| Setting | Name | What it does |
|---|---|---|
| `license_key` | License key | The key this install was issued. Its term and entitlements come from the license service. |

## Notes on a few of them

**The dials** — `app_memory_limit_mb`/`_gb`, `app_cpu_request_*`,
`app_cpu_limit_*`, `max_concurrent_builds`, `auto_deploy_poll_seconds`,
`r_package_repository`, `log_level` — have an environment variable underneath
them. **Zero or empty means the environment's number, never "off"**, and only one
of a quantity's two unit spellings may be set.

**`public_apps_enabled`** and **`apps_listable_to_authenticated`** both default
**on** and both *take a capability away* when you turn them off. Their default is
read from an **absent row**, which is why the query asks whether the value is
`false` rather than whether it is `true`.

**Write-only fields** — `email_password`, `email_api_key`, `telemetry_headers`,
`dependency_feed_credential` — are credentials, not setting values. They never
come back to a browser, and leaving one blank keeps what is stored.

**`log_format` is not here.** It is reported read-only on the settings document,
beside `effective_log_level`: it is a fact about who is reading the stream, and
changing it mid-flight hands a collector a format change it did not ask for.

**`security_txt_expires` is required whenever `security_txt_contact` is set**, and
is never invented or rewritten.

**`integrations_retention_days` is floored at 30.**

**`environment_tag`** left blank turns `.env.<tag>` environment defaults off
entirely.
