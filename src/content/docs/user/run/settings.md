---
title: Settings and environment variables
description: Renaming, source, variables, runtime and tags — everything on the Settings tab.
---

## Environment variables

How you configure an app without putting anything in the repository.

Set them on the **Settings** tab. They are stored encrypted, handed to your app
when it starts, and read the ordinary way — `process.env.DATABASE_URL`,
`os.environ["API_KEY"]`, `Sys.getenv("TOKEN")`.

**Mark a value sensitive** and it is write-only: it goes to your app and never
comes back to a browser, to you or to anybody else. You can replace it; you
cannot read it.

### A change takes effect at the next start

Editing a variable does not restart a running app. While a saved value has not
reached the running process, the app page says so with a banner naming what is
saved versus what is running. Restart when you want the new value picked up.

:::caution
Your app is given exactly three things: **the variables you set**, **the
contract variables Toft supplies** (`PORT`, `BASE_PATH`, its own token and
a few more), and **credentials an administrator attached**. Nothing else.

It never inherits the platform's own environment — so a variable that works on
your laptop because it was already in your shell will not be there.
:::

### A key can only have one source

If an administrator has [attached a credential](../credentials/) that supplies
`DATABASE_URL`, you cannot also set `DATABASE_URL` yourself. The write is
refused, naming the key and what already supplies it, rather than one silently
winning.

### Environment defaults per tag

On a multi-environment install, a `.env.<tag>` file in your repository supplies
defaults for the environment this install is. Your own variables still win.

## Renaming

Changing the name changes the slug, and the slug is the URL. Anything pointing
at the old address stops working — Toft does not keep a redirect.

A slug starting with `_` is refused: that namespace belongs to apps Toft
installs itself, like the guide you are reading.

## Source

Where the code comes from: repository, branch, subdirectory, and whether
auto-deploy is on. See [From a git repository](../../deploy/from-git/).

## Runtime

How this app runs, and what it runs with:

- **Execution mode**, where your install offers a choice.
- **The language version this release actually resolved**, down to the patch.
  This is the app that is serving, not your last attempt.

## Tags

The values your administrator's [taxonomy](../../share/tags/) offers. Tags are
how the estate gets browsed, so filling them in is a favour to whoever has to
answer a question about every app at once.

## Ownership

An app is owned by a person or by a group — never both, never neither. Moving it
to a group is how you stop being the only one who can change it. See
[Ownership and transfer](../../share/ownership/).

## Deleting

Type-to-confirm, because it is not reversible. It removes the releases, the
workload and the storage attachments — but **not the data in a store**.
