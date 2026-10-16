---
title: Listeners, origins and proxies
description: Three ports, two origins, and the headers you have to declare.
---

## Three listeners

| Port | Serves |
|---|---|
| `:8080` (`PORT`) | The platform. |
| `APPS_PORT` | Deployed apps. A different origin. |
| `METRICS_ADDR` | The Prometheus scrape endpoint. Absent unless set. |

The metrics endpoint **never lives as a path on `:8080`**. On a single-origin
install an app's JavaScript would be able to read a metrics path as the viewer,
so it gets a listener of its own or nothing at all. Loopback by convention, with
`METRICS_TOKEN` when it is not.

## Two origins

`BASE_URL` is the platform's address. `APPS_BASE_URL` is where apps are reached,
and it is only needed when that is a **different hostname** rather than a
different port.

Both shapes are supported, and `/api/v1/config` reports which one this install
actually uses, unauthenticated, so every client — the SPA, the CLI — bootstraps
from the same answer rather than deriving one.

**Prefer a second hostname.** A second port is a real origin boundary as far as
a browser is concerned, but a second hostname is easier to put TLS in front of
and easier to explain.

## Trusted proxies

`X-Forwarded-For`, `X-Real-IP`, `X-Forwarded-Proto` and `X-Forwarded-Host` are
believed **only from a proxy you have declared trusted**.

```
TRUSTED_PROXY_CIDRS=10.0.0.0/8,192.168.1.5
```

Defaults to loopback, so a proxy on the same machine needs nothing. Set it when
the proxy dials from somewhere else — another host, a load balancer, an ingress.

**Present but empty means trust nothing, not even loopback.**

Get this wrong and every client address in your audit log and your rate limiter
is your load balancer's. The [checks page](../../operate/checks/) catches it from
the request that asked: a forwarded header arriving from outside the list is a
warning.

`X-Forwarded-Proto` is also how a deployed app learns the browser was on HTTPS
while the app itself was reached over plain HTTP inside your network.

## Extra origins

`EXTRA_ORIGINS` adds browser origins trusted for write requests, on top of
`BASE_URL`. It also decides where an OAuth sign-in returns to.

## Cookies

Cookies carry the `Secure` flag by default. `DEV_INSECURE_COOKIES` turns that
off and is **only** for a plain-HTTP loopback install — the checks page names it
out loud on anything else.

Every cookie the platform sets is named `toft_*`. Any other cookie name on
an app's origin is the app's own, which is how the two are told apart with no
ambiguity.

## robots.txt

The platform origin serves `User-agent: * / Disallow: /`. The apps gateway has no
such route — what your apps say to a crawler is theirs to decide.
