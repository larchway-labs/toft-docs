---
title: The platform's own subcommands
description: What the toft server binary does besides serving — recovery, offline imports, key rotation and route listings.
---

Run with no arguments, the platform binary starts the server. These subcommands
do one job and exit; the first three talk only to Postgres (reading
`DATABASE_URL` from the environment or `.env`), so they work on an install that
will not start.

| Command | Does | See |
|---|---|---|
| `toft local-admin status \| enable [--password <value>] \| disable` | Reports, switches on (setting the built-in administrator's password, generated unless given) or switches off local sign-in | [Built-in administrator](../../identity/local-administrator/) |
| `toft advisory-import --ecosystem <name> --as-of <date> <file.zip>` | Imports a vulnerability-advisory snapshot from a file, for installs with no outbound HTTPS | [Dependency policy](../../security/dependencies/) |
| `toft rotate-key [--dry-run]` | After a key swap and restart, re-encrypts stored records onto the new key so the old one can be dropped | [At-rest encryption](../../security/encryption/) |
| `toft routes [--json] [--router <name>]` | Prints every route on both listeners (platform and apps). Reads no configuration, opens no database | — |
| `toft openapi [--server <url>]` | The same routes as an OpenAPI document, for scanners | — |

```bash
# Nobody can sign in: run on the host
toft local-admin enable
```

:::tip
`local-admin` is the only recovery path when nobody can sign in, and it cannot be
done through the API. It needs a shell on the host, not a stolen session.
:::

## The OpenAPI document

Also served at `GET /api/v1/admin/openapi.json` (404 to non-administrators). Its
paths are exactly the routes the install serves. Operations a personal API key
cannot reach are marked `x-toft-key-denied` — hand this to anyone asking what a
key can do.

## Internal subcommands

You never run these by hand; the platform starts them.

| Command | Purpose |
|---|---|
| `toft serve-static` | The file server for static apps and rendered documents |
| `toft runner` | A job run on the platform's machine when there is no cluster ([Automation](../automation/#where-a-job-runs)) |

## Startup refusals

The server exits, naming the reason, rather than start unsafely. Examples:

- `JWT_SECRET` missing or under 32 bytes; `ENCRYPTION_KEY` (or `ENCRYPTION_KEY_URI`) or `DATABASE_URL` missing
- A database below the [schema floor](../../start/upgrading/), or a pending migration
- An unknown `ARTIFACT_STORE` or `STORE_BACKEND`, or one missing its bucket or account
- Two isolated backends configured at once
- A boolean, origin or CIDR it cannot parse

The full list of variables is in [Environment](../../reference/environment/).
