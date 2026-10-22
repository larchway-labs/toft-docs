---
title: Who is asking
description: caller, who and viewer — what a request may do, who sent it, and acting on their behalf.
---

Three calls answer three different questions.

| Call | Question | Round trip | Anonymous visitor |
|---|---|---|---|
| `caller(headers)` | What may they do? | No | Role `anonymous` |
| `who(headers)` | Who are they? | Yes | `None` / `null` |
| `viewer(headers)` | Act as them | On use | Raises |

## `caller`: what they may do

```python
c = toft.caller(request.headers)
if not c.at_least(toft.ROLE_EDITOR):
    abort(403)
```
```js
const c = toft.caller(req.headers);
if (!c.atLeast(toft.ROLE_EDITOR)) return res.status(403).end();
```
```go
c := toft.CallerFor(r.Header)
if !c.AtLeast(toft.RoleEditor) { … }
```
```r
caller_role(req$HEADERS)                 # "editor", "viewer", ... or "unknown"
caller_can(req$HEADERS, "editor")        # TRUE / FALSE
```

The role arrives signed on every request and is verified locally against
`TOFT_ROLE_KEY`. It never fails: a missing, invalid or expired role reads as
`unknown`, and every `at_least` check on it is false. Use this in request
handlers. See [The six roles](../../reference/roles/).

## `who`: who they are

```python
me = toft.who(request.headers)           # Identity, or None
if me and (me.role == "owner" or me.is_admin):
    render_admin_tab()
if me and "finance" in me.group_names:
    render_approvals()
```
```js
const me = await toft.who(req.headers);
if (me?.role === "owner" || me?.isAdmin) renderAdminTab();
```
```go
me, err := toft.Who(ctx, r.Header)       // *Identity, or nil
```
```r
me <- viewer(req$HEADERS)                # a list, or NULL
```

An identity has `id`, `name`, `email`, `role`, `is_admin` and `groups`. It returns nothing
for an anonymous visitor, because that is an answer, not an error.

It also returns nothing for a request made with an **API key** — `toft fetch`,
`curl` with a key. Toft lets the key in as its owner but tells the app no
person is behind it, and `viewer(headers)` refuses for the same reason. To test
this code from a terminal, `toft fetch --session` sends the request as a
signed-in browser (see [The administrator's session](../../cli/signing-in/#the-administrators-session)).

It fails for one reason: a signed-in person is looking and viewer identity is not
switched on for this app. That is an administrator's setting, not a state to
branch on. With nobody on the request — anonymous, or an API key — it returns
nothing whatever the setting; `toft.app.can("viewer.identity")` reads the
setting itself.

- `role` is `owner`, `editor` or `viewer` on this app in Toft. A rule about your
  own domain, such as who approves invoices, belongs on groups.
- `is_admin` is separate. Administrators effectively own every app, so gating on
  `role == "owner"` alone would include all of them.
- `email` is empty on a public app.

Answers are cached for 60 seconds. Pass `refresh=True` (Node `{ refresh: true }`,
Go `WhoNow`) to bypass.

## `viewer`: act as them

```python
me = toft.viewer(request.headers)
me.jobs.start("reconcile", params={"month": month})
```
```js
const me = toft.viewer(req.headers);
await me.jobs.start("reconcile", {});
```
```go
me, err := toft.ViewerFor(r.Header)
me.Jobs.Start(ctx, "reconcile", opts)
```

```r
viewer_jobs(req) |> job_start("reconcile", params = list(month = month))
```

Work started through `viewer()` is recorded in that person's name. It raises
`no_viewer` when no one is signed in, rather than silently acting as the app.
Toft adds no role check of its own: declaring the job allows your app to start
it, and whether this person may press the button is your app's rule. Answer
the request with `toft.jobs.respond(run)`; see [Jobs](../jobs/#respond-dont-wait).

## Your app enforces its own rules

The platform tells your app what the caller may do; it does not enforce anything
inside your app. Protect your own admin screens.

- **Never trust a raw header.** Anything that can reach your app can send one.
  `caller()` verifies the signature.
- **A role is not an identity.** It doesn't say who, or whether a human is there.
- **A Toft administrator with no grant on your app reads as `viewer`.** Use
  `who` to see `is_admin`.
