---
title: From a git repository
description: Pointing an app at a repository, choosing a branch, and deploying a subdirectory.
---

The normal way to get code onto Toft: the app names a repository, and
Toft clones it.

## Creating it

**New app → paste a URL.** Any git URL your install is willing to deploy from.
Your administrator may restrict that list, and if the URL is refused you are
told so at creation time rather than at 3am during a deploy.

**New app → pick a repository.** If your administrator has connected your
organization's git host, you get a picker instead of a text box. You are never
asked for a token — Toft holds the credential, and you are not told which
one it used.

## Private repositories

You do not paste a token into Toft. Either the git host is connected by an
administrator, or the clone fails and says so.

If your repository is private and there is no connected host, that is a
conversation with your administrator, not something to work around by making
the repository public.

## Branch and subdirectory

On the **Settings** tab:

- **Branch** — which ref to clone. Defaults to the repository's default branch.
- **Subdirectory** — deploy a folder inside the repository rather than its root.
  Useful for a monorepo: detection, `toft.toml`, dependency files and the
  entry point are all resolved relative to that folder.

Both are read at deploy time, so changing one takes effect on the next deploy.

## Redeploying

**Deploy** on the app's page pulls the current commit of the configured branch
and builds it. Nothing is cached between the git host and you: what is on the
branch now is what you get.

From the terminal, that is `toft redeploy` — which rebuilds from the repository
and uploads nothing. (`toft deploy` is a different thing: it pushes your working
tree. See [From your machine](../from-your-machine/).)

## Deploying automatically

An app can rebuild itself when the branch moves. See
[Deploying on every push](../auto-deploy/).

## Changing where the code comes from

You can repoint an app at a different repository, branch or subdirectory. The
app keeps its slug, its URL, its history, its variables and its access — a
source change is not a new app.

What you cannot do is convert an app between sources by accident. An app
created from an archive stays an archive app until you tell it otherwise, and
`toft redeploy` on one is refused by name rather than guessing.
