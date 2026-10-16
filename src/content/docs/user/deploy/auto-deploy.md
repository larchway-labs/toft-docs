---
title: Deploying on every push
description: Turn on auto-deploy and Toft rebuilds your app when its branch gets a new commit.
---

Turn on **Settings → Source & deploys → Auto-deploy on push**. New commits on
the tracked branch deploy within about a minute.

Only apps built from a git repository can auto-deploy. Apps from the gallery
cannot while they are linked to it.

## How it notices

Toft checks each auto-deploying app's branch on an interval your administrator
sets. If your administrator has connected your git host with a webhook, a push
triggers that check immediately. Nothing to configure per app.

## What it deploys

The head of the tracked branch (and the app's folder, if set) — the same as
selecting **Redeploy**. It goes through the same source rules and
[dependency policy](../../run/dependencies/) as any deploy.

:::caution[Monorepos]
A push to any folder of the repository rebuilds every auto-deploying app on
that branch, not only the app whose folder changed.
:::

## When a deploy fails

- The serving release stays where it was. The failure appears in the app's
  [events](../../run/events/).
- Toft does **not** retry the same commit. Push a fix, or select **Redeploy**.
- A [locked](../../run/locked/) app refuses auto-deploys like any other deploy.

## When to use CI instead

Auto-deploy does not run tests. If a push should pass checks first, have your
CI run `toft deploy` or `toft redeploy` at the end, with a
[deploy key](../../cli/api-keys/).
