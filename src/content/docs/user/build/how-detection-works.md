---
title: How Toft reads your repository
description: The ordered checks that pick your app's framework, and what to do when the pick is wrong.
---

You don't declare a framework. Toft inspects the repository root — or the
**Folder** you set for a monorepo — and the first check that matches wins.

## The order

| # | Check | Framework |
|---|---|---|
| 1 | `[batch]` in `toft.toml` | A [batch app](../../automation/jobs/): jobs only, no server |
| 2 | `[static]` in `toft.toml` | [Static site](../static/), overriding everything below |
| 3 | `next.config.js`/`.mjs`/`.ts`, or `next` in `package.json` | [Next.js](../node/) |
| 4 | `package.json` with a `start` script | [Node](../node/) |
| 5 | `go.mod` plus a `main` package | [Go](../go/) |
| 6 | One `.Rmd` or R-engine `.qmd` at the root | [R document](../notebooks/) |
| 7 | One `.ipynb` or Python `.qmd` at the root, or one marimo `.py` | [Notebook](../notebooks/) or [marimo](../python/) |
| 8 | `app.R`, `ui.R` + `server.R`, `plumber.R`, or an annotated `.R` | [Shiny or plumber](../r/) |
| 9 | `requirements.txt`, `pyproject.toml` or `Pipfile` | [Python](../python/) |
| 10 | A folder of HTML with none of the files above | [Static site](../static/) |

- **R wins over Python.** An `app.R` beside a `requirements.txt` is an R app.
- **A notebook wins over a Python server.** A Flask repo with an `.ipynb` at
  its root deploys as a notebook. Move the notebook into a subfolder.

## Several candidates are refused

When one shape has more than one candidate — two notebooks, two `.Rmd` files,
several HTML files and no `index.html` — the deploy fails and lists them. Name
the one you mean in [`toft.toml`](../toft-toml/).

## When it picks wrong

| Symptom | Fix |
|---|---|
| "Unsupported framework" on a front-end repo | There's no `start` script. Commit the build output and declare [`[static] root`](../static/). |
| Python repo refused with no entry point | Add one of `app.py`, `main.py`, `streamlit_app.py`, `server.py`, `wsgi.py` at the root. |
| Detected as a notebook, you wanted a server | Move the notebook out of the root. If viewers need to change inputs, use marimo, Streamlit or Shiny. |
| A `.qmd` detected as Python, you wanted R | Set its engine. See [Notebooks](../notebooks/). |

:::tip
Every build log states the framework it detected and the language version it
resolved. Read that line first, and again to confirm a fix took effect.
:::
