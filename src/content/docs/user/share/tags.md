---
title: Tags
description: The taxonomy your install defines, and why filling it in is worth your time.
---

Tags are how a Toft estate gets browsed. Your administrator defines the
**tags** and their allowed **values**; you set values on your app's Settings
tab.

A typical taxonomy: `team`, `environment`, `data-classification`, `criticality`.

## You cannot invent a value

Tags and their values are the administrator's. You choose among them; you do not
type a new one. That is what makes browsing by tag mean anything — a taxonomy
where everyone invents values is a free-text field with extra steps.

If a value you need is missing, ask for it. That is a normal request.

## Browsing

`/tags/<tag>` lists the values in a tag; `/tags/<tag>/<value>` lists the apps
carrying it. Both are ordinary pages that survive a refresh, so they are
linkable — a `team/payments` URL is a reasonable thing to put in a runbook.

The app list filters by tag too.

## Framework is a tag you do not set

Toft maintains a `framework` tag itself, from what detection decided. You
cannot edit it, and it is the honest answer to "what is this app written in"
rather than what somebody typed a year ago.

## Why bother

Because somebody will eventually have to answer a question about every app at
once — which apps touch customer data, which belong to a team that no longer
exists, which have to be reviewed before an audit.

Tags are the only mechanism that makes those questions answerable without a
spreadsheet, and they are only useful if the apps are actually tagged.
