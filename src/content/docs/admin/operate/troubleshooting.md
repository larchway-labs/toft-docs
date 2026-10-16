---
title: Troubleshooting
description: The failures that are yours rather than a developer's.
---

**Start at Admin → Checks.** It is faster than the logs, and the failures that used
to report themselves nowhere report themselves there.

## Nobody can sign in

Sign in as the [built-in administrator](../../identity/local-administrator/) —
that is what it is for — and look at the provider.

If you cannot, you need the machine: `toft local-admin`.

## Somebody signed in and has no access

Expected. **There is no first-user-becomes-admin rule**, and a provider does not
grant anything by itself. Make them an administrator, or add them to a
[group](../../identity/groups/), explicitly.

If they are stuck at a refusal instead, check whether your provider's policy is
`pending` — see [Accounts that wait](../../identity/activation/).

## Directory group memberships never appear

The checks page's **directory groups** row reads `warn` when a provider has
mappings and no membership has ever arrived. Usually: the claim name, a scope that
was not requested, or an IdP that needs the groups claim explicitly enabled.

Remember **absent is not empty** — a claim of an unexpected shape reads as absent
and reconciles nothing, deliberately.

## The directory feed does nothing

`skip` means no token. `warn` means a token that has never been used, which is
your IdP not calling. And `/scim/v2/*` answers **401 rather than 404** without a
token, deliberately, so your IdP's diagnostics say "not authorized" rather than
sending you off to re-check the base URL.

## An app is public but nobody outside can reach it

Almost never the app. In order: DNS, your proxy, the apps origin, TLS. See
[Reachability](../../security/reachability/) — and remember `unknown` is not
`not_ok`.

## Apps are public but being asked to sign in

[Anonymous access](../../security/anonymous/) is off, so public resolves to
`authenticated`. Nothing was rewritten; turn it back on and everything that was
public is public again.

## Everybody can suddenly see every app's name

[`apps_listable_to_authenticated`](../../apps/listing/), which defaults on. One
toggle takes the whole install back at once, with nothing to restore by hand.

## A deploy is refused and the developer says it worked yesterday

| Check | Why |
|---|---|
| [Dependency policy](../../security/dependencies/) | A new advisory can refuse today's deploy. It does **not** stop the running app. |
| [Trusted sources](../../security/sources/) | Did the source list change? A settings change never takes down running code, but it does gate new deploys. |
| [Language versions](../../build/languages/) | Did an interpreter get removed? A version is refused, never approximated. |
| [Clone credentials](../../security/git-connections/) | Expired? The checks page names the app count. |
| [Locks](../../apps/locking/) | A lock refuses with your own words. |

## Builds are queued and not starting

Admin → Queue first: is something building, or is nothing building? Then the
concurrency dial, then the machine.

On one box, builds compete with running apps for memory — a Next.js or an R build
is the usual culprit. A [binary R repository](../../build/languages/) is often the
largest single win.

## An app restarts repeatedly

In isolated mode it is restarted a **bounded** number of times and then told it has
stopped being restarted. One the backend keeps killing for memory is **stopped
rather than restarted forever**.

Read the app's logs. The reason is usually the app's — but check the memory
ceiling before telling the owner that.

## Storage uploads fail from the browser and nothing is logged

CORS on the bucket. Toft never saw the request, so it cannot report it. See
[App storage](../../capabilities/storage/).

## The gallery is empty

It is **off by default**. If it is on and empty, check whether the catalog declares
a schema version newer than this binary — you would be told that specifically
rather than shown an empty list.

## Metrics stopped

Telemetry is **never load-bearing**, so this is not an outage. Check the collector
endpoint, and that `METRICS_ADDR` is still set — it is a listener of its own, never
a path on `:8080`.

## Every client address in the audit log is the load balancer's

`TRUSTED_PROXY_CIDRS`. The checks page catches it from the request that asked.

## The install will not start

Read the exit message; every startup refusal names its reason. The likely ones:

- `JWT_SECRET` under 32 bytes.
- A database **below the schema floor** — upgrade through the intermediate
  release. See [Upgrading](../../start/upgrading/).
- Both isolated backends configured at once.
- An unknown artifact or store backend, an unknown KEK scheme, a versionless Key
  Vault URI.
- A boolean it could not read. Anything that is not `1/true/yes/on` or
  `0/false/no/off` is refused rather than treated as false.

## A secret will not decrypt

**A key that is not held is refused by name.** You are told which key is missing.
Put it in `ENCRYPTION_KEY_OLD` and restart. See [At-rest
encryption](../../security/encryption/).
