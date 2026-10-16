---
title: Glossary
description: The terms this guide uses, in one place.
---

| Term | Meaning |
|---|---|
| **App** | One deployable thing, with a slug, owner, history and address. |
| **App data** | The one JSON document (up to 256 KiB) each app can read and write. |
| **App key** (`toft_`) | A credential for one app. |
| **Base path** | The `/apps/your-slug` prefix your app is served under (`BASE_PATH`). |
| **Deploy key** (`toftd_`) | A credential for a pipeline, belonging to no person. |
| **Document app** | A notebook, Quarto or R Markdown file, rendered at build time. |
| **Editor** | May deploy and configure an app, but not share it. |
| **Event** | Something that went wrong without anyone doing it, such as a crash. |
| **Execution mode** | `shared` (a process on the install's machine) or `isolated` (its own container). |
| **Grant** | Access to an app for a person or group: list, view or edit. |
| **Job** | A command run in a fresh process from your app's release. |
| **List access** | Shows an app in someone's list without letting them open it. |
| **Lock** | An administrator's stop. Only an administrator can lift it. |
| **Personal key** (`toftu_`) | A credential that acts as you. |
| **Publisher** | The role that may create and own apps. |
| **Release** | The output of a successful deploy. One serves; the others are rollback targets. |
| **Scheduled task** | An HTTP request to a path in your app, on a schedule or on demand. |
| **Sleeping** | Stopped to save memory; woken by the next request. |
| **Slug** | The lowercase identifier in your app's address. |
| **Viewer** | The role that may open apps but not create them; also the middle level of a grant. |
| **Visibility** | Private, authenticated or public — who may reach the app. |
| **Workload** | The running process or container. |
