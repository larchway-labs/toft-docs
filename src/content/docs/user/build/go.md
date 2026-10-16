---
title: Go
description: How a Go app is detected, built and versioned.
---

Detected by `go.mod` plus a `main` package — at the module root, else the first
`cmd/*` directory in alphabetical order. Toft runs `go build` and starts the
binary.

## The contract

Listen on `PORT`, bound to `HOST`. Use `BASE_PATH` for any absolute URL you
emit. See [Base paths](../base-paths/).

```go
addr := os.Getenv("HOST") + ":" + os.Getenv("PORT")
http.ListenAndServe(addr, mux)
```

## Version comes from `go.mod`

The `go` line in `go.mod` is your version declaration. `go 1.25` means Go 1.25
or newer. A `go` key under `[runtime]` in `toft.toml` is refused.

If no installed toolchain meets your `go.mod`, Toft hands the build to the `go`
command: depending on your install's settings it downloads the required
toolchain or fails naming both versions. See
[Language versions](../versions/).

## Front ends

Server-rendered pages work. A bundled SPA works if you commit its built assets
and embed them — Toft won't run npm in a Go build.

## Module settings

The module proxy, checksum database and private-module settings come from the
install, not your repository. If a private module won't resolve, ask your
administrator.
