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

Declare them in [`toft.toml`](../../build/toft-toml/#env), one key each, and mark the secrets:

```toml
[env]
DB_HOST     = "db.internal"          # visible, with a default
API_URL     = {}                     # visible, no default
LOG_LEVEL   = { default = "info" }   # visible, with a default
DB_PASSWORD = { sensitive = true }   # sensitive, never a default
```

Each deploy adds any variable the app doesn't have yet, with the file's default and flag. A secret shows up here as **not set** until someone fills it in; it can never have a default in the file. Nothing else changes: a value already set is kept, and a variable you remove from the file stays on the app until you delete it. A name an attached credential supplies is skipped. An unfilled variable reaches the app as an empty string.

## Different environments

Toft has no environment switch inside an app. Each environment is its own app,
with its own variables: `sales-dashboard-dev` and `sales-dashboard` on one
install, or the same app on a staging install and a production install. The
code is the same everywhere; only the values differ.

Declare the names once in `toft.toml`, so every environment's app asks for the
same variables:

```toml
[env]
APP_ENV     = { default = "production" }
LOG_LEVEL   = { default = "info" }
API_URL     = {}
DB_PASSWORD = { sensitive = true }
```

Keep one dotenv file per environment beside your code, and out of git:

```bash
# .env.dev
APP_ENV=dev
LOG_LEVEL=debug
API_URL=https://api-dev.example.com
```

```bash
# .env.production
APP_ENV=production
LOG_LEVEL=info
API_URL=https://api.example.com
```

`toft deploy` never uploads these files, so nothing reaches an app until you
send it.

### Two apps on one install

Name the app with `--app` for each environment:

```bash
toft env set --from-file .env.dev        --app sales-dashboard-dev
toft env set --from-file .env.production --app sales-dashboard

# Secrets are piped in, so they stay out of your shell history
printf 'DB_PASSWORD=%s\n' "$DEV_DB_PASSWORD"  | toft env set --from-file - --sensitive --app sales-dashboard-dev
printf 'DB_PASSWORD=%s\n' "$PROD_DB_PASSWORD" | toft env set --from-file - --sensitive --app sales-dashboard

toft restart --app sales-dashboard-dev   # applies the change
toft env list --app sales-dashboard-dev
```

### A staging install and a production install

Give the app a slug per install in `toft.toml` (`toft link --install` writes
this), then choose the install with `--install`:

```toml
[app]
slug = "sales-dashboard"

[app.installs."https://staging.toft.example.com"]
slug = "sales-dashboard-stg"
```

```bash
toft env set --from-file .env.staging    --install https://staging.toft.example.com
toft env set --from-file .env.production --install https://toft.example.com
```

### Reading them in your app

Read the values, not the name of the environment, so a new environment needs no
code change. Fall back to a local value for running on your own machine. A
variable declared in `[env]` but never filled arrives as an empty string, so
treat empty as missing:

```python
import os
api_url = os.environ.get("API_URL") or "http://localhost:5000"
debug = os.environ.get("LOG_LEVEL") == "debug"
```

```js
const apiUrl = process.env.API_URL || "http://localhost:5000";
```

```r
api_url <- Sys.getenv("API_URL")
if (!nzchar(api_url)) api_url <- "http://localhost:5000"
```

## Name and slug

They are separate. The slug is the end of the address, so changing it breaks the old address at once, with no redirect. Slugs starting with `_` are reserved.

## Source and runtime

Source is the repository, branch, optional folder and auto-deploy; see [From a git repository](../../deploy/from-git/). Runtime shows the exact language version the serving deployment resolved. Execution mode, **Never sleep**, the memory limit and the CPU limit are visible but only an administrator can change them. Each limit says how it is held on this install — enforced, sampled by a watchdog, or not enforced — and the CPU limit shows how much of the last hour the app spent held at it. A CPU limit is an amount of CPU time, not a set of cores: an app over it is slowed, not restarted. The app's limits don't apply to its jobs; see [Schedule work with jobs](../../automation/jobs/).

## Tags and ownership

Tags come from your administrator's [taxonomy](../../share/tags/). An app is owned by one person or one group; see [Ownership and transfer](../../share/ownership/).
