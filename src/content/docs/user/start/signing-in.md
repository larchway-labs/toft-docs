---
title: Signing in
description: How you get an account on a Toft install, and what to do when you cannot.
---

How you sign in is your administrator's decision, not a setting you control.
An install can offer any of these, and usually offers one:

- **Your organization's single sign-on** (OIDC) — the button says whatever your
  administrator named it.
- **GitHub.**
- **A username and password** held by Toft itself. Usually only the
  built-in administrator account, kept for emergencies.

If the sign-in page offers a button you do not recognize, that is the one your
organization uses. Ask internally rather than trying to create an account —
there is no self-service sign-up.

## You do not get an account by deploying

Someone has to give you one, or your sign-in provider has to be configured to
let your directory account through. Deploying an app is something you do
*after* you can sign in, never before.

## Your account may exist before it lets you in

Some installs provision an account on your first sign-in and then hold it until
an administrator activates it. If that is how yours is set up, you will be
turned away with a message your administrator wrote, on **every** attempt, not
just the first — and an administrator is told once that you are waiting.

That is not a failure and retrying will not help. Wait for the activation, or
ask.

## What you can do once you are in

Every account has one **system role**, and it decides whether you can create
apps at all.

| Role | Can |
|---|---|
| **Viewer** | Open apps shared with them. Cannot create one. |
| **Publisher** | Everything a viewer can, plus create, deploy and own apps. |
| **Administrator** | Runs the install. |

If you signed in and there is no **New app** button, you are a viewer. You can
[ask to become a publisher](../../account/becoming-a-publisher/) from your own
account page.

## Sessions

A session has two clocks: how long you can be idle before it ends, and how long
it can live in total no matter how active you are. Your administrator sets
both, so "I was signed out overnight" and "I was signed out mid-afternoon" are
both normal and both configurable — by them, not by you.

Signing in again is the whole fix. If it happens constantly, that is worth
raising with your administrator.

## When you cannot get in

Toft has no "forgot password" email unless your administrator turned mail
on *and* you sign in with a Toft password rather than SSO. Everything
else — a disabled account, an expired directory account, a provider that was
switched off, an account waiting for activation — is theirs to fix.

You can see your own sign-in history under
[**Me → Security**](../../account/your-account/), which is the fastest
way to answer "did that even reach the install?"
