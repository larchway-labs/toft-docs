---
title: R
description: Shiny, plumber and R documents — what Toft detects, and why you need renv.lock.
---

| Framework | Detected by |
|---|---|
| **Shiny** | `app.R`; `ui.R` and `server.R`; `server.R` with `www/index.html`; or an `.Rmd` whose YAML says `runtime: shiny` (or `shinyrmd`, or `shiny_prerendered`) |
| **plumber** | `plumber.R`, or a root `.R` file with a route annotation such as `#* @get /summary` (`@get`, `@post`, `@put`, `@delete`, `@head`, `@options`, `@patch` or `@use`) |
| **R Markdown** | one `.Rmd` at the root, rendered at deploy time |
| **Quarto (knitr)** | one `.qmd` whose engine is knitr, rendered at deploy time |

File names match in either case (`app.r` works). The two document types are
covered in [Notebooks and documents](../notebooks/). A bare `#*` comment with no
route annotation doesn't make a file plumber; a tree with nothing else to detect
is refused as `unsupported_framework`. Keep helper scripts with route
annotations out of the root, or the repository becomes plumber.

An R Markdown document whose YAML says `runtime: shiny` (also `shinyrmd` or
`shiny_prerendered`) is not rendered once like other documents: it is served
live with `rmarkdown::run`. List `shiny` and `rmarkdown` in `renv.lock`.

There is no generic R app: a script run with `Rscript` exits, and an app that
exits is a crash. An R repository matching none of the four is refused, with
the four listed.

## Commit `renv.lock`

:::caution
Without `renv.lock`, no packages are installed, and `toft check` and the build
log say so. A Shiny or plumber app deploys and then fails at its first
`library()` call. A batch app (`[batch]`) deploys too, and each of its jobs
fails at its first `library()` call. An R Markdown or Quarto document still
goes through its render step, so the deploy fails there, naming the missing
package.
:::

```r
renv::init()
renv::snapshot()
```

Commit `renv.lock`. You don't need to commit the `renv/` library.

Packages come from a repository your administrator configures. If one won't
install, the build log names it.

## Version

With no pin, Toft uses the R version recorded in `renv.lock` if the install
has it, and the default otherwise. To pin explicitly:

```toml
# toft.toml
[runtime]
r = ">=4.5"
```

Changing R versions reinstalls every package, so that deploy is slower. See
[Language versions](../versions/).

## From Posit Connect or RStudio

A bundle with a Posit Connect `manifest.json` and no `renv.lock` is translated
into an `renv.lock` automatically. You can also publish straight from RStudio's
**Publish** button — see [From RStudio](../../deploy/from-rstudio/).
