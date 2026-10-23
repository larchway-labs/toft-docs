---
title: From an archive
description: Upload a .zip or .tar.gz to create an app, or to ship a new version of one.
---

Upload an archive when the code is not in git — a build produced elsewhere, a
one-off, or an air-gapped transfer. For anything you iterate on,
[`toft deploy`](../from-your-machine/) sends the same bytes without making an
archive.

## Upload

- **New app → Upload an archive** creates an app from a `.zip`, `.tar.gz` or
  `.tgz`.
- **Deploy → Upload new version** on the app page ships a new archive to an
  existing uploaded app.

If **Upload an archive** is missing, your administrator has switched uploads
off.

| Limit | |
|---|---|
| Archive size | 100 MB |
| Unpacked size | 500 MB, 20,000 files |

## What Toft does to it

- **Unwraps** a single top-level folder, so `myapp-main/` does not become the
  app's root.
- **Removes** `node_modules/`, `venv/`, `.venv/`, `__pycache__/` and VCS
  folders — the build reinstalls dependencies.
- **Drops** unsafe entries: absolute paths, paths escaping the root, symlinks
  pointing outside.

What was removed is reported on the deploy. If a file is missing, look there
first.

## An uploaded app has no repository

It has no branch, folder or auto-deploy, and `toft redeploy` refuses it — use
`toft deploy` or **Deploy → Upload new version**. An uploaded app cannot be converted into a
git app; create a new app from the repository instead.
