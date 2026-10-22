---
title: Base paths
description: Your app is served under /apps/<slug>. Here's what that means for links, redirects and cookies.
---

Your app is served at `/apps/<slug>` on the apps address, not at the root of a
host. Most "it deployed but the page is broken" problems come from this.

## What your app is given

| Variable | Holds |
|---|---|
| `PORT` | The port to listen on. |
| `HOST` | The address to bind to. |
| `BASE_PATH` | The prefix, e.g. `/apps/reports`. |

For most frameworks the proxy strips the prefix before forwarding, so your
routes stay at `/`. Next.js, Streamlit and marimo are configured with the
prefix and receive it unchanged.

## Links carry the prefix

Anything the browser resolves — links, form actions, script and stylesheet
URLs — must land under the prefix.

```html
<!-- wrong: requests /styles.css, outside your app -->
<link rel="stylesheet" href="/styles.css">

<!-- right -->
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="{{ base_path }}/styles.css">
```

Relative URLs work everywhere. Use `BASE_PATH` when you can't be relative.

## Redirects don't need to

The proxy adds the prefix to an absolute-path `Location` header, so you can
redirect as if your app were at the root, in every framework:

```python
return redirect("/dashboard")               # right
return redirect("/apps/reports/dashboard")  # also right: never prefixed twice
```

A `Location` that already carries the prefix, from `url_for` or a framework's
own helpers, is left as it is. Relative redirects (`new/`, `?page=2`) pass
through untouched.

## By framework

| Framework | What to do |
|---|---|
| Next.js | Nothing. `basePath` is set before the build. |
| Streamlit, marimo | Nothing. |
| FastAPI | Nothing. `root_path` is set, so `url_for` includes the prefix. |
| Flask | Relative URLs, or wrap with `ProxyFix(app.wsgi_app, x_prefix=1)` so `url_for` reads the `X-Forwarded-Prefix` header. |
| Node, Go, plain Python | Relative URLs, or prefix with `BASE_PATH`. |
| Shiny, plumber | Nothing for routing; keep asset URLs relative. |
| Static sites | Set your generator's base option. See [Static sites](../static/). |

## Cookies and WebSockets

Cookies your app sets are scoped to its own path. The platform's sign-in
cookies (`toft_*`) are removed before requests reach your app.

WebSockets pass through. Connect to the same prefixed path the page was served
from.
