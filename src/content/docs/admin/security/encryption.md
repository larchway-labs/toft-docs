---
title: At-rest encryption
description: The key ring, rotating keys with toft rotate-key, and the KMS backends.
---

Secrets Toft stores — app environment variables, provider client secrets,
integration and held credentials — are encrypted at rest.

## The key ring

| Variable | Role |
|---|---|
| `ENCRYPTION_KEY` | Encrypts every new write. Required unless `ENCRYPTION_KEY_URI` is set. |
| `ENCRYPTION_KEY_OLD` | Comma-separated keys kept for **reading** only. |
| `ENCRYPTION_KEY_URI` | Wraps the data key in a KMS: `aws-kms://`, `hcvault://` or `azurekeyvault://`. |

Every ciphertext records the ID of the key that wrote it. The ID is derived from
the key itself, so it cannot be mislabeled. A record whose key is not in the ring
is reported by key ID, not as a generic decryption failure. Unreadable secrets are
counted at startup and never stop the server — sign-in does not depend on this key.

## Rotating

1. Put the new key in `ENCRYPTION_KEY` and the previous one in `ENCRYPTION_KEY_OLD`.
2. Restart. Everything still reads; new writes use the new key.
3. Run the sweep with the server's environment (`--dry-run` to survey first):
   ```bash
   toft rotate-key
   ```
   It checks every record is readable before rewriting any, and refuses rather
   than half-finishing.
4. When it reports nothing left under the old key, remove it from
   `ENCRYPTION_KEY_OLD`.

:::danger[Retiring is not revoking]
A key in `ENCRYPTION_KEY_OLD` still opens everything it wrote. A compromised key is
neutralized only after the sweep and its removal. Removing a key whose records
still exist makes them unreadable for good.
:::

## The KMS backend

Setting `ENCRYPTION_KEY_URI` selects it; there is no mode flag and no runtime
fallback. If the KMS is unreachable, Toft fails to start rather than using a local
key. The local backend is a legitimate choice, not a degraded one.

Refused at startup:

- an unknown scheme (the error lists the three);
- an `azurekeyvault://` URI without a key version — a vault-side rotation would
  otherwise silently change which key wraps yours.

## Apps never get a key

Workloads receive decrypted values Toft chose to give them, never a key or the
KMS URI.

## Back up the key

The **encryption** row on **Admin → System checks** names the backend, the current
key ID, the ring size and the KMS URI. A database restored without its key is a
database of unreadable secrets.
