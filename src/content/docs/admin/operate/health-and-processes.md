---
title: Health, processes and the queue
description: What is running now, how crashes and restart loops are judged, and where the platform explains a failed start.
---

## Where to look

| Surface | Shows |
|---|---|
| `GET /api/v1/system/health` | Administrators get host metrics and a `server` block (version and build revision); everyone else gets health scoped to the apps they can see |
| **Admin → Processes** | Host CPU, memory and disk; every running workload on both backends; who is signed in |
| **Admin → Queue** | Builds waiting and building, and each one's step — see [The build queue](../../build/queue-and-limits/) |

On Processes, readings are sortable and the page states what it is not listing.
A stopped entry is never shown as running, uptime is zero for anything not up,
and a metric a backend cannot measure is **absent, never zero**.

## Crashes and restarts

| Situation | What happens |
|---|---|
| Process exits (shared mode) | Noticed, and an event written |
| Workload exits (isolated mode) | Restarted a bounded number of times, then reported as no longer being restarted |
| Restart loop (either mode) | **5 restarts within 15 minutes** raises a flapping event. The window matches the kubelet's backoff; an app restarting every ten minutes never trips it |
| Repeatedly killed at its memory cap | After 3 memory-attributed restarts on one release, the workload is stopped and the app marked crashed |
| Never becomes ready | After **5 minutes** *starting*, the app is marked crashed with the backend's reason — e.g. a pod no node can schedule |

A pull the kubelet is still retrying is not counted as a failed deploy. The
restart count on the app page states the window it covers.

## The platform's own log lines

The app's log interleaves the platform's account of the app — the release it
fetched, the interpreter it resolved, dependencies it repaired, why a start was
refused, when it stopped retrying — marked and filterable beside the app's own
output. A failure that repeats unchanged is logged once and then counted.

So when an app prints nothing and will not start, the reason is still in its log.
A workload that is missing answers with the same explanation shape on both backends.
