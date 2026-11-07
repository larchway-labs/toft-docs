---
title: Sharing with people and groups
description: Grant a person or group List only, Viewer or Editor on the Access tab.
---

Share an app under **Access → People and groups**. Search for a person or a group and pick a role.

| Role | Can |
|---|---|
| **List only** | See the app's name, slug and owner in their list. Cannot open it, but can [request access](../requesting-access/). |
| **Viewer** | Open the app, and see whether it is running or sleeping. Not its logs, events, process figures (CPU, memory, uptime, restarts), serving release, deploy history or times, or job runs — those need editor. |
| **Editor** | Everything a viewer can, plus deploy, change settings and run automation. |

Owning an app is not a grant. Three things stay with its **owner** (and administrators), whoever else holds editor: changing who can see it, sharing it, and deleting it. To hand an app over, [transfer it](../ownership/).

Prefer a group to a list of people: the grant survives when someone joins or leaves the team. Groups are managed in Toft, and your administrator may fill some of them from your identity provider.

## Showing a restricted app in everyone's list

By default, your install shows every app in everyone's list by name and owner, so people can find it and ask for access. Opening it still needs a grant.

On a **Restricted** app you can turn this off: switch off **Show this app in everyone's list**. The app then appears only to people you have granted something. The switch never hides an app from someone you have shared it with.

## Viewers cannot be editors

A person whose account role is **viewer** cannot hold **Editor** on any app, because editing includes deploying. They need to [become a publisher](../../account/becoming-a-publisher/) first.

## Checking access

The Access tab shows who holds what on this app. **Your account → Access** shows the other direction: everything you can reach.

Every grant is enforced by Toft before a request reaches your app. Your app does not need to check grants and should not try.
