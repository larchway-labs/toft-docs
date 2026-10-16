---
title: Installing toft
description: Install the command-line client and sign it in to your Toft install.
---

`toft` deploys the folder on your disk to an app — no commit or git host needed. It is a single binary.

## Install

On Linux or macOS:

```bash
curl -fsSL https://raw.githubusercontent.com/larchway-labs/toft-cli/main/install.sh | sh
```

The script verifies the download and installs to `/usr/local/bin`, or `~/.local/bin` if you cannot write there. Re-run it to upgrade.

On Windows, download `toft_windows_amd64.exe` from the [releases page](https://github.com/larchway-labs/toft-cli/releases), rename it `toft.exe` and put it on your `PATH`.

## Sign in

```bash
toft login https://toft.your-company.com
```

A browser opens, you approve the device, and `toft` stores a personal [API key](../api-keys/) in `~/.config/toft/credentials.toml` (`%AppData%\toft\` on Windows). `toft login --status` shows who and where you are signed in.

For several installs, sign in to each and pick one with `--install <url-or-alias>`.

## In CI

There is no `--token` flag, so a key never lands in shell history. Set `TOFT_URL` and `TOFT_TOKEN` (or `TOFT_TOKEN_FILE` for a mounted secret), or pipe a key to `toft login --token-stdin`.

:::caution
`TOFT_TOKEN` is used only when `TOFT_URL` is set too. Any other combination is refused, so a production token cannot deploy to staging by accident.
:::

## Expiry and signing out

`toft` warns on stderr within 14 days of your key expiring. After that, commands exit with code 3 until you sign in again.

`toft login --forget <install>` removes the key from this machine but does not revoke it — do that under **Your account → Credentials**.

More options: [Signing in](../../../cli/cli/signing-in/) in the CLI & SDK guide.
