---
title: How Toft reads your repository
description: The one ordered decision that picks a framework, and what to do when it picks wrong.
---

You do not declare a framework. Toft looks at the repository and decides.

## It is one ordered decision

Detection runs once, in a fixed order, and stops at the first match. That order
is why a repository can be "obviously Python" to you and something else to
Toft — and why the fix is usually to remove an ambiguity rather than to
add a declaration.

Roughly:

1. **`[static]` in `toft.toml`.** Read first, and it overrides everything
   below — including the rules that would otherwise disqualify the repository.
2. **Documents.** One `.ipynb`, `.qmd` or `.Rmd` at the root.
3. **R.** `app.R`, `ui.R`+`server.R`, `plumber.R`, or an `.R` file carrying
   plumber annotations.
4. **JavaScript.** `next.config.*` or `next` in `package.json`; else any
   `package.json` with a `start` script.
5. **Python.** `requirements.txt`, then the framework inside it, then the
   entry-point filenames.
6. **Go.** `go.mod` plus a `main` package.
7. **Static, last.** A folder of HTML with none of the disqualifiers.

The framework each one implies is on its own page: [Node](../node/),
[Python](../python/), [Go](../go/), [R](../r/), [static](../static/) and
[notebooks](../notebooks/).

## An ambiguous repository is refused, not guessed

If your repository matches two shapes at once, the deploy fails and **names what
it matched**. It does not pick one and hope.

That is a deliberate trade: a wrong guess produces an app that deploys
successfully and does not work, which is far more expensive to debug than a
refusal that tells you what it saw.

## R wins over Python

A repository with `app.R` and a `requirements.txt` is an R app. R projects
commonly carry Python files for one script; Python projects do not commonly
carry `app.R`.

## Static is last, and its disqualifiers are the point

A tree is only detected as static if it has **none** of `package.json`,
`requirements.txt`, `pyproject.toml`, `Pipfile` or `go.mod`.

Without that rule, a Vite repository would deploy successfully as "a folder of
files" and serve a blank page forever. If you *want* a repository with a
`package.json` served as static, say so with
[`[static] root`](../static/) — which is exactly what overriding the
disqualifiers means.

## What to do when it picks wrong

| Symptom | Usually |
|---|---|
| "Unsupported framework" on a front-end repo | No `start` script. Commit the build output and declare `[static]`. |
| "No entry point" on a Python repo | None of `app.py`, `main.py`, `streamlit_app.py`, `server.py`, `wsgi.py` at the root. |
| Detected as Node, you wanted static | Declare `[static] root = "dist"`. |
| Detected as a notebook, you wanted a server | A notebook is a document, executed once. If viewers need to change inputs, you want marimo, Streamlit or Shiny. |
| Detected as Python, you wanted R | Check the `.qmd` engine — see [Notebooks](../notebooks/). |

## What the build log tells you

Every build states the framework it detected and the language version it
resolved. When something is surprising, that line is the first thing to read,
and it is the fastest way to confirm a fix actually changed the decision.
