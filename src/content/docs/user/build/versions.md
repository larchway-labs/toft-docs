---
title: Language versions
description: Pinning Python, Node, Go or R, and what a pin may and may not say.
---

Toft picks a default version for your language. To ask for a different
one, declare it — in `toft.toml` for Python, Node and R, and in `go.mod`
for Go.

```toml
# toft.toml
[runtime]
python = ">=3.12"
node   = ">=22"
r      = ">=4.4"
```

Go is the exception: its declaration is the `go` line in `go.mod`, because Go
already has one and teaching a second would mean two places to disagree. It is a
**minimum**, not a pin — Go resolves it itself and never downgrades, so a
`toolchain` line naming something older does not hold a build there. Which
toolchain a Go build uses is your administrator's to set, not yours.

## What a pin may say

**Comparators only** — `>=3.12`, `<3.13`, and combinations. Not `^3.12` and not
`~3.12`: those are semver assumptions, and Python is not semver.

**Never a patch version.** `3.12` is a pin. `3.12.4` is **refused**, not quietly
truncated to `3.12`. Patch releases are security fixes, and an app that pins
away from them is an app that stops getting them.

## What happens when it cannot be met

The version is **refused, not approximated**. If your install has 3.11 and 3.12
and you ask for `>=3.13`, the deploy fails and names what is available. You are
never silently placed on an interpreter you did not ask for.

The decision is made **before** the build, because that is where the interpreter
gets baked in — so you find out in seconds rather than after a ten-minute
install.

## Which versions exist

Your administrator decides. Versions are **discovered on the machine**, not
compiled into Toft, so the set can change without a Toft upgrade.

The published Toft image carries three of each — three Pythons, three
Nodes, three Go toolchains and three Rs — so most installs offer a real choice
without anybody having installed anything. Your install may offer more, or
fewer.

In the published image the sets, newest first, are Node 24, 22 and 20; Python
3.15, 3.14 and 3.13; R 4.6, 4.5 and 4.4. The newest is the default, so an app
with no pin runs Python 3.15 and R 4.6. Pin `>=` something older, or `<` the
newest, to stay behind.

The New app page and the build log both tell you what was available.

## What is running right now

Every build records the version it actually resolved, pinned or not. Two places
read that back:

- **Your app's Settings tab**, under **Runtime** — the version this app is
  serving on, down to the patch.

  **The release names its own interpreter, and that is what starts it** — so an
  app pinned below your install's default runs on the version it asked for, in
  either execution mode, and a restart puts back the same one. What you read
  there is what is running, not the install's default.
- **Your administrator's estate view**, which counts the release that is
  *serving* rather than the newest build.

So "which Python is this app on?" is always answerable, and the answer is about
the release in production rather than about your last attempt.

## When an interpreter goes away

If your administrator retires a version, apps already running on it keep
running — a restart puts back the same release. What changes is the next
*deploy*: it re-resolves, finds the version gone, and is refused with the list
of what exists.

That is your signal to move the pin, and it arrives at a moment when you are
already deploying rather than in the middle of the night.
