---
title: What your app learns about a viewer
description: The role header, asking who someone is, and what your app must never assume.
---

Every request Toft forwards to your app tells your app **what the caller
may do**. It does not, by default, tell your app **who they are**.

## The role

Each forwarded request carries `X-Toft-Role`, one of exactly six words:

```
unknown  anonymous  viewer  editor  owner  system  app
```

Three rules matter more than the list:

- **It is signed**, per app and per start. Verify it rather than trusting the
  header text. The SDK does this for you.
- **Absent, unverifiable and expired are one word, and that word refuses.** A
  role you cannot verify is not a weaker role; it is no role.
- **A role is not an identity.** Two people with the same role are
  indistinguishable to your app, and nothing in it tells you whether a human is
  involved at all.

The role is **not** behind the viewer-identity switch below, and it may not be
off by default: your app is always told what the caller may do.

## Asking who someone is

Where an administrator has switched it on, per app, your app can ask Toft
who the current viewer is.

- **It is off unless switched on.** Not being permitted and there being nobody
  signed in are **different answers** — `403` and `204` — and they never
  collapse into one.
- It is not available to a [static app](../../build/static/) or a rendered
  [document](../../build/notebooks/): those have no process to hold a token.
- It works on a **public** app too. A colleague who is signed in and opens a
  public app is identified to it; a visitor who is not is asked once per
  browser and then left alone, so a public app is never slower for the people
  it is public for.

```python
from toft import viewer, caller

who = viewer()          # None if nobody, refused if not permitted
role = caller()         # always available
```

## What your app must never do

**Never trust a header your app did not verify.** Anything that can reach your
app can send anything.

**Never use the role as a user id.** It is a permission word, not a person.

**Never assume a viewer exists.** Scheduled tasks, health checks and probes reach
your app with nobody behind them, and "nobody in particular" is a valid caller.

**Never enforce Toft's rules for it.** The platform refuses first. Your app
enforces its own rules, on its own screens, and does not try to re-implement
visibility or grants.

## An API key can carry a role

A key acting on your app carries one of two roles as a stored grant — bounded by
what the app's own access already allows. It can narrow what a key may do, never
widen it. From inside your app it looks like any other role.

## Groups are not sent

If your app needs to know which team somebody is on, it has to get that from
somewhere else. Toft tells your app what a viewer may *do*, not which
groups they are in.
