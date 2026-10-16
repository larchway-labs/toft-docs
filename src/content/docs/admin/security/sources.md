---
title: Trusted app sources
description: Constraining where code may come from — and nothing else.
---

This constrains the **provenance** of an app — where its code came from — and
nothing else.

## What it is not

It says nothing about what an app *does* once it is running. An app from an
approved source is not safer at runtime than one from anywhere else; it is merely
from a place you decided to trust.

Every sentence of copy about this feature has to survive that distinction, and so
does every conversation about it.

## How it works

An **allowlist or a blocklist** of git hosts and paths, on Admin → Sources. One
resolver, and the matcher is pure.

Seven enforcement points, and that list is the whole specification.

You can **preview** a policy before saving it, see **what the estate actually
uses**, and see **what the policy resolves to**. Use all three before you save:
the observed list is usually shorter and more surprising than people expect.

## Two switches that are not this one

**Archive uploads** — `source_uploads_enabled` — are a different switch, and the
two ZIP routes are **not** among the seven enforcement points. Turning the source
policy on does not stop somebody uploading a folder. Publishing from RStudio is an
upload too, so this switch governs it — see
[Publishing from RStudio](../../capabilities/rstudio-publishing/).

**Extensions-only mode** restricts the gallery, not the source policy.

## Changing it

**A settings change never takes down running code.** Tightening the list does not
stop apps deployed under the old one. It gates the next deploy.

**A refused source is stated on the app's page**, as a banner, so the owner finds
out where they are rather than in a log.

## Connected git hosts

A connected git host is a **held credential**: Toft holds it, developers
never see it, and **a developer is never told which auth method was used**.

See [Connected git hosts](../git-connections/).

**No key may attach one.** An API key cannot connect a git host, because that
would be a key managing a credential.

**Coverage is checked at the write, never at the clone.** You find out that a
source is not covered when you configure it, not at 3am during a deploy.

## What to set it to

The honest default for most installs is an **allowlist of your own git host's
organizations**. That is one line, it is the thing everybody assumed was true
anyway, and it makes "somebody deployed from their personal GitHub" a refusal
rather than a discovery.

Going finer than that — path-level rules — is worth it only when you have a
reason you could write down.
