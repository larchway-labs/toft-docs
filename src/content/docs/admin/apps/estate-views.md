---
title: The estate views
description: The cross-app pages, and what each one is honest about.
---

Most admin pages are about one thing. A few are about all of them, and those are
what you use when somebody asks a question about the whole install.

| View | The question | Where |
|---|---|---|
| **Usage** | Which apps are used, what they cost, which nobody has opened | Admin → Usage |
| **Languages** | Which interpreter is each app actually on | Admin → Languages |
| **Scan targets** | What addresses should a scanner be pointed at | Admin → Scan targets |
| **Processes** | What is running right now, and on what | Admin → Processes |
| **Queue** | What is building, and what is waiting | Admin → Queue |
| **Automation** | Every schedule on the install and every run it has made | Admin → Automation |
| **Dependencies** | What does this estate install, and what does policy say | Admin → Dependencies |

## Two properties they all have

**They are admin-only.** These cross every app, including ones you would not
otherwise be authorized to see individually.

**They never answer less than they know.** A cross-estate reader that quietly
omitted an app would be worse than no view at all — you would be making decisions
against a list you believed was complete.

## Coverage is about addresses, not rows

The [scan-target](../../security/scan-targets/) reader never omits an app. When
its coverage is incomplete, that is because an app has **no resolvable address** —
never because a row was skipped — and it says which.

That distinction matters when you hand the list to a security team: "we scanned
everything on this list" is only useful if you know what the list left out and
why.

## Languages counts what is serving

Every build records the version it resolved. The estate view reads those records
and counts **the release that is serving**, not the most recent build — an app
whose last build failed is still running the one before it, and that is the one
you care about when you are planning to retire an interpreter.

It folds the patch away; an app's own Runtime section carries it.

## Usage

Requests and distinct viewers per app, consumption sampled per app, active users
across the install, and the quiet list.

**A metric a backend does not measure is absent, never zero** — including one it
tried to take and could not. Blank and `0` are different facts, and comparing two
apps means respecting that.

Uptime is zero for anything not up.

## Processes

Every workload, on both backends, with its readings. Sortable, and it accounts
for what is *not* listed rather than silently showing a subset.

**A reader asks the backend's word**, never whether the backend has a row — one
of them keeps its stopped entries, and a stopped entry is not a running workload.
