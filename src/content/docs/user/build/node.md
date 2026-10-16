---
title: Node and Next.js
description: What is detected, what is run, and the two things a Node app has to get right.
---

| Framework | Detected by | Started as |
|---|---|---|
| **Next.js** | `next.config.*`, or `next` in `package.json` | the framework's own server |
| **Node (generic)** | any `package.json` with a `start` script | `npm run start` |

A `build` script runs first if you have one.

## The contract

**Listen on the port in `PORT`.** Never a port of your own choosing, and never a
hard-coded one.

```js
const port = process.env.PORT || 3000;
app.listen(port);
```

**Honour `BASE_PATH`.** Your app is mounted under `/apps/your-slug`, and the
proxy strips that prefix before forwarding — so your routes are at the root, but
every URL you hand to a browser has to carry it. See [Base
paths](../base-paths/).

## Next.js

Next needs to know its base path at **build** time, so it is set for you before
the build runs. You do not have to add `basePath` to `next.config.js` yourself,
and if you do, make sure it matches your slug.

Everything else is ordinary Next: `next build`, then the framework's own server.

## Dependencies

`npm ci` when there is a lockfile, `npm install` otherwise. Commit your
lockfile — it is the difference between a reproducible build and a build that
resolves differently in three weeks.

**Toft reads `package-lock.json`.** A repository locked with pnpm
(`pnpm-lock.yaml`) or Yarn (`yarn.lock`) is not refused, but that file is passed
over: the dependency scan resolves versions from `package.json` instead, so they
can differ from the ones your lockfile pins. The build log names the file it
passed over.

**Lifecycle scripts are disabled** unless your administrator has switched them
on install-wide. A `postinstall` that fetches a binary or patches a package will
not run, and that is not something you can turn on per app. If your build
depends on one, do that work in your `build` script instead.

## A front end with no server

A Vite, Create React App or Astro repository with no `start` script is not a
Node app — there is nothing to run. Two options:

- Add a server and a `start` script.
- Commit the built output and declare it a [static site](../static/). This is
  usually the right answer, and it is cheaper to run.

Toft never runs `npm run build` for a static app, so `dist/` has to be
committed and out of your `.gitignore`.

## Version

```toml
[runtime]
node = ">=22"
```

Comparators only, never a patch version. See [Language versions](../versions/).

## What does not work

- A dev server. `next dev`, `vite`, `nodemon` — start scripts that assume a
  developer is watching.
- Writing into your own release directory expecting it to persist. A start
  replaces the tree.
- Binding to a specific host of your choosing. Bind to the address Toft
  gives you.
