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

Set them under **Runtime → Environment variables**, or from a terminal with [`toft env set`](../../../cli/cli/commands/#toft-env). They are stored encrypted and read the usual way, such as `os.environ["API_KEY"]` or `process.env.API_KEY`. Click the lock icon to make a value **sensitive**: it can be replaced but never shown again. A sensitive variable with no value yet shows **not set**. Removing a row deletes the variable.

Saving doesn't restart the app. A **Saved, but not running yet** notice offers **Restart to apply**.

A rendered document — a notebook, Quarto or R Markdown app — reads its variables when it is rendered, at deploy, so a change reaches its page at the next deploy, not a restart. A job reads them at its next run.

:::caution[Your app gets only three things]
Your variables, the ones Toft supplies (`PORT`, `BASE_PATH`, `TOFT_*`), and [credentials an administrator attached](../credentials/). Never your shell's environment.
:::

- **One source per key.** You can't set a key an attached credential supplies.
- **Names are letters, digits and underscores**, not starting with a digit. Anything else is refused.
- **Toft's own names are refused**, because Toft sets them itself and your value would never reach the app: `PORT`, `HOST`, `BASE_PATH`, `TMPDIR`, `VIRTUAL_ENV`, `R_LIBS_SITE` and the `TOFT_*` variables it sets. See [Environment variables](../../../cli/reference/environment/) in the CLI & SDK guide. A variable you saved before this rule keeps working and doesn't block saving the rest.
- **`.env` files are not read.** Toft never takes values from a file in the repository, and `toft deploy` doesn't upload `.env` or `.env.*` at all. To send a file's values, run `toft env set --from-file .env`.

## Declaring the variables your app needs

List the names in [`toft.toml`](../../build/toft-toml/#env) — names only, never values:

```toml
[env]
names = ["DB_PASSWORD", "API_TOKEN", "DB_HOST"]
```

Each deploy adds any name the app doesn't have yet as an empty, sensitive variable, so it shows up here as **not set** until someone fills it in. Nothing else changes: a value already set is kept, and a name you remove from the list stays on the app until you delete it. A name an attached credential supplies is skipped. An unfilled variable reaches the app as an empty string.

If a declared variable isn't a secret, such as `DB_HOST`, type its value and open the lock, or run `toft env set --visible DB_HOST=…`.

## Name and slug

They are separate. The slug is the end of the address, so changing it breaks the old address at once, with no redirect. Slugs starting with `_` are reserved.

## Source and runtime

Source is the repository, branch, optional folder and auto-deploy; see [From a git repository](../../deploy/from-git/). Runtime shows the exact language version the serving deployment resolved. Execution mode, **Never sleep**, the memory limit and the CPU limit are visible but only an administrator can change them. Each limit says how it is held on this install — enforced, sampled by a watchdog, or not enforced — and the CPU limit shows how much of the last hour the app spent held at it. A CPU limit is an amount of CPU time, not a set of cores: an app over it is slowed, not restarted. The app's limits don't apply to its jobs; see [Schedule work with jobs](../../automation/jobs/).

## Tags and ownership

Tags come from your administrator's [taxonomy](../../share/tags/). An app is owned by one person or one group; see [Ownership and transfer](../../share/ownership/).
