---
title: Trusted app sources
description: Restrict which git hosts and paths apps may be deployed from.
---

The source policy controls **where an app's code may come from** — nothing else.
An app from an approved source is not safer at runtime: its build still runs
arbitrary code and can still reach public npm and PyPI.

## Setting it

**Admin → Sources** holds an **allowlist or blocklist** of git hosts and paths.
Before saving:

- **Preview** the policy against the estate,
- see **what the estate actually uses**,
- see **what the policy resolves to**.

A sensible default for most installs is an allowlist of your own git host's
organizations. Go finer only for a reason you could write down.

Hosts match exactly (`github.com.evil.internal` does not match `github.com`) and
redirects are never followed.

## Where it is enforced

Seven points, all failing closed: `POST /apps`, re-pointing in
`PATCH /apps/{id}`, `POST /apps/{id}/deploy`, the builder just before cloning, the
auto-deploy poller, and the gallery's deploy and update routes. The picker is
convenience, not enforcement — a typed URL meets the same check.

A refusal is a 403 that names what would be allowed. There is no exception-request
workflow.

## Changing it

Tightening never stops running apps. A non-compliant app keeps serving and can be
rolled back, but not redeployed; auto-deploy skips it. The owner sees a banner on
the app's page. Every policy change is audited as a diff.

## Switches that are not this one

| | |
|---|---|
| `source_uploads_enabled` | Archive uploads (including [RStudio publishing](../../capabilities/rstudio-publishing/)) are a separate switch. With git restricted and uploads on, a refused developer can upload the same code — the settings page says so. |
| Gallery | One-click gallery deploys are off entirely while the policy is restricted. **Extensions only** mode limits what the gallery lists, not the source policy. |

## Connected git hosts

A [connected git host](../git-connections/) is a credential Toft holds. Coverage
is checked when an app is attached, never at clone time, so you learn about a gap
while configuring, not during a deploy. No key may attach one.
