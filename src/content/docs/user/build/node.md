---
title: Node and Next.js
description: How Node and Next.js apps are detected, built and started.
---

| Framework | Detected by | Started with |
|---|---|---|
| **Next.js** | `next.config.js`/`.mjs`/`.ts`, or `next` in `package.json` | `next start` |
| **Node** | `package.json` with a `start` script | `npm run start` |

If `package.json` has a `build` script, it runs during the deploy.

## The contract

Listen on `PORT`, bound to `HOST`. Toft sets both.

```js
app.listen(process.env.PORT, process.env.HOST);
```

Pass `HOST`. `app.listen(port)` alone binds every interface, where on an
install that runs apps on its own host the app can be reached without going
through Toft's sign-in. The build warns about it on every Node deploy.

Your app is served under `/apps/<slug>`. For a plain Node app the proxy strips
that prefix, so routes stay at `/`, but URLs you send to the browser must carry
it. `BASE_PATH` holds it. See [Base paths](../base-paths/).

**Next.js needs nothing.** Toft sets `basePath` in your Next config before the
build, merged over whatever your config exports.

## Environment variables

Read them from `process.env`. `toft deploy` doesn't upload `.env` or any
`.env.*` file (`.env.example` and `.env.sample` still go), so Next.js and
`dotenv` find none on the install. Set the values on the app instead, with the
Settings tab or `toft env set --from-file .env.production`. `dotenv` never
overrides a variable that is already set, so code that loads a `.env` locally
keeps working unchanged. To make sure every install asks for the variables your
app needs, list them under [`[env]` in `toft.toml`](../toft-toml/#env).

## Dependencies

| Repository has | Toft runs |
|---|---|
| `package-lock.json` | `npm ci` |
| no `package-lock.json` | `npm install` |

Only `package-lock.json` is honored. With a `pnpm-lock.yaml` or `yarn.lock`,
versions resolve from `package.json`, and the build log names the lockfile it
passed over.

:::caution
Dependency lifecycle scripts (`postinstall` and similar) don't run unless your
administrator has enabled them for the whole install. Move that work into your
`build` script.
:::

## A front end with no server

A Vite, Create React App or Astro project with no `start` script has nothing to
run. Commit the build output and serve it as a [static site](../static/), or
add a server and a `start` script.

## Version

```toml
# toft.toml
[runtime]
node = ">=22"
```

Node is matched on the major version. See [Language versions](../versions/). `engines.node` and `.nvmrc` are
not read; a tree that pins only there gets a `node_version_unread` warning.

## What doesn't work

- Dev servers as `start`: `next dev`, `vite`, `nodemon`.
- Writing into your app's directory and expecting it to persist. A restart
  replaces the tree; use [app storage](../../data/app-storage/).
