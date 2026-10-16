---
title: The app SDK
description: The library your app calls back with, and where to get it.
---

Your app can talk back to Toft — read who is calling, store its document,
start a job, send a message, read its mounts. That is the **app SDK**, in
Python, Node, Go and R.

The full reference is the **CLI and SDK guide**. This is the orientation.

## Get it from your own install

```bash
toft sdk vendor python
```

Writes the SDK into `.toft/sdk-python/` in your project. Go also gets a
`go.work` unless you already have one.

The install serves the SDK it speaks, so vendoring gets you a version matched to
the platform you are deploying to. A language your install does not carry is a
stated refusal, not a broken download.

**The SDK is identified by its bytes.** `toft sdk vendor` prints the build id of
the copy it just wrote, and the platform reports the same id for its own — so
you can tell whether the copy in your tree is the copy your install would have
given you. Both build logs print it too. That is a checksum rather than a
declared version, because a declared version is a thing somebody forgets to
change.

If you deploy to an isolated install whose runner image carries a different copy
from the platform's, the build log **says so and the deploy still succeeds** —
it names both, and it is your administrator's cue to rebuild the image.

## What is in it

```python
from toft import (
    app,        # who am I: id, slug, mode, base path, capabilities
    caller,     # what may this request's caller do
    viewer,     # who is looking, where that is switched on
    data,       # the app's JSON document
    storage, mounts, store,
    notify, deliver,
    jobs, run,
    task,
    scratch_dir, session_scratch_dir,
)
```

Node, Go and R mirror the same surface, with each language's idioms.

## Two things it does for you

**`can()` is a local answer.** Your app is told its capabilities at start, so
checking one is not a round trip.

**Role verification is done properly.** `verify_role` checks the signature rather
than reading the header, and treats absent, unverifiable and expired as one
answer: refuse.

**It knows where it is mounted.** `app.base_path` — and its peers in the other
three languages — is where your app is served from, which is what you build
links out of. See [Base paths](../../build/base-paths/).

**A write hands back what it wrote.** `data.set(...)` returns the document, not
an empty handle, so you do not have to read it back to find out what was saved.

## Errors are typed

`ToftError` with a code and a retryable flag, plus the specific ones worth
catching by name — `VersionConflict` on an app-data precondition, `QueueFull`
when your app is at its job concurrency cap.

## Scratch space

Every workload gets scratch space, and a per-session scratch directory for work
that belongs to one visitor. It is scratch: assume nothing survives a restart.

## The contract is versioned

The SDK speaks a versioned contract with the platform, and a mismatch is refused
rather than tolerated. Vendor from the install you deploy to and this never
comes up.

## In R

`library(toft)` is installed before your own packages, so if you declare a
version of it yourself, yours wins.
