---
title: Scan targets and security.txt
description: Handing a security team a list of what to point a scanner at.
---

Toft publishes **what to scan** and **how to be contacted**. It does not
scan.

## The reader

Admin → Scan targets lists the apps on this install with their addresses, so a
scanner can be pointed at them.

**The reader never omits an app.** When its coverage is incomplete, that is about
*addresses* — an app with no resolvable address, because nothing has been
deployed to it — and never about rows it skipped. It tells you which.

That is the difference between "here is everything" and "here is everything we
could construct a URL for", and a security team needs the second sentence.

## One construction of an address

An app's address is built in one place. On a split-origin install the list
reports the **apps** origin, which is where a scanner should actually go.

The visibility on a row is the **effective** one — after [anonymous
access](../anonymous/) and [reachability](../reachability/) have had their say —
so the list does not claim an app is public when the install is not publishing.

## Who may read it

A **deploy key** may. It is the only route under `/admin` that either key scope
reaches, and that is deliberate: a CI-driven scan should not need a person's
credential.

An **`lp_` app key may not.** An app key is a grant on one app; the estate is not
one app.

## A scan is never usage

`X-Toft-Scan: 1` from an `lp_` key marks a request as a scan. It **grants
nothing** — it only stops the request counting as evidence that somebody wanted
the app, so a sweep does not make every [quiet](../../apps/quiet/) app look busy.

The header never reaches the workload.

## security.txt

Four settings on Admin → Settings, and filling in the contact is what publishes
`/.well-known/security.txt` on **both origins**.

| Setting | |
|---|---|
| `security_txt_contact` | Where a finder should send it. Filling this in publishes; clearing it stops. |
| `security_txt_expires` | **Required** whenever there is a contact. |
| `security_txt_policy` | An `https://` page describing how you want reports made. Optional. |
| `security_txt_languages` | Language tags the mailbox can read. Optional. |

**Absent rather than empty.** An empty `security.txt` is worse than none: it looks
like an answer.

**The expiry is required, never invented and never rewritten.** Toft will not
silently extend it — an expired `security.txt` is a fact you should see, and the
checks page warns 30 days out and again once it has passed.

Put a **role address** in the contact field, not a person's. It outlives them, and
it is the field a stranger will use during your worst week.
