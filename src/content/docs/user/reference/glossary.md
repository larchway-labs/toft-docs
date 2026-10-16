---
title: Glossary
description: The words this guide uses precisely.
---

**App** — one deployable thing, with a slug, an owner, a history and an address.

**App data** — the single 256 KiB JSON document each app can read and write.

**App key (`lp_`)** — a credential that is a grant on one app.

**Base path** — the `/apps/your-slug` prefix your app is served under, given to
it as `BASE_PATH`.

**Deploy** — one attempt to turn source into a running app. Three phases: upload,
scan, deploy.

**Deploy key (`lpd_`)** — a credential for a pipeline, belonging to nobody.

**Document app** — a notebook, Quarto or R Markdown file, executed once at build
time and served as its output.

**Editor** — someone who may deploy and configure an app, but not decide who
else may see it.

**Effective mode** — the execution mode a *deployment* ran under, which is the
one that matters. An app's configured mode is what the next one will use.

**Event** — something that went wrong without anybody doing it. Distinct from a
log line.

**Execution mode** — `shared` (a process on the install's machine) or `isolated`
(a container of its own). Never a backend name.

**Grant** — permission given to a person or group: list, view or edit.

**Group** — a set of people on this install. Never an actor; nothing runs as a
group.

**Job** — a command run in a fresh process built from your app's release, with
its own limits.

**List rung** — a grant that puts an app in somebody's list without letting them
open it, so they can ask.

**Lock** — an administrator's stop. It cannot be lifted by the owner, and lifting
it does not start the app.

**Mapping** — an attachment of a storage resource to an app. An app's.

**Personal key (`lpu_`)** — a credential that is you.

**Publisher** — the system role that may create and own apps.

**Quiet** — how long since anybody showed evidence of wanting an app. A fact,
never a verdict.

**Release** — the built output of a successful deploy. One is serving; the others
are what you roll back to.

**Scheduled task** — an HTTP request to a path your app publishes, on a schedule.

**Sleeping** — stopped to save memory, and woken by the next request. Not
`stopped`.

**Slug** — the lowercase identifier that is your app's address.

**Storage grant** — access to a folder, for a person. A person's.

**Viewer** — the system role that may open apps but not create them. Also the
name of the middle object grant, confusingly, and context tells you which.

**Visibility** — private, authenticated or public. Who may reach the app, not
what they may do inside it.

**Workload** — the running process or container. Replaceable without your release
changing.
