---
title: What this install tells an assessor
description: The NIST SP 800-171r3 control document and audit report — what each covers and who can read them.
---

**Admin → Compliance** produces two documents against **NIST SP 800-171
Revision 3**, from one registry compiled into the binary.

:::caution
This is audit **support**: it makes an assessment cheaper to run. It is not an
attestation and not evidence that one was passed.
:::

## Two documents

| | **Control document** | **Audit report** |
|---|---|---|
| Describes | the **build** — what Toft does per requirement | the **install** — what this machine is set to now |
| Reads | nothing | settings, providers, credentials, sources, apps |
| Stale when | you upgrade | you change anything |
| Download | PDF, `toft-800-171r3-controls-<version>.pdf` | JSON export, `compliance-<install>-<date>.json` |

Both render the same registry, so they cannot disagree about what the controls
are. The PDF is generated in the binary, so it works without outbound HTTPS, and
every page footer names the build.

## Responsibility

Each of the 97 requirements is one of:

| | |
|---|---|
| **platform** | Toft does this |
| **shared** | Toft does part; you do the rest |
| **inherited** | Your infrastructure does it |
| **customer** | Entirely yours |

At least twenty stay *customer* or *inherited* — a test holds that floor. There is
**no score**: nineteen requirements have nothing to do with Toft, so an average
would mean nothing.

## Parameters bound to settings

Where SP 800-171 asks you to define a value, the report reads your live setting:

| Parameter | Setting |
|---|---|
| Account inactivity period | `dormant_lock_days` |
| Session termination period | `session_idle_minutes` |
| Malware response | `dependency_block_malware` |

Parameters the install does not hold are shown as **unbound** and counted.

## Evidence outcomes

All 39 evidence items always produce a row:

| | |
|---|---|
| `ok` | Read; here is the value |
| `absent` | The install does not offer that capability — not a finding |
| `refused` | An access boundary stopped the read |
| `error` | It should have worked and did not |

A bare install produces no `error` rows.

## The export

The report is computed per request and never stored. The JSON export names the
install, the date and the collector, and carries a **digest recomputable from the
file alone** (it covers its own timestamp). File it wherever you keep evidence.

## One app's audit file

Each app also has an **Audit** tab, read by its editors. It shows the app's own evidence: grants, with who gave each one and when; deploys and who started them; packages and an SBOM per release; reach; credential age; logs; viewers; and deletion. Each section is checked exactly as the page it mirrors would be. An editor who is not an administrator sees the app's change history as **Refused**, with the reason, and never sees more than they could elsewhere. A personal API key can read it; deploy keys cannot. Its export uses the same digest rule as this report's.

It lists access. Reviewing that access is the organization's job, not Toft's.

## Who can read it

**Administrators in a browser only.** All five routes return 404 to
non-administrators and refuse every API key class, deploy keys included.
[Scan targets](../scan-targets/) is the deliberate contrast: a deploy key can read
addresses, not posture.

Not license-gated — a lapsed install can still read its own posture.

Out of scope: other frameworks, POA&M, remediation tracking, per-app compliance,
scheduled generation, attestation.
