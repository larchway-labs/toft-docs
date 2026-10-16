---
title: Notebooks and documents
description: Publishing a Jupyter, Quarto or R Markdown document as a page anyone can read.
---

A repository holding one `.ipynb`, `.qmd` or `.Rmd` at its root is a **document
app**: executed once at build time, and served as the page that fell out.

| Source | Engine |
|---|---|
| `.ipynb` | Python |
| `.qmd` | Python or R, depending on its engine |
| `.Rmd` | R Markdown |
| `.Rmd` with `runtime: shiny` | not a document — that is a [Shiny app](../r/) |

## It is executed once, at build time

This is the thing to understand. Your document runs **during the deploy**, with
your app's own environment variables, and what gets served is the output.
Visitors execute nothing. Nobody gets a kernel.

That means:

- The numbers on the page are the numbers from deploy time. To refresh them,
  deploy again — or put a [render schedule](../reports/) on it.
- A notebook that takes ten minutes to run makes a ten-minute deploy.
- A notebook that fails fails the **deploy**, with the error in the build log,
  and the previously published document keeps serving.

There is a render timeout your administrator sets. Past it the deploy fails and
what was already published stays up.

## Your environment variables are in the output

Your document runs with your app's environment, and whatever it prints goes into
a published document. **If you print a connection string, the connection string
is on the page.**

The build log names which variables were available, so this is not a surprise.
Treat a published document as public-facing output even when the app is private.

## The renderer is provided

You do not add `jupyter`, `nbconvert` or `quarto` to your dependencies.
Toft installs the renderer. Declare the libraries your document *imports*.

The rendered output is served from a directory Toft owns — never from your
release — so your `.qmd`, your `.Rmd`, `renv/` and `renv.lock` are 404 at any
depth. The source is not published with the document.

## Quarto: which engine

A `.qmd` is Python or R depending on its **engine**, decided at detection time
in this order:

1. `[notebook] engine = "knitr"` in `toft.toml`
2. `engine:` or `knitr:` in the document's YAML header
3. A fenced ` ```{r} ` chunk
4. Otherwise, Python

A `.qmd` with neither a declaration nor R chunks stays a Python notebook. That
rule exists so a document deployed before R was available does not silently
change framework underneath you.

## Interactive documents are a different thing

If a viewer needs to change an input and see the result recomputed, you do not
want a document — you want a server. Use marimo, Streamlit or Shiny.
