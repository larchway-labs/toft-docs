---
title: Upgrading
description: Moving to a new version, the schema floor, and what a refusal at startup means.
---

An upgrade is: pull the new image tag, restart. The binary migrates its own
schema on the way up.

## Pin the tag

The image is tagged with a version and **never `latest`**. Pin it. An install
that follows a moving tag upgrades itself at a restart you did not plan, which
is the same class of problem as a git tag that gets re-pointed.

## Migrations run at startup

Toft owns its schema. There is no separate migration step and nothing to
run by hand.

**Nothing runs a migration backwards.** There is no down-path, and a rollback of
the binary across a schema change is not supported. Take a backup before an
upgrade that crosses one.

## The schema floor

At a major version, Toft collapses its migration history into a new
**baseline**. A database below that baseline's version cannot be migrated by
this binary, and the process **refuses at startup, by name**:

> this database is at version *N*; this release requires *M*

It does not touch the database. This is a statement about which installs have an
upgrade path, not a path itself.

The way through it is to upgrade to a release that still carries the older
migrations, let it bring the database up, and then move to the newer one.
**The last moment a database can be carried across is the commit before the
rebaseline** — so do not skip a major.

## What upgrading can change underneath you

Read the release notes, but two categories are worth knowing about generally:

- **A default that moved.** A capability that was off can ship on. The most
  recent example is whether every app is listable to everyone signed in — see
  [Listing and access requests](../../apps/listing/), which is written for
  somebody deciding whether to turn it back off.
- **A check that is new.** The [checks page](../../operate/checks/) may light up
  with a warning about something that was always true and was not being looked
  at.

Neither takes an install down. Both are worth looking at the same day.

## After an upgrade

1. **Run the checks.** The `migrations` row tells you if the database moved
   underneath a running process — a restore from an older backup, for instance.
   A *pending* migration at boot is a startup refusal, not a row on a page.
2. **Look at Admin → Info** for the version, the build, and the toolchains this
   process actually found.
3. **Nothing to do about apps.** A restart replaces a workload's tree from its
   stored release; apps come back on the releases they were serving.

## The other artifacts

The Helm chart and the Compose bundle are versioned with the binary and are
published alongside it. The `toft` client is published separately and is
backward-compatible across a release; people do not need to upgrade it in step.
