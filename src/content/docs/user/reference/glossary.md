---
title: Glossary
description: The terms this guide uses, in one place.
---

| Term | Meaning |
|---|---|
| **App** | One deployable thing, with a slug, owner, history and address. |
| **App data** | The one JSON document (up to 256 KiB) each app can read and write. |
| **Base path** | The `/apps/your-slug` prefix your app is served under (`BASE_PATH`). |
| **Deploy key** (`toftd_`) | A credential for a pipeline, belonging to no person. |
| **Deployment** | One deploy, as the **Deployments** tab lists it. A successful one serves or is a rollback target. |
| **Document app** | A notebook, Quarto or R Markdown file, rendered at build time. |
| **Editor** | May deploy and configure an app, but not share it. |
| **Event** | Something that went wrong without anyone doing it, such as a crash. |
| **Execution mode** | `shared` (a process on the install's machine) or `isolated` (its own container). |
| **Grant** | Access to an app for a person or group: list, view or edit. |
| **Job** | A command your app declares in `toft.toml`, run in its own process from your app's deployment, on a schedule or when started. Toft's one kind of automation. |
| **List access** | Shows an app in someone's list without letting them open it. |
| **Lock** | An administrator's stop. Only an administrator can lift it. |
| **Personal key** (`toftu_`) | A credential that acts as you. |
| **Publisher** | The role that may create and own apps. |
| **Run** | One start of a job. It ends once: succeeded, failed, timed out, out of memory, cancelled or skipped. |
| **Sleeping** | Stopped to save memory; woken by the next request. |
| **Slug** | The lowercase identifier in your app's address: letters, digits and hyphens, at most 54 characters. |
| **Viewer** | The role that may open apps but not create them; also the middle level of a grant. |
| **Visibility** | Private, authenticated or public — who may reach the app. |
| **Workload** | The running process or container. |
