---
title: Deploy your first app
description: From a repository URL to a running app you can share, in about ten minutes.
---

The shortest path from a git repository to a URL. You need the
[publisher role](../signing-in/).

## 1. Create the app

1. Select **New app**.
2. **Source** — choose **Git repository** and paste the **Repository URL**.
   Set **Branch** if it is not `main`. For a private repository, pick a
   connected host under **Deploy through** or paste an **Access token**.
   Select **Next**.
3. **Configure** — give it an **App name**. The **Slug** is derived from it
   and becomes the app's address, `/apps/<slug>`. Add any environment
   variables now (mark secrets sensitive). Select **Next**.
4. **Deploy** — check the summary and select **Deploy now**.

:::tip[Monorepo?]
Put the app's folder in **Folder (optional)**, for example `apps/web`. Only
that folder is built. See [From a git repository](../../deploy/from-git/).
:::

If the slug is taken, Toft adds a number (`sales-2`). Slugs starting with `_`
are reserved and refused.

## 2. Watch the deploy

You land on the app's page with a deploy console above the tabs:

| Phase | What happens |
|---|---|
| **Source** | The repository is cloned (**Upload** for an archive). `node_modules`, `.venv` and similar folders are dropped — the build reinstalls them. |
| **Scan** | Dependencies are checked against your install's policy. |
| **Deploy** | Detect the framework, install, build, start, health-check, go live. |

If it fails, the reason is in the build log. See
[Watching a deploy](../../deploy/watching/).

## 3. Open it

Copy the URL from the app's **Overview** tab rather than typing it — apps are
served on their own address, which your administrator chooses.

A new app is **Restricted**: only you can open it until you
[share it](../../share/visibility/).

## 4. Add configuration

Keep secrets out of the repository. Add environment variables on
**Settings → Environment variables**; your app reads them at startup.

A change reaches the app at its next start. Until then the app page shows
**Restart to apply**.

## If it failed

**"Unsupported framework."** Toft did not recognize the repository. The
message lists what it supports. Common cases:

- **A front-end build with no server** (Vite, Create React App): there is
  `package.json` but no `start` script. Add a server with a `start` script, or
  commit the built output and deploy that folder as a
  [static site](../../build/static/).
- **Python with no entry point**: Toft looks for `app.py`, `main.py`,
  `streamlit_app.py`, `server.py` or `wsgi.py`.

**It deployed but the page is broken.** Almost always links. Your app is
served under `/apps/<slug>`, so `/styles.css` asks the platform, not your app.
Read [Base paths](../../build/base-paths/) once.

## Next

- Deploy your working tree from a terminal: [From your machine](../../deploy/from-your-machine/)
- Rebuild on every push: [Deploying on every push](../../deploy/auto-deploy/)
- Let colleagues in: [Who can see your app](../../share/visibility/)
