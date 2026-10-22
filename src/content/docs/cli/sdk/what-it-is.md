---
title: What the SDK is
description: The app SDK for Python, Node, Go and R — how your code calls the platform back.
---

The app SDK is how your deployed code talks to Toft: send a notification, start
a job, read the app's JSON document, find out who is looking at the page.

It comes in four languages with one model behind them. The build installs it,
so there is nothing to add to `requirements.txt`, `package.json` or `go.mod`.

```python
import toft                      # Python
```
```js
import toft from "@larchway/toft";   // Node (ESM)
```
```go
import "toft"                    // Go
```
```r
library(toft)                    # R
```

The source is published at
[larchway-labs/toft-sdk](https://github.com/larchway-labs/toft-sdk) under the
Apache-2.0 license, tagged with the platform version. Your install also serves
its own copy; see [Vendoring it](../vendoring/).

## The surface

| Area | Python | Node | Go | R |
|---|---|---|---|---|
| [The app itself](../app/) | `toft.app` | `toft.app` | `toft.App` | `app_info()` |
| [App data](../data/) | `toft.data` | `toft.data` | `toft.Data` | `app_data_get()` |
| [Files](../files/) | `toft.storage`, `toft.scratch_dir` | `toft.storage`, `toft.scratchDir` | `toft.Storage`, `toft.ScratchDir` | `storage()`, `scratch_dir()` |
| [Notifications](../notify/) | `toft.notify` | `toft.notify` | `toft.Notify` | `notify()` |
| [Jobs](../jobs/) | `toft.jobs`, `toft.run` | `toft.jobs`, `toft.run` | `toft.Jobs`, `toft.CurrentRun()` | `job_start()`, `job_respond()`, `current_run()` |
| [Who is asking](../viewer/) | `toft.caller`, `toft.who`, `toft.viewer` | same | `toft.CallerFor`, `toft.Who`, `toft.ViewerFor` | `caller_role()`, `viewer()` |

R has a smaller surface than the other three. See
[Language notes](../../reference/languages/).

## Rules that hold in every language

- **The credential stays with the platform.** Your app never holds the Slack
  token or mail password and never chooses the channel or sender. It supplies
  the message; Toft supplies the identity.
- **Ask before you send.** `toft.app.can("email")` is cheap and cached. Check at
  startup and show "email is not enabled for this app" instead of failing later.
- **Sends don't wait for delivery.** A send returns once the platform has
  recorded it. You can read the record back.
- **Off-platform, calls fail.** Every call that needs the platform names the
  missing environment variable. There is no dry-run mode; scratch directories
  are the one exception.
- **Branch on the code, not the sentence.** Every refusal carries a stable
  `code`, a `retryable` flag and often a `hint`. See
  [When the platform says no](../errors/).
- **Background work is a job.** `jobs.start` runs a command declared in
  `toft.toml`, from the same deployment, as its own process with a memory limit and
  a deadline.

## As the app, or as a person

`toft.jobs` is the app acting as itself. `toft.viewer(headers).jobs` is the app
acting for the person viewing the page, and the run is recorded in their name.
Pick deliberately; see [Who is asking](../viewer/).
