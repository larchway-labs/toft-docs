---
title: Settings and environment variables
description: Name, slug, source, runtime and environment variables on an app's Settings tab.
---

The **Settings** tab holds everything you can change about an app.

| Section | Contains |
|---|---|
| **Identity** | Name, slug, app ID, tags |
| **Source & deploys** | Repository, branch, folder, auto-deploy, git token |
| **Runtime** | Language version, execution mode, sleep, memory, credentials, environment variables |
| **Notifications** | Email maintainers when the app breaks |
| **Data** | The app's saved data |
| **Danger zone** | Transfer ownership, delete |

## Environment variables

Set them under **Runtime → Environment variables**. They are stored encrypted and read the usual way, such as `os.environ["API_KEY"]` or `process.env.API_KEY`. Click the lock icon to make a value **sensitive**: it can be replaced but never shown again.

Saving doesn't restart the app. A **Saved, but not running yet** notice offers **Restart to apply**.

:::caution[Your app gets only three things]
Your variables, the ones Toft supplies (`PORT`, `BASE_PATH`, `TOFT_*`), and [credentials an administrator attached](../credentials/). Never your shell's environment.
:::

- **One source per key.** You can't set a key an attached credential supplies.
- **Defaults from the repository.** If the install has an environment tag such as `prod`, each deploy reads `.env.<tag>` (or `.env`) and adds variables the app doesn't have yet. It never overwrites a value set in Toft.

## Name and slug

They are separate. The slug is the end of the address, so changing it breaks the old address at once, with no redirect. Slugs starting with `_` are reserved.

## Source and runtime

Source is the repository, branch, optional folder and auto-deploy; see [From a git repository](../../deploy/from-git/). Runtime shows the exact language version the serving release resolved. Execution mode, **Never sleep** and the memory limit are visible but only an administrator can change them.

## Tags and ownership

Tags come from your administrator's [taxonomy](../../share/tags/). An app is owned by one person or one group; see [Ownership and transfer](../../share/ownership/).
