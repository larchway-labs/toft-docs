---
title: Go
description: What is built, what it must do, and where the version comes from.
---

Detected by `go.mod` plus a `main` package — at the module root, else the first
`cmd/*` directory. Built with `go build` into a single binary, which is what
runs.

## The contract

- Serve HTTP on the port in **`PORT`**.
- Bind to the address Toft gives you.
- Honour **`BASE_PATH`** for absolute URLs you emit. See [Base
  paths](../base-paths/).

```go
port := os.Getenv("PORT")
http.ListenAndServe(":"+port, mux)
```

## The version declaration is `go.mod`

Go is the exception to `toft.toml`: its declaration is the `go` line in
`go.mod`, because Go already has one and teaching a second would mean two places
that can disagree.

Everything else about [language versions](../versions/) applies — the version is
refused rather than approximated, and every build records what it resolved.

## Front ends

Server-rendered UIs work. An embedded SPA works if you commit the built assets
and embed them.

What does not work is a front end that needs an npm build during the deploy:
this is a Go build, and it will not run your JavaScript toolchain. Commit the
built output.

## Toolchain settings

Module proxy, checksum database and private-module settings come from the
install's own environment, not from your repository. If your organization runs
an internal proxy, your build already uses it; if a private module will not
resolve, that is a conversation with your administrator rather than a variable
you can set on the app.
