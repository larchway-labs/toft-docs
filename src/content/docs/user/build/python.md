---
title: Python
description: Flask, FastAPI, Streamlit, marimo and plain Python — how each is detected and started.
---

| Framework | Detected by | Started with |
|---|---|---|
| **Streamlit** | `streamlit` in your dependencies | `streamlit run`, mounted under your app's path |
| **FastAPI** | `fastapi` in your dependencies | `uvicorn` with `--root-path` set |
| **Flask** | `flask` in your dependencies | `gunicorn` if your dependencies include it, otherwise `flask run` — see [Flask](#flask) |
| **marimo** | a root `.py` that imports `marimo` and builds a `marimo.App` | `marimo run`, mounted under your app's path |
| **Python** | anything else | `python <entry point>` |

Dependencies are read from `requirements.txt`, else `pyproject.toml`, else
`Pipfile`. `marimo` as a dependency alone is not the trigger — a Flask app that
imports it stays Flask.

## Flask

Toft never adds a web server you didn't ask for. If your dependencies include
`gunicorn`, your Flask app is served by gunicorn; otherwise it runs on Flask's
development server. The build log says which one your app got:

```text
    Serving with gunicorn (app), from this app's requirements.
```

To move to gunicorn, add `gunicorn` to `requirements.txt` and deploy again.

gunicorn needs to know which object is your app. Toft looks in your entry point
for a top-level `app = Flask(...)` (or an object named `app` or `application`),
then for a `create_app()` or `make_app()` factory that takes no arguments. If it
finds none, the app runs on Flask's development server even with gunicorn
installed, and the build log says so.

Toft sets the address gunicorn listens on. To choose workers, timeouts and
other options, set `GUNICORN_CMD_ARGS` as an
[environment variable](../../run/settings/#environment-variables), for example
`--workers 4 --timeout 60`.

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

`requires-python` in `pyproject.toml` never chooses the version, but with no pin
the deploy warns when it excludes the one Toft chose. See
[Python's `requires-python`](../versions/#pythons-requires-python).

## Work that finishes

A web app must keep running — a script that computes something and exits looks
like a crash. Run batch work as a [job](../../automation/jobs/), and have the
web app show the result.
