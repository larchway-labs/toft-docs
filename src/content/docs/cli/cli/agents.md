---
title: Skills for coding agents
description: Two skills that let a coding agent deploy and write Toft apps on its own — what they cover and how to install them.
---

Toft publishes two **agent skills**: the instructions a coding agent loads before
it touches Toft. They live beside the client, in
[`larchway-labs/toft-cli`](https://github.com/larchway-labs/toft-cli), and are
updated with every `toft` release.

| Skill | Load it to | Source |
|---|---|---|
| **toft-cli** | Ship an app: sign in without a browser, the deploy loop, exit codes and `--json` shapes, jobs and tasks, what `toft` refuses and why | [SKILL.md](https://github.com/larchway-labs/toft-cli/blob/main/skills/toft-cli/SKILL.md) |
| **toft-sdk** | Write the app: `PORT`, `HOST` and `BASE_PATH`, how the build detects a framework, `toft.toml`, and the SDK for Python, Node, R and Go | [SKILL.md](https://github.com/larchway-labs/toft-cli/blob/main/skills/toft-sdk/SKILL.md) |

## Install them

For Claude Code, put each in its skills folder:

```bash
for s in toft-cli toft-sdk; do
  mkdir -p ~/.claude/skills/$s
  curl -fsSL -o ~/.claude/skills/$s/SKILL.md \
    https://raw.githubusercontent.com/larchway-labs/toft-cli/main/skills/$s/SKILL.md
done
```

Any other agent that reads markdown instructions can load the same two files.
Re-run the loop after upgrading `toft` to pick up the new version.

## Give the agent a key, not a browser

`toft login` opens a browser and waits for a person. An agent signs in with a
key instead:

```bash
printf '%s' "$TOFT_KEY" | toft login --token-stdin https://toft.example.com
```

Use a personal key (`toftu_`, **Your account → Credentials**) for an agent
working on your behalf, or a deploy key (`toftd_`, **Admin → Deploy keys**) for
one running unattended. See [Signing in](../signing-in/).

:::tip
No local runtime is needed to deploy. The install builds the app, so an agent
with `toft` and a key can create an app, push a directory, read the build log
and roll back without Node, Python or Go on its machine.
:::
