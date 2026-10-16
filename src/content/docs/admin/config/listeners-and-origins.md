---
title: Listeners, origins and proxies
description: Three listeners, two origins, trusted proxies and cookies.
---

## Listeners

| Variable | Default | Serves |
|---|---|---|
| `PORT` | `8080` | The platform |
| `APPS_PORT` | `8081` | Deployed apps, on a separate origin |
| `METRICS_ADDR` | unset | Prometheus scrape endpoint; absent unless set |

Metrics never live as a path on `:8080`, where an app's JavaScript on a
single-origin install could read them as the viewer. Keep `METRICS_ADDR` on
loopback, or set `METRICS_TOKEN`.

## Origins

| Variable | Meaning |
|---|---|
| `BASE_URL` | The platform's address, for outbound links |
| `APPS_BASE_URL` | Where apps are reached — needed only when that is a **different hostname**, not just a different port |
| `EXTRA_ORIGINS` | More browser origins trusted for write requests, beyond `BASE_URL`; also where an OAuth sign-in may return to |

`GET /api/v1/config` (unauthenticated) reports the shape this install uses, so
the web interface and the CLI read the same answer.

:::tip
Prefer a second hostname for apps. A second port is a real origin boundary, but a
hostname is easier to put TLS in front of.
:::

## Trusted proxies

`X-Forwarded-For`, `X-Real-IP`, `X-Forwarded-Proto` and `X-Forwarded-Host` are
honored **only from trusted proxies**.

```bash
TRUSTED_PROXY_CIDRS=10.0.0.0/8,192.168.1.5
```

| Value | Trusts |
|---|---|
| Unset | Loopback only |
| CIDRs or IPs, comma-separated | Those addresses |
| Set but empty | Nothing, not even loopback |

Get it wrong and every client address in the audit log and rate limiter is your
load balancer's. **Admin → System checks** warns when a forwarded header arrives
from outside the list. `X-Forwarded-Proto` is also how an app learns the browser
used HTTPS.

## Cookies

Cookies are `Secure` by default. `DEV_INSECURE_COOKIES` turns that off, for a
plain-HTTP loopback install only; System checks flags it anywhere else. Every
platform cookie is named `toft_*`; any other cookie on the apps origin belongs to
an app.

## robots.txt

The platform origin serves `User-agent: *` / `Disallow: /`. The apps origin has
none — what apps tell crawlers is up to them.
