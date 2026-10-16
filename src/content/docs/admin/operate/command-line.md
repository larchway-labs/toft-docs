---
title: The platform's own subcommands
description: Five things the binary does without starting a server.
---

The Toft binary is a server when you run it with no arguments. It also
carries five subcommands, and three of them talk to Postgres and exit — which is
what makes them usable on an install that will not start.

```bash
toft local-admin
toft advisory-import <file>
toft rotate-key
toft routes
toft openapi
```

## `local-admin`

**Re-enables local sign-in and resets the built-in administrator's password.**

It does not depend on the server it is repairing: it talks to Postgres and exits.
This is the recovery path when nobody can sign in, and it is deliberately the only
one. **Proof you have the machine**, not proof you control an email address.

See [The built-in administrator](../../identity/local-administrator/).

## `advisory-import`

Imports the vulnerability corpus **from a file**, for an install with no outbound
HTTPS — which is the customer this product is for rather than an edge case.

Also talks to Postgres and exits. See [Dependency
policy](../../security/dependencies/).

## `rotate-key`

The second half of a key rotation. The swap is a restart; **this is the sweep**
that moves stored records onto the new key so the old one can be dropped.

See [At-rest encryption](../../security/encryption/).

## `routes`

Prints every route the router serves, and exits. **Neither a database nor a
server** — the router can describe itself.

Useful when you are putting a WAF or a reverse proxy in front of the install and
need to know what actually exists.

## `openapi`

The same question in the form a scanner reads. Also available at
`GET /api/v1/admin/openapi.json`, which **404s to non-administrators**.

The document's paths are exactly the routes this install serves — not a
hand-maintained file that drifts.

**Every route reachable by a personal API key is marked in it**, with
`x-toft-key-denied` on exactly the operations that refuse a key. That is the
artifact to hand somebody asking what a key can do.

## Two more things the binary does

**It serves static apps.** A subcommand runs the file server for a static app or a
rendered document — the same implementation in both execution modes, which is why
neither needs a generated `server.js` or a fetched file server.

**It refuses to start** rather than doing something unsafe: a `JWT_SECRET` under 32
bytes, a database below the [schema floor](../../start/upgrading/), an unknown
artifact or store backend, an unknown KEK scheme, a versionless Key Vault URI,
both isolated backends configured at once, or a boolean it cannot read.

Every one of those exits naming the reason. A refusal at startup is the cheapest
place for a configuration error to land.
