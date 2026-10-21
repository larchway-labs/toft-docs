---
title: Language versions
description: Pin the Python, Node, R or Go version your app builds and runs on.
---

With no pin, your app gets the install's default version. To choose, declare a
range in `toft.toml` — or, for Go, in `go.mod`.

```toml
# toft.toml
[runtime]
python = ">=3.12,<3.14"
node   = "22"
r      = ">=4.5"
```

Toft picks the **highest** installed version that satisfies the range.

## How to write a range

| Language | Compared on | Examples |
|---|---|---|
| Python, R | major.minor | `3.13`, `>=3.12,<3.14` |
| Node | major | `22`, `>=20` |

- Operators are `>=`, `<=`, `>`, `<` and `==`. A bare version means exactly
  that version. A comma means AND.
- One wildcard is accepted: a trailing `.*` after `==`, as in
  `python = "==3.13.*"`, which means the 3.13 line — the same as `3.13`.
- `^`, `~`, `~=`, `||`, `!=` and any other `*` are refused, each with the range
  to write instead.
- Extra components are refused, not truncated: `3.12.4` for Python, `22.4` for
  Node.

To stay on an older version, give an upper bound or an exact version
(`python = "3.13"`). A bare `>=` floor always takes the newest.

## Python's `requires-python`

Toft does not pick a Python version from `requires-python` in `pyproject.toml`.
With no `[runtime] python` pin, if `requires-python` excludes the version Toft
chose, the deploy and `toft check` warn you and name a pin that satisfies it.

## Go

Go reads the `go` line in `go.mod` as a minimum — `go 1.25` means 1.25 or
newer. If no installed toolchain meets it, the `go` command either downloads
one or fails, depending on your install. See [Go](../go/).

## When no version matches

The deploy is refused before anything builds, and the error lists the versions
the install has. Toft never substitutes a different version.

## Which versions exist

Your administrator decides. The published Toft image ships three of each
language, Go included, with the newest as the default:

| Language | Versions |
|---|---|
| Python | 3.15, 3.14, 3.13 |
| Node | 24, 22, 20 |
| R | 4.6, 4.5, 4.4 |

Your install may differ.

## What's running

Your app's **Settings** tab, under **Runtime**, shows the exact version the
serving deployment runs on. A restart keeps it.

If your administrator removes a version, running apps keep it. Your next deploy
re-resolves and is refused if the pin no longer matches — that's your cue to
update the pin.
