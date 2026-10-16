---
title: Upgrading
description: Pin a new image tag and restart — migrations run at startup and only go forward.
---

An upgrade is a new image tag and a restart. The binary migrates its own schema
on the way up; there is no separate migration step.

| Install | How |
|---|---|
| One box | Re-run the `larchway-labs/toft-install` installer. It keeps your `.env`, pulls the new `gopanair/toft:<version>` and restarts. |
| Helm chart | Upgrade the release; the image tag follows the chart's app version unless you pin `image.tag`. |

:::danger[Back up first]
Migrations are **one-way**. There is no down path, and rolling the binary back
across a schema change is not supported. On one box:
`docker compose exec postgres pg_dump -U toft toft > backup.sql`
:::

:::note[0.7.0 is a fresh install]
0.7.0 does not upgrade a 0.5 or earlier install: the rename to Toft changed its
variables, containers, volumes and database. Install 0.7.0 beside or in place of
the old one and redeploy your apps.
:::

## The schema floor

Toft periodically collapses its migration history into a new **baseline**. A
database older than the baseline is refused at startup, untouched:

> this database is at schema version *N* and this release requires *M*

Upgrade through the last release that still carried the older migrations, then
move on — or restore from a backup. Do not skip releases across a baseline.

## What can change underneath you

- **A default moves.** A capability that was off can ship on — for example
  whether every app is [listable](../../apps/listing/) to everyone signed in.
- **A new check appears.** [System checks](../../operate/checks/) may warn about
  something that was always true.
- **An interpreter moves** (one box). Python apps rebuild their dependencies on their next
  start, automatically; a new Node major needs each Node app redeployed.

## After an upgrade

1. **Open Admin → System checks.** The **Schema migrations** row flags a database
   that moved under a running process, such as a restore.
2. **Open Admin → System info** for the version, build and toolchains found.
3. **Apps need nothing.** Each comes back on the release it was serving.
