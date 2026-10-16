---
title: App data
description: The one small JSON document every app gets.
---

Every app has one JSON document it can read and write. That is the entire
feature, and the limits are the point of it.

| | |
|---|---|
| **Size** | 256 KiB |
| **Shape** | One document. No keys, no collections, no listing, no queries. |
| **Contents** | Yours. Toft stores it as text and never reads it. |

```python
from toft import data

doc = data.get()
doc["last_run"] = "2026-08-31T02:00:00Z"
data.set(doc)
```

## What it is for

Small state that belongs to the app rather than to a person: a saved filter, a
last-run timestamp, a feature flag your app set itself, a bit of configuration
somebody edited in the UI.

## What it is not for

A database. There are no queries, so anything you want to *search* does not
belong here. Anything per-user does not belong here either — it is one document
for the whole app.

If you need a real database, your administrator provides one and you get its
connection string as an environment variable.

## Three states, and they stay distinct

- **Never written** — the app has never stored anything.
- **Cleared** — there was something and it was removed.
- **`{}`** — an empty object, which the app deliberately wrote.

These are three different answers, not one. Code that treats "never written" and
"empty" as the same thing will do the wrong thing the first time somebody clears
it.

## Versions

Every read gives you a version. You can use it as a **precondition** on a write,
so two concurrent writers do not silently overwrite each other:

```python
doc, version = data.get_with_version()
data.set(doc, if_version=version)   # VersionConflict if somebody else wrote
```

The version is always there. Using it is opt-in — write without one and the last
write wins.

## Your owner's view

Whoever can edit the app can see the document's **metadata** — that it exists,
its size, its version — and can reset it. They do not read its contents from the
platform.

That reset exists for the moment your app has written something it cannot
recover from. It is not a browser for your data.
