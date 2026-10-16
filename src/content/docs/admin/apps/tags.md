---
title: Tags
description: The taxonomy the estate is filed under, and who may add to it.
---

Tags are how a Toft estate gets browsed. **You define the tags and their
allowed values**; app owners choose among them.

Admin → Tags.

## Owners choose, they do not invent

That is the whole design decision. A taxonomy where everyone types their own
value is a free-text field with extra steps, and browsing by it means nothing.

The cost is that "please add a value" becomes a request you receive. Answer it
quickly; the alternative is people leaving tags blank.

## A taxonomy that works

Four or five tags, each with a closed and short list:

| Tag | Values |
|---|---|
| `team` | Your actual teams |
| `environment` | `prod`, `staging`, `sandbox` |
| `data` | `public`, `internal`, `confidential`, `regulated` |
| `criticality` | `tier-1`, `tier-2`, `tier-3` |

The test for a good tag: **somebody will one day have to answer a question about
every app at once**, and the tag is what makes it answerable without a
spreadsheet. Which apps touch regulated data. Which belong to a team that no
longer exists. Which have to be reviewed before an audit.

A tag that answers no such question is a tag nobody fills in.

## Framework is maintained for you

Toft keeps a `framework` tag itself, from what detection decided. Nobody can
edit it, which makes it the honest answer to "what is this written in" rather
than what somebody typed a year ago.

## Browsing

`/tags/<tag>` and `/tags/<tag>/<value>` are ordinary pages that survive a
refresh, so they are linkable. A `team/payments` URL is a reasonable thing to put
in a runbook.

Value listings carry counts, so an unused value is visible as one.

## Getting them filled in

Tags are only useful if the apps are tagged, and nothing forces an owner to
choose. What works, in order:

1. Keep the list short enough that choosing is obvious.
2. Tag the apps you already know about yourself. Most estates have twenty apps
   and four teams.
3. Use the counts to find the gap, and ask.
