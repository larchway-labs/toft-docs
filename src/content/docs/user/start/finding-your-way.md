---
title: Finding your way around
description: The pages you will actually use, and what each one answers.
---

Toft has more screens than you need. These are the ones that matter to
somebody deploying apps.

## The app list

The front door once you are signed in. It has two halves:

- **Mine** — apps you can open. Yours, plus anything shared with you. This is
  where you land.
- **All apps** — every app on this install that you are allowed to *see the
  name of*, which on many installs is all of them.

An app in **All apps** that is not in **Mine** is one you can see and cannot
open. That is deliberate: it is what makes it possible to
[ask the owner for access](../../share/requesting-access/) instead of asking
around the office for the URL.

Filter by status, by owner, by [tag](../../share/tags/), or by whether you can
open it.

## An app's page

Everything about one app. Tabs appear according to what you are allowed to do
and what this install has configured — a tab for a capability your install does
not have is **absent**, not greyed out.

| Tab | What it answers |
|---|---|
| **Overview** | Is it running, what is its URL, what did the last deploy do, and what needs attention. |
| **Logs** | What the process is printing, and the build log of any deploy. |
| **Deployments** | Every deploy, the release that is serving, and rollback. |
| **Usage** | Who has opened it, how often, and what it is consuming. |
| **Dependencies** | What it installs, and what your install's policy thinks of it. |
| **Automation** | Scheduled tasks and jobs. |
| **Integrations** | What this app may send outward, and where. |
| **Access** | Visibility, the people and groups you have shared it with, and anyone waiting for access. |
| **Settings** | Name, slug, source, environment variables, runtime, tags, deletion. |

## Your own pages

Under **Me**:

- **Overview** — who you are, your role, what you may do.
- **Access** — everything you can reach on this install, in one list. The
  fastest answer to "do I actually have access to that?"
- **Credentials** — your [API keys](../../cli/api-keys/).
- **Security** — your sign-in history, and the button that ends every session
  you have anywhere.
- **Storage** — [stores](../../data/browsing-a-store/) you hold a grant on.

## The command palette

`⌘K` (`Ctrl-K` on Windows and Linux) opens a search across pages, apps and
settings. It is the fastest way to reach anything named in this guide.

Type the words you know a thing by, in any order: `idle sleep` finds **Sleep
idle apps after** just as `sleep idle` does. A setting's own name finds the
control itself, wherever it is rendered, and lands you on it.

## Documentation

The **Documentation** page lists the guides installed here — this one, the admin
guide, the CLI and SDK guide — and, if your administrator has picked one, your
organization's own handbook.

That handbook also appears as a link at the end of the header on every page. It
is the only item in the navigation that leaves Toft.
