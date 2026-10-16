---
title: What an app can reach
description: Everything one app has been given, the estate's transpose of it, and what the page cannot see.
---

Admin → Governance → **Reach** answers two questions that an incident asks
first: **what has this app been given**, and **which apps hold this thing**.

The other estate readers are the estate as *addresses* (scan targets) and as
*packages* (dependencies). This one is the estate as **what each app was
handed**.

Every fact on it was already stored. Nothing new is collected; the whole feature
is assembly.

## The ten things an app can be given

| | |
|---|---|
| Who may open it | Its visibility and its grants, by name |
| Who may frame it | Embedding |
| Whether it is told who is looking | [Viewer identity](../../capabilities/optional/) |
| Values its owner never holds | [Broker credentials](../../capabilities/credentials/) |
| Values its owner set | Environment variables |
| Durable storage it mounts | [App storage](../../capabilities/storage/), and where |
| What it may send, and where | [Integrations](../../capabilities/integrations/) |
| A document it keeps | App data |
| People it emails on a timer | Report recipients |
| Credentials that act as it | Its app API keys |

**That list is a closed specification, not a summary.** A table carrying an
`app_id` that is neither read here nor written down as deliberately excluded
fails Toft's own build. The exclusion half is the load-bearing one: without
it, a future feature could give apps a new way to touch something, this page
would keep rendering, and the only symptom would be an answer that had been
quietly incomplete for a year.

## Names, never values

Credential names and the *names* of the values inside them. Environment keys.
Storage resource names and mount paths. Integration kinds and destination
labels. Grant principals.

**No value, under any key, on either surface.** *Which* credential an app holds
is the entire governance fact, and a governance reader must not become the
second route by which a credential can be read.

## What it can touch, never what it did

An app that has sent nothing this month still may. A zero here would read as
*cannot* when it means *has not*.

So the send ledger, the usage tables and the audit log are all deliberately
outside this page — each has a reader of its own. Eleven of the eighteen
excluded tables are that one sentence.

## Nothing is skipped, and absent is said out loud

- An app holding nothing at all is still a row, and says so.
- A capability this install does not offer is **absent**, not a column of zeros.
- An attachment that is present but not effective — a kind switched off
  install-wide after an app attached it — reads as exactly that, never as
  absent.
- Visibility is the **effective** value: an app whose public visibility has been
  withheld reads `authenticated`.
- The owner appears once. A grant restating ownership is not a second fact;
  somebody *else* holding an owner grant is, and stays.

## The two axes

The estate list is one query, and its coverage is summed from the rows it
returns — so the sentence above the table and the table itself cannot disagree.

**By credential** and **by storage** are that same list transposed, not a second
query. *Which apps hold this credential* and *which apps mount this store* are
therefore always consistent with the list they came from.

## What this page cannot see

Stated on the page, above the list, every time.

**Outbound network is not on it.** Egress from an app is unrestricted unless
your install sets blocked ranges, and shared mode has no network policy at all.
A page called *Reach* gets read as exhaustive, so the gap is named rather than
hedged — a footnote reading "this may not be complete" would make every entry
suspect and identify no gap.

## No verdict

No score, no severity, no *this app is risky*. A score is a verdict with the
argument deleted; it would end up tuned by whoever complained loudest, and the
first app it rated *low* on the morning of an incident would end the feature's
credibility for good.

The page reports what an app holds. You decide what that means.

## Who can read it

| Read | Who |
|---|---|
| The **app's own Reach tab** | Anyone who can edit that app — its owner, an editor, an administrator |
| The **estate view** | Administrators only. 404 to everybody else |

The estate read is refused to **every** API key, deploy keys included — the one
`/admin` read a deploy key normally reaches is scan targets, and this is
deliberately not that. It is the read whose value to a stolen token is greater
than the sum of the routes it replaces.

The per-app refusal to a viewer is **403, not 404**: they can already see the
app, so pretending it does not exist is a lie they could disprove in the next
tab.
