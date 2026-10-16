---
title: Notebooks and documents
description: Publish a Jupyter notebook, Quarto or R Markdown document as a page.
---

A repository with one `.ipynb`, `.qmd` or `.Rmd` at its root is a **document
app**: Toft runs it once during the deploy and serves the HTML it produces.

| Source | Rendered with |
|---|---|
| `.ipynb` | nbconvert (Python), or Quarto if you declare `engine = "quarto"` |
| `.qmd` | Quarto, with Python or R depending on its engine |
| `.Rmd` | R Markdown |
| `.Rmd` with `runtime: shiny` | Not a document — a [Shiny app](../r/) |

For a document viewers can interact with, use marimo, Streamlit or Shiny
instead.

## It runs at deploy time

Visitors execute nothing; they read the output.

- The numbers are from deploy time. Refresh them by redeploying, or with a
  [render schedule](../reports/).
- A slow document is a slow deploy. Past the render timeout your administrator
  sets, the deploy fails.
- A failing document fails the deploy, and the previously published version
  stays up.

:::danger[Output is published]
The document runs with your app's environment variables. Anything it prints —
a connection string included — ends up on the page. The build log lists which
variables were available.
:::

## Dependencies

Toft installs the renderer (Jupyter, nbconvert or Quarto). Declare only what
your document imports: `requirements.txt` for Python, `renv.lock` for R.

Only the rendered output is served. Your source files, `renv.lock` and
everything else in the repository return 404.

## Choosing the file

With more than one candidate at the root, or a document in a subfolder, name it:

```toml
# toft.toml
[notebook]
file = "reports/weekly.qmd"
```

## Quarto: Python or R

A `.qmd` runs as R when, in this order:

1. `toft.toml` sets `[notebook] engine = "knitr"` (or `"jupyter"` for Python).
2. The document's YAML header has `engine: knitr` or a top-level `knitr:` key.
3. It contains an R chunk (` ```{r} `).

Otherwise it runs as Python.
