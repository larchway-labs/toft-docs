---
title: R
description: Shiny, plumber, and the two things an R app must have.
---

| Framework | Detected by |
|---|---|
| **Shiny** | `app.R`, or `ui.R` and `server.R` together, or an `.Rmd` with `runtime: shiny` |
| **plumber** | `plumber.R`, or a root `.R` carrying `#* @get` / `#* @post` |
| **R Markdown** | an `.Rmd` at the root — rendered once at build time |
| **Quarto (knitr)** | a `.qmd` whose engine is knitr |

The last two are documents, not servers. See [Notebooks and
documents](../notebooks/).

## There is no generic R framework, and that is deliberate

`Rscript app.R` runs to the end and exits, and a workload that exits is a crash
loop. An R repository matching none of the four is refused, with the four
named — rather than deployed into a restart loop.

## Commit `renv.lock`

**Without a lockfile, nothing is installed.** The deploy succeeds, says so in
the build log, and your app fails at its first `library()` call — which is a
confusing failure if you have not been told to expect it.

```r
renv::init()
renv::snapshot()
```

Commit `renv.lock`. You do not need to commit the `renv/` library itself.

## Where packages come from

Your administrator points R builds at a **binary** package repository. Binary
packages are the difference between a two-minute deploy and a forty-minute one,
and on some architectures the difference between a deploy and a failure.

You do not configure this. If a package will not install, the build log names
it, and the repository is your administrator's to change.

## The library is stamped with its R series

A library built for R 4.4 is not restored into an R 4.5 release. The build
refuses the mismatch instead of producing an app that half-loads.

That is why changing your R pin means a full reinstall of your packages, and why
that deploy is slower than the one before it.

## Version

```toml
[runtime]
r = ">=4.4"
```

## A Posit Connect bundle

If you have a `manifest.json` from Posit Connect, Toft translates it into
an `renv.lock` rather than learning a second format. Everything downstream is
the same.

You can also publish straight from RStudio with the Publish button, as you
would to Connect — see [From RStudio](../../deploy/from-rstudio/).

## Dependency scanning

R packages are matched against the CRAN advisory corpus, and an app's
Dependencies tab will still say **not scanned** — with any findings shown. That
is honest rather than pessimistic: matching is not the same as coverage, and
the absence of a finding for an R app is not a verdict.

An R app with no lockfile reads **not enumerable**, never "no dependencies".
