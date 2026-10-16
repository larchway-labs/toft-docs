---
title: What is optional
description: Unconfigured capabilities are absent, not disabled — the rule, the one exception, and the list.
---

An optional capability you have not configured is **absent**: no greyed-out
control, no empty tab, no button that explains itself. A disabled control invites
a support question; an absent one reads as what it is.

| Not configured | Result |
|---|---|
| Artifact store | Its routes 404; nothing in the UI |
| Isolated backend | The mode is not offered |
| App storage | No storage on any app |
| Background jobs | No jobs (no *cluster* still allows jobs on the platform's machine) |

**Admin → System info** and **[Admin → Checks](../../operate/checks/)** show what is
on. On Checks an unconfigured capability reads `skip` with a reason, never `fail`.

:::note[The one exception: not licensed is visible]
A capability your [license tier](../../operate/licensing/) withholds is **shown as
locked**. Unconfigured is your decision; unlicensed is someone else's, and you are
entitled to see it.
:::

[Operating dials](../../config/operating-dials/) are not capabilities: a dial
always has a value, with the environment as its floor.

## The list

| Capability | Configured by |
|---|---|
| [App storage](../storage/) | A storage resource, and a mount or a bucket |
| [Integrations](../integrations/) | A connection per kind |
| [Email](../email/) | An SMTP relay or a sending API |
| [The gallery](../gallery/) | A setting; off by default |
| [Telemetry](../telemetry/) | A collector endpoint |
| [The artifact store](../../apps/artifact-store/) | `ARTIFACT_*` variables |
| Isolated execution | A Kubernetes or ECS cluster |
| [Jobs](../../operate/automation/#where-a-job-runs) | `background_jobs_enabled`, and the cluster or the platform's machine |
| [Reachability](../../security/reachability/) | Nothing — active whenever an app is public; inert if the internet cannot resolve the install |
| [Dependency policy](../../security/dependencies/) | A setting, and an advisory feed |
| [Connected git hosts](../../security/git-connections/) | A connection |
| Metrics endpoint | `METRICS_ADDR` |
