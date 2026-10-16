---
title: What is optional
description: The rule that governs every optional capability, and the one exception.
---

Toft has a rule about capabilities you have not configured, and it holds
everywhere:

## Absent, not dormant

An unconfigured capability is **not there**. Not greyed out, not a tab that
explains why it is empty, not a button that raises a support ticket.

- No artifact store configured → the routes 404 and nothing appears in the UI.
- No isolated backend → the mode is not offered.
- No app storage → there is no storage on an app.
- No jobs → no jobs. (No *cluster* is not no jobs: a run can be placed on the platform's own machine.)

## Why

Because a disabled control is an advertisement, and an advertisement in an
enterprise product is a support call. A developer who can see a button they
cannot press will ask you about it, every time, forever.

It also means an install that has decided not to use something looks like an
install that does not have it — which is the honest rendering.

## Where the rule decays, and how that is held

**The [checks page](../../operate/checks/) is where it decays**, because it is a
page whose whole job is to talk about things that are not configured. So its list
is the specification, and five rules hold it:

- Only reads. It configures nothing.
- Never a third party. It does not dial out to test somebody else's service.
- **`skip` over `warn`.** An unconfigured capability is a `skip` with a reason,
  never a failure.
- **A check the platform could not ask is not a bad answer.** A timeout is
  "did not answer", not `fail`.
- **No detail carries a credential.**

## An operating dial is neither a fact nor a capability

Also stated because it is the other place the rule does not apply: a
[dial](../../config/operating-dials/) always has a value. The environment is its
floor and is never taken away, zero at any level means the level beneath, and a
quantity's two unit spellings are peers of which only one may be set.

## The one exception, and it is the opposite

**Not licensed is visible.** A capability withheld by [license
tier](../../operate/licensing/) is shown, and shown as **locked**.

That is deliberate and it is the inverse of the rule: unconfigured is a decision
you made and should not be nagged about; unlicensed is a decision somebody else
made, and you are entitled to see what you do not have.

## The list

| Capability | Configured by |
|---|---|
| [App storage](../storage/) | A storage resource, and a mount or a bucket |
| [Integrations](../integrations/) | A connection per kind |
| [Email](../email/) | A relay or a sending API |
| [The gallery](../gallery/) | A switch, and it is off by default |
| [Telemetry](../telemetry/) | A collector endpoint |
| [The artifact store](../../apps/artifact-store/) | `ARTIFACT_*` |
| Isolated execution | A cluster or an ECS cluster |
| [Jobs](../../operate/automation/#where-a-job-runs) | A switch, and somewhere to run: the isolated backend, or the platform's own machine |
| [Reachability](../../security/reachability/) | `PRESENCE_ENDPOINT` |
| [Dependency policy](../../security/dependencies/) | A switch, and a feed |
| [Connected git hosts](../../security/git-connections/) | A connection |
| The metrics endpoint | `METRICS_ADDR` |

Before you design a process around any of them, check it is actually on. Admin →
Info and the checks page both answer that in one screen.
