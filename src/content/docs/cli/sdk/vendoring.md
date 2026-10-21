---
title: Vendoring it
description: Put the install's own SDK on your disk with toft sdk vendor, for local builds, tests and your editor.
---

A deployed app never needs this: the build installs the SDK. Vendor it when your
editor, `go build`, tests or CI need to see the package before the deploy.

```bash
toft sdk vendor                  # language detected from the tree
toft sdk vendor --lang python
```

It writes the install's own SDK into `.toft/sdk-<lang>/`, so you compile against
exactly what that install's build would use.

| Flag | |
|---|---|
| `--lang <go\|python\|node>` | Which SDK. Detected from the tree when absent. A tree that is two languages at once is refused, exit 2. |
| `--dir <path>` | Where to write it. Default `.toft`. |

The install decides which languages it serves. Vendoring covers **Go, Python and
Node**; asking for another is refused with `sdk_language_unknown`, exit 2. The R
package is installed by the build into the app's library and has nothing to
vendor.

## Per language

| Language | Lands in | Then |
|---|---|---|
| Go | `.toft/sdk-go/`, plus a `go.work` that uses it | Nothing. No `require` line is needed. |
| Python | `.toft/sdk-python/` | `uv pip install -e .toft/sdk-python` (or `pip install -e`) |
| Node | `.toft/sdk-node/` | Add `"@larchway/toft": "file:.toft/sdk-node"` to `package.json`, then `npm install`. |

`toft` prints the next step for you.

**Python's copy is added to `.gitignore`** (unless a rule already covers it), so
the next deploy does not ship it and the platform installs its own. `--json`
names the line it added as `gitignore`.

**Node's copy ships on purpose.** `package.json` names it as a `file:`
dependency, so the build's `npm ci` needs it, and the platform then keeps your
copy.

:::caution[Go: ignore both or neither]
`go.work` and `.toft/` ship with `toft deploy`, and the platform then uses your
copy. Ignore both in `.gitignore`, or neither. Ignoring only `.toft/` leaves a
`go.work` that names a folder that did not ship, and the build fails on the
install. `toft sdk vendor` warns when it sees this.
:::

## Which copy is this

`toft sdk vendor` prints a build id for the copy it wrote:

```text
Wrote the python SDK (toft 0.3.0) to .toft/sdk-python — 14 files, from https://toft.corp
  Build 9ed4b6bdfa26 — the deploy log names the copy your app was built with; they should match.
```

The deploy log prints the build id of the copy your app was built with. On an
isolated install the two can differ if the runner image is older than the
platform. The deploy still succeeds, with a warning; tell your administrator to
rebuild the image.

## Keeping it current

Re-run `toft sdk vendor` after the install is upgraded, and read the diff. To go
back to the platform's own copy, delete `.toft/` (and `go.work` for Go, or the
`file:` dependency for Node).

The same source is published at
[larchway-labs/toft-sdk](https://github.com/larchway-labs/toft-sdk)
(Apache-2.0), tagged with the platform version. Vendor from your install rather
than the public repository, so the copy matches the platform you deploy to.
