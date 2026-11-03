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

A `go` line newer than any toolchain the install carries is not refused. `toft
check` and the deploy warn (`go_toolchain_fetched`), and the build has the `go`
command fetch the toolchain it needs. It fails only if that fetch can't happen,
and the build failure names the Go this install has. See [Language versions](../versions/).

## Jobs

A Go job runs the binary the build produced, on a web app and on a `[batch]`
app alike. Give it arguments with `command = "./toft-app job nightly"` or
`args = ["job", "nightly"]`. `args` are the binary's own arguments; a leading
`"./toft-app"` there is dropped rather than passed on as the first argument.

## Front ends

Server-rendered pages work. A bundled SPA works if you commit its built assets
and embed them — Toft won't run npm in a Go build.

## Module settings

The module proxy, checksum database and private-module settings come from the
install, not your repository. If a private module won't resolve, ask your
administrator.
