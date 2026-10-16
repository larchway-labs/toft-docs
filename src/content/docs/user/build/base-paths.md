---
title: Base paths
description: The one rule that catches everybody once, and the three things that follow from it.
---

Your app is served at **`/apps/your-slug`** on the apps address. It is not at
the root of a host, and it is not on the same origin as the Toft pages you
are reading this on.

Almost every "it deployed and the page is broken" is this.

## What your app is told

| Variable | What it holds |
|---|---|
| `PORT` | The port to listen on. Never choose your own. |
| `BASE_PATH` | The prefix your app is mounted under, e.g. `/apps/reports`. |

The proxy **strips** the prefix before forwarding, so your routes are written at
the root as normal. What has to carry the prefix is anything a browser will
resolve.

## The three rules

**1. Links and form actions must carry the prefix.**

```html
<!-- wrong: asks the platform for /styles.css -->
<link rel="stylesheet" href="/styles.css">

<!-- right -->
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="{{ base_path }}/styles.css">
```

Relative URLs work everywhere and need no variable. Reach for `BASE_PATH` when
you cannot be relative.

**2. Redirects must *not* carry the prefix.**

```python
# right
return redirect("/dashboard")

# wrong: becomes /apps/reports/apps/reports/dashboard
return redirect("/apps/reports/dashboard")
```

The proxy re-adds the prefix to a `Location` header. Prefix it yourself and it
gets added twice.

Only an absolute path is prefixed. A relative `Location` — `new/`, `?page=2`,
`.` — is passed through untouched, because the browser resolves it against the
page it is already on. A cookie whose `Path` already sits under the prefix is
left alone too, so an app that knows its prefix can set one.

**3. Bind to `PORT`.** Anything else is a crash on start.

## Framework by framework

| | What to do |
|---|---|
| **Next.js** | Nothing. The base path is set before the build. |
| **Node/Express** | `app.use(process.env.BASE_PATH || '', router)`, or relative URLs. |
| **Flask / FastAPI** | Relative URLs, or `url_for`/`root_path` with `BASE_PATH`. |
| **Streamlit / marimo** | Nothing. Mounted under the prefix for you. |
| **Shiny / plumber** | Nothing for routing; relative URLs for assets. |
| **Static sites** | Set your generator's base option to `/apps/your-slug`. |

## Cookies

Any cookie your app sets is yours and survives the proxy. Every cookie the
**platform** sets is named `toft_*` — so if you see one of those, it is not
yours, and you should not read it or expect it to mean anything to your code.

## WebSockets

Upgrades pass through. A reactive Shiny output recalculates; a socket app
echoes. Point the client at the same prefixed path your page was served from.

## Why not just give every app a hostname

Because the boundary is the point. Apps are on a different origin from the
platform so that code inside an app cannot read the platform API as the person
looking at it. The prefix is what that boundary costs, and it costs you three
rules once.
