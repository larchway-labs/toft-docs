---
title: Installing toft
description: Install the toft command-line client on Linux, macOS or Windows, and keep it current.
---

`toft` is Toft's command-line client: one binary, no runtime, no daemon. It
pushes the directory on your disk to an install, watches the build, and reads
the logs afterwards.

:::note
This guide covers `toft` and the app SDK. Building and sharing apps in the
browser is the **user guide**; running an install is the **admin guide**. Your
install's **Documentation** page links to all three for its version.
:::

## Linux and macOS

```bash
curl -fsSL https://raw.githubusercontent.com/larchway-labs/toft-cli/main/install.sh | sh
```

The script downloads the binary for your machine, checks it against the
release's `SHA256SUMS`, and puts it in `/usr/local/bin` if you can write there,
otherwise in `~/.local/bin`. It never uses `sudo`.

| Option | Effect |
|---|---|
| `--version X.Y.Z` | Install that release. `latest` follows the newest one. |
| `--dir DIR` | Install into `DIR`. |
| `-q`, `--quiet` | Print only the installed path. |

Pass options through the pipe with `sh -s --`:

```bash
curl -fsSL https://raw.githubusercontent.com/larchway-labs/toft-cli/main/install.sh | sh -s -- --version 0.7.0
```

## Windows

Download `toft_windows_amd64.exe`, rename it `toft.exe`, and put it on your
`PATH`:

```powershell
curl.exe -fsSLo toft.exe https://github.com/larchway-labs/toft-cli/releases/latest/download/toft_windows_amd64.exe
```

:::caution[Unsigned binaries]
The binaries are not code-signed. On Windows, Smart App Control may refuse
`toft.exe`. On macOS, a binary installed by the script runs; one downloaded
through a browser has to be cleared by Gatekeeper first.
:::

## Platforms

| OS | Architectures | Release asset |
|---|---|---|
| Linux | amd64, arm64 | `toft_linux_amd64`, `toft_linux_arm64` |
| macOS | Intel, Apple Silicon | `toft_darwin_amd64`, `toft_darwin_arm64` |
| Windows | amd64 | `toft_windows_amd64.exe` |

Releases live at
[larchway-labs/toft-cli](https://github.com/larchway-labs/toft-cli/releases),
which holds binaries and checksums, not source. To verify a manual download:

```bash
grep toft_linux_amd64 SHA256SUMS | sha256sum -c
```

## Check the version

```bash
toft --version
# toft 0.7.0 (build 4f2a1c9e…)
```

The build id tells two binaries with the same version number apart. A local
`go build` prints no build id.

An older `toft` works against a newer install. It prints one dimmed line saying
so and carries on.

## Upgrade and uninstall

Re-run the install script to upgrade. Your sign-in in `~/.config/toft` is kept.
On Windows, replace `toft.exe` with the new download.

To uninstall:

```bash
rm "$(command -v toft)"
rm -rf ~/.config/toft
```

Deleting the config directory does not revoke your keys. Revoke them under
**Your account → Credentials** on the install.

## Next

- [Sign in](../signing-in/) to an install.
- [Deploy](../deploying/) a directory.
- Call the platform from your code with the [SDK](../../sdk/what-it-is/).
