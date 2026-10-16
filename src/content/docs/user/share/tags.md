---
title: Tags
description: Label your app with your install's tags so people can browse and filter the estate.
---

Your administrator defines the tags, such as `team`, `environment` or `data-classification`, and the values each one allows. You pick values for your app under **Settings → Tags**. You cannot type a new value; if one you need is missing, ask your administrator.

## Browsing by tag

| Page | Shows |
|---|---|
| `/tags/<tag>` | The values of one tag. |
| `/tags/<tag>/<value>` | Every app with that value. |

Both pages are linkable, so a URL such as `/tags/team/payments` works in a runbook. The app list filters by tag too.

## The framework tag

Toft sets a `framework` tag on every app from what it detected at build time. You cannot edit it.

:::tip
Tag every app you own. Tags are what make questions like "which apps touch customer data?" answerable across the whole install.
:::
