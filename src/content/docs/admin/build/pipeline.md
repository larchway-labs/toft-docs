---
title: What a deploy does
description: The three phases of a deploy, what each can refuse, building from a folder, and what a failure leaves alone.
---

Every deploy runs **upload → scan → deploy**. Each step belongs to one phase, and
the step keys are a stable wire contract across the UI, CLI and API.

| Phase | What happens | Can refuse on |
|---|---|---|
| **Upload** | Clone the repository (or its folder), or unpack an archive. Dependency directories stripped; unsafe entries dropped. | [Source policy](../../security/sources/), archive caps, a clone credential, a bad folder |
| **Scan** | Resolve what the app installs and compare it to the [dependency policy](../../security/dependencies/). | Severity, fixability, malware |
| **Deploy** | Install dependencies, build, start the workload. | Build timeout, language version, a start that produced no process |

:::note[A failure never takes an app down]
The deployment that is serving keeps serving. A build that fails, times out, is
killed or is refused changes nothing users see.
:::

A refusal before anything is stored writes no deployment row. An upload that
started and then failed **is** recorded, with the reason.

## Building from a folder of a repository

One repository can hold several apps. Each app names its folder:

| Surface | Where |
|---|---|
| UI | **New app → Folder (optional)**; later, the app's **Settings → Source & deploys → Folder** |
| API | `repo_subdir` on `POST /api/v1/apps` and `PATCH /api/v1/apps/{id}` |
| CLI | `toft create --repo <url> --subdir <folder>`; `toft status` prints `folder` |

- **Only that folder is deployed.** The repository is cloned beside the
  deployment's directory and the folder is moved in; nothing outside it and no `.git` is kept.
  Detection, `toft.toml` and the build all treat the folder as the app's root.
- **Refused:** absolute paths, `.` or `..` segments, anything inside `.git`, and a
  folder that is a symlink in the repository (checked on disk, segment by segment).
  A missing folder, or a file where a folder is expected, fails the upload phase.
- Without a name or slug, the **slug defaults to the folder's name**.
- An app deployed from an upload has no repository, so it has no folder.

:::caution[Auto-deploy and shared repositories]
Auto-deploy tracks the branch's commits, not the folder's. A push to **any**
folder rebuilds **every** auto-deploying app on that branch. This is a known
limitation.
:::

## What an archive loses

Applied **before the caps are counted**, so a zip that is mostly `node_modules`
usually fits once unpacked. `.zip` and `.tar.gz` go through the same unpacker.

- A single top-level wrapper directory is unwrapped.
- Dependency directories are removed.
- Entries with absolute paths, paths escaping the root, or symlinks pointing
  outside are dropped.

What was dropped is reported on the deployment it changed.

## Build parameters are the operator's

- Build memory, CPU and timeout are yours; a repository cannot ask for more.
- Registry URLs **and credentials** come from the platform's environment and
  **override the app's**: an app declaring `NPM_TOKEN` gets the operator's value.
  One allow-list governs which keys pass through, and a build credential never
  reaches the deployed app.

## npm lifecycle scripts

Off unless **`BUILD_ALLOW_SCRIPTS`** is set; a `postinstall` does not run. It is
install-wide configuration, not a setting or a per-app choice: turning it on
widens what every later build may execute.

## Watching a deploy

A deploy in flight shows as a console above the app page's tabs, with a phase
bar and the build's own output. The stored log is offered after the fact; the
deployment list carries no log.

## Builds are unsandboxed

A build runs your organization's code with the toolchain's ordinary access.
Mitigations: the [source policy](../../security/sources/), the lifecycle-script
switch, and per-app OS accounts ([execution modes](../../apps/execution-modes/)).
