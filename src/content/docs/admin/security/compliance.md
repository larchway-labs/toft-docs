---
title: What this install tells an assessor
description: The control document, the audit report, and the two things neither of them is.
---

Admin → Governance → **Compliance** produces two documents against **NIST SP
800-171 Revision 3**, from one registry compiled into the binary.

They exist because an organization being assessed has all the facts and no
document, and an administrator assembling them by hand produces something with
no provenance, no timestamp, and no statement of what it did *not* cover.

:::caution
This is audit **support**. It makes an assessment cheaper to run. It is not
evidence that one was passed, and nothing here is an attestation.
:::

## Two documents, and why they are two

| | **Control document** | **Audit report** |
|---|---|---|
| A property of | the **build** | the **install** |
| Reads | nothing | your settings, providers, credentials, sources, apps |
| Says | what Toft does about each requirement | what this machine is actually set to, now |
| Goes stale when | you upgrade | you change anything |
| Renders on a bare install | yes | yes, mostly `absent` |

They cannot disagree about what the controls *are*, because both render the same
registry. A single document doing both jobs would be one nobody could date.

The control document is the same sentence on every install of a version, so it
can be circulated once across an estate. **Download it as a PDF** —
`toft-800-171r3-controls-<version>.pdf` — laid out in the binary itself,
with no browser involved, so it works on a box with no outbound HTTPS. The build
is in the footer of every page, because pages get quoted and attached to
findings on their own.

## The responsibility split is the document

Every requirement is one of four:

| | |
|---|---|
| **platform** | Toft does this |
| **shared** | Toft does part; you do the rest |
| **inherited** | Your infrastructure does it, not this software |
| **customer** | Yours entirely — Toft has no part in it |

**The entries claiming nothing are what make the rest credible.** A pack
asserting Toft satisfied all 97 requirements would be worthless to an
assessor: this is software, and it has no part in personnel screening, physical
protection or awareness training. At least twenty requirements must stay
*customer* or *inherited*, and a test holds that floor — a registry drifting
towards claiming everything would drift one requirement at a time.

## No score, and there never will be one

Nineteen of the requirements have nothing to do with Toft, so any average
mixes a platform control with a personnel one and produces a figure whose only
use is to be quoted by somebody who has not read the rest.

The document reports what it read. The assessor decides. The dashboard tile
somebody will ask for would be a lie with a number on it.

## Parameters bound to live settings

SP 800-171 asks the organization to define a number of parameters — a period
here, a threshold there. The sharp part of this feature is that several of them
are **read back from your actual settings** rather than asked for a second time:

- the account-inactivity period *is* `dormant_lock_days`
- the session-termination period *is* `session_idle_minutes`
- the malware response *is* `dependency_block_malware`

The rest are shown as **unbound** and counted out loud rather than hidden. A
coverage figure you cannot see is a coverage figure you cannot trust.

## Four outcomes, kept apart

Every one of the 37 evidence items is a row whatever happens to it — a collector
that fails is that row's outcome, never a missing row.

| | |
|---|---|
| `ok` | Read, and here is the value |
| `absent` | This install does not offer that capability, named |
| `refused` | An access boundary stopped the read |
| `error` | It should have worked and did not |

**Absent is never amber.** It matters more here than anywhere else in the
product, because the reader is an assessor who does not know which of
Toft's capabilities are optional, and a row that looks like a finding will
be filed as one. `refused` and `error` stay apart for the same reason:
collapsing them leaves a reader unable to tell a boundary from an outage.

A bare install produces no `error` rows at all.

## The export

The report itself is computed per request and stored nowhere — no table, no
retention dial, no sweep. What you can keep is the **export**: a dated JSON
document naming the install, the day, the collector and a **digest recomputable
from the file alone**, which deliberately covers its own collection timestamp. A
digest that ignored part of its own document would be one nobody could verify by
hashing the document.

It downloads as `compliance-<install>-<date>.json`. Toft generates it,
streams it and forgets it — you have somewhere to file an artifact and the
platform does not need one.

## Who can read it

**Administrators in a browser, and nothing else.** All five routes answer 404 to
anyone who is not an administrator, and every API key class is refused by name —
deploy keys included, which makes this stricter than the [reach
read](../../apps/reach/).

That is deliberate. This is the reach inventory *plus* the settings document,
the identity providers, the credential inventory, the connected git hosts and
the source policy: the whole install described in one place, assembled for
somebody whose job is to find weaknesses in it. An assessment is a thing a
person does, once, from a browser. [Scan
targets](../scan-targets/) stays reachable by a deploy key and is the deliberate
contrast — a scanner needs addresses, and addresses are not a posture.

**It is not license-gated.** Reads never are, and an install whose license has
lapsed can still read its own posture against a public standard.

## What it deliberately is not

No second framework, no POA&M, no remediation tracking, no per-app compliance,
no scheduled generation, and no attestation.
