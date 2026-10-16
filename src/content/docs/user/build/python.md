---
title: Python
description: Flask, FastAPI, Streamlit, marimo and plain Python — what triggers each.
---

| Framework | Detected by |
|---|---|
| **Flask** | `flask` in `requirements.txt` |
| **FastAPI** | `fastapi` in `requirements.txt`, served with uvicorn |
| **Streamlit** | `streamlit` in `requirements.txt`, mounted with `--server.baseUrlPath` |
| **marimo** | a root `.py` that imports `marimo` **and** constructs `marimo.App` |
| **Generic Python** | `requirements.txt` and none of the above |

## Generic Python needs an entry point

One of `app.py`, `main.py`, `streamlit_app.py`, `server.py` or `wsgi.py`, at the
root. A project with none of them is refused by name — there is nothing to
start.

## marimo is triggered by code, not by the requirement

`marimo` in `requirements.txt` alone is not the trigger: a Flask app that
happens to import marimo stays a Flask app. What triggers it is a root `.py`
that imports marimo and builds a `marimo.App`.

## The contract

Serve HTTP on the port in `PORT`. Honour `BASE_PATH` for anything you hand to a
browser — see [Base paths](../base-paths/).

Streamlit and marimo are both mounted under the prefix for you; you do not pass
the flag yourself.

## Dependencies

`requirements.txt`, installed with [uv](https://docs.astral.sh/uv/) into a
virtual environment Toft manages.

Pin what matters. An unpinned `requirements.txt` resolves differently over time,
and the first time you notice is a deploy that stops working with no change on
your side.

`pyproject.toml` and `Pipfile` are recognised as "this is a Python project" for
detection purposes, but the dependency list Toft installs is
`requirements.txt`.

## Version

```toml
[runtime]
python = ">=3.12"
```

Comparators only, never a patch version, refused rather than approximated. See
[Language versions](../versions/).

## Long-running work

A request handler that takes ten minutes is a request handler that will be cut
off by something. If you have batch work, run it as a [job](../../automation/jobs/)
and have the web app show the result.

## A script that finishes is a crash

A workload has to keep running. `python main.py` that computes something and
exits looks exactly like a crash to the supervisor, because it is one. If you
want something that runs and exits, that is a job.
