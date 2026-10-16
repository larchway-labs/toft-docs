---
title: Deploy your first app
description: From a repository URL to a running app, and what happens in between.
---

This walks the shortest path: a git repository to a URL you can send someone.
Ten minutes, and you need to be a [publisher](../signing-in/).

## 1. Create the app

1. Press **New app**.
2. Paste the repository URL, or pick a repository from a git host your
   administrator has connected.
3. Give the app a **name**. Toft turns it into a **slug** — lowercase
   letters, digits and hyphens — and that slug is the app's address:
   `/apps/your-slug`.
4. Press **Create**.

If the slug you asked for is taken, Toft tells you the one it actually
used rather than silently renaming your app. Slugs beginning with `_` are
refused: that namespace belongs to apps Toft installs itself, like this
guide.

## 2. Watch the deploy

The deploy starts on its own, and a console appears above the tabs while it
runs. It has three phases:

| Phase | What happens |
|---|---|
| **Upload** | The code arrives — cloned from git, or unpacked from what `toft` sent. Dependency directories like `node_modules` and `.venv` are stripped, because the build reinstalls them. |
| **Scan** | Your dependencies are checked against your install's policy. Depending on how strict that policy is, a finding can warn you or stop the deploy. |
| **Deploy** | Dependencies are installed, the app is built, and the workload is started. |

The build log is live. If something fails, **the log is where the reason is** —
not the status word on the app page. See [Watching a deploy](../../deploy/watching/).

## 3. Open it

The app's URL is on its Overview tab. Copy it from there rather than typing it:
apps are served on a different address from the platform, and which address is
your administrator's decision.

A brand-new app is **private**. The URL works for you and for nobody else until
you [share it](../../share/visibility/).

## 4. Give it configuration

Nothing secret belongs in the repository. On the **Settings** tab, add
environment variables — a database URL, an API key — and your app reads them the
ordinary way at startup.

A change takes effect at the **next start**, not immediately. The app page says
so with a banner while a saved value has not reached the running process.

## If it failed

Two failures account for most first deploys.

**"Unsupported framework."** Toft decided your repository is not one of the
shapes it can run, and the message names what it looked for. The two common
cases:

- **A front-end build with no server.** A Vite or Create React App repository
  has a `package.json` but no `start` script, so there is nothing to run.
  Either add a server and a `start` script, or commit the built output and
  declare it as a [static site](../../build/static/).
- **A Python project with no obvious entry point.** Toft looks for
  `app.py`, `main.py`, `streamlit_app.py`, `server.py` or `wsgi.py`.

**It deployed and the page is broken.** Almost always links. Your app is served
under `/apps/your-slug`, and a link written as `/styles.css` asks the *platform*
for that file, not your app. That rule has [a page of its
own](../../build/base-paths/), and it is worth reading once properly.

## Next

- Push from your machine instead of via git: [From your machine](../../deploy/from-your-machine/).
- Let colleagues in: [Who can see your app](../../share/visibility/).
- Run something nightly: [Scheduled tasks](../../automation/scheduled-tasks/).
