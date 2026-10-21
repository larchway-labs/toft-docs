---
title: Signing in
description: Sign toft in to an install, the four kinds of key, and how credentials are stored.
---

```bash
toft login https://toft.your-company.com
```

A browser opens, you approve the device, and the install mints a **personal API
key** for this machine. It appears under **Your account → Credentials**, named
after the machine, and you revoke it there.

| Flag | Effect |
|---|---|
| `--status` | Who this machine is signed in as, and where. With `--json`, every stored session. |
| `--no-browser` | Print the approval URL instead of opening it. |
| `--token-stdin` | Read a key from stdin instead of opening a browser. Takes a personal key or a deploy key. |
| `--forget <install>` | Drop one stored credential. |
| `--forget-all` | Drop every stored credential. |

`toft login` with no URL signs in again to your default install, which is what
you run when a key expires. Forgetting a credential does **not** revoke the key;
that happens on the install.

:::caution
There is no `--token` flag. A secret on the command line ends up in shell
history and in `ps`. Use `--token-stdin` or the environment variables below.
:::

## API keys

Toft has four kinds of credential. The prefix tells you which one you hold.

| Prefix | Kind | Where it comes from | What it is for |
|---|---|---|---|
| `toftu_` | Personal API key | `toft login`, or **Your account → Credentials** | Acting as you, from `toft` or a script. |
| `toftd_` | Deploy key | **Admin → Deploy keys** | CI. Belongs to nobody, so it survives people leaving. |
| `toft_` | App key | The app's **Sharing** tab | A program calling one app through the apps gateway. |
| `tofta_` | App token | Injected as `TOFT_APP_TOKEN` | The app's own credential for calling the platform. You never handle it. |

`toft` accepts the first two.

### Scope

A personal key is **full** or **read**, chosen when it is minted and never
changed. A read key can make every `GET` you are allowed and is refused
everything else, with exit 3 and code `key_read_scope`. Replace it with a full
key; it cannot be widened.

`toft login` always mints a full key. A read key reaches `toft` only through
`--token-stdin` or the environment.

A scope bounds Toft's own API. It does not limit what a deployed app does with
a request it receives.

A deploy key does less than a personal key. It cannot manage credentials or
grants, and it cannot use `toft task` or `toft store`.

## Credentials in the environment

For CI, skip `toft login` and set:

| Variable | Value |
|---|---|
| `TOFT_URL` | The install's address. **Required** with either variable below. |
| `TOFT_TOKEN` | The key itself. |
| `TOFT_TOKEN_FILE` | A path to read the key from, for a mounted secret. |

A token from the environment is used only when the install also came from
`TOFT_URL`. Any other pairing, such as `TOFT_TOKEN` with `--install` or with
the stored default, is refused with exit 2. Setting both `TOFT_TOKEN` and
`TOFT_TOKEN_FILE` is also refused.

See [CI and automation](../ci/).

## Where credentials are stored

| OS | Directory |
|---|---|
| Linux, macOS | `~/.config/toft/` (or `$XDG_CONFIG_HOME/toft/`) |
| Windows | `%AppData%\toft\` |

`credentials.toml` holds keys and nothing else, at mode `0600`. Settings you may
edit live beside it in `config.toml`.

```toml
default = "https://toft.corp"

[installs."https://toft.corp"]
alias = "prod"
token = "toftu_…"
user  = "ada@corp.com"
expires_at = 2026-11-19T09:30:00Z
```

Never read the token out of this file in a script. Use [`toft api`](../commands/#toft-api)
to make authenticated calls instead.

## Expiry

When a key is within 14 days of `expires_at`, every command prints one dimmed
line on stderr, never on stdout. A key stored with `--token-stdin` has no known
expiry.

`toft` never decides on its own that a key has expired. The install answers
`401 key_expired`, `toft` exits 3, and the fix is `toft login`.

## Plain http

`toft login` refuses an `http://` address unless it is loopback. Other commands
print a dimmed warning for a stored `http://` install and carry on.
