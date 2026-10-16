---
title: Language versions and toolchains
description: Which interpreters this install offers, who decides, and how to retire one.
---

## Discovered, never compiled in

Toft ships no list of language versions. **The operator says where, and the
probe says what.** You install interpreters on the machine (or bake them into the
[runner images](../runner-images/)); Toft finds them and offers what it
found.

There is no version string in a variable name anywhere, which is why adding a new
Python does not need a Toft release.

Admin → Info and the health endpoint both list what was found. The checks page
re-probes a family reported **absent** when you press Run checks — so installing
an interpreter and confirming it does not need a restart. A family reported
present carries the age of its reading.

## Four families

Python, Node, Go and R.

**The published image ships three of each**, so a fresh install offers a choice
before anybody installs anything:

| | What the platform image carries | Default |
|---|---|---|
| Python | 3.15, 3.14, 3.13 | 3.15 |
| Node | 24, 22 (22.23.3), 20 | 24 |
| Go | the image's own (1.27), plus 1.26.9 and 1.25.14 | the image's own |
| R | 4.6 (4.6.1), 4.5 and 4.4 | 4.6 |

Highest first, in every case — the probe takes the first entry as the family's
default. Quarto (1.10.19) is in the same image; there is no separate `-quarto`
tag to choose between.

**Python 3.12 and R 4.3 are no longer offered.** An app pinned to either is
refused by name at its next deploy, and has to move up; one already running keeps
running until then (see [Retiring a version](#retiring-a-version)).

**R comes from Posit's builds, not the distribution's.** Every R in both images is
Posit's build for Debian 13, installed under `/opt/R/<version>` with the newest on
`PATH` as the default. The image carries no distribution R, so there is no
undeclared fourth interpreter at `/usr/bin/Rscript`.

Your own final image is yours to compose, and dropping entries from one
variable is how you offer fewer.

## What a developer may ask for

**Comparators only**, and **never a patch version**. A pin naming a patch is
**refused rather than truncated** — `3.13.4` is an error, not a slow way of
saying `3.13`.

**A version is refused, never approximated.** An app asking for something you do
not have fails its deploy and is told what exists. It is never silently placed on
a different interpreter.

**The decision is made before the build**, because that is where the interpreter
gets baked in — so a developer finds out in seconds rather than after a
ten-minute install.

**One declaration per family**, and Go's is `go.mod`. A Posit Connect
`manifest.json` is translated into an `renv.lock` rather than taught as a second
format.

## Go is not like the other three

There is no `[runtime] go` key and there will not be one. A `go` directive in
`go.mod` is a **minimum**, the `go` command resolves it itself, and the version
reaches a runner not at all, because `go build` produces a binary.

**Go never downgrades**, which is the part that surprises people: a
`toolchain go1.25.14` line does not hold a build on 1.25.14 when a newer
toolchain is present. Go takes the newer of the two, always. So no declaration
an app can write reaches the older toolchains at all.

**The lever is yours: `GOTOOLCHAIN=go1.X.Y`.** It is on the operator's
allow-list of build parameters, for an estate that has to be held on a known
toolchain, or one dependency that will not compile on the newest. Go looks for
an executable of that name on `PATH` before it considers the module proxy, so it
works on an install with no egress at all — which is the whole reason the extra
toolchains are in the image rather than fetched.

It is inert until you set it, and the checks page reports the set the image
carries.

## R has more moving parts than the others

**Point R at a binary repository.** `TOFT_R_REPOS`, and it is a
[dial](../../config/operating-dials/). This is the single largest lever on R build
times, and on some architectures it is the difference between a build and a
failure.

**The default is Posit Package Manager's `latest`, not a dated snapshot.** A
date bought one thing — an app with no lockfile builds the same way twice — and
charged for it in packages that do not exist yet: anything published after the
date is absent rather than old, and a dependency refusal naming a fixed version
could not be answered from a snapshot that predates it. If your estate has
decided when it moves, pin a dated path here. The default cannot decide that for
one that has not.

**renv's cache is off**, deliberately. renv's default fills a library with links
into a machine-global cache, and those links dangle in every pod.

**A library is stamped with the R series it was built for.** Restoring a 4.5
library into a 4.6 release is refused rather than half-loading.

**Both launchers point R at its library**, shared and isolated alike.

R also needs system libraries beyond the interpreter — pandoc for rendering,
plus whatever your packages link against. Those are the machine's, or the image's.

## What is running right now

Every build records the version it resolved, pinned or not. Two readers:

- **Admin → Languages**, counting the release that is **serving** rather than the
  newest build, and never answering less than it knows.
- **The app's own Runtime section**, editor-only, carrying the patch the estate
  view folds away.

**A release names the interpreter it was built against, and both launchers start
the workload under that one** — shared and isolated alike. An app pinned below
the install's default reports that version at runtime, not the default, and a
restart puts back the same one.

Use the first when you are planning; use the second when you are answering a
question about one app.

## Retiring a version

1. **Look at Admin → Languages** and see what is actually on it.
2. **Tell the owners**, with a date.
3. **Remove the interpreter.**

Apps already running on it keep running: a restart replaces the tree and puts
back the same release. What changes is the next **deploy** — it re-resolves,
finds the version gone, and is refused with the list of what exists.

That refusal arrives while a developer is already deploying, which is the moment
they can act on it.

## Build parameters and registries

Where builds fetch from is this process's environment: `NPM_CONFIG_REGISTRY`,
`UV_INDEX_URL`, `GOPROXY`, and the credentials for an authenticated mirror.

Prefer a credential variable over a token inside a registry URL: a URL credential
works, and then appears in the output of every build that mentions it.

Go and R have no credential variable of their own — point them at a netrc file
you mount.

`GOOS` and `GOARCH` are the one pair that is **refused** rather than passed
through.
