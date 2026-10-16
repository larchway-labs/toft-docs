---
title: From a git repository
description: Point an app at a repository, a branch and optionally one folder of it; Toft clones and builds it.
---

The standard way to deploy: the app names a repository and branch, and Toft
clones it on every deploy.

## Create the app

In the browser, **New app → Git repository**:

| Field | |
|---|---|
| **Repository URL** | Any URL your install's source policy allows. A refused URL is refused at creation. |
| **Branch** | Defaults to `main`. |
| **Folder (optional)** | Build one folder of the repository. See [Monorepos](#monorepos). |
| **Deploy through** | Shown when an administrator has connected a git host. Pick it and no token is needed. |
| **Access token (private repos)** | Otherwise, a read token for a private repository. Stored encrypted. |

From the terminal:

```bash
toft create --repo https://github.com/acme/reports
toft create --repo https://github.com/acme/platform --subdir apps/web --branch release
```

`toft create --repo` uses the repository's default branch unless you pass
`--branch`.

## Monorepos

Set **Folder** to build one app out of a repository that holds several:

- Only that folder becomes the release — no `.git`, nothing outside it.
  Detection, `toft.toml` and dependency files are read from the folder.
- The slug defaults to the app name, or else the folder's name.
- Paths containing `..` or `.git`, and folders that are symlinks, are refused.
- `toft status` prints the `folder` an app builds from.

:::caution[Auto-deploy in a monorepo]
A push to *any* folder of the repository rebuilds every auto-deploying app on
that branch, not only the app whose folder changed.
:::

## Redeploy

**Redeploy** on the app page builds the branch's current head. From the
terminal:

```bash
toft redeploy
```

`toft redeploy` uploads nothing. To send your working tree instead, use
[`toft deploy`](../from-your-machine/).

## Change branch, folder or token

**Settings → Source & deploys** holds **Tracked branch**, **Folder**,
**Auto-deploy on push** and **Git access token**. Changes apply on the next
deploy. The app keeps its slug, URL, history, variables and access.

Pointing an app at a *different repository* is an administrator action.

## Next

- [Deploying on every push](../auto-deploy/)
- [Watching a deploy](../watching/)
