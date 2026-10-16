---
title: Language versions and toolchains
description: Which interpreters an install offers, how an app picks one, and how to retire a version.
---

Toft ships no list of language versions. You install interpreters on the machine
(or in the [runner images](../runner-images/)); Toft probes for them and offers
what it finds. A new Python needs no Toft release.

**Admin → System info** and the health endpoint list what was found. **Run
checks** on **Admin → System checks** re-probes a family reported absent, so a
newly installed interpreter shows up without a restart.

## What the published image carries

Four families, three versions each, highest first. The first entry is the
family's default.

| Family | In `gopanair/toft` | Default |
|---|---|---|
| Python | 3.15, 3.14, 3.13 | 3.15 |
| Node | 24, 22, 20 | 24 |
| Go | 1.27, 1.26.9 | 1.27 |
| R | 4.6, 4.5, 4.4 (Posit builds, `/opt/R/<version>`) | 4.6 |

Quarto 1.10.19 is in the same image. Python 3.12 and R 4.3 are not offered: an
app pinned to either is refused at its next deploy and keeps running until then.

## What an app may ask for

- **Comparators only, never a patch version.** `3.13.4` is refused, not truncated.
- **Refused, never approximated.** A version you do not have fails the deploy
  before the build starts, listing what exists.
- **One declaration per family.** Go's is `go.mod`. A Posit Connect
  `manifest.json` is translated into an `renv.lock`.

## Go

There is no `[runtime] go` key and no `RUNNER_GO_VERSION`: `go build` produces a
binary, so no Go reaches a runner. The `go` directive in `go.mod` is a minimum,
and Go always takes the newest toolchain present — a `toolchain` line cannot hold
a build on an older one.

To hold builds on a known toolchain, set **`GOTOOLCHAIN=go1.X.Y`** in the
platform's environment. It is on the build allow-list, and Go finds the matching
toolchain on `PATH` before trying the module proxy, so it works with no egress.

## R

| Topic | Behavior |
|---|---|
| Package repository | **`TOFT_R_REPOS`**, default Posit Package Manager `latest` for Debian trixie. The largest lever on R build time; pin a dated snapshot if your estate needs reproducibility. |
| renv cache | Off — its links would dangle in every pod. |
| Library stamp | A library records the R series it was built for; restoring a 4.5 library into 4.6 is refused. |
| System libraries | pandoc and whatever your packages link against come from the machine or image. |

## What is running

Every build records the version it resolved, and both launchers start the
workload under that version — a restart keeps it.

- **Admin → Languages** — the estate, counting the **serving** release, patch folded away.
- **The app's Runtime section** — one app, with the patch.

## Retiring a version

1. Check **Admin → Languages** for apps on it.
2. Tell their owners, with a date.
3. Remove the interpreter.

Running apps keep running; a restart restores the same release. The app's next
**deploy** is refused with the list of versions that exist.

## Registries and build parameters

Builds fetch from what the platform's environment names: `NPM_CONFIG_REGISTRY`,
`UV_INDEX_URL`, `GOPROXY`, and credentials for an authenticated mirror.

- Prefer a credential variable over a token in a registry URL; a URL credential
  appears in build output.
- Go and R have no credential variable — mount a netrc file.
- `GOOS` and `GOARCH` are never passed through; a Go app that sets them is refused.
