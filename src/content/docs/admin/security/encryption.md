---
title: At-rest encryption
description: The key ring, the backends, and the difference between retiring a key and revoking it.
---

Secrets Toft stores — app environment variables, provider client secrets,
integration credentials, held credentials — are encrypted at rest.

## Every ciphertext names the key that wrote it

One record format, across both backends, parsed in exactly one place. There is no
ciphertext whose key is inferred from context.

**The key id is derived, never configured.** You cannot label a key wrongly,
because you do not label it at all.

## One writes, all read

**`ENCRYPTION_KEY` writes. Every key in the ring reads** — the current one plus
whatever is in `ENCRYPTION_KEY_OLD`, comma-separated.

That is what makes rotation possible without a migration: new secrets are written
under the new key, and old ciphertexts keep being readable under the key that
wrote them.

**A key that is not held is refused by name.** You are told which key is missing,
not given a generic decryption failure.

## Rotating

1. New key in `ENCRYPTION_KEY`, the previous one in `ENCRYPTION_KEY_OLD`.
2. Restart. Everything still reads; new writes use the new key.
3. `toft rotate-key` — a subcommand that talks to Postgres and exits — sweeps
   the stored records onto the new key.
4. When the sweep is done, drop the old key.

The swap is a restart; the sweep is what lets you drop the old key.

## Retiring is not revoking

**Retiring** a key stops it being used to write. It stays in the ring and keeps
reading.

**Revoking is a different thing, and it is destructive**: anything only that key
can read becomes unreadable. Do not reach for it as a tidier form of retirement.

## The backend

**Presence decides the backend, and there is no runtime fallback.**
`ENCRYPTION_KEY_URI` puts the key that encrypts the key into a KMS. If that is
configured and unavailable, Toft **refuses** rather than quietly falling back
to a local key.

The local backend is a **peer, not a fallback**. It is a legitimate choice.

Two startup refusals worth knowing:

- **An unknown KEK scheme** is refused, naming the three that exist.
- **A versionless `azurekeyvault://` URI** is refused, saying why: rotation in the
  vault would silently change which key wraps yours.

## No key reaches a workload

Apps never receive a key. They receive decrypted values Toft chose to give
them. An app cannot decrypt anything on its own, including its own variables'
ciphertext.

## What is in the backup

The checks page's **encryption** row always reads `pass` and carries the backend,
the encrypt key id, the ring size and the KEK URI.

That row exists so the answer to **"which key must be in the backup?"** is one
place, in writing, before you need it. A database restored without its key is a
database of unreadable secrets.
