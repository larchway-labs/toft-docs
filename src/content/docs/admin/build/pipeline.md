---
title: What a deploy does
description: The three phases, what each can refuse, and what a failure never disturbs.
---

Every deploy is **upload → scan → deploy**, in that order, and every step belongs
to exactly one phase. The phase is derived from the step, never stored, and the
step keys are a wire contract — the same across surfaces and releases.

| Phase | What happens | Can refuse on |
|---|---|---|
| **Upload** | Clone, or unpack an archive. Dependency directories stripped; unsafe entries dropped. | [Source policy](../../security/sources/), archive caps, a clone credential |
| **Scan** | Resolve what the app installs, compare to the [dependency policy](../../security/dependencies/). | Severity, fixability, malware |
| **Deploy** | Install dependencies, run the build, start the workload. | Build timeout, a language version, a start that produced no process |

## What a failure never disturbs

**The release that is serving keeps serving.** A build that fails, times out or is
refused changes nothing about what users are getting. There is no window in which
a failed deploy leaves an app with nothing.

A killed build leaves the serving release up. So does a refusal.

## A refusal is not a deploy, but a failed upload is

If the platform refuses before anything is stored, no deployment row is written.
If the upload started and then failed, it **is** recorded, with the reason.

Two different things, and the difference is whether there is anything to look at.

## What an archive loses

Fixed, and it happens **before the caps are counted** — so a zip that is mostly
`node_modules` is usually well inside the limit once unpacked.

A single top-level wrapper directory is unwrapped. Dependency directories are
removed. Entries with absolute paths, paths escaping the root, or symlinks
pointing outside are dropped.

**What was dropped is reported on the deploy it changed**, so an owner looking for
a missing file finds it there.

Both container formats — `.zip` and `.tar.gz` — go through one unpacker.

## Build parameters are yours, never the app's

Build memory, CPU and timeout are the operator's numbers. A repository cannot ask
for a bigger builder.

Registry URLs **and registry credentials** come from this process's environment
and **beat the app's**: an app declaring `NPM_TOKEN` gets the operator's value.
There is one allow-list of keys and prefixes, and a build credential never
reaches the deployed app.

## npm lifecycle scripts

Disabled unless `BUILD_ALLOW_SCRIPTS` is set. A `postinstall` that fetches a
binary or patches a package does not run.

This is not a dial and is not per app: it decides what code a build may execute,
and turning it on widens the trust boundary of **every** subsequent deploy on the
install, with nothing about the result looking different.

## Watching one

A deploy in flight is watched where the person is standing — a console above the
tabs on the app's page, with a phase bar and the build's own output. Progress is
a stream of snapshots and is never load-bearing.

A build's log has three lifetimes and no surface presents one as another: a pane
that joined mid-build says so, the stored log is offered and never substituted,
and there is one socket per build per page.

The deployment **list** carries no build log. One route serves it.

## Builds are unsandboxed

Stated rather than hidden: a build runs your organization's code with the
toolchain's ordinary access. The mitigations are the [source
policy](../../security/sources/), the lifecycle-script switch above, and per-app
OS accounts. Build sandboxing is on the backlog and is not shipped.
