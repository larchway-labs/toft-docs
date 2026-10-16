---
title: Publishing from RStudio
description: The Posit Connect publishing API — what rsconnect can do here, what it depends on, and how to turn it off.
---

Toft answers the part of Posit Connect's API that the `rsconnect` R package uses
to publish. People keep using RStudio's **Publish** button and
`rsconnect::deployApp()`, adding Toft as a server; they don't need `toft`. The
developer's side is in the user guide under **Deploying → From RStudio**.

## How Connect maps onto Toft

| Connect | Toft |
|---|---|
| Content | An app; its `name` is the address `/apps/<name>/` |
| Bundle | An uploaded archive, unpacked like any upload |
| Deploy | An ordinary upload deploy — same build, steps and history |
| Task | The deployment, with its build log streamed back to RStudio |
| Environment variables | The app's variables, stored as sensitive |

Content settings, access lists, vanity URLs and schedules sent from `rsconnect`
are refused — manage those on the app in Toft.

The API is at `/__api__` on the platform's address. A reverse proxy that forwards
selected paths must forward `/__api__` and `/cli`.

## What it depends on

There is no separate switch. It follows settings you already govern:

| Requirement | Effect when missing |
|---|---|
| `api_keys_enabled` ([Machine credentials](../../security/keys/)) | RStudio cannot sign in; every request is refused |
| `source_uploads_enabled` ([Trusted sources](../../security/sources/)) | Creating an app from RStudio is refused, as is publishing into a git-deployed app |
| Publisher role / edit right | Needed to create / publish into an app, as in the web UI |

License caps, locks, dependency policy, retention and the default execution mode
apply unchanged. **Deploy keys cannot use it** — an app created from RStudio
needs a person to own it.

## How RStudio signs in

Both ways end in an ordinary personal key, listed in **Admin → API keys** with
owner, scope and last use. Revoking it signs RStudio out on its next request; it
expires on the 90-day personal-key default.

| Way | How |
|---|---|
| RStudio's **Add account** dialog | `rsconnect` registers a key pair; the person approves in the browser on the same page `toft login` uses, which names the requesting address. Toft creates a key named **RStudio (rsconnect)**; every request is then signed and the private key stays on their machine |
| Pasted key | `rsconnect::connectApiUser()` with a personal key the person created |

If Toft is behind a proxy, set `TRUSTED_PROXY_CIDRS` so the approval page shows
the real requesting address — see [Listeners, origins and proxies](../../config/listeners-and-origins/).

:::caution[Fixed by rsconnect's protocol]
Requests are signed with **RSA/SHA-1**, so a FIPS-only host refuses them (a pasted
key still works). A request more than **5 minutes** from Toft's clock is refused;
within that window a captured request could be replayed, so serve over TLS.
:::

## What you can see

- **Admin → API keys**: every RStudio key, by owner, with last use.
- **Audit log**: the approval and key creation (via `rsconnect`), then each deploy as the person.
- **The app**: deployments marked as uploaded, with the build log.

## Turning it off

Turn off personal API keys or archive uploads. `/__api__/server_settings` still
answers, reporting that no sign-in is available and the Toft version.
