---
title: Licensing
description: What a license key is, what it gates, and why a lapse never takes a running app down.
---

Enter the key in **Admin → License**. **Admin → Features** shows what this build
offers, what the license covers, and what you have switched on.

:::note
The license is bookkeeping, not a security boundary. It protects no data and
controls no access.
:::

## The key

A key looks like `TOFT1-K7QN4-8XZR2-M3TWD-6BVHC`. It names a customer, not an
install, and carries no entitlements or signature — the install checks its shape
and checksum locally and asks the vendor's service what it covers. It is plain
text, audited in the clear and readable back in full; there is nothing to rotate.

## Tiers

Four tiers, derived from the vendor's answer and never stored: **demo**, **free**,
**trial**, **paid**. The vendor's *plan* maps to a tier on the vendor's side;
nothing here infers one from a plan name. An install with no key is on demo.

Gated by tier:

| Entitlement | |
|---|---|
| `dependency_policy` | [Dependency policy](../../security/dependencies/) |
| `identity_providers`, `groups` | Sign-in providers and groups |
| `app_storage` | [App storage](../../capabilities/storage/) |
| `telemetry` | [Telemetry](../../capabilities/telemetry/) |
| `trusted_sources` | [Trusted sources](../../security/sources/) |
| `integrations`, `slack` | [Integrations](../../capabilities/integrations/) |
| `public_apps` | Public apps |

Unlike an unconfigured [optional capability](../../capabilities/optional/), which is hidden, a
capability your tier withholds is **shown as locked**.

## What a lapse does

A license gates **configuration, never operation**.

| | Behavior |
|---|---|
| Running apps | Keep serving. Publishing is gated on the change, so an already-public app stays public |
| Switching things off | Never gated — telemetry, exporters, source policy, uploads can all be turned off after a trial ends |
| License server unreachable | Nothing changes; every failure resolves to the tier you already hold |
| Losing a tier | Only on an explicit adverse verdict from the vendor, after weeks of warning |
| Counts | No tier has a seat or install cap. Demo and free refuse *creation* past a count, nothing more |

## Outbound traffic

An install with no key never contacts the vendor. The endpoint is compiled in —
there is no variable or setting to change it — and a private address is refused.
An install whose egress is blocked never checks in; it keeps its last answer, and
nothing is withdrawn.

The check-in payload contains no names — no apps, users or hostnames — and every
value is type-checked before it is sent. Usage counts are sent by default; turn
them off with `license.send_usage` (one count is always sent on a paid license).
