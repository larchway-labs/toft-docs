---
title: From an archive
description: Uploading a zip or a tarball, and what an upload loses.
---

You can create an app by uploading `.zip` or `.tar.gz`, and you can upload a new
archive over an existing app. Both formats go through the same unpacker and
behave identically.

Your administrator can switch archive uploads off for the whole install. If the
option is not on the New app page, that is why.

## When to use it

- A build produced somewhere else that you want to serve.
- A one-off you are not going to keep in version control.
- An air-gapped transfer.

For anything you are iterating on, [`toft deploy`](../from-your-machine/) is
better: it sends the same bytes without you making an archive.

## What an upload loses, and what it says about it

An archive is normalised before anything is counted or built:

- A single top-level wrapper directory is unwrapped, so `myapp-main/` inside the
  zip does not become the root of your app.
- Dependency directories — `node_modules/`, `.venv/`, `__pycache__/` — are
  **removed**, because the build reinstalls them.
- Entries that cannot be trusted (absolute paths, paths escaping the root,
  symlinks pointing outside) are dropped.

**This happens before the size caps are counted**, so a zip that is mostly
`node_modules` is usually well inside the limit once unpacked.

**What was dropped is reported on the deploy that dropped it.** If a file you
expected is missing, that report is the first place to look.

## An upload is not a git app

An app created from an archive has no repository, so it has no branch, no
subdirectory and no auto-deploy. `toft redeploy` on it is refused by name and
tells you to use `toft deploy`.

You can point it at a repository later from the **Settings** tab.

## A refusal is not a deploy — but a failed upload is

If the platform refuses before anything is stored — an archive that is too
large, a source your install will not accept — no deployment is recorded.

If the upload started and then failed, it *is* recorded, with the reason, so
there is something to look at. The two are different on purpose.
