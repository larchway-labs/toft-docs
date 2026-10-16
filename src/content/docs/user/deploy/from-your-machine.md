---
title: From your machine
description: Pushing the working tree with toft deploy, and what actually gets sent.
---

```bash
toft deploy
```

Run from inside your project. It sends what is on your disk **right now** —
uncommitted changes included, nothing pushed to a git host, no commit required.

This is the fast loop while you are still working something out. The full
client reference is in the **CLI and SDK guide**; what follows is what matters
when you are deploying.

## Getting `toft`

```bash
toft login https://toft.your-company.com
```

Installing it and signing in are on [Installing toft](../../cli/installing/).

## Which app it deploys to

```toml
# toft.toml, at the root of your project
[app]
slug = "phase-test"
```

`toft link` writes that for you and checks the slug against the install first, so
a typo fails at link time rather than at deploy time. `--app <slug>` overrides
it for one invocation.

## What gets sent

**`.gitignore` decides.** Every `.gitignore` in the tree, with `!` negations
honoured, plus `.git/info/exclude`. `.toftignore` adds to that; it never
replaces it.

`toft` does **not** shell out to git, so this works in a plain folder that was
never a repository.

Always dropped: `.git/`, `.hg/`, `.svn/`, `node_modules/`, `venv/`, `.venv/`,
`__pycache__/`, `*.pyc`, `.DS_Store`.

Dropped **only when the tree root has a `package.json`**: `dist/`, `build/`,
`out/`, `.next/`, `.nuxt/`, `.svelte-kit/`. That is the right bet for a Node
project and the wrong one for a static site — so a `[static] root` pointing
inside one of those wins, and your `dist/` ships.

:::note
`toft deploy` does not convert your app. Deploying from your machine to an app
created from a git repository does not detach it from that repository or change
how it updates.
:::

## Watching it

`toft deploy` streams the build log and exits with the deploy's outcome. If you
lose the terminal, `toft deploy --watch <deployID>` rejoins the same build.

Exit codes are a contract, and the two that matter in CI are different failures:
**1** means the platform built your code and the build failed; **3** means your
credential was refused.

## In a pipeline

```bash
export TOFT_URL=https://toft.your-company.com
export TOFT_TOKEN_FILE=/run/secrets/toft
toft deploy --app reports
```

There is no `--token` flag, on purpose: a secret on a command line lands in
your shell history and in the process table. A credential and an address are
one statement — `TOFT_TOKEN` is used only alongside `TOFT_URL`, and
every other combination is refused naming both halves.

Use a [deploy key](../../cli/api-keys/) rather than your personal one, so the
pipeline does not stop working when you leave.
