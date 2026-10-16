---
title: Troubleshooting
description: The failures an administrator fixes — sign-in, access, deploys, builds, storage, startup and keys.
---

Start at **Admin → [Checks](../checks/)**. It is faster than the logs and catches
failures that are reported nowhere else.

## Sign-in and access

| Symptom | Cause and fix |
|---|---|
| Nobody can sign in | Sign in as the [built-in administrator](../../identity/local-administrator/). If local sign-in is off, run `toft local-admin enable` on the host |
| Signed in, no access | Expected: no first-user-becomes-admin rule, and a provider grants nothing. Make them an administrator or add them to a [group](../../identity/groups/). If they see a refusal, check whether the provider is set to wait for [activation](../../identity/activation/) |
| Directory group memberships never appear | The **Directory groups** check warns when mappings exist but no membership arrived. Check the claim name, the requested scopes, and whether the IdP must enable the groups claim. A claim of unexpected shape reads as absent |
| Directory feed does nothing | `skip` = no token; `warn` = token never used, so the IdP is not calling. `/scim/v2/*` answers 401 (not 404) without a token |
| Public apps ask people to sign in | [Anonymous access](../../security/anonymous/) is off, so public means signed-in. Turn it on and they are public again |
| Everyone sees every app's name | [`apps_listable_to_authenticated`](../../apps/listing/), on by default. One toggle turns it off |
| Every audit-log address is the load balancer's | Set `TRUSTED_PROXY_CIDRS`; the **Trusted proxy** check flags it |

## Apps and deploys

| Symptom | Where to look |
|---|---|
| Public but unreachable from outside | Rarely the app: DNS, proxy, apps origin, TLS. See [Reachability](../../security/reachability/); `unknown` is not `not_ok` |
| Deploy refused, "worked yesterday" | [Dependency policy](../../security/dependencies/) (a new advisory refuses deploys, never the running app) · [Trusted sources](../../security/sources/) · [Language versions](../../build/languages/) (removed interpreter) · [Clone credentials](../../security/git-connections/) (expired) · [Locks](../../apps/locking/) |
| Builds queued, not starting | **Admin → Queue**, then the build concurrency setting, then host memory. Next.js and R builds are the usual culprits; a [binary R repository](../../build/languages/) helps most |
| App restarts repeatedly | See [crashes and restarts](../health-and-processes/#crashes-and-restarts). Read the app's logs, and check its memory limit before blaming the owner |
| Browser uploads to storage fail, nothing logged | Bucket CORS — Toft never saw the request. See [App storage](../../capabilities/storage/) |
| Gallery is empty | It is off by default. If on and empty, the catalog may need a newer Toft — you are told so |
| Metrics stopped | Not an outage. Check the collector endpoint and `METRICS_ADDR` (its own listener, never a path on `:8080`) |

## The install will not start

Read the exit message; every refusal names its reason. Common ones:

- `JWT_SECRET` under 32 bytes.
- A database below the schema floor — upgrade through the intermediate release
  ([Upgrading](../../start/upgrading/)).
- Both isolated backends configured.
- An unknown artifact or store backend, or an unknown KEK scheme.
- A boolean it cannot read: only `1/true/yes/on` and `0/false/no/off` (or unset) are accepted.

## A secret will not decrypt

The error names the missing key. Put it in `ENCRYPTION_KEY_OLD` and restart. See
[At-rest encryption](../../security/encryption/).
