---
title: The app SDK
description: The library your app uses to talk to Toft — who is calling, its data, jobs and messages.
---

The app SDK lets your app see who is calling, keep its data, start jobs, send messages and find its storage. It exists for Python, Node, Go and R, and the build installs it for you.

The source is also published, Apache-2.0, at [larchway-labs/toft-sdk](https://github.com/larchway-labs/toft-sdk).

## Use it locally

For your editor and local tests, copy your install's own SDK into the project:

```bash
toft sdk vendor            # language detected from the project
```

| Language | Written to | Then |
|---|---|---|
| Python | `.toft/sdk-python/` | `uv pip install -e .toft/sdk-python` |
| Node | `.toft/sdk-node/` | add `"@larchway/toft": "file:.toft/sdk-node"` to `package.json` |
| Go | `.toft/sdk-go/` and `go.work` | nothing more |

Re-run it after your install is upgraded. For Go, `.toft/` and `go.work` deploy with your code and replace the platform's copy — ignore both in `.gitignore`, or neither.

## A taste

```python
import toft

toft.app.base_path                    # where the app is served
toft.app.can("email")                 # is this capability attached? (no network call)
toft.who(request.headers)             # who is looking, where enabled
toft.data.set({"period": "2026-03"})  # the app's JSON document
toft.jobs.start("reconcile", params={"month": "2026-03"})
toft.notify.slack("Ingest finished")
toft.scratch_dir("uploads")           # temporary; gone after a restart
```

Node, Go and R offer the same features. Errors are typed: catch `VersionConflict` and `QueueFull` by name.

Full reference: [What the SDK is](../../../cli/sdk/what-it-is/) and [Vendoring it](../../../cli/sdk/vendoring/) in the CLI & SDK guide.
