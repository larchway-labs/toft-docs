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

Your app is served under `/apps/<slug>`. For a plain Node app the proxy strips
that prefix, so routes stay at `/`, but URLs you send to the browser must carry
it. `BASE_PATH` holds it. See [Base paths](../base-paths/).

**Next.js needs nothing.** Toft sets `basePath` in your Next config before the
build, merged over whatever your config exports.

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

Node is matched on the major version. See [Language versions](../versions/).

## What doesn't work

- Dev servers as `start`: `next dev`, `vite`, `nodemon`.
- Writing into your app's directory and expecting it to persist. A restart
  replaces the tree; use [app storage](../../data/app-storage/).
