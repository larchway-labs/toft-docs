---
title: Scan targets and security.txt
description: Give a security team the list of app addresses to scan, and publish where to report findings.
---

Toft publishes **what to scan** and **how to contact you**. It does not scan.

## Scan targets

**Admin → Scan targets** (`GET /api/v1/admin/estate/targets`) lists every app with
the URL a scanner should hit — the apps origin on a split-origin install.

- **No app is omitted.** Apps with no URL (never deployed, batch apps) are still
  listed; `apps_addressable` counts the ones that have one. Locked apps are marked.
- **Visibility is the effective one.** A public app reads `authenticated`, with
  `visibility_withheld`, when [anonymous access](../anonymous/) is off or
  [reachability](../reachability/) has suspended it.

| Caller | Access |
|---|---|
| Administrator | Yes |
| Deploy key (`toftd_`) | Yes — the only `/admin` route a key reaches |
| App key (`toft_`) | No — it is a grant on one app |
| Other signed-in users | 404 |

## Marking scan traffic

Send `X-Toft-Scan: 1` with an app key (`toft_`) and the request is not counted as
usage, so a sweep does not keep [quiet](../../apps/quiet/) apps looking busy. It
grants nothing else, is ignored from any other credential, and is stripped before
the request reaches the app.

## security.txt

Set on **Admin → Settings**. Filling in the contact publishes
`/.well-known/security.txt` on both origins; clearing it removes the file (404).

| Setting | |
|---|---|
| `security_txt_contact` | Where to send reports. Use a role address, not a person's. |
| `security_txt_expires` | **Required** with a contact. A past date is refused at save. |
| `security_txt_policy` | Optional `https://` page describing how to report. |
| `security_txt_languages` | Optional language tags the mailbox reads. |

Toft never extends the expiry for you. **Admin → System checks** warns 30 days
before it lapses and again once it has.
