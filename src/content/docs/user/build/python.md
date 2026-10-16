---
title: Python
description: Flask, FastAPI, Streamlit, marimo and plain Python — how each is detected and started.
---

| Framework | Detected by | Started with |
|---|---|---|
| **Streamlit** | `streamlit` in your dependencies | `streamlit run`, mounted under your app's path |
| **FastAPI** | `fastapi` in your dependencies | `uvicorn` with `--root-path` set |
| **Flask** | `flask` in your dependencies | `flask run` |
| **marimo** | a root `.py` that imports `marimo` and builds a `marimo.App` | `marimo run`, mounted under your app's path |
| **Python** | anything else | `python <entry point>` |

Dependencies are read from `requirements.txt`, else `pyproject.toml`, else
`Pipfile`. `marimo` as a dependency alone is not the trigger — a Flask app that
imports it stays Flask.

## Entry point

Every Python app except marimo needs one of these at the root, picked in this
order: `app.py`, `main.py`, `streamlit_app.py`, `server.py`, `wsgi.py`. With
none, the deploy is refused.

## The contract

Listen on `PORT`, bound to `HOST`. Toft passes both to Streamlit, FastAPI,
Flask and marimo for you; a plain Python app reads them from the environment.

Anything you send to the browser must respect the `/apps/<slug>` prefix. See
[Base paths](../base-paths/).

## Dependencies

Toft creates a virtual environment with [uv](https://docs.astral.sh/uv/) and
installs `requirements.txt` (`uv pip install -r`), or, if there's none, your
`pyproject.toml` project (`uv pip install .`). A `Pipfile` is used for
detection only. The [Toft SDK](../../cli/sdk/) is installed for you.

Pin your versions. An unpinned `requirements.txt` resolves differently over
time.

## Version

```toml
# toft.toml
[runtime]
python = ">=3.12,<3.14"
```

See [Language versions](../versions/).

## Work that finishes

A web app must keep running — a script that computes something and exits looks
like a crash. Run batch work as a [job](../../automation/jobs/), and have the
web app show the result.
